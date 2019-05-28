export default {
  data() {
    var vm = this;
    return {
      // 其他UI模板区域panel左侧按钮
      pageHotelIcons: [{
        icon: 'plus',
        click: () => {
          if (!vm.id || vm.id === "undefined") {
            vm.$message({
              message: "请先保存主表信息",
              type: 'error'
            });
          } else {
            // 关闭table中的编辑区
            vm.$refs.pageHotel.getTableComp().closeExpandRow();
            // 重置新增数据
            vm.$refs.pageHotel.resetFormData();
            // 显示新增区域
            vm.$refs.pageHotel.formShow = true;
            this.pageHotelEditable = true;
          }
        }
      }],
      pageHotelRightIcons: [{
        icon: 'setting',
        click: (e, code) => {
          vm.$refs.pageHotel.setTransferVisible(true);
        }
      }],
      // UI模板相关变量
      pageHotelData: {},
      pageHotelEditable: false,
      tableOperVif: true,
      pageHotelResetFun: function ($node) {
        var $table = this.getTableDom($node);
        var icons = [{
            title: '修改',
            icon: 'edit',
            vif: "tableOperVif"
          },
          {
            icon: 'delete',
            title: '删除',
            vif: "tableOperVif"
          },
        ];
        var operateHtml = this.getTableOperateHtml(icons);
        // let operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      // 删除相关变量
      pageHotelDelDialogVisible: false,
      pageHotelDelData: {},
    };
  },
  methods: {
    // 请求其他UI模板区域数据
    requestPageHotel() {
      if (!this.id || this.id === "undefined") {
        this.$nextTick(() => {
          this.$refs.pageHotel.tableShow = false;
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
              if (this.$refs.pageHotel) {
                this.$refs.pageHotel.setTableData(resData);
              } else {
                this.$set(this.pageHotelData, 'uitemplateTableData', resData);
              }
              this.$refs.pageHotel.tableShow = resData.length < 1 ? false : true;
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
    // 其他UI模板区域表单的保存按钮处理
    pageHotelFormConfirm(type) {
      let vm = this;
      let url = "/ifbp-demo-web/hotelCost/update";
      this.$refs.pageHotel.validate(valid => {
        if (valid) {
          let data = vm.$refs.pageHotel.getFormData();
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
                if(type === "form"){
                  vm.$message({
                    message: "保存成功"
                  });
                }else{
                  vm.$message({
                    message: "修改成功"
                  });
                }
                vm.$refs.pageHotel.tableShow = true;
                vm.$refs.pageHotel.formShow = false;
                vm.pageHotelEditable = false;
                vm.$refs.pageHotel.clearEdit();
                if (type === 'form') {
                  vm.requestPageHotel();
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
    // 其他UI模板区域表单的删除按钮处理
    pageHotelDeleteClick(type, row) {
      this.pageHotelDelDialogVisible = true;
      this.pageHotelDelData = row;
    },
    // 其他UI模板区域操作类的按钮处理
    pageHotelClick(icon, scope) {
      // 编辑按钮处理
      if (icon === "edit") {
        this.$refs.pageHotel.expandRow(scope.row, scope.$index);
        this.pageHotelEditable = true;
      }
      // 删除按钮处理
      if (icon === "delete") {
        this.pageHotelDelDialogVisible = true;
        this.pageHotelDelData = scope.row;
      }
    },
    // 其他UI模板区域删除处理逻辑
    pageHotelDelDialogClick() {
      var data = this.pageHotelDelData;
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
            this.pageHotelDelDialogVisible = false;
            this.requestPageHotel();
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
  mounted() {
    this.requestPageHotel();
  }
}
