<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="课程详情"></ifbp-breadcrumb>
    <process ref="initiate" :showBtnOfSpzt="showBtnOfSpzt" :templatePk="templatePk" @callBack="processCallback" :passValue="passValue=true" @afterAction="processAfterCallback"></process>
    <ifbp-button-area v-if="this.isSponsor && this.showBtnOfSpzt">
      <el-button type="primary" @click="initiateProcess">提交</el-button>
    </ifbp-button-area>
    <ifbp-initiate-flow  v-if="true" ref="initiate" :templatePk="templatePk" @callBack="processCallback" :passValue="passValue=true" @afterAction="processAfterCallback"></ifbp-initiate-flow>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail" style="margin-top:8px;">
      <ifbp-panel-group navbar="true" :base-nav-bar-top="baseNavBarTop" :base-scroll-top="baseScrollTop">
        <!-- 主表编辑页签 -->
        <ifbp-panel id="courseInfo" title="课程信息" :icons="courseInfoIcons" :main-title="true">
          <!-- UI模板组件 --> <!-- funnode参数指定平台UI模板定义值 nexuskey参数指定平台UI模板定义值 -->
          <ifbp-template
            ref="formRef"
            tpl-id="formId"
            :editable="formEdit"
            :funnode="formFunnode"
            :nexuskey="formNexuskey"
            :tpl-data="formData"
            show-type="form">
          </ifbp-template>
          <ifbp-form-button-area v-if="formEdit">
            <el-button type="primary" @click="formConfirm">保存</el-button>
            <el-button type="default" @click="formCancel">取消</el-button>
          </ifbp-form-button-area>
        </ifbp-panel>
        <!-- 子表页签 -->
        <ifbp-panel id="courseForm" :icons="courseFormIcons" title="课表">
          <ifbp-template
            ref="courseForm"
            tpl-id="courseForm"
            show-type="table-form"
            :funnode="courseFormFunnode"
            :nexuskey="courseFormNexuskey"
            :tpl-data="courseFormData"
            :tpl-reset-fun="courseFormResetFun"
            :editable="courseFormEdit"
            :delete-button-show="!courseFormEdit"
            :cancel-button-show="courseFormEdit"
            :form-show-message="courseFormEdit"
            :table-oper-vif="courseFormTableOperVif"
            @update:editable="val => {this.courseFormEdit = val}"
            @expand="(row, expanded) => {this.courseFormTableOperVif = !expanded}"
            @edit-table-click="courseFormEditTable"
            @delete-table-click="courseFormDeleteTable"
            @form-edit-click="courseFormEditClick"
            @form-confirm-click="courseFormConfirm"
            @form-delete-click="courseFormDeleteClick">
          </ifbp-template>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
  </ifbp-page>
</template>

<script>
import process from "./process.vue"; // 引入流程组件

export default {//导出组件process
  components:{process},

  data() {//页面初始化
    let vm = this;
    let id = this.$root.$router.currentRoute.params.id;
    return {
      /* ===========  主表 课程信息  =============== */
      formFunnode: "TRAIN_COURSE",
      formNexuskey: "CourseMaster",
      formData: {},
      // 获取当前主表单id
      id: id,
      formEdit: true,
      // 基础panel显示图标
      courseInfoIcons: [
        {
          icon: "edit",
          show: false,
          click: function() {
            vm.formEdit = !vm.formEdit;
            vm.courseInfoIcons[0].show = false;
          }
        }
      ],
      /* ===========  子表 课表  =============== */
      courseFormFunnode: "TRAIN_COURSE",
      courseFormNexuskey: "coursedetail",
      courseFormData: {},
      courseFormEditIndex: -1,
      courseFormEdit: false,
      courseFormTableOperVif: true,
      courseFormRowId: '',
      courseFormIcons: [
        {
          icon: "plus",
          click: function() {
            // 关闭表格展开列
            vm.$refs.courseForm.getTableComp().closeExpandRow();
            // 隐藏表格
            // 重置新增数据
            vm.$refs.courseForm.resetFormData();
            // vm.$refs.courseForm.setData("", {});
            // 显示新增区域
            vm.$refs.courseForm.tableShow = true;
            vm.$refs.courseForm.formShow = true;
            vm.courseFormEdit = true;
          }
        }
      ],
      courseFormResetFun($node) {
        //获取table,此id为ui模板上面的表格Id
        let $table = this.getTableDom($node);
        //定义操作
        let operateArr = [
          {
            icon: "edit",
            title: "查看",
            vif: "tableOperVif"
          },
          {
            title: "删除",
            icon: "delete",
            vif: "tableOperVif"
          }
        ];
        //获取操作按钮html片段
        let operateHtml = this.getTableOperateHtml(operateArr);
        $table.append(operateHtml);

        return $node[0].outerHTML;
      },

      /* ===========  审批流 =============== */
      // 动态确定右侧导航栏高度
      baseNavBarTop: 115,
      baseScrollTop: 116,
      // 根据审批状态是否显示提交
      isSponsor: false,
      showBtnOfSpzt:false,
      // 单据pk
      templatePk: '',
      // 场景编码
      sceneCode: '',
      // 业务编码
      businessKey: '',
      // 控制是否显示操作按钮,false不显示,默认是true
      showBtn: false, 
    }
  },
  created() {
    this.request();
    // 修改页面默认不可编辑
    if (this.id) {
      this.formEdit = false;
      this.courseInfoIcons[0].show = true;
    }
  },
  mounted() {
    const self = this;
    this.getSceneCode();
    var promise1 = this.requestCourseData();
    var promise = this.isEnable();
    // 修改页面默认不可编辑
    if (this.id && this.id !== "undefined") {
      this.formEdit = false;
      this.courseInfoIcons[0].show = true;
    }
    if(this.$route.params.id === 'undefined'){
      this.baseNavBarTop = 43;
      this.baseScrollTop = 44;
    } else{
      Promise.all([promise1,promise]).then(() => {
        if(window.location.hash.indexOf('processKey') !== -1){
          self.baseNavBarTop = 163;
          self.baseScrollTop = 164;
        } else if (self.isSponsor && self.showBtnOfSpzt){
          self.baseNavBarTop = 115;
          self.baseScrollTop = 116;
        } else {
          self.baseNavBarTop = 43;
          self.baseScrollTop = 44;
        }
      });
    }
  },
  methods: {
    // 获取数据
    request() {
      // 获取课程基本信息详情
      this.requestCourseData();
      // 获取课表信息
      this.requestCourseFormData();
    },
    // 请求课程基本信息详情
    requestCourseData() {
      if (!this.id) return;
      this.$http({
        url: "/ifbp-demo-web/course/getById",//后台业务实现接口-查询
        method: "post",
        data: this.id,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            let resData = res.data.data || {};
            // 根据返回的审批状态决定是否显示提交按钮
            if(resData.djzt === "0" || resData.djzt === "-1" || resData.djzt === undefined || resData.djzt === null){
              this.showBtnOfSpzt = true;
            } else {
              this.baseNavBarTop = 43;
              this.baseScrollTop = 44;
            }
            this.templatePk = resData.id;

            this.$nextTick(() => {
              if (this.$refs.formRef) {
                this.$refs.formRef.setFormData(resData);
              } else {
                this.$set( this.formRef, "uitemplateFormData", resData );
              }
            });
            this.baseData = JSON.parse(JSON.stringify(resData));
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "基本信息详情获取失败",
            type: "error"
          });
        });
    },
    // 基本信息取消按钮操作
    formCancel() {
      this.formEdit = false;
      this.courseInfoIcons[0].show = true;
      this.$refs.formRef.clearEdit();
      if (this.baseData) {
        this.$refs.formRef.setFormData(JSON.parse(JSON.stringify(this.baseData)));
      } else {
        this.$refs.formRef.resetFormData();
      }
    },
    // 基本信息保存按钮操作
    formConfirm() {
      let vm = this;
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let data = vm.$refs.formRef.getFormData();
          vm.$http({
              url: "/ifbp-demo-web/course/update",//后台业务实现接口-更新保存-只主表
              method: "post",
              data: data,
              headers: {
                "Content-Type": "application/json"
              },
              dataType: "application/json"
            })
            .then(res => {
              if (res.data.success) {
                vm.$message({
                  message: "保存成功"
                });
                vm.formEdit = false;
                vm.courseInfoIcons[0].show = true;
                this.$refs.formRef.clearEdit();
              } else {
                vm.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              vm.$message({
                message: "保存失败",
                type: "error"
              });
            });
        } else {
          // this.$message("校验未通过");
        }
      });
    },
    // 请求课表信息
    requestCourseFormData() {
      let data = {
        searchParams: {
          searchMap: {course: this.id}
        }
      }
      this.$http({
        url: "/ifbp-demo-web/courseitem/page",//后台业务实现接口-子表查询
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
      .then(res => {
        if (res.data.success === true) {
          let resData = JSON.parse( JSON.stringify(res.data.data.content) );
          this.$nextTick(() => {
            if (this.$refs.courseForm) {
              this.$refs.courseForm.setTableData(resData);
            } else {
              this.$set( this.courseFormData, "uitemplateTableData", resData );
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      })
      .catch(e => {
        this.$message({
          message: "课程列表信息获取失败",
          type: "error"
        });
      });
    },
    // 删除课表信息
    deleteClick() {
      this.$http({
        url: "/ifbp-demo-web/courseitem/deleteById",//后台业务实现接口-子表删除
        method: "post",
        data: this.delId,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.delDialogVisible = false;
            this.requestCourseFormData();
            this.courseFormTableOperVif = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "删除接口调用失败",
            type: "error"
          });
        });
    },
    // 编辑课表列表数据
    courseFormEditTable(scope) {
      this.$refs.courseForm.tableShow = true;
      this.$refs.courseForm.getTableComp().expandRow(scope.row);
      this.$refs.courseForm.formShow = false;
      var row = JSON.parse(JSON.stringify(scope.row));
      this.$refs.courseForm.setFormData(row);
      this.courseFormEdit = true;
      // 备份数据
      // this.staffWorkBaseData = row;
      this.courseFormEditIndex = scope.$index;
      // this.$nextTick(() => {
      //   this.$refs.courseForm.setFormData(courseFormData);
      // });
    },
    // 在课表列表的子表单删除数据
    courseFormDeleteClick(type, row){
      this.courseFormDeleteTable(row,"tableForm");
    },
    // 在课表列表删除数据
    courseFormDeleteTable(scope, type) {
      this.delDialogVisible = true;
      console.log(scope);
      if(type === "tableForm"){
        this.delId = scope.id;
      } else {
        this.delId = scope.row.id;
      }
      this.deleteClick();
    },
    // 在课表选中编辑行
    courseFormEditClick(type, row, index) {
      this.courseFormEdit = true;
      this.courseFormRowId = index;
    },
    // 新增或编辑课表后保存
    courseFormConfirm(type, row) {
      this.$refs.courseForm.getFormComp().validate(valid => {
        if (valid) {
          let data = this.$refs.courseForm.getFormData();
          data.course = this.id;
          let url = "";
          if (type === "form") {
            url = "/ifbp-demo-web/courseitem/create";
          } else {
            url = "/ifbp-demo-web/courseitem/update";
          }
          this.$http({
            url: url,
            method: "post",
            data: data,
            headers: {
              "Content-Type": "application/json"
            },
            dataType: "application/json"
          })
            .then(res => {
              if (res.data.success) {
                this.record_status = "table";
                this.courseFormEdit = false;
                this.$refs.courseForm.formShow = false;
                this.$refs.courseForm.tableShow = true;
                if (!data.id) {
                  this.requestCourseFormData();
                  this.$message({
                    message: "新增成功",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  this.$refs.courseForm.clearEdit();
                }
              } else {
                this.courseFormEdit = true;
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              if (!data.id) {
                this.$message({
                  message: "课表新增失败",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "课表更新失败",
                  type: "error"
                });
              }
              this.record_status = "table";
            });
        } else {
          this.$message("校验未通过");
        }
      }, type);
    },


    // 流程的回调函数
    processCallback(action){
      //action为按钮的类型,从流程的组件中传过来的,同意=>aggreeAble,驳回=>rejectAble,拒绝=>refuseAble,指派=>assignAble...
      //可以根据自己的需要，调用流程组件中的方法
      this.$refs.initiate.customEvents();
    },
    // 流程按钮确定后的事件(撤回=>withDraw,同意=>aggreeAble,驳回=>rejectAble,拒绝=>refuseAble,指派=>assignAble...)
    processAfterCallback(action){

    },
    // 云审流程的提交按钮是否显示
    isEnable() {
      var sceneCode = this.sceneCode;
      if (sceneCode !== "undefined" && sceneCode) {
       return this.$http.get("/ifbp-bpm-service/bmp_proc/check", {
            params: {
              buzicode: "TRAIN_COURSE",
              sceneCode: sceneCode
            }
          }).then((res) => {
            this.isSponsor = res.data.data.enabled;
          }).catch(error => {
          });
      }
    },
    // 流程提交发送的请求
    initiateProcess() {
      var promise1 = this.initiateProcessBefore();
      Promise.all([promise1]).then(() => {
        if(this.courseSubmit){
          this.initiateProcessAfter();
        }
      });
    },
    // 提交的时候需要首先发送一个请求
    initiateProcessBefore() {
      return this.$http({
        url: '/ifbp-demo-web/course/submit',//后台业务实现接口-流程提交
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json",
        method: 'post',
        data: this.templatePk
      }).then((res) => {
        if(res.data.success === true){
          this.courseSubmit = true;
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '请求出错'
        });
      });
    },
    initiateProcessAfter() {
      var params = {
        buzicode: "TRAIN_COURSE",
        sceneCode: this.sceneCode,
        processInstanceName: "COURSE_FLOW",
        businessKey: this.businessKey,
        mdPK: this.businessKey
      };
      this.$http({
        url: "/ifbp-bpm-service/proc/start",
        method: "post",
        data: params
      }).then(res => {
        if (res.data.status === 1) {
          this.$message({
            type: "success",
            message: "发起流程成功"
          });
          this.isSponsor = false;
          this.baseNavBarTop = 43;
          this.baseScrollTop = 44;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(() => {
        this.$message.error("发起失败");
      });
    },
    // 获取场景编码
    getSceneCode(){
      this.sceneCode = window.location.href.split('?')[1].split('&')[0].split('=')[1];
      let paramPK = location.href.split("?")[0].split("/");
      this.businessKey = paramPK[paramPK.length - 1];
      if(location.href.indexOf("processKey") !== -1){
        this.showBtn = true;
      } else{
        this.showBtn = false;
      }
    },
  }
}
</script>