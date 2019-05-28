<template>
  <ifbp-page>
    <ifbp-breadcrumb name="新增"></ifbp-breadcrumb>
    <ifbp-main-area type="detail">
    <!-- 添加员工信息ui模板 -->
    <ifbp-panel-group>
    <ifbp-panel title="员工信息" :mainTitle="true">
      <ifbp-template ref="staffFormRef"
                      tplId="staffFormTemplate"
                      :funnode="funNode"
                      :nexuskey="nexusKey"
                      show-type="form"
                      :tplData="tplData"
                      :methods="staffMethods"
                      :tpl-reset-fun="staffResetFun"
                      :editable="true">
      </ifbp-template>
    </ifbp-panel>

    <!--工作经历列表-->
    <ifbp-panel title="员工工作列表">
      <div v-show="record_status === 'form'">
        <ifbp-template ref="staffWorkRef"
                      tpl-id="staffWorkTableId"
                      show-type="form"
                      :editable="true"
                      :funnode="workFunnode"
                      :nexuskey="workNexuskey"
                      :tpl-data="staffWorkTableData"
                      :tpl-reset-fun="staffWorkTableResetFun"
                      :methods="staffWorkMethods">
        </ifbp-template>
      </div>
    </ifbp-panel>
    </ifbp-panel-group>
    </ifbp-main-area>
    <ifbp-footer>
      <el-button type="default" @click="backInfo">取消</el-button>
      <el-button class="fr" type="primary" @click="addUser">保存</el-button>
    </ifbp-footer>
  </ifbp-page>
</template>
<script>
  export default {
    data(){
      var valiadateCode = (rule,value,callback) => {
        this.$http({
          url:'/ifbp-app-bd/bd/psn/psndoc/checkCode?code=' + value,
          type:'get'
        }).then((res) => {
          if(res.data.success === true){
            callback();
          }else if(res.data.success === false){
            callback(new Error('编码已存在，请重新输入！'));
          }
        }).catch(() => {
          callback();
          this.$message.error("请求失败");
        });
      }
      var patterns = {
        identity: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, // 身份证[17位数字校验+1位数字或字母X]
        residence: /^([0-9]){9}$/, // 户口簿[9位数字校验]
        passport: /^[a-z|A-Z]{1}[0-9]{8}$/, // 中国护照[1位字母+8位数字校验]
        officers: /^[0-9]{8}$/, // 军官证[8位数字校验]
        driving: /^[0-9]{18}$/, // 驾驶证[18位数字校验]
        macaoPermit: /^[a-z|A-Z]{1}[0-9]{8}$/, // 港澳通行证[1位字母+8位数字校验]
        taiwanPermit: /^[a-z|A-Z]{1}[0-9]{8}$/, // 台湾通行证[1位字母+8位数字校验]
        returnCard: /^[a-z|A-Z]{1}[0-9]{10}$/, // 返乡证[1位字母+10位数字校验]
        soldbuch: /^[0-9]{7}$/, // 士兵证[7位数字校验]
      };
      var vm = this;
      var documentidValidator = function(rule, val, callback) {
        if(!vm.idNumRequired && val === ''){
          callback()
        } else {
          var documentType = vm.$refs.staffFormRef.getFormData().idtype; // 证件类型
          if(documentType) {
            var typeName = vm.documentTypeMap[documentType];
            if(typeName) {
              var pattern = vm.patterns[typeName];
              if(val === ""){
                callback(new Error("证件号码不能为空"))
              }
              if(!pattern.test(val)) {
                callback(new Error("证件号格式不正确"));
                return;
              }
            }
          }
          callback();
        }
      }
      return {
        /* ===========  staff detail Form data  =============== */
        funNode: 'YGGL',
        nexusKey: 'STAFF_INFO',
        tplData: {
          psndoc: {},
          rules:{
            id_num: [{
              validator: documentidValidator,
              trigger: 'blur',
              // message: '证件号格式错误'
            }],
            code:[{validator:valiadateCode,trigger:'blur'}]
          }
        },
        idNumRequired: '',
        staffResetFun($node){
          let $form = $node.find("el-form");
          var $id_num = $form.find("el-form-item[prop='id_num']").attr(":required");
          vm.idNumRequired = $id_num;
        },
        staffMethods: {
          avatarUploadSuccess(res) {
            var formData = vm.$refs.staffFormRef.comp.psndoc;
            formData.avatar = res.data;
          }
        },
        /* ===========  staff-work Table data  =============== */
        workFunnode:'YGGL',
        workNexuskey:'STAFF_WORK_INFO',
        staffWorkTableData: {
          psnjob: {
            ismainjob: '主职'
          },
          ismainjobCheckedList: ['主职'], // ismainjob为数组类型 默认为主职选中
          pk_dept_queryparams: {}, // 所在部门queryparams
          deptRefBeforeQuery() {
            if(this.field === 'pk_dept'){
              if(!vm.$refs.staffWorkRef.getFormData().pk_org){
                vm.$message('请选择任职公司');
                return false;
              }
            }
            return true;
          },
        },
        staffWorkTableResetFun($node) {
          // 获取form元素
            let $form = $node.find("el-form");
            // 处理'是否主职'checkbox
            var $checkboxGroup = $form.find("el-checkbox-group[v-model='psnjob.ismainjob']");
            // 重新给checkbox绑定自定义的变量（数组类型），在onchange事件里给psnjob.ismainjob赋值字符串"主职"
            $checkboxGroup.attr("v-model", "ismainjobCheckedList");
            $checkboxGroup.attr("v-on:change", "checkboxChange");
            // 为任职公司字段添加trigger事件
            var $orgRef = $form.find("el-ref[field='pk_org']");
            $orgRef.attr("v-on:trigger", "orgRefChange");
            // 为所在部门字段添加before-query属性方法
            var $deptRef = $form.find("el-ref[field='pk_dept']");
            $deptRef.attr("v-bind:before-query", "deptRefBeforeQuery");
            
            return $node[0].outerHTML;
        },
        staffWorkMethods: {
          checkboxChange(v) {
            var value = v.join(',');
            this.psnjob.ismainjob = value;
          },
          orgRefChange(type, value) {
            if(type === "change") {
              vm.$refs.staffWorkRef.setData("pk_dept_queryparams", {pk_corp: value.value[0].id})
            }
          },
        },
        record_status: 'form',
        // currentValueRecord: '',
        patterns: patterns,
        documentTypeMap: { // document_type to document_id Map
          '0': 'identity', // 身份证
          '1': 'residence',// 户口簿
          '2':'passport', // 中国护照
          '3':'officers', // 军官证
          'D':'driving', // 驾驶证
          'B':'macaoPermit', // 港澳通行证
          'C':'taiwanPermit', // 台湾通行证
          'E':'returnCard', // 返乡证
          '4':'soldbuch' // 士兵证
        },
      };
    },
//    components: {uitemplate:template},
    methods: {
      /**
       *  添加用户
       *
       **/
      addUser() {
        this.$refs.staffFormRef.validate((valid) => {
          if(valid) {
           this.$refs.staffWorkRef.validate((validNext) => {
              if(validNext){
                  var url = '/ifbp-app-bd/bd/psn/psndoc/save';
                  this.$http({
                    url: url,
                    method: 'POST',
                    data: {
                      psndoc: this.$refs.staffFormRef.getFormData(),
                      psnjob: this.$refs.staffWorkRef.getFormData()
                    },
                    dataType: 'json'
                  }).then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: '添加成功！',
                        type: 'success'
                      });
                      this.$refs.staffFormRef.clearEdit();
                      this.$refs.staffWorkRef.clearEdit();
                      this.$context.destroyCurrentTile();
                      this.$router.push("/staff");
                    } else {
                      this.$message({
                        message: res.data.error.errorMessage,
                        type: 'error'
                      });
                    }

                  }).catch(() => {
                  });
              }
            });
          }
        });

      },

      /**
       *  一些控制页面状态的方法
       *  都在按钮上绑着
       **/
      // 返回list页面
      backInfo() {
        // 清空路由上下文的栈,使返回页面的面包屑没有异常
        this.$context.destroyCurrentTile();
        this.$router.push('/staff');
      }
    }
  };

</script>
