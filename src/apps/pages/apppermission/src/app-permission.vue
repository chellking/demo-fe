<template>
	<div>
		<div style="height: 44px;margin-left:40px;font-size: 14px;line-height: 40px;">磁贴授权</div>
		<div style="display:flex;height: 100%;">
			<div style="height: 100%;float: left;margin-right: 16px;margin-left: 24px;">
				<div class="white-bg-color"  @mousewheel="mouseWheel" id="mouseWheel">
					<div class="handleSerach">
						<el-input placeholder="搜索角色名称" icon="search" style="width: 224px;margin-right: 8px;margin-bottom: 8px;" v-model="input1"  @keyup.enter.native="handleIconClickRole" :on-icon-click="handleIconClickRole">
						</el-input>
					</div>
					<li @click="showRolePersion(item.id,item.roleName)" :class="['roleClass',{is_active:roleName == item.roleName}]" class="roleClass" v-for="(item,index) in roleList">

						<div class="roleName">{{item.roleName}} </div>
						<div class="roleCode">{{item.roleCode}} </div>
					</li>
				<!--	<li v-if = " page == totalpage">
						没有更多内容
					</li>-->
					<div class="norole" v-if = "roleList.length == 0">
						没有找到<span style="font-weight: bolder;">{{input1}}</span>的相关内容
					</div>
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

					<div class='permission-body' >
						<div class="permission-title">
							{{ roleName ? roleName +"的磁贴授权" : "磁贴授权" }}
						</div>

						<div v-for="(group,index) in showPermissionList" v-if="showPermission">
							<span class="persion-groupName" v-if='group.check && group.check.length>0'>{{group.groupName}}</span>
							<permission-body   @handleChange="function(item,itemindx){handleRemove(item, itemindx,index)}"  :group="group.check"></permission-body>
						</div>

						<div class="permission-icon" v-if="!showPermission">
							<div class="permission-norole">

								<i class="ifbp-icon-patch" v-if="roleName"></i>
								<i class="ifbp-icon-person el-icon-pt-yonghu1" v-else></i>
								<span>{{roleName ? "此角色无磁贴授权" : "请选择角色" }}</span>
							</div>
						</div>
					</div>
			</div>

		</div>

		<el-dialog size="large" custom-class='permission-dialog' width="100%" :title='roleName ? roleName +"的磁贴授权" : "磁贴授权"' :visible.sync="dialogFormVisible">
			<div>
				<div class="permission-header">
					<el-input placeholder="请输入磁贴名称" icon="search" style="width: 288px;float: right;" v-model="input2" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick">
					</el-input>

				</div>

				<div v-for="(group,index) in showPermissionList" v-if="permissionList && permissionList.length>0 ">
                        <span class="persion-groupName"  v-show="group.showCheckTittle">
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
import permissionBody from "./permission-body";
import url from "../../../assets/url.json";




export default {
  components: {
    permissionBody
  },
  data() {
    return {
      roleList: [],
      searchCode: "APP_SEARCH",
      searchTemplate: {},
      permissionList: [],
      roleName: "",
      dialogFormVisible: false,
      input2: "",
      input1: "",
      roleid: "",
      page: 1,
      totalpage: 1,
      roleList_copy: [],
    };
  },
  watch: {},
  computed: {
    //对PermissionList 进行数据处理 选中的放上面 没选中的放下面
    showPermissionList() {
      var list = [];
      this.permissionList.map((group, inx) => {
        group.check = [];
        group.uncheck = [];
        group.indeterminate = false;
        //group.checked = false;
        group.app.map((item, index) => {
          if (item.checked) {
            group.check.push(item);
          } else {
            group.uncheck.push(item);
          }
          item.hidden = item.hidden || false;
        });
        if (group.check.length == group.app.length) {
          group.checked = true;
        }
        if (group.uncheck.length == group.app.length) {
          group.checked = false;
        }
        if (group.check.length > 0 && group.check.length < group.app.length) {
          group.indeterminate = true;
        }
        list.push(group);
      });
      return list;
    },
    showPermission() {
      var showPer = false;
      this.permissionList.map((group, inx) => {
        group.app.map((item, index) => {
          if (item.checked) {
            showPer = true;
          }
        });
      });
      return showPer;
    }
  },
  methods: {
      changeIcon(val){
          alert(val)
      },
    //滚动分页
    mouseWheel(e) {
      var rolebox = document.getElementById("mouseWheel");
      var scrollTop = rolebox.scrollTop;
      var scrollheight = rolebox.scrollHeight;
      var clientHeight = rolebox.clientHeight;
      //滚动条滚动到页面最底部加载分页
      if (scrollheight == scrollTop + clientHeight) {
        //避免向后台发送不必要的请求 加载到最后一页数据就不在发送请求
        if (this.totalpage > this.page) {
          this.page += 1;
          this.updateRoleList(this.page);
        }
      }
    },
    handleChange(item, index, inx) {
      index = this.permissionList[inx].app.indexOf(item);
      this.permissionList[inx].app[index].checked = !this.permissionList[inx]
        .app[index].checked;
      this.permissionList[inx].app = Object.assign(
        [],
        this.permissionList[inx].app
      );
    },
    handleRemove(item, index, inx) {
      index = this.permissionList[inx].app.indexOf(item);
      this.$confirm("你确定要删除该磁贴吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.permissionList[inx].app[index].checked = false;
          this.permissionList[inx].app = Object.assign(
            [],
            this.permissionList[inx].app
          );
          var arr = [];
            this.permissionList.map((group, inx) => {
                group.app.map((item, index) => {
                if (item.checked) {
                    arr.push(item.id);
                }
                });
            });
        //   arr.push(item.id);
          var data = {
            isHasAppid: false,
            checkedItems: arr,
            roleId: this.roleid,
            uncheckedItems: []
        };

        let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/roleMGT/saveRoleWbApp';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/app/delRoleWbApp';
        }
        this.$http({
            // url: url.apppermission.saveAppAuthorize,
            url: url,
            method: "POST",
            dataType: "json",
            data: data
        }).then(res => {
            if (res.data.success === 1 || res.data.success == true) {
              this.$message({
                type: "success",
                message: '删除成功'
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
      // var getRoleListUrl = "/wbalone/roleMGT/listWithPaging";
      var data = {
        searchParams: {
          blurSearchMap: {
            role_name: "",
            role_code: ""
          }
        },
        pageNum: pn || "0",
        pageSize: "20"
      };
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/roleMGT/listRoleWithPaging';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/app/rolePageList';
        }
      this.$http({
        // url: url.apppermission.searchRole,
        url: url,
        method: "POST",
        data: data,
        dataType: "json"
      })
        .then(res => {
          if (res.data.success === 1 || res.data.success == true) {
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
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/rolemgr/listAppWithGroup?roleId=' + roleid;
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/app/appGroupList?roleId=' + roleid;
        }
    //   var urls = url.apppermission.searchApp + "?roleId=" + roleid;
      this.$http({
        url: urls,
        method: "get",
        dataType: "json"
      })
        .then(res => {
          if (res.data.success === 1 || res.data.success == true) {
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
      // var url = "/wbalone/rolemgr/assingedApp";
      var data = {
        roleid: this.roleid
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
            url = '/wbalone/rolemgr/appListByRole';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/app/appListByRoleId';
        }
      this.$http({
        // url: url.apppermission.searchAppByRole,
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      }).then(res => {
        var datas = [];
        for (var i = 0; i < res.data.data.length; i++) {
          datas.push(res.data.data[i].id);
        }
        this.permissionList.map((group, inx) => {
            group["showCheckTittle"] = true;
          group.app.map((item, index) => {
            if (datas.indexOf(item.id) != -1) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
          //对数组进行排序
          group.app.sort(function(s, t) {
            var a = s.checked;
            var b = t.checked;
            if (a > b) {
              return 1;
            } else {
              return -1;
            }
          });
          this.permissionList[inx].app = Object.assign(
            [],
            this.permissionList[inx].app
          );
        });
      });
    },
    //对数据进行处理
    handlePerssionMessage() {},

    handleIconClick() {
      this.permissionList.map((group, inx) => {
        group["checkFlag"] = [];
        group["unCheckFlag"] = [];
        group.check.map((item, index) => {
          if (item.appName.indexOf(this.input2) == -1) {
            item.hidden = true;
          } else {
            item.hidden = false;
            group["checkFlag"].push(item);
          }
        });
        group.uncheck.map((item, index) => {
          if (item.appName.indexOf(this.input2) == -1) {
            item.hidden = true;
          } else {
            item.hidden = false;
            group["unCheckFlag"].push(item);
          }
        });
        if(group["checkFlag"].length == 0 && group["unCheckFlag"].length == 0){
            group["showCheckTittle"] = false;
        } else {
            group["showCheckTittle"] = true;
        }
      });
      this.permissionList = Object.assign([], this.permissionList);
    },
    handleIconClickRole() {
      //   this.roleList = this.roleList_copy;
      //   //将原数组copy 给一个 变量存储
      //   this.roleList = this.roleList.filter((role, index) => {
      //     return role.roleName.indexOf(this.input1) != -1;
      //   });
      var data = {
        searchParams: {
          blurSearchMap: {
            role_name: this.input1,
            role_code: this.input1
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
            url = '/f/baseapp/role/app/rolePageList';
        }
      this.$http({
        // url: url.apppermission.searchRole,
        url: url,
        method: "POST",
        dataType: "json",
        data: data
      }).then(res => {
        if (res.data.success === 1 || res.data.success) {
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
      this.permissionList.map((group, inx) => {
        group.app.map((item, index) => {
          if (item.checked) {
            arr.push(item.id);
          }
        });
      });
      var data = {
        isHasAppid: false,
        checkedItems: arr,
        roleId: this.roleid,
        uncheckedItems: []
      };
      let url = "";
        let plat_flag = this.$context.getPlatform;
        if(plat_flag == 'ifbp'){
            url = '/wbalone/roleMGT/saveRoleWbApp';
        } else if(plat_flag == 'fbp') {
            url = '/f/baseapp/role/app/saveRoleWbApp';
        }
      this.$http({
        // url: url.apppermission.saveAppAuthorize,
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
      this.permissionList[index].app.map((item, inx) => {
        item.checked = checkedG;
      });

      this.permissionList[index].app = Object.assign(
        [],
        this.permissionList[index].app
      );
    }
  },
  created() {
    this.updateRoleList();
  },
  mounted() {}
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

/*.white-bg-color li:hover .roleName,
.white-bg-color li:hover .roleCode {
  cursor: pointer;
  color: #5cb0e6 !important;
  background: #eaf9ff;
}*/
.white-bg-color li:hover{
  cursor: pointer;
  background: #eaf9ff;
}
.white-bg-color li:hover .roleName,.white-bg-color li:hover .roleCode,li.roleClass.is_active .roleName,li.roleClass.is_active .roleCode{
  color: #5cb0e6 !important;
}
li.roleClass.is_active{
  cursor: pointer;
  background: #eaf9ff;
}
.roleName {
  font-size: 14px;
  color: #2d2d2d;
  padding-left: 16px;
  padding-top: 4px;
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