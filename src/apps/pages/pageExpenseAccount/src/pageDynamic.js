export default {
  data() {
    var vm = this;
    return {
      // 动态区域panel右侧按钮
      dynamicRightIcons: [{
        icon: 'setting',
        click: (e, code) => {
          vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTransferVisible(true);
        }
      }],
      transCostData: {},
      travelAllowData: {},
      // 记录当前处理的动态组件的code
      dynamicCode: '',
      // 动态区域UI模板相关变量
      pageDynamicNoCodeResetFuns: function ($node) {
        var $pageConfigTable = this.getTableDom($node);
        var operateHtml = this.getTableOperateHtml([{
          title: '修改',
          icon: 'edit',
          vif: "tableOperVif"
        }, {
          icon: 'delete',
          title: '删除',
          vif: "tableOperVif"
        }]);
        $pageConfigTable.append(operateHtml);
        return $node[0].outerHTML;
      },
      // 删除相关变量
      dynamicPageDelDialogVisible: false,
      pageDyDelData: ''
    };
  },
  methods: {
    // 动态区域editable发生改变时的处理
    editableChange(item, index, editable) {
      this.$refs['pageDynamic'].setItemAttrBycode(item.code, 'deleteButtonShow', !editable);
    },
    // 动态区域渲染完成之后再请求数据
    dynamicPageAfterCreate() {
      this.requestPageDynamic('trans_cost');
      this.requestPageDynamic('travel_allow');
    },
    // 根据code请求不同扩展区的数据
    requestPageDynamic(code) {
      var url;
      if (!this.id || this.id === "undefined") {
        this.$nextTick(() => {
          if (this.$refs['pageDynamic'] && this.$refs['pageDynamic'].$refs['dynamic_' + code]) {
            this.$refs['pageDynamic'].$refs['dynamic_' + code][0].tableShow = false;
          }
        });
        return;
      }
      let data = {
        searchParams: {
          searchMap: {
            pk_example: this.id
          }
        }
      };
      if (code === "trans_cost") {
        url = '/ifbp-demo-web/BXTransCost/page';
      }
      if (code === "travel_allow") {
        url = '/ifbp-demo-web/travelAllowance/page';
      }
      this.$http({
          url: url,
          method: 'post',
          data: data,
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "application/json"
        })
        .then((res) => {
          if (res.data.success === true) {
            this.$nextTick(() => {
              if (res.data.data.content && res.data.data.content.length > 0) {
                for (var i = 0; i < res.data.data.content.length; i++) {
                  this.$refs['pageDynamic'].setItemAttrNoCode('dynamicEditable', true);
                }
              }
              let resData = res.data.data.content || [];
              let intervalNum = 0;
              let pageInterval = setInterval(() => {
                intervalNum++;
                if(i < 100) {
                  if (this.$refs['pageDynamic'] && this.$refs['pageDynamic'].$refs['dynamic_' + code]) {
                    this.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTableData(resData);
                    this.$refs['pageDynamic'].$refs['dynamic_' + code][0].tableShow = resData.length < 1 ? false : true;
                    clearInterval(pageInterval);
                  }
                } else {
                  clearInterval(pageInterval);
                }

              }, 100);
              // if (this.$refs['pageDynamic'] && this.$refs['pageDynamic'].$refs['dynamic_' + code]) {
              //   this.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTableData(resData);
              //   this.$refs['pageDynamic'].$refs['dynamic_' + code][0].tableShow = resData.length < 1 ? false : true;
              // } else {
              //   if (code === "trans_cost") {
              //     this.$set(this.transCostData, 'uitemplateTableData', resData);
              //   }
              //   if (code === "travel_allow") {
              //     this.$set(this.travelAllowData, 'uitemplateTableData', resData);
              //   }
              // }
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        })
        .catch((e) => {
          console.log(e)
          this.$message({
            message: '子表信息获取失败',
            type: 'error'
          });
        });
    },
    // 表格中操作列按钮事件
    dynamicPageTableClick(item, index, icon, scope) {
      // 编辑按钮处理
      if (icon === "edit") {
        this.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].expandRow(scope.row);
        this.$refs['pageDynamic'].resetResDataByAttr(item.dynamicEditable, "dynamicEditable", true);
      }
      // 删除按钮处理
      if (icon === "delete") {
        this.dynamicPageDelDialogVisible = true;
        this.pageDyDelData = scope.row;
        this.dynamicCode = item.code;
      }
    },


    // 动态区域表单的保存按钮处理
    dynamicFormConfirmClick(item, type) {
      var vm = this;
      var url;
      if (item.code === "trans_cost") {
        url = "/ifbp-demo-web/BXTransCost/update";
      }
      if (item.code === "travel_allow") {
        url = "/ifbp-demo-web/travelAllowance/update";
      }
      this.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].validate((valid) => {
        if (valid) {
          let data = this.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].getFormData();
          data = $.extend(data, {
            pk_example: vm.id
          });
          if (type === "form") {
            if (item.code === "trans_cost") {
              url = "/ifbp-demo-web/BXTransCost/create";
            }
            if (item.code === "travel_allow") {
              url = "/ifbp-demo-web/travelAllowance/create";
            }
          }
          vm.$http({
            url: url,
            data: data,
            method: "post",
            dataType: "application/json"
          }).then((res) => {
            if (res.data.success === true) {
              if(type === "form"){
                vm.$message({
                  message: "保存成功"
                });
              }else{
                vm.$message({
                  message: "修改成功"
                });
              }
              vm.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].tableShow = true;
              vm.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].formShow = false;
              vm.$refs['pageDynamic'].setItemAttrBycode(item.code, 'dynamicEditable', false);
              vm.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].clearEdit();
              if (type === 'form') {
                vm.requestPageDynamic(item.code);
              }
            } else {
              vm.$message({
                message: res.data.error.errorMessage,
                type: "error"
              });
            }
          }).catch(() => {
            this.$message({
              message: "保存失败",
              type: "error"
            });
          });
        }
      });
    },
    // 动态区域表单的删除按钮处理
    pageDynamicFormDelete(item, type, row) {
      this.dynamicPageDelDialogVisible = true;
      this.pageDyDelData = row;
      this.dynamicCode = item.code;
    },
    // 删除逻辑处理
    dynamicPageDelDialogClick() {
      var data = this.pageDyDelData;
      var url;
      if (this.dynamicCode === "trans_cost") {
        url = "/ifbp-demo-web/BXTransCost/delete";
      }
      if (this.dynamicCode === "travel_allow") {
        url = '/ifbp-demo-web/travelAllowance/delete';
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
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.dynamicPageDelDialogVisible = false;
            this.requestPageDynamic(this.dynamicCode);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    }
  },
  mounted() {}
}
