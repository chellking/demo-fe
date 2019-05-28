<template>
  <!-- <div class="main-panel"> -->
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="典型页面信息设置"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="true">
        <!-- 主表编辑页签 -->
        <ifbp-panel id="basePanel" title="基本信息" :icons="typicalDemoIcons" :main-title="mainTitle" @update:showBody="showBody=> this.mainTitle = showBody" >
          <ifbp-template ref="typicalDemoRef"
                    tplId="typicalDemoId"
                    :funnode="typicalDemoFunnode"
                    :nexuskey="typicalDemoNexuskey"
                    show-type="form"
                    :tpl-data="typicalDemoData"
                    :editable="typicalDemoEdit"
                    :form-show-message="typicalDemoEdit">
          </ifbp-template>
          <ifbp-form-button-area v-if="typicalDemoEdit">
            <el-button type="primary"  @click="typicalDemoConfirm">保存</el-button>
            <el-button @click="typicalDemoCancel">取消</el-button>
          </ifbp-form-button-area>
        </ifbp-panel>
        <!-- 子表页签 -->
        <ifbp-panel id="childPanel" title="子表信息"  :icons="childIcons" :right-icons="childRightIcons" :show-body="childShowBody" @update:showBody="val=> this.childShowBody =val">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :table-show-menu="false"
                :editable="childEditable"
                @update:editable="val => {this.childEditable = val}"
                :delete-button-show="!childEditable"
                :cancel-button-show="childEditable"
                @expand="(row, expanded) => {this.tableOperVif = !expanded}"
                :table-oper-vif="tableOperVif"
                :tpl-reset-fun="typicalDemoChildResetFun"
                :confirm-clear-edit="false"
                @change="templateChange"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-delete-click="childFormDelete">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    <!-- </div> -->
  <!-- </div> -->
</ifbp-page>
</template>
<script>
import typicalDemoDetailChild from "./typicalDemoDetailChild.js";
import elCustomRefDialog from './elCustomRefDialog.vue';
import mockjson from '../mock/detail.mock.js';
// import Table from '/Users/sunyuting/Desktop/youyong/ifbp-element-rc007/ifbp-element/packages/table/src/table.vue';
// import ifbpPage  from './debug/ifbp-page.vue';
// import ifbpBreadcrumb  from './debug/ifbp-breadcrumb.vue';
// import ifbpButtonArea  from './debug/ifbp-button-area.vue';
// import ifbpMainArea  from './debug/ifbp-main-area.vue';
// import ifbpFormButtonArea from './debug/ifbp-form-button-area.vue';
Vue.component(elCustomRefDialog.name, elCustomRefDialog);
export default {
  mixins: [typicalDemoDetailChild],
  components:{
    //ifbpPage, ifbpBreadcrumb, ifbpButtonArea, ifbpMainArea
    // ifbpFormButtonArea
  },
  // components:{
  //   Table
  // },
  data() {
    let vm = this;
    let id = this.$root.$router.currentRoute.params.id;
    return {
      // 通过传入的参数判断是新增还是修改操作
      id: id,
      typicalDemoEdit: true,
      mainTitle: true,
      iconsEdit: true,
      // 基础panel显示图标
      typicalDemoIcons: [
        {
          icon: "create-square",
          show: false,
          click: function() {
            vm.typicalDemoEdit = !vm.typicalDemoEdit;
            // vm.iconsEdit = false;
            vm.typicalDemoIcons[0].show = false;
          }
        }
      ],
      // UI模板所需参数
      typicalDemoFunnode: "CJGL",
      typicalDemoNexuskey: "typical",
      typicalDemoData: {},
      // 基本信息默认是否可修改

    };
  },
  mounted() {
    this.request();
    // 修改页面默认不可编辑
    if (this.id) {
      this.typicalDemoEdit = false;
      this.typicalDemoIcons[0].show = true;
    }
  },
  // computed: {
  //   typicalDemoIcons :function() {
  //     var vm = this;
  //     var a = [
  //       {
  //         icon: "edit",
  //         show: vm.iconsEdit,
  //         click: function() {
  //           vm.typicalDemoEdit = !vm.typicalDemoEdit;
  //           vm.iconsEdit = false;
  //           // vm.typicalDemoIcons[0].show = false;
  //         }
  //       }
  //     ];
  //     return a;
  //   }
  // },
  methods: {
    ifbpPageBeforeClose(){
      console.log('typical demo detail close false');
      return true;
    },
    // 获取数据
    request() {
      // 请求客户基本信息详情
      this.requestTypicalDemoBaseInfo();
      // 请求客户银行账户列表
      this.requestTypicalDemoChild();
    },
    // 请求客户基本信息详情
    requestTypicalDemoBaseInfo() {
      if (!this.id) return;
      this.$http({
        url: "/ifbp-app-sm-infoset-web/typical_demo/getById",
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
            this.$nextTick(() => {
              if (this.$refs.typicalDemoRef) {
                this.$refs.typicalDemoRef.setFormData(resData);
              } else {
                this.$set(this.typicalDemoData, "uitemplateFormData", resData);
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
    typicalDemoCancel() { 
      this.typicalDemoEdit = false;
      this.typicalDemoIcons[0].show = true;
      // this.iconsEdit = true;
      this.$refs.typicalDemoRef.clearEdit();
      if (this.baseData) {
        this.$refs.typicalDemoRef.setFormData(JSON.parse(JSON.stringify(this.baseData)));
      } else {
        this.$refs.typicalDemoRef.resetFormData();
      }
    },
    // 基本信息保存按钮操作
    typicalDemoConfirm() {
      let vm = this;
      let url = "/ifbp-app-sm-infoset-web/typical_demo/update";
      this.$refs.typicalDemoRef.validate(valid => {
        if (valid) {
          let data = vm.$refs.typicalDemoRef.getFormData();
          if (!vm.id) {
            url = "/ifbp-app-sm-infoset-web/typical_demo/create";
          }
          vm
            .$http({
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
                vm.$message({
                  message: "保存成功"
                });
                if (!vm.id) {
                  vm.id = res.data.data.id;
                }
                let resData = res.data.data || {};
                vm.$refs.typicalDemoRef.setFormData(resData);
                vm.baseData = JSON.parse(JSON.stringify(resData));
                vm.typicalDemoEdit = false;
                // this.iconsEdit = true;
                vm.typicalDemoIcons[0].show = true;
                this.$refs.typicalDemoRef.clearEdit();
                // debugger;
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
          this.$message("校验未通过");
        }
      });
    }
  }
};
</script>
<style>

</style>
