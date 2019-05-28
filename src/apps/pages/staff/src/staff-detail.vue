<template>
  <ifbp-page>
    <ifbp-breadcrumb name="员工信息设置"></ifbp-breadcrumb>
    <ifbp-main-area type="detail">
      <ifbp-panel-group>
    <ifbp-panel title="员工信息" :icons="staffEditIcons">
      <ifbp-template ref="staffFormRef"
                      tplId="staffFormTemplate"
                      :funnode="funNode"
                      :nexuskey="nexusKey"
                      show-type="form"
                      :tplData="tplData"
                      :methods="staffMethods"
                      :editable="staffEdit"
                      :form-show-message="staffEdit">
      </ifbp-template>
      <div class="button-area" v-if="staffEdit">
        <el-button type="default" @click="cancalStaff">取消</el-button>
        <el-button type="primary" @click="confirmStaff">保存</el-button>
      </div>
    </ifbp-panel>
    <!--工作经历列表-->
    <ifbp-panel title="员工工作列表" :icons="staffWorkIcons">
        <ifbp-template ref="staffWorkRef"
                      tpl-id="staffWorkTableId"
                      :tpl-data="staffWorkTableData"
                      show-type="table-form"
                      :funnode="workFunnode"
                      :nexuskey="workNexuskey"
                      :tpl-reset-fun="staffWorkTableResetFun"
                      :methods="staffWorkMethods"
                      :editable="staffWorkEdit"
                      :form-show-message="staffWorkEdit"
                      @update:editable="val => {this.staffWorkEdit = val}"
                      :delete-button-show="!staffWorkEdit"
                      :cancel-button-show="staffWorkEdit"
                      @expand="staffWorkExpand"
                      :table-oper-vif="staffWorkTableOperVif"
                      @edit-table-click="workEditTableRow"
                      @delete-table-click="workDeleteTableRow"
                      @setting-table-click="workShiftTableClick"
                      @form-edit-click="workFormEditClick"
                      @form-confirm-click="workFormConfirm"
                      @form-delete-click="workDeleteFormRow">
        </ifbp-template>
    </ifbp-panel>
    <ifbp-panel title="银行账户" :icons="bankIcons" :show-body="bankTableRefShow">
      <ifbp-template ref="bankTableRef"
                    tpl-id="bankTableId"
                    show-type="table-form"
                    :funnode="bankFunnode"
                    :nexuskey="bankNexuskey"
                    :methods="bankMethods"
                    :tpl-data="bankTplData"
                    :tpl-reset-fun="bankTableResetFun"
                    :editable="bankTableEdit"
                    :form-show-message="bankTableEdit"
                    @update:editable="val => {this.bankTableEdit = val}"
                    :delete-button-show="!bankTableEdit"
                    :cancel-button-show="bankTableEdit"
                    @expand="(row, expanded) => {this.tableOperVif = !expanded}"
                    :table-oper-vif="tableOperVif"
                    @edit-table-click="editBankTableRow"
                    @delete-table-click="deleteBankTableRow"
                    @form-edit-click="bankTableFormEditClick"
                    @form-confirm-click="bankConfirm"
                    @form-delete-click="deleteBankFormRow">
      </ifbp-template>
    </ifbp-panel>
  </ifbp-panel-group>
    </ifbp-main-area>
    <ifbp-del-dialog
      v-model="showWorkShift"
      message="确认转换为主职?"
      @click="workShift">
    </ifbp-del-dialog>
  </ifbp-page>
</template>
<script>
export default {
  data() {
    var vm = this;
    var patterns = {
      identity: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, // 身份证[17位数字校验+1位数字或字母X]
      residence: /^([0-9]){9}$/, // 户口簿[9位数字校验]
      passport: /^[a-z|A-Z]{1}[0-9]{8}$/, // 中国护照[1位字母+8位数字校验]
      officers: /^[0-9]{8}$/, // 军官证[8位数字校验]
      driving: /^[0-9]{18}$/, // 驾驶证[18位数字校验]
      macaoPermit: /^[a-z|A-Z]{1}[0-9]{8}$/, // 港澳通行证[1位字母+8位数字校验]
      taiwanPermit: /^[a-z|A-Z]{1}[0-9]{8}$/, // 台湾通行证[1位字母+8位数字校验]
      returnCard: /^[a-z|A-Z]{1}[0-9]{10}$/, // 返乡证[1位字母+10位数字校验]
      soldbuch: /^[0-9]{7}$/ // 士兵证[7位数字校验]
    };
    var documentidValidator = function(rule, val, callback) {
      var formData = vm.$refs.staffFormRef.getFormData();
      if (formData && formData.idtype) {
        var typeName = vm.documentTypeMap[formData.idtype];
        if (typeName) {
          var pattern = vm.patterns[typeName];
          if (!pattern.test(val)) {
            callback(new Error("证件号格式未匹配到 pattern: ") + pattern);
            return;
          }
        }
      }
      callback();
    };
    return {
      /* ===========  staff detail Form data  =============== */
      funNode: "YGGL",
      nexusKey: "STAFF_INFO",
      staffEditIcons: [
        {
          icon: "create-square",
          show: true,
          click: function() {
            vm.staffEdit = true;
            vm.staffEditIcons[0].show = false;
          }
        }
      ],
      tplData: {
        psndoc: {},
        rules: {
          id_num: [
            {
              validator: documentidValidator,
              trigger: "blur",
              message: "证件号格式错误"
            }
          ]
        }
      },
      staffMethods: {
        avatarUploadSuccess(res) {
          var formData = vm.$refs.staffFormRef.comp.psndoc;
          formData.avatar = res.data;
        }
      },

      /* ===========  staff-work Table data  =============== */
      workFunnode: "YGGL",
      workNexuskey: "STAFF_WORK_INFO",
      // staffWorkBaseData: {}, // 备份数据
      staffWorkEditIndex: -1,
      staffWorkEdit: false,
      staffWorkTableOperVif: true,
      staffWorkRowId: '',
      staffWorkIcons: [
        {
          icon: "plus",
          click: function() {
            // 关闭表格展开列
            vm.$refs.staffWorkRef.getTableComp().closeExpandRow();
            // 隐藏表格
            // 重置新增数据
            vm.$refs.staffWorkRef.resetFormData();
            vm.$refs.staffWorkRef.getFormData().ismainjob = "";
            //
            vm.$refs.staffWorkRef.setData("pk_dept_queryparams", {});
            // 显示新增区域
            vm.$refs.staffWorkRef.tableShow = true;
            vm.$refs.staffWorkRef.formShow = true;
            vm.staffWorkEdit = true;
          }
        }
      ],
      staffWorkTableResetFun($node) {
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
          },
          {
            title: "设为主职",
            icon: "setting",
            vif: "tableOperVif"
          }
        ];
        //获取操作按钮html片段
        let operateHtml = this.getTableOperateHtml(operateArr);
        $table.append(operateHtml);

        // 获取form元素
        let $form = $node.find("el-form");
        var $checkboxGroup = $form.find(
          "el-checkbox-group[v-model='psnjob.ismainjob']"
        );
        $checkboxGroup.attr("v-model", "ismainjobCheckedList");
        $checkboxGroup.attr("v-on:change", "checkboxChange");

        var $orgRef = $form.find("el-ref[field='pk_org']");
        $orgRef.attr("v-on:trigger", "orgRefChange");

        var $deptRef = $form.find("el-ref[field='pk_dept']");
        $deptRef.attr("v-bind:before-query", "deptRefBeforeQuery");
        // 级别参照,增加dialog标题
        let $job_level = $form.find("el-ref[field='job_level']");
        $job_level.attr("dialog-title","级别");
        // 岗位参照,增加dialog标题
        let $job_station = $form.find("el-ref[field='job_station']");
        $job_station.attr("dialog-title","岗位");

        return $node[0].outerHTML;
      },
      staffWorkMethods: {
        checkboxChange(v) {
          var value = v.join(",");
          this.psnjob.ismainjob = value;
        },
        orgRefChange(type, value) {
          if (type === "change" && value.value.length !== 0) {
            vm.$refs.staffWorkRef.setData("pk_dept_queryparams", {
              pk_corp: value.value[0].id
            });
          }
        }
      },
      staffWorkTableData: {
        psnjob_t: [],
        psnjob: {
          ismainjob: []
        },
        ismainjobCheckedList: [], // ismainjob
        pk_dept_queryparams: {}, // 所在部门queryparams
        deptRefBeforeQuery() {
          if (this.field === "pk_dept") {
            if (!vm.$refs.staffWorkRef.getFormData().pk_org) {
              vm.$message("请选择任职公司");
              return false;
            }
          }
          return true;
        }
      },
      expandRow: true,
      currentWorkRowData: "",
      showWorkShift: false,
      /* ===========  bank Table data  =============== */
      bankFunnode: "YGGL",
      bankNexuskey: "STAFF_BANK",
      bankTableRefShow: true,
      bankTableEdit: true,
      tableOperVif:true,
      bankIcons: [
        {
          icon: "plus",
          click: function() {
            // 关闭展开的列
            vm.$refs.bankTableRef.getTableComp().closeExpandRow();
            // 重置新增的表单
            vm.$refs.bankTableRef.resetFormData();
            vm.$refs.bankTableRef.setData("", {});
            // 显示表单新增区域
            vm.$refs.bankTableRef.tableShow = true;
            vm.$refs.bankTableRef.formShow = true;
            // 设置为编辑态
            vm.bankTableEdit = true;
            vm.isAddBankForm = true;
            vm.bankTableRefShow = true;
          }
        }
      ],
      bankTableResetFun($node) {
        //获取table,此id为ui模板上面的表格Id
        let $table = $node.find("el-table");
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

        let $form = $node.find("el-form");
        var $banktypeRef = $node.find("el-ref[field='pk_banktype']");
        $banktypeRef.attr("v-on:trigger", "banktypeRefChange");

        var $bankdocRef = $node.find("el-ref[field='pk_bankdoc']");
        $bankdocRef.attr("v-bind:before-query", "bankdocBeforeQuery");

        return $node[0].outerHTML;
      },
      // bankFormResetFun($node) {
      //   let $form = $node.find("el-form");
      //   var $banktypeRef = $node.find("el-ref[field='pk_banktype']");
      //   $banktypeRef.attr("v-on:trigger", "banktypeRefChange");

      //   var $bankdocRef = $node.find("el-ref[field='pk_bankdoc']");
      //   $bankdocRef.attr("v-bind:before-query", "bankdocBeforeQuery");
      // },
      bankTplData: {
        // bankTableOperVif: true,
        BankAccBas_t: [],
        BankAccBas: {},
        bankdocQueryParams: {},
        bankdocBeforeQuery: function() {
          if (this.field === "pk_bankdoc") {
            if (!vm.$refs.bankTableRef.getFormData().pk_banktype) {
              vm.$message("请选择银行类别");
              return false;
            }
          }
          return true;
        }
      },
      bankMethods: {
        banktypeRefChange(type, val) {
          if ((type = "change" && val.value.length !== 0)) {
            vm.$refs.bankTableRef.setData("bankdocQueryParams", {
              pk_banktype: val.value[0].id
            });
          }
        }
      },
      psnId: "",
      isCreate: false, //主表是否已经保存
      isEditBankForm: false, //是否是编辑状态
      showBankForm: false, //显示银行账户表单
      isAddBankForm: false,
      delDialogVisible: false,
      isNew: true,
      record_status: "table",
      originalValue: "",
      currentValue: "",
      recordOriginalValue: "",
      recordCurrentValue: "",
      staffEdit: false,
      staffWorkEdit: false,
      patterns: patterns,
      documentTypeMap: {
        // document_type to document_id Map
        "0": "identity", // 身份证
        "1": "residence", // 户口簿
        "2": "passport", // 中国护照
        "3": "officers", // 军官证
        "D": "driving", // 驾驶证
        "B": "macaoPermit", // 港澳通行证
        "C": "taiwanPermit", // 台湾通行证
        "E": "returnCard", // 返乡证
        "4": "soldbuch" // 士兵证
      }
    };
  },
  created() {
    this.psnId = this.$root.$router.currentRoute.params.id;
    // 根据路由的edit参数决定是否是编辑态以及编辑按钮是否显示
    var staffEdit = this.getEdit("edit");
    if(staffEdit === 'false'){
      this.staffEdit = false;
      this.staffEditIcons[0].show = true;
    } else if(staffEdit === 'true'){
      this.staffEdit = true;
      this.staffEditIcons[0].show = false;
    }
    // 获取员工信息表单数据
    this.requestStaffFormData();
    // 获取员工工作信息列表数据
    this.requestStaffWorkTableData();
    // 获取银行账户列表数据
    this.requestBankValues();
  },
  methods: {
    // 获取从卡片页传过来的是否是编辑态
    getEdit(params){
      var paramsArr = window.location.hash.split("?")[1].split("&");
      var paramsData = [];
      paramsArr.forEach((value) => {
        paramsData[value.split("=")[0]] = value.split("=")[1];
      });
      return paramsData[params];
    },
    //请求银行信息
    requestBankValues() {
      this.$http({
        url: "/ifbp-app-bd/bd/psn/psndoc/bank?id=" + this.psnId,
        type: "get"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$nextTick(() => {
              if (this.$refs.bankTableRef && res.data.data.length !== 0) {
                this.$refs.bankTableRef.setTableData(res.data.data);
              } else {
                this.bankTableRefShow = false;
                this.$set(
                  this.bankTplData,
                  "uitemplateTableData",
                  res.data.data
                );
              }
            });
          }
        })
        .catch(() => {
          this.$message.error("请求银行信息失败");
        });
    },

    //点击新增银行账户按钮
    bankConfirm() {
      const self = this;
      var submitData = {};
      var bankaccbas = this.$refs.bankTableRef.getFormData();
      this.$set(submitData, "id", self.psnId);
      this.$refs.bankTableRef.getFormComp().validate(valid => {
        if (valid) {
          this.$set(submitData, "BankAccBas", bankaccbas);
          self
            .$http({
              url: "/ifbp-app-bd/bd/psn/psndoc/addBank",
              method: "post",
              dataType: "json",
              data: submitData
            })
            .then(res => {
              if (res.data.success === true) {
                var tableData = self.$refs.bankTableRef.getTableData();
                if (this.isAddBankForm) {
                  tableData.unshift(res.data.data);
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                } else {
                  tableData.splice(this.bankRowId, 1, res.data.data);
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                }
                this.$refs.bankTableRef.formShow = false;
                this.$refs.bankTableRef.tableShow = true;
                this.$refs.bankTableRef.clearEdit();
                this.bankTableEdit = false;
                if(!self.isAddBankForm){
                  this.$refs.bankTableRef.expandRow(res.data.data,this.bankRowId);
                } else {
                  this.$refs.bankTableRef.getTableComp().closeExpandRow();
                }
                this.isAddBankForm = false;
                // this.VRFieldOfView = true;
                // this.showBankForm = false;
              } else {
                this.$message.error(res.data.error.errorMessage);
              }
            })
            .catch(() => {
              this.$message({
                message: "请求出错！",
                type: "error"
              });
            });
        } else {
          // self.$message({
          //   message: '校验未通过',
          //   type: 'success'
          // });
        }
      });
    },
    //点击银行账户编辑按钮
    editBankTableRow(scope) {
      var bankRecordForm = JSON.parse(JSON.stringify(scope.row));
      this.$refs.bankTableRef.formShow = true;
      this.$refs.bankTableRef.tableShow = false;
      this.bankTableEdit = true;
      this.isAddBankForm = false;
      // this.tableOperVif = true;
      this.bankRowId = scope.$index;
      this.$nextTick(() => {
        this.$refs.bankTableRef.setFormData(bankRecordForm);
      });
    },
    //在银行账户子表单删除数据
    deleteBankFormRow(type,row,index){
      this.deleteBankTableRow(row,"tableForm",index);
    },
    //点击银行账户删除数据
    deleteBankTableRow(scope,type,index) {
      const self = this;
      var subScope;
      if(type === "tableForm"){
        subScope = scope;
      } else {
        subScope = scope.row;
      }
      self
        .$confirm("是否删除当前记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self
            .$http({
              url:
                "/ifbp-app-bd/bd/psn/psndoc/deleteBank?id=" +
                subScope.pk_bankaccbas,
              method: "DELETE"
            })
            .then(res => {
              if (res.data.success === true) {
                var tableData = this.$refs.bankTableRef.getTableData();
                if(type === "tableForm"){
                  tableData.splice(index, 1);
                } else {
                  tableData.splice(scope.$index, 1);
                }
                if(tableData === null || tableData.length === 0){
                  this.bankTableRefShow = false;
                }
                this.$refs.bankTableRef.clearEdit();
                this.tableOperVif = true;
                self.$message("删除成功");
              } else {
                self.$message("删除失败");
              }
            })
            .catch(() => {
              self.$message("删除失败");
            });
        })
        .catch(() => {
          self.$message("已取消删除");
        });
    },
    bankTableFormEditClick(type,row,index) {
      // this.bankTableEdit = true;
      this.bankRowId = index;
    },
    bankCancel(type,row) {
      if (type === "form") {
        this.$refs.bankTableRef.formShow = false;
        this.$refs.bankTableRef.tableShow = true;
        this.bankTableEdit = false;
        if(this.$refs.bankTableRef.getTableData() === undefined || this.$refs.bankTableRef.getTableData().length === 0){
          this.bankTableRefShow = false;
        }
      } else {
        this.$refs.bankTableRef.formShow = false;
        this.$refs.bankTableRef.tableShow = true;
        this.bankTableEdit = false;
        this.$refs.bankTableRef.getTableComp();
        // this.$refs.bankTableRef.getTableComp().closeExpandRow();
      }
    },
    closeBankForm(done) {
      done();
      this.showBankForm = false;
    },

    // 获取员工信息表单数据
    requestStaffFormData() {
      this.$http({
        url: "/ifbp-app-bd/bd/psn/psndoc/" + this.psnId,
        method: "get"
      })
        .then(res => {
          if (res.data.success) {
            this.originalValue = res.data.data;
            if (this.originalValue && this.originalValue.avatar === null) {
              this.originalValue.avatar = "null";
            }
            if (this.originalValue) {
              this.currentValue = JSON.parse(
                JSON.stringify(this.originalValue)
              );
              this.$nextTick(() => {
                if (this.$refs["staffFormRef"]) {
                  this.$refs["staffFormRef"].setData(
                    "psndoc",
                    JSON.parse(JSON.stringify(this.currentValue))
                  );
                } else {
                  this.$set(
                    this.tplData,
                    "uitemplateFormData",
                    JSON.parse(JSON.stringify(this.currentValue))
                  );
                }
              });
            }
          } else {
            this.$message({
              message: res.data.data,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "用户信息获取失败",
            type: "error"
          });
        });
    },

    // 获取员工工作列表数据
    requestStaffWorkTableData() {
      this.$http({
        url:
          "/ifbp-app-bd/bd/psn/psnjob/pageList?pn=1&ps=10&sortColumn=auto&pkPsndoc=" +
          this.psnId,
        method: "get"
      })
        .then(res => {
          if (res.data.success) {
            var staffWorkList = JSON.parse(
              JSON.stringify(res.data.data.content)
            );
            this.$nextTick(() => {
              if (this.$refs["staffWorkRef"]) {
                this.$refs["staffWorkRef"].setData("psnjob_t", staffWorkList);
              } else {
                this.$set(
                  this.staffWorkTableData,
                  "uitemplateTableData",
                  staffWorkList
                );
              } 
            });
          } else {
            this.$message({
              message: res.data.data,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "用户工作信息获取失败",
            type: "error"
          });
        });
    },

    /**
     *  一些控制页面状态的方法
     *  都在按钮上绑着
     **/
    // 返回list页面
    backInfo() {
      this.$context.destroyCurrentTile();
      this.$router.push("/staff");
    },
    // 详情变为可编辑态
    setStaff() {
      this.staffEdit = true;
    },
    setRecord() {
      this.staffWorkEdit = true;
    },
    cancalStaff() {
      this.staffEdit = false;
      this.$refs.staffFormRef.setData(
        "psndoc",
        JSON.parse(JSON.stringify(this.originalValue))
      );
      this.staffEditIcons[0].show = true;
    },
    /**
     *  修改员工信息
     *
     **/
    // 确认修改
    confirmStaff() {
      this.$refs.staffFormRef.getFormComp().validate(valid => {
        if (valid) {
          var submitData = this.$refs.staffFormRef.getData("psndoc");
          this.$http({
            url: "/ifbp-app-bd/bd/psn/psndoc/update",
            method: "put",
            data: submitData
          })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.staffEdit = false;
                this.staffEditIcons[0].show = true;
                this.$refs.staffFormRef.clearEdit();
              } else {
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "用户信息更新失败",
                type: "error"
              });
            });
        } else {
          // 验证失败
        }
      });
    },

    workEditTableRow(scope) {
      this.$refs.staffWorkRef.tableShow = true;
      this.$refs.staffWorkRef.getTableComp().expandRow(scope.row);
      this.$refs.staffWorkRef.formShow = false;
      var row = JSON.parse(JSON.stringify(scope.row));
      this.$refs.staffWorkRef.setFormData(row);
      this.staffWorkEdit = true;
      // 处理是否主职字段
      this.$refs.staffWorkRef.comp.ismainjobCheckedList = row.ismainjob.split(
        ","
      );
      // 所在部门根据任职公司级联
      if (row.pk_org) {
        this.$refs.staffWorkRef.setData("pk_dept_queryparams", {
          pk_corp: row.pk_org
        });
      }
      // 备份数据
      // this.staffWorkBaseData = row;
      this.staffWorkEditIndex = scope.$index;
    },
    staffWorkExpand(row,expanded){
      this.staffWorkTableOperVif = !expanded;
      //  处理是否主职字段
      if(row.ismainjob){
        this.$refs.staffWorkRef.comp.ismainjobCheckedList = row.ismainjob.split(",");
      }
      // 所在部门根据任职公司级联
      if (row.pk_org) {
        this.$refs.staffWorkRef.setData("pk_dept_queryparams", {
          pk_corp: row.pk_org
        });
      }
    },
    //在员工工作列表的子表单删除数据
    workDeleteFormRow(type,row){
      this.workDeleteTableRow(row,"tableForm");
    },
    //在员工工作列表删除数据
    workDeleteTableRow(scope,type) {
      this.delDialogVisible = true;
      if(type === "tableForm"){
        this.delId = scope.id;
      } else {
        this.delId = scope.row.id;
      }
      this.deleteClick();
    },
    workShiftTableClick(scope){
      this.currentWorkRowData = scope.row;
      if(scope.row.ismainjob === '主职'){
        this.$message({
          type: 'info',
          message: '当前工作已经是主职'
        });
        return;
      } else{
        this.showWorkShift = true;
      }
    },
    // 转换主职
    workShift(){
      var submitData = {
        pkPsndoc: this.currentWorkRowData.pk_psndoc,
        pkPsnjob: this.currentWorkRowData.id
      };
      this.$http({
        url: '/ifbp-app-bd/bd/psn/psnjob/mainJob',
        method: 'post',
        data: submitData
      }).then((res) => {
        if(res.data.success === true){
          this.$message({
            type: 'success',
            message: '转换主职成功'
          });
          this.showWorkShift = false;
          this.requestStaffWorkTableData();
        } else {
          this.$message({
            type: 'error',
            message: res.data.error.errorMessage
          });
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '请求出错'
        });
      });
    },
    workFormEditClick(type,row,index) {
      this.staffWorkEdit = true;
      this.staffWorkRowId = index;
    },
    workFormConfirm(type,row) {
      this.$refs.staffWorkRef.getFormComp().validate(valid => {
        if (valid) {
          var data = this.$refs.staffWorkRef.getFormData();
          data.pk_psndoc = this.psnId;
          var method, url;
          if (type === "form") {
            method = "post";
            url = "/ifbp-app-bd/bd/psn/psnjob/create";
          } else {
            method = "put";
            url = "/ifbp-app-bd/bd/psn/psnjob/update";
          }
          this.$http({
            url: url,
            method: method,
            data: data
          })
            .then(res => {
              if (res.data.success) {
                this.record_status = "table";
                this.isNew = false;
                this.staffWorkEdit = false;
                this.$refs.staffWorkRef.formShow = false;
                this.$refs.staffWorkRef.tableShow = true;
                if (!data.id) {
                  this.requestStaffWorkTableData();
                  this.$message({
                    message: "新增成功",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  this.$refs.staffWorkRef.clearEdit();
                }
              } else {
                this.staffWorkEdit = true;
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              if (this.isNew) {
                this.$message({
                  message: "工作记录新增失败",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "工作记录更新失败",
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
    workFormCancel(type) {
      if (type === "form") {
        this.$refs.staffWorkRef.tableShow = true;
        this.$refs.staffWorkRef.formShow = false;
        this.staffWorkEdit = false;
      } else {
        this.$refs.staffWorkRef.getTableComp();
      }
    },

    deleteClick() {
      this.$http({
        url: "/ifbp-app-bd/bd/psn/psnjob/" + this.delId,
        method: "delete"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.delDialogVisible = false;
            this.requestStaffWorkTableData();
            this.staffWorkTableOperVif = true;
          } else {
            this.$message({
              message: res.data.error.errorMessage,
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
    }
  }
};
</script>
<style scoped>
.button-area {
  box-sizing: border-box;
  height: 48px;
  margin-top: 6px;
  padding-top: 16px;
  text-align: right;
  border-top: 1px solid #e6e6eb;
}
</style>


