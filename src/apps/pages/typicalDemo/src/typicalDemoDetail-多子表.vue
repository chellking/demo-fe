<template>
  <!-- <div class="main-panel"> -->
  <ifbp-page>
    <!--节点title-->
    <!-- <div class="title-container">
      <h2 class="name">典型页面信息设置</h2>
    </div> -->
    <ifbp-breadcrumb name="典型页面信息设置"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <!-- <div class="detail-main-container clearfix"> -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group :navbar="true">
        <!-- 主表编辑页签 -->
        <ifbp-panel id="basePanel" title="基本信息" :icons="typicalDemoIcons" class="titleLine">
          <ifbp-template ref="typicalDemoRef"
                    tplId="typicalDemoId"
                    :funnode="typicalDemoFunnode"
                    :nexuskey="typicalDemoNexuskey"
                    show-type="form"
                    :tplData="typicalDemoData"
                    :editable="typicalDemoEdit"
                    :form-show-message="typicalDemoEdit">
          </ifbp-template>
          <div class="form-button-div" v-if="typicalDemoEdit">
            <el-button @click="typicalDemoCancel">取消</el-button>
            <el-button type="primary"  @click="typicalDemoConfirm">保存</el-button>
          </div>
        </ifbp-panel>
        <!-- 子表页签 -->
         <ifbp-panel id="childPanel" title="子表信息"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel1" title="子表信息1"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel2" title="子表信息2"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel3" title="子表信息3"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel4" title="子表信息4"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel5" title="子表信息5"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel6" title="子表信息6"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
          </ifbp-template>
          <!--删除确认Dialog-->
          <ifbp-del-dialog
            v-model="childDelDialogVisible"
            message="确认删除该数据？删除后无法恢复。"
            @click="childDeleteDialogClick"
            >
          </ifbp-del-dialog>
        </ifbp-panel>
        <ifbp-panel id="childPanel7" title="子表信息7"  :show-body="false" :icons="childIcons">
          <ifbp-template ref="typicalDemoChildRef"
                tpl-id="typicalDemoChildId"
                :funnode="typicalDemoChildFunnode"
                :nexuskey="typicalDemoChildNexuskey"
                :tpl-data="typicalDemoChildData"
                show-type="table-form"
                :editable="childEditable"
                :table-oper-vif="childEditable"
                :tpl-reset-fun="typicalDemoChildResetFun"
                @row-click="childRowClick"
                @edit-table-click="childEditClick"
                @delete-table-click="childDeleteClick"
                @form-confirm-click="childFormConfirm"
                @form-edit-click="childFormEdit"
                @form-cancel-click="childFormCancel">
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
// import Table from '/Users/sunyuting/Desktop/youyong/ifbp-element-rc007/ifbp-element/packages/table/src/table.vue';
// import ifbpPage  from './debug/ifbp-page.vue';
// import ifbpBreadcrumb  from './debug/ifbp-breadcrumb.vue';
// import ifbpButtonArea  from './debug/ifbp-button-area.vue';
// import ifbpMainArea  from './debug/ifbp-main-area.vue';
Vue.component(elCustomRefDialog.name, elCustomRefDialog);
export default {
  mixins: [typicalDemoDetailChild],
  // components:{
  //   ifbpPage, ifbpBreadcrumb, ifbpButtonArea, ifbpMainArea
  // },
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
      // 基础panel显示图标
      typicalDemoIcons: [
        {
          icon: "edit",
          show: true,
          click: function() {
            vm.typicalDemoEdit = !vm.typicalDemoEdit;
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
    }
  },
  methods: {
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
      if (this.baseData) {
        this.$refs.typicalDemoRef.setFormData(this.baseData);
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
                vm.typicalDemoIcons[0].show = true;
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
