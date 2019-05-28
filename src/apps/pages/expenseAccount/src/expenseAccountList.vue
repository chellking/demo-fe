<template>
  <ifbp-page>
    <!-- 按钮区域 -->
    <ifbp-button-area>
        <el-button type="primary" @click="add" class="fl">新增</el-button>
        <!-- 查询模板组件 -->
        <ifbp-search class="fr"
          :search-template="searchTemplate"
          @search="handleSearch">
        </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <div class="ifbp-btn-line" style="height:16px;">
        <div class="fr">
          <ifbp-table-card-icon
            :show-table="showTable"
            @update:showTable="value => this.showTable = value">
          </ifbp-table-card-icon>
        </div>
      </div>
      <div id="el-templatetableId" class="yon-uitemplate" style="position: relative;">
        <el-table _id="62thxw1xqgl" :inline="true" :data="mainTableData" v-show="showTable">
          <el-table-column _id="ef71o7g2597" :sortable="true" render-type="default" separator="," symbol="￥" align="left" header-align="left" prop="djbh" label="单据编号" width="150" format=""></el-table-column>
          <el-table-column _id="i04idsnamjq" :sortable="true" render-type="default" separator="," symbol="￥" align="left" header-align="left" prop="djrq" label="单据日期" width="150" format=""></el-table-column>
          <el-table-column _id="weltj1w8wz" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="total" label="合计金额" width="100" format=""></el-table-column>
          <el-table-column _id="06kfgk69nrsx" :sortable="true" render-type="default" separator="," symbol="￥" align="left" header-align="left" prop="pjh" label="票据号" width="150" format=""></el-table-column>
          <el-table-column _id="0d4mw0mqf428" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="hkybje" label="还款原币金额" width="100" format=""></el-table-column>
          <el-table-column _id="5rwk64iz3o3" :sortable="true" render-type="number" separator="," symbol="￥" align="right" header-align="right" prop="zfybje" label="支付原币金额" width="100" format=""></el-table-column>
          <el-table-column label="" width="152" class-name="table-operate-column" header-align="center" fixed="right">
            <template scope="scope">
              <i @click.stop="tableEditClick(scope)" class="ifbp-icon-edit el-table-operate-icon" title="编辑"></i>
              <i @click.stop="tableDeleteClick(scope)" class="ifbp-icon-delete el-table-operate-icon" title="删除"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页组件-->
      <el-pagination
        v-show="showTable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
        >
      </el-pagination>
      <expense-account-card
        v-show="!showTable"
        :table-data="mainTableData"
        @cardEditClick="expenseAccountCardEditClick"
        @cardDeleteClick="expenseAccountCardDeleteClick"
        >
      </expense-account-card>
    </ifbp-main-area>

    <!--删除确认Dialog-->
    <ifbp-del-dialog
      v-model="delDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="deleteClick"
      >
    </ifbp-del-dialog>
  </ifbp-page>
</template>
<script>
import expenseAccountCard from './expenseAccountCard.vue';
export default {
  components: {
    expenseAccountCard
  },
  data() {
    return {

      showTable:true,
      // 查询模板传入参数
      // 查询模板传入参数
      searchTemplate: {
    "template": {
      "metaDefinedName": "SMQueryTemplateEntity",
      "namespace": "ifbp",
      "status": 0,
      "changedPropertyNames": null,
      "beanMap": {},
      "id": "wbalone100000019837",
      "name": "报销单查询模板",
      "code": "BXD_SEARCH",
      "memo": null,
      "pk_metaclass": "f6e1ab23-b538-45d1-ae77-deda638c9a69",
      "issys": true,
      "busicode": "BXD",
      "pid": null,
      "pk_group": null,
      "pk_org": null,
      "creator": "U001",
      "creationtime": "2018-05-29 11:11:42",
      "modifier": "U001",
      "modifiedtime": "2018-05-30 09:57:32",
      "scenecode": "BXD_SEARCH",
      "dr": 0,
      "ts": 1527645453000,
      "condition": null
    },
    "keyword": {
      "value": null,
      "fields": [{
        "fieldcode": "BXHeaderEntity.djbh",
        "fieldname": "单据编号",
        "iskeyword": true
      }]
    },
    "schema": null,
    "conditionList": [],
    "candidateConditionList": null
  },
      searchData: "",
      // UI模板传入参数
      tableFunnode: "BXD",
      tableNexuskey: "BXD_HEADER",
      tableData: {},
      mainTableData: [],
      tableResetFun: function($node) {
        // 增加默认的新增删除按钮
        var $table = this.getTableDom($node);
        var operateHtml = this.getBaseTableOperateHtml();
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 0,
      size: 10,
      // 是否显示批量删除按钮
      showDeleteButton: false,
      // 是否显示删除dialog
      delDialogVisible: false,
    };
  },
  mounted() {
    this.request();
  },
  methods: {
    // 请求数据
    request(curPage, size) {
      var data = {
        pageNum: curPage || 0,
        pageSize: size || this.size
      };
      if (this.searchData) {
        data.searchParams = {
          searchMap: {
            qtAggVO: JSON.stringify(this.searchData)
          }
        };
      }
      this.$http({
        url: "/ifbp-demo-web/BXHeader/page",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          var resData = res.data.data.content || [];
          this.$nextTick(() => {
            this.mainTableData = resData;
          });
          this.totalElements = res.data.data.totalElements;
          this.size = res.data.data.size;
        })
        .catch(() => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },

    // 查询区点击搜索后的处理
    handleSearch(searchData) {
      if (!searchData) {
        return;
      }
      this.searchData = searchData;
      this.request();
    },

    // 跳转到添加地点页面
    add() {
      this.$router.push("/expenseAccount/add");
    },

    // table行的编辑操作
    tableEditClick(scope) {
      this.$router.push("/expenseAccount/detail/" + scope.row.pk);
    },

    // table行的删除操作
    tableDeleteClick(scope) {
      this.delDialogVisible = true;
      this.delId = scope.row.pk;
    },

    // 删除处理
    deleteClick() {
      var vm = this;
      var data = this.delId;
      this.$http({
        url: "/ifbp-demo-web/BXHeader/deleteById",
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
            this.request(0, this.size);
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

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(0, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val - 1, this.size);
    },

    //卡片的事件
    expenseAccountCardEditClick(Item, index) {
      this.$router.push("/expenseAccount/detail/" + Item.pk);
    },
    expenseAccountCardDeleteClick(Item, index) {
      this.delDialogVisible = true;
      this.delId = Item.pk;
    },
  }
};
</script>
<style>
.el-pagination {
    float: right;
    margin-top: 16px;
    padding: 0;
    color: #475669;
}
</style>
