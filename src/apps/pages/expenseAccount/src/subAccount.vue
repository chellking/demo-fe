<template lang="html">
  <div class="">
      <ifbp-panel id="childPanel" title="子表信息"  :icons="childIcons"  :show-body="childShowBody" @update:showBody="val=> this.childShowBody =val">
        <div class="" v-if="subAccountPlus">
          <el-form _id="k09w0jh2igs":inline="true" :rules="rules" label-width="150px" :adaptation="true" :model="HotelCostEntity" :show-message="formShowMessage" ref="formRef">
           <el-form-item _id="g41kn9dl5c" label="发票号码" prop="invoice_num">
               <el-input _id="njloqcg5m4" max="50" :editable="editable" v-model="HotelCostEntity.invoice_num" ></el-input>
           </el-form-item>
           <el-form-item _id="ikgys0r208l" label="入住日期"  prop="start_date">
               <el-date-picker _id="vnts40xkpco" type="date" max="null" :editable="editable" v-model="HotelCostEntity.start_date" ></el-date-picker>
           </el-form-item>
           <el-form-item _id="wpo8pmahpj" label="离店日期"  prop="leave_date">
               <el-date-picker _id="jumbv01hbmf" type="date" max="null" :editable="editable" v-model="HotelCostEntity.leave_date" ></el-date-picker>
           </el-form-item>
           <el-form-item _id="wqtgpisdof" label="住宿天数" prop="live_days">
               <el-number _id="tu5etbgofwr" separator="," max="null" :editable="editable" v-model="HotelCostEntity.live_days" ></el-number>
           </el-form-item>
           <el-form-item _id="ifij44vaco" label="住宿金额"  prop="cost">
               <el-number _id="4ffe8cl2ttk" separator="," max="28" :editable="editable" v-model="HotelCostEntity.cost"></el-number>
           </el-form-item>
           <el-form-item _id="lbb9s86pgi" label="税率" prop="tax_rate">
               <el-number _id="zukgqe5coe" separator="," max="28" :editable="editable" v-model="HotelCostEntity.tax_rate" ></el-number>
           </el-form-item>
           <el-form-item _id="e405tbjtep" label="税金"  prop="tax_cost">
               <el-number _id="r23pwmas3f" separator="," max="28" :editable="editable" v-model="HotelCostEntity.tax_cost" ></el-number>
           </el-form-item>
           <el-form-item _id="v2x8lmk11b" label="报销金额"  prop="reimburs_cost">
               <el-number _id="iyr2kjo3r" separator="," max="28" :editable="editable" v-model="HotelCostEntity.reimburs_cost"></el-number>
           </el-form-item>
       </el-form>
       <div class="form-button-div"  style="padding-bottom:16px">
        <el-button type="primary" @click="subAccountFormConfirmClick" >保存</el-button>
        <el-button  @click="subAccountFormCancelClick"> 取消</el-button>
      </div>
    </div>
    <el-table _id="n5zf9st5oml" :inline="true" :data="HotelCostEntity_t" v-if="showTable" style="margin-top:16px" ref="tableRef">
        <el-table-column type="noIconExpand">
            <template scope="props">
                <el-form _id="k09w0jh2igs" :inline="true" :rules="rules" label-width="150px" :adaptation="true" :model="editHotelCostEntity" :show-message="formShowMessage" ref="tableFormRef">
                    <el-form-item _id="g41kn9dl5c" label="发票号码"  prop="invoice_num">
                        <el-input _id="njloqcg5m4" max="50" :editable="editable" v-model="editHotelCostEntity.invoice_num" ></el-input>
                    </el-form-item>
                    <el-form-item _id="ikgys0r208l" label="入住日期"  prop="start_date">
                        <el-date-picker _id="vnts40xkpco" type="date" max="null" :editable="editable" v-model="editHotelCostEntity.start_date"></el-date-picker>
                    </el-form-item>
                    <el-form-item _id="wpo8pmahpj" label="离店日期" prop="leave_date">
                        <el-date-picker _id="jumbv01hbmf" type="date" max="null" :editable="editable" v-model="editHotelCostEntity.leave_date"></el-date-picker>
                    </el-form-item>
                    <el-form-item _id="wqtgpisdof" label="住宿天数" prop="live_days">
                        <el-number _id="tu5etbgofwr" separator="," max="null" :editable="editable" v-model="editHotelCostEntity.live_days"></el-number>
                    </el-form-item>
                    <el-form-item _id="ifij44vaco" label="住宿金额" prop="cost">
                        <el-number _id="4ffe8cl2ttk" separator="," max="28" :editable="editable" v-model="editHotelCostEntity.cost"></el-number>
                    </el-form-item>
                    <el-form-item _id="lbb9s86pgi" label="税率"  prop="tax_rate">
                        <el-number _id="zukgqe5coe" separator="," max="28" :editable="editable" v-model="editHotelCostEntity.tax_rate"></el-number>
                    </el-form-item>
                    <el-form-item _id="e405tbjtep" label="税金" prop="tax_cost">
                        <el-number _id="r23pwmas3f" separator="," max="28" :editable="editable" v-model="editHotelCostEntity.tax_cost" ></el-number>
                    </el-form-item>
                    <el-form-item _id="v2x8lmk11b" label="报销金额" prop="reimburs_cost">
                        <el-number _id="iyr2kjo3r" separator="," max="28" :editable="editable" v-model="editHotelCostEntity.reimburs_cost" ></el-number>
                    </el-form-item>
                </el-form>
                <div class="form-button-div">
                    <el-button type="primary" @click="subEditFormSubmit(props)">保存</el-button>
                    <el-button @click="subEditFormCancelClick(props)">取消</el-button>
                </div>
            </template>
        </el-table-column>
        <el-table-column _id="f8iyq7p1ko" :sortable="true" render-type="default" separator="," symbol="￥" align="left" header-align="left" prop="invoice_num"  label="发票号码" width="150" format=""></el-table-column>
        <el-table-column _id="y6hczcsiq5" :sortable="true" render-type="date" separator="," symbol="￥" align="right" header-align="right" prop="start_date"  label="入住日期" width="150" format="YYYY-MM-DD"></el-table-column>
        <el-table-column _id="m2ohqqcb4ef" :sortable="true" render-type="date" separator="," symbol="￥" align="right" header-align="right" prop="leave_date"  label="离店日期" width="150" format="YYYY-MM-DD"></el-table-column>
        <el-table-column _id="nqr5tl2pcx" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="live_days"  label="住宿天数" width="100" format=""></el-table-column>
        <el-table-column _id="oy79zf0q2jj" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="cost" label="住宿金额" width="100" format=""></el-table-column>
        <el-table-column _id="1otqb0qv4nai" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="tax_rate" label="税率" width="100" format=""></el-table-column>
        <el-table-column _id="4662ut6x4bs" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="tax_cost"  label="税金" width="100" format=""></el-table-column>
        <el-table-column _id="8tkagbkhks" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="reimburs_cost"  label="报销金额" width="100" format=""></el-table-column>
        <el-table-column label="" width="152"  class-name="table-operate-column" header-align="center" fixed="right">
            <template scope="scope"> <i @click.stop="subHandleClick(scope)" class="ifbp-icon-edit el-table-operate-icon" title="编辑"></i><i @click.stop="subHandleDelClick(scope)"  class="ifbp-icon-delete el-table-operate-icon" title="删除"></i>
            </template>
        </el-table-column>
    </el-table>


    </ifbp-panel>
    <ifbp-del-dialog
      v-model="delDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="deleteClick"
      >
    </ifbp-del-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      delDialogVisible: false,
      showTable: false,
      delId:'',
      subAccountPlus:false,
      rules:{
        "tax_cost":[{"max":28,"trigger":"blur","message":"输入长度不能大于28"}],
        "cost":[{"max":28,"trigger":"blur","message":"输入长度不能大于28"}],
        "live_days":[{"max":null,"trigger":"blur","message":"输入长度不能大于null"},{"max":null,"trigger":"blur","message":"输入长度不能大于null"}],
        "invoice_num":[{"max":50,"trigger":"blur","message":"输入长度不能大于50"}],
        "leave_date":[{"max":null,"trigger":"blur","message":"输入长度不能大于null"},{"max":null,"trigger":"blur","message":"输入长度不能大于null"}],"reimburs_cost":[{"max":28,"trigger":"blur","message":"输入长度不能大于28"}],
        "tax_rate":[{"max":28,"trigger":"blur","message":"输入长度不能大于28"}],"start_date":[{"max":null,"trigger":"blur","message":"输入长度不能大于null"},{"max":null,"trigger":"blur","message":"输入长度不能大于null"}]
      },
      editHotelCostEntity: {
        "tax_cost":"","cost":"","live_days":"","invoice_num":"","leave_date":"","reimburs_cost":"","tax_rate":"","start_date":""
      },
      HotelCostEntity:{"tax_cost":"","cost":"","live_days":"","invoice_num":"","leave_date":"","reimburs_cost":"","tax_rate":"","start_date":""},
      HotelCostEntity_t:[],
      childShowBody: true,
      formShowMessage:false,
      editable:true,
    };
  },
  props: ['parentId'],
  computed: {
    childIcons: function() {
      var vm = this;
      var icons = [{
          icon: "plus",
          show: true,
          click: function() {
            vm.subAccountPlus = !vm.subAccountPlus;
          }
        }];
      return icons;
    }
  },
  methods: {
    requestSub() {
      // debugger;
      if (!this.parentId) {
        return;
      }
      let data = {
        searchParams: {
          searchMap: {
            fk_id_hotelcostentity: this.parentId
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
              this.HotelCostEntity_t = resData;
              this.showTable = resData.length < 1 ? false : true;
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
    subAccountFormConfirmClick() {
      let vm = this;
      let url = "/ifbp-demo-web/hotelCost/create";
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let data = vm.HotelCostEntity;
          // 拼接主表的id
          data = $.extend(data, {
            fk_id_hotelcostentity: vm.parentId
          });
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
                this.requestSub();
                this.subAccountPlus = false;
                this.HotelCostEntity = {};
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
    subAccountFormCancelClick() {
      this.HotelCostEntity = {};
      this.subAccountPlus = false;
    },
    subEditFormSubmit(scope) {
      var vm = this;
      let url = "/ifbp-demo-web/hotelCost/update";
      this.$refs.tableFormRef.validate(valid => {
        if (valid) {
          let data = scope.row;
          // 拼接主表的id
          data = $.extend(data, {
            fk_id_hotelcostentity: vm.parentId
          });
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
                this.$set(this.HotelCostEntity_t, scope.$index, res.data.data);
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
    subHandleClick(scope) {
      this.$refs.tableRef.expandRow(scope.row);
      this.editHotelCostEntity = scope.row;
    },
    subEditFormCancelClick(scope) {
      var data = JSON.parse(JSON.stringify(scope.row));
      this.$set(this.HotelCostEntity_t, scope.$index, data);
    },
    subHandleDelClick(scope) {
      this.delDialogVisible = true;
      this.delId = scope.row;
    },
    deleteClick() {
      var vm = this;
      var data = this.delId;
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
            this.delDialogVisible = false;
            this.requestSub();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },
  },
  mounted() {
    this.requestSub();

  }
}
</script>

<style lang="css">
</style>
