<template>
  <ifbp-page>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group >
        <!-- 主表编辑页签 -->
        <ifbp-panel id="basePanel" title="报销单" :icons="formIcons" :main-title="true">
          <div id="el-templateformId" class="yon-uitemplate" style="position: relative;">
            <el-form _id="fm2sycrhn2w" ref="formRef" :inline="true" :rules="rules" label-width="150px" :adaptation="true" :model="BXHeaderEntity">
              <el-form-item _id="g82spzbx6e5" label="票据号" prop="pjh">
                  <el-input v-if="formEdit" _id="7ulim5wlxaq" max="50" :editable="editable" v-model="BXHeaderEntity.pjh"></el-input>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.pjh}}</el-button>
              </el-form-item>
              <el-form-item _id="88kjzw5i04o" label="合计金额" prop="total">
                  <el-number v-if="formEdit" _id="ux5rykcj1eg" separator="," max="28" :editable="editable" v-model="BXHeaderEntity.total"></el-number>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.total}}</el-button>
              </el-form-item>
              <el-form-item _id="313zw8lv11w" label="单据编号" prop="djbh">
                  <el-input v-if="formEdit" _id="a3ekmc07huu" max="50" :editable="editable" v-model="BXHeaderEntity.djbh"></el-input>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.total}}</el-button>
              </el-form-item>
              <el-form-item _id="3s0vagan4m3" label="单据日期" prop="djrq">
                  <el-input v-if="formEdit" _id="i2wxpqzskj" max="50" :editable="editable" v-model="BXHeaderEntity.djrq"></el-input>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.djrq}}</el-button>
              </el-form-item>

              <el-form-item _id="1isl08d06kg" label="还款原币金额" prop="hkybje">
                  <el-number v-if="formEdit" _id="aeazvyfcscb" separator="," max="28" :editable="editable" v-model="BXHeaderEntity.hkybje"></el-number>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.hkybje}}</el-button>
              </el-form-item>
              <el-form-item _id="tr1q9inujjf" label="支付原币金额" prop="zfybje">
                  <el-number v-if="formEdit" _id="f0s3wxhyky5" separator="," max="28" :editable="editable" v-model="BXHeaderEntity.zfybje"></el-number>
                  <el-button v-else class="no-min-width" type="text">{{BXHeaderEntity.zfybje}}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <ifbp-form-button-area v-if="formEdit">
            <el-button type="primary"  @click="formConfirm">保存</el-button>
            <el-button @click="formCancel">取消</el-button>
          </ifbp-form-button-area>
        </ifbp-panel>
        <!-- 子表页签 -->
        <sub-account :parent-id="id"></sub-account>

      </ifbp-panel-group>
    </ifbp-main-area>
    <!-- </div> -->
  <!-- </div> -->
</ifbp-page>
</template>
<script>
import expenseAccountDetailChild from "./expenseAccountDetailChild.js";
import subAccount from "./subAccount.vue"
export default {
  mixins: [expenseAccountDetailChild],
  components: {
    subAccount
  },
  data() {
    let vm = this;
    let id = this.$root.$router.currentRoute.params.id;
    return {
      editable:true,
      rules:{},
      "BXHeaderEntity":{
        "pjh": "",
        "pk_org_v":"",
        "pk_fiorg":"",
        "total":"",
        "djbh":"",
        "djrq":"",
        "deptid_v":"",
        "jkbxr":"",
        "pjh":"",
        "fkyhzh":"",
        "hkybje":"",
        "zfybje":"",
        "customer":""
      },
      // 通过传入的参数判断是新增还是修改操作
      id: id,
      formEdit: true,
      iconsEdit: true,
      // 基础panel显示图标
      formIcons: [
        {
          icon: "edit",
          show: false,
          click: function() {
            vm.formEdit = !vm.formEdit;
            vm.formIcons[0].show = false;
          }
        }
      ],
      // UI模板所需参数
      formFunnode: "BXD",
      formNexuskey: "BXD_HEADER",
      formData: {},
      // 基本信息默认是否可修改
    };
  },
  mounted() {
    this.request();
    // 修改页面默认不可编辑
    if (this.id) {
      this.formEdit = false;
      this.formIcons[0].show = true;
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
        url: "/ifbp-demo-web/BXHeader/getById",
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
              this.BXHeaderEntity = resData;
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
      this.formIcons[0].show = true;
      // this.iconsEdit = true;

      if (this.baseData) {
        this.BXHeaderEntity = this.baseData;
      } else {
        this.BXHeaderEntity = {};
      }
    },
    // 基本信息保存按钮操作
    formConfirm() {
      let vm = this;
      let url = "/ifbp-demo-web/BXHeader/update";
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let data = this.BXHeaderEntity;
          if (!vm.id) {
            url = "/ifbp-demo-web/BXHeader/create";
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
                this.BXHeaderEntity = resData;
                vm.baseData = JSON.parse(JSON.stringify(resData));
                vm.formEdit = false;
                vm.formIcons[0].show = true;
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
