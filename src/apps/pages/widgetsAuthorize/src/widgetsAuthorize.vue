<template>
<div>
		<div style="height: 44px;margin-left:40px;font-size: 14px;line-height: 40px;">小部件授权</div>
		<div style="display:flex;height: 100%;">
			<div style="height: 100%;float: left;margin-right: 16px;margin-left: 24px;">
				<div class="white-bg-color" @mousewheel="mouseWheel">
					<div class="handleSerach">											
						<el-input placeholder="搜索角色名称" icon="search" style="width: 224px;margin-right: 8px;margin-bottom: 8px;" v-model="input1" @change="handleIconClickRole" :on-icon-click="handleIconClickRole">
						</el-input>
					</div>

					<li @click="showRolePersion(item.id,item.roleName)" :class="['roleClass',{is_active:roleName == item.roleName}]" v-for="(item,index) in roleList">

						<div class="roleName">{{item.roleName}} </div>
						<div class="roleCode">{{item.roleCode}} </div>

					</li>

				</div>
		   </div>
			
			<div style="height: 100%;width: 100%;float: right;margin-right: 24px;">	
				<div id = "areasearch">
					<ifbp-button-area style="height: auto;">
						<el-button type="primary" @click="appPermissionBtn">分配权限</el-button>
						<ifbp-search class="fr" :template-code="searchCode" @search="handleSearch">
						</ifbp-search>
					</ifbp-button-area>
				</div>
				<div class='permission-body'>
					<div class="permission-title">
						{{ roleName ? roleName +"的小部件授权" : "小部件授权" }}
					</div>

					<div v-for="(group,index) in showPermissionList" v-if="showPermission">
						<span class="persion-groupName" v-if='group.check && group.check.length>0'>{{group.groupName}}</span>
						<permission-body @handleChange="function(item,itemindx){handleRemove(item, itemindx,index)}"  :group="group.check"></permission-body>
					</div>

					<div class="permission-icon" v-if="!showPermission">
						<div class="permission-norole">

							<i class="ifbp-icon-patch" v-if="roleName"></i>
							<i class="ifbp-icon-person el-icon-pt-yonghu1" v-else></i>
							<span>{{roleName ? "此角色无小部件授权" : "请选择角色" }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		

	

		<el-dialog size="large" custom-class='permission-dialog' width="100%" :title='roleName ? roleName +"的小部件授权" : "小部件授权"' :visible.sync="dialogFormVisible">
			<div>
				<div class="permission-header">
					<el-input placeholder="请输入小部件名称" icon="search" style="width: 288px;float: right;" v-model="input2" @keyup.enter.native="handleIconClick"  :on-icon-click="handleIconClick">
					</el-input>

				</div>

				<div v-for="(group,index) in showPermissionList" v-if="permissionList && permissionList.length>0">
					<span class="persion-groupName"   v-show="group.showCheckTittle">
						<el-checkbox :indeterminate = "group.indeterminate" v-model="group.checked"  @change="handleCheckAllChange(group,index)">{{group.groupName}}</el-checkbox>	
						
					</span>
					<permission-body @handleChange="function(item,itemindx){handleChange(item, itemindx,index)}" :group="group.check"></permission-body>
					<permission-body @handleChange="function(item, itemindx ){handleChange(item, itemindx,index)}" :group="group.uncheck"></permission-body>

				</div>

			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="saveRoleApp">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import permissionBody from "./authorizeBody";
import url from "../../../assets/url.json";

export default {
  components: {
    permissionBody
  },
  data() {
    return {
      roleList: [],
      searchCode: "WIDGET_SEARCH",
      searchTemplate: {},
      permissionList: [],
      roleName: "",
      dialogFormVisible: false,
      input2: "",
      input1: "",
      roleid: "",
      page: 1,
      totalpage: 0,
      roleList_copy: []
    };
  },
  computed: {
    //对PermissionList 进行数据处理 选中的放上面 没选中的放下面
    showPermissionList() {
      var list = [];
      this.permissionList.map((group, inx) => {
        group.check = [];
        group.uncheck = [];
        group.indeterminate = false;
        //group.checked = false;

        group.widgetList.map((item, index) => {
          if (item.checked) {
            group.check.push(item);
            group.check = Array.from(new Set(group.check));
          } else {
            group.uncheck.push(item);
            group.uncheck = Array.from(new Set(group.uncheck));
          }
          item.hidden = item.hidden || false;
        });
        if (group.check.length == group.widgetList.length) {
          group.checked = true;
        }
        if (group.uncheck.length == group.widgetList.length) {
          group.checked = false;
        }
        if (
          group.check.length > 0 &&
          group.check.length < group.widgetList.length
        ) {
          group.indeterminate = true;
        }
        list.push(group);
      });
      return list;
    },
    showPermission() {
      var showPer = false;
      this.permissionList.map((group, inx) => {
        group.widgetList.map((item, index) => {
          if (item.checked) {
            showPer = true;
          }
        });
      });
      return showPer;
    }
  },
  methods: {
    //滚动分页
    mouseWheel(e) {
      var delta = event.detail || -event.wheelDelta;

      if (delta > 0 && this.page > 0 && this.page <= this.totalpage) {
        this.page += 1;
      }
      if (delta < 0 && this.page > 0 && this.page <= this.totalpage) {
        this.page -= 1;
      }
      this.updateRoleList(this.page);
    },
    handleChange(item, index, inx) {
      index = this.permissionList[inx].widgetList.indexOf(item);

      this.permissionList[inx].widgetList[index].checked = !this.permissionList[
        inx
      ].widgetList[index].checked;
      this.permissionList[inx].widgetList = Object.assign(
        [],
        this.permissionList[inx].widgetList
      );
    },
    handleRemove(item, index, inx) {
      index = this.permissionList[inx].widgetList.indexOf(item);
      this.$confirm("你确定要删除该小部件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.permissionList[inx].widgetList[index].checked = !this
            .permissionList[inx].widgetList[index].checked;
          this.permissionList[inx].widgetList = Object.assign(
            [],
            this.permissionList[inx].widgetList
          );
          //   this.saveRoleApp();
          var uncheck_arr = [];
          uncheck_arr.push(item.pkWidget);
          var check_arr = [];
          this.permissionList.map((group, inx) => {
            group.widgetList.map((item, index) => {
              if (item.checked) {
                check_arr.push(item.pkWidget);
              }
            });
          });

          var data = {
            // pk_widgets: arr,
            checkedItems: check_arr,
            roleId: this.roleid,
            uncheckedItems: uncheck_arr
          };
        let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/widgetAuth/saveRoleWidget';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/saveRoleWbWidget';
        }
          this.$http({
            // url: url.widgetsAuthorize.deleteWidgetAuthorize,
            url: url,
            method: "post",
            dataType: "application/json",
            data: data
          }).then(res => {
            if (res.data.success == true || res.data.success == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        })
        .catch(e => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //更新角色列表
    updateRoleList(pn) {
      //   var getRoleListUrl = "/wbalone/roleMGT/listWithPaging";
      var data = {
        searchParams: {
          blurSearchMap: {
            role_name: "",
            role_code: ""
          }
        },
        pageNum: pn || "0",
        pageSize: "20",
        pn: pn || "1"
      };

      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/roleMGT/listRoleWithPaging';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/rolePageList';
        }
      this.$http({
        // url: url.widgetsAuthorize.searchRoleFuzzy,
        url: url,
        method: "POST",
        data: data,
        dataType: "json"
      })
        .then(res => {
          if (res.data.success === 1 || res.data.success) {
            this.roleList = this.roleList.concat(res.data.data.content);
            this.roleList_copy = this.roleList.slice(0);
            this.totalpage = res.data.data.totalPages;
          }
        })
        .catch(() => {
          this.$message({
            message: "接口调用失败！",
            type: "error"
          });
        });
    },
    appPermissionBtn() {
      if (this.roleName) {
        this.dialogFormVisible = true;
      } else {
        this.$message({
          type: "success",
          message: "请选择角色!"
        });
      }
    },
    handleSearch(searchTemplate) {
      this.searchTemplate = searchTemplate;
      this.showRolePersion(this.roleid, this.roleName);
    },
    showRolePersion(roleid, roleName) {
      this.roleName = roleName;
      this.roleid = roleid;
      //   var url = "/wbalone/widgetQuery/list";
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/widgetQuery/widgetPageList';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/widgetPageList';
        }
      this.$http({
        // url: url.widgetsAuthorize.searchWidget,
        url: url,
        method: "post",
        dataType: "json"
      })
        .then(res => {
          if (res.status === 200) {
            this.permissionList = res.data.data;
            this.checkedRolePersion();
          }
        })
        .catch(() => {
          this.$message({
            message: "接口调用失败！",
            type: "error"
          });
        });
    },
    /** 已分配的权限 */
    checkedRolePersion() {
      //   var url = "/wbalone/widgetQuery/widgetListByRoleId";
      var data = {
        ROLEID: this.roleid
      };
      data.searchParams = {
        searchMap: {
          ROLEID: this.roleid,
          searchTemplateParam: JSON.stringify(this.searchTemplate)
        }
      };

      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/widgetQuery/widgetListByRole';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/widgetListByRoleId';
        }
      this.$http({
        // url: url.widgetsAuthorize.searchWidgetByRole,
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      }).then(res => {
        var datas = [];
        if (res.data.success === 1 || res.data.success) {
          for (var i = 0; i < res.data.data.length; i++) {
            datas.push(res.data.data[i].id);
          }
          this.permissionList.map((group, inx) => {
            group["showCheckTittle"] = true;
            group.widgetList.map((item, index) => {
              if (datas.indexOf(item.id) != -1) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });

            //对数组进行排序
            group.widgetList.sort(function(s, t) {
              var a = s.checked;
              var b = t.checked;
              if (a > b) {
                return 1;
              } else {
                return -1;
              }
            });
            this.permissionList[inx].widgetList = Object.assign(
              [],
              this.permissionList[inx].widgetList
            );
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.error.errorMessage
          });
        }
      });
    },

    //对数据进行处理
    handlePerssionMessage() {},

    handleIconClick() {
      this.permissionList.map((group, inx) => {
        group["checkFlag"] = [];
        group["unCheckFlag"] = [];
        group.check.map((item, index) => {
          if (item.name.indexOf(this.input2) == -1) {
            item.hidden = true;
          } else {
            item.hidden = false;
            group["checkFlag"].push(item);
          }
        });
        group.uncheck.map((item, index) => {
          if (item.name.indexOf(this.input2) == -1) {
            item.hidden = true;
          } else {
            item.hidden = false;
            group["unCheckFlag"].push(item);
          }
        });
        if (
          group["checkFlag"].length == 0 &&
          group["unCheckFlag"].length == 0
        ) {
          group["showCheckTittle"] = false;
        } else {
          group["showCheckTittle"] = true;
        }
      });
      this.permissionList = Object.assign([], this.permissionList);
    },
    handleIconClickRole(val) {
      //   this.roleList = this.roleList_copy;
      //   //将原数组copy 给一个 变量存储
      //   this.roleList = this.roleList.filter((role, index) => {
      //     return role.roleName.indexOf(this.input1) != -1;
      //   });
      var data = {
        searchParams: {
          blurSearchMap: {
            role_name: val,
            role_code: val
          }
        },
        pageNum: "0",
        pageSize: "20"
      };
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/roleMGT/listRoleWithPaging';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/rolePageList';
        }
      this.$http({
        // url: url.widgetsAuthorize.searchRoleFuzzy,
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      }).then(res => {
        if (res.data.status === 1 || res.data.status) {
          this.roleList = res.data.data.content;
          this.roleList_copy = this.roleList.slice(0);
          this.totalpage = res.data.data.totalPages;
        }
      });
    },
    closeDialog() {
      var roleid = this.roleid;
      var roleName = this.roleName;
      this.showRolePersion(roleid, roleName);
      this.dialogFormVisible = false;
    },
    saveRoleApp() {
      var arr = [];
      var arrWidget = [];
      this.permissionList.map((group, inx) => {
        group.widgetList.map((item, index) => {
          if (item.checked) {
            arr.push(item.id);
            arrWidget.push(item.pkWidget);
          }
        });
      });
      var data = {
        pk_widgets: arrWidget,
        checkedItems: arrWidget,
        roleId: this.roleid,
        uncheckedItems: []
      };
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/widgetAuth/saveRoleWidget';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/widget/saveRoleWbWidget';
        }
      this.$http({
        // url: url.widgetsAuthorize.saveWidgetAuthorize,
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      }).then(res => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.dialogFormVisible = false;
      });
    },
    handleCheckAllChange(group, index) {
      var checkedG = group.checked;
      this.permissionList[index].widgetList.map((item, inx) => {
        item.checked = checkedG;
      });

      this.permissionList[index].widgetList = Object.assign(
        [],
        this.permissionList[index].widgetList
      );
    }
  },
  created() {
    this.updateRoleList();
  },
  mounted() {
    // var el = document.getElementById("items");
    // var sortable = Sortable.create(el);
  }
};
</script>

<style>
.white-bg-color {
  background: #fff;
  height: 100%;
  overflow: auto;
}

.roleClass {
  list-style-type: none;
  height: 48px;
}
.white-bg-color li:hover {
  cursor: pointer;
  background: #eaf9ff;
}
.white-bg-color li:hover .roleName,
.white-bg-color li:hover .roleCode,
li.roleClass.is_active .roleName,
li.roleClass.is_active .roleCode {
  color: #5cb0e6 !important;
}
.roleName {
  font-size: 14px;
  color: #2d2d2d;
  padding-left: 16px;
  padding-top: 8px;
}
.roleCode {
  font-size: 12px;
  color: #75787b;
  padding-left: 16px;
  padding-bottom: 8px;
}

.role-header {
  height: 64px;
  line-height: 64px;
  background: #fff;
}

.role-header button {
  margin-left: 16px;
}

.permission-body {
  background: #fff;
  height: calc(100% - 80px);
  margin-top: 15px;
  overflow: auto;
}

.permission-title {
  font-size: 16px;
  color: #2d2d2d;
  padding: 16px;
  font-weight: bolder;
}

.permission-norole {
  text-align: center;
  padding-top: 100px;
}

.permission-norole i {
  color: #c8c8cd;
  font-size: 96px;
}

.permission-norole span {
  font-size: 20px;
  margin-top: 32px;
  color: #333333;
  display: block;
}

.permission-header {
  height: 60px;
}

.persion-groupName {
  font-size: 16px;
  color: #2d2d2d;
  display: block;
  margin: 8px 0 8px 16px;
}

.handleSerach {
  padding-left: 8px;
  padding-top: 16px;
}

.permission-dialog .el-dialog__body {
  max-height: 480px !important;
}
.norole {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: #151515;
}
</style>