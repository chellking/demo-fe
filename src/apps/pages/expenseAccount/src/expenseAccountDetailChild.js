export default {
  data() {
    var oThis = this;
    return {
      // 标题旁的显示图标
      childIcons: [{
        icon: 'plus',
        click: () => {
          if (!this.id) {
            this.$message({
              message: "请先保存主表信息",
              type: 'error'
            });
          } else {
            // 关闭table中的编辑区
            this.$refs.typicalDemoChildRef.getTableComp().closeExpandRow();
            // 重置新增数据
            this.$refs.typicalDemoChildRef.resetFormData();
            // 显示新增区域
            this.$refs.typicalDemoChildRef.formShow = true;
            this.childEditable = true;
            this.childShowBody = true;
          }
        }
      }],
      childRightIcons: [{
        icon: 'setting',
        click: () => {
          this.$refs.typicalDemoChildRef.setTransferVisible(true);
        }
      }],
      childEditable: true,
      childShowBody: true,
      tableOperVif: true,
      // UI模板传入参数
      typicalDemoChildFunnode: 'BXD',
      typicalDemoChildNexuskey: 'BXD_HOTEL',
      typicalDemoChildData: {},
      typicalDemoChildResetFun($node) {
        let $table = this.getTableDom($node);
        // 子表默认不显示标题
        $table.attr(':show-header', 'false');
        let operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      // 是否显示删除dialog
      childDelDialogVisible: false
    };
  },
  methods: {
    templateChange(filed,val){
      console.log(filed + 'change:' + val);
    },
    // 初始化加载数据
    requestTypicalDemoChild() {
      // 新增时默认不显示子表的table
      if (!this.id) {
        this.$nextTick(() => {
          this.$refs.typicalDemoChildRef.tableShow = true;
        });
        return;
      }
      let data = {
        searchParams: {
          searchMap: {
            fk_id_hotelcostentity: this.id
          }
        }
      };
      this.$http({
          url: '/ifbp-demo-web/hotelCost/page',
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
              let resData = res.data.data.content || [];
              if (this.$refs.typicalDemoChildRef) {
                this.$refs.typicalDemoChildRef.setTableData(resData);
              } else {
                this.$set(this.typicalDemoChildData, 'uitemplateTableData', resData);
              }
              this.childShowBody = resData.length < 1 ? false : true;
              // this.$refs.typicalDemoChildRef.tableShow = resData.length < 1 ? false : true;
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
    // table行的编辑操作
    childEditClick(scope) {
      this.$refs.typicalDemoChildRef.expandRow(scope.row,scope.$index)
      this.childEditable = true;
    },
    // form的保存操作
    childFormConfirm(type) {
      let vm = this;
      let url = "/ifbp-demo-web/hotelCost/update";
      this.$refs.typicalDemoChildRef.validate(valid => {
        if (valid) {
          let data = vm.$refs.typicalDemoChildRef.getFormData();
          // 拼接主表的id
          data = $.extend(data, {
            fk_id_hotelcostentity: vm.id
          });
          if (type === 'form') {
            url = "/ifbp-demo-web/hotelCost/create";
          }
          vm.$http({
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

                vm.$refs.typicalDemoChildRef.tableShow = true;
                vm.$refs.typicalDemoChildRef.formShow = false;
                vm.childEditable = false;
                vm.$refs.typicalDemoChildRef.clearEdit();
                if (type === 'form') {
                  vm.requestTypicalDemoChild();
                }
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
          vm.$message('校验未通过');
        }
      });
    },

    // form的删除操作
    childFormDelete(type,row) {
      this.typicalDemoChildDel = row;
      this.childDelDialogVisible = true;
    },
    // table行的删除操作
    childDeleteClick(scope) {
      this.typicalDemoChildDel = scope.row;
      this.childDelDialogVisible = true;
    },

    childDeleteDialogClick() {
      let data = this.typicalDemoChildDel;
      this.$http({
          url: "/ifbp-demo-web/hotelCost/delete",
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
            this.childDelDialogVisible = false;
            this.requestTypicalDemoChild();
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
  }
};
