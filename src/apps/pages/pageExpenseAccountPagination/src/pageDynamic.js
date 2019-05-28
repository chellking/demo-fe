export default {
  data() {
    var vm = this;
    return {
      // 动态区域panel右侧按钮
      dynamicMethods:{
        addBusi(e, code) {
          if (!vm.id || vm.id === "undefined") {
            vm.$message({
              message: "请先保存主表信息",
              type: 'error'
            });
          } else {
            // debugger;
            // 关闭table中的编辑区
            vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].getTableComp().closeExpandRow();
            // 重置新增数据
            vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].resetFormData();
            // 显示新增区域
            vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].formShow = true;
            let dynamicResData = vm.$refs['pageDynamic'].dynamicResData;
            for (var i = 0; i < dynamicResData.length; i++) {
              if(dynamicResData[i].code === code) {
                vm.$set(dynamicResData[i], "dynamicEditable", true);
                vm.$refs['pageDynamic'].$forceUpdate();
              }
            }
          }
        },
        travelSet(e, code) {
          vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTransferVisible(true);
        },
        busiSet(e, code) {
          vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTransferVisible(true);
        }
      },
      size: 10,
      dynamicRightIcons:[],
      // dynamicRightIcons: [{
      //   icon: 'setting',
      //   click: (e, code) => {
      //     vm.$refs['pageDynamic'].$refs['dynamic_' + code][0].setTransferVisible(true);
      //   }
      // }],
      transCostData: {},
      travelAllowData: {},
      // 记录当前处理的动态组件的code
      dynamicCode: '',
      // 动态区域UI模板相关变量
      pageDynamicNoCodeResetFuns: function ($node,item) {
        var $pageConfigTable = this.getTableDom($node);
        var icons = vm.$refs['pageDynamic'].getInnerIconsByCode(item.code);
        var $operateHtml = this.getTableOperateHtml(icons);
        $pageConfigTable.append($operateHtml);
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
      let showPagination = {};
      let allCode = this.$refs.pageDynamic.getAllTableCode();
      for (var i = 0; i < allCode.length; i++) {
        showPagination = {
          code :allCode[i],
          isShowPagination:true
        }
        if(allCode[i] === 'travelAccount') {
          showPagination.isShowPagination = false;
        }
        this.showPagination.push(showPagination);
      }
      this.requestPageDynamic(0,this.size,'travelAccount');
      this.requestPageDynamic(0,this.size,'busiAccount');
    },
    handleSizeChange(item,val) {
      this.requestPageDynamic(0, val, item.code);
    },
    // 翻页标签改变当前页
    handleCurrentChange(item, val) {
      this.requestPageDynamic(val - 1, this.size, item.code);
    },
    // 根据code请求不同扩展区的数据
    requestPageDynamic(currPage, size, code) {
      let data = {
        pageNum: currPage || 0,
        pageSize: size || this.size
      };
      var url;
      if (!this.id || this.id === "undefined") {
        this.$nextTick(() => {
          if (this.$refs['pageDynamic'] && this.$refs['pageDynamic'].$refs['dynamic_' + code]) {
            this.$refs['pageDynamic'].$refs['dynamic_' + code][0].tableShow = false;
          }
        });
        return;
      }
      data.searchParams = {
        searchMap: {
              pk_example: this.id
            }
      };
      // let data = {
      //   searchParams: {
      //     searchMap: {
      //       pk_example: this.id
      //     }
      //   }
      // };
      if (code === "travelAccount") {
        url = '/ifbp-demo-web/BXTransCost/page';
      }
      if (code === "busiAccount") {
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
            let pagination;
            pagination = {
              code: code,
              dynamicPagination:{
                size: res.data.data.size,
                currentPage: currPage || 0,
                totalElements: res.data.data.totalElements
              }
            };
            this.size = res.data.data.size;
            let hasFlag = false;
            for (var i = 0; i < this.dynamicPagination.length; i++) {
              if(this.dynamicPagination[i].code === pagination.code) {
                this.dynamicPagination.splice(i,1,pagination)
                hasFlag = true
              }
            }
            if(!hasFlag){
              this.dynamicPagination.push(pagination)
            }
            console.log('123',this.dynamicPagination);
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
      if (item.code === "travelAccount") {
        url = "/ifbp-demo-web/BXTransCost/update";
      }
      if (item.code === "busiAccount") {
        url = "/ifbp-demo-web/travelAllowance/update";
      }
      this.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].validate((valid) => {
        if (valid) {
          let data = this.$refs['pageDynamic'].$refs['dynamic_' + item.code][0].getFormData();
          data = $.extend(data, {
            pk_example: vm.id
          });
          if (type === "form") {
            if (item.code === "travelAccount") {
              url = "/ifbp-demo-web/BXTransCost/create";
            }
            if (item.code === "busiAccount") {
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
                vm.requestPageDynamic(0, this.size,item.code);
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
      if (this.dynamicCode === "travelAccount") {
        url = "/ifbp-demo-web/BXTransCost/delete";
      }
      if (this.dynamicCode === "busiAccount") {
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
            this.requestPageDynamic(0, this.size,this.dynamicCode);
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
