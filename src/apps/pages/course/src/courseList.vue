<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="课程管理"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="add" class="fl">新增</el-button>
      <!-- 查询模板组件 -->
      <ifbp-search 
        class="fr"
        :template-code="searchCode"
        @search="handleSearch">
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-no-data :search-state="searchState" :total-elements="totalElements">
      <ifbp-main-area type="list">
        <div class="ifbp-btn-line">
          <div class="fr">
            <ifbp-table-card-icon
              :show-table="showTable"
              @update:showTable="value => this.showTable = value">
            </ifbp-table-card-icon>
            <i class="ifbp-icon-setting" :class='{"disabled":!showTable}' @click="showHeaderSetting" title="设置"></i>
          </div>
        </div>
        <!-- UI模板组件 --> <!-- funnode参数指定平台UI模板定义值 nexuskey参数指定平台UI模板定义值 -->
        <ifbp-template 
          ref="tableRef"
          tpl-id="tableId"
          show-type="table"
          v-show="showTable"
          :funnode="tableFunnode" 
          :nexuskey="tableNexuskey"
          :tpl-data="tableData"
          :table-show-menu="false"
          :tplResetFun="pageCourseResetFun"
          @table-click="pageTableClick">
        </ifbp-template>
        <!-- 卡片展示 -->
        <course-card
          v-show="!showTable"
          :table-data="cardData"
          @cardEditClick="courseCardEditClick"
          @cardDeleteClick="courseCardDeleteClick"
          >
        </course-card>
        <!--分页组件-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalElements">
        </el-pagination>
      </ifbp-main-area>
    </ifbp-no-data>
    <!--删除确认Dialog-->
    <ifbp-del-dialog
      v-model="delDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="deleteClick">
    </ifbp-del-dialog>
  </ifbp-page>
</template>

<!-- 页面逻辑处理 -->
<script>
import courseCard from './courseCard.vue';//引入卡片界面
export default {//导出组件course-card
  components: {
    courseCard
  },
  data() {//页面初始化
    return {
      // 查询模板传入参数
      searchCode: "CourseSearchTemplate1",//平台查询模板定义值
      searchData: "",
      // 查询时提示展示
      searchState: "",
      // UI模板传入参数
      tableFunnode: "TRAIN_COURSE",//平台UI模板定义值
      tableNexuskey: "CourseMaster",//平台UI模板定义值
      // 模板列表
      loading: false,//页面加载动画
      tableData: {},
      pageCourseResetFun: function($node) {//行尾控件菜单
        let $table = this.getTableDom($node);
        let icons = [
          {
            title: "修改",
            icon: "edit"
          },
          {
            title: "打印预览",
            icon: "print"
          },
          {
            title: "删除",
            icon: "delete"
          }
        ];
        let operateHtml = this.getTableOperateHtml(icons);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      // 卡片列表切换
      showTable: true,
      // 卡片相关变量
      cardData: [],
      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      // 是否显示批量删除按钮
      showDeleteButton: false,
      // 是否显示删除dialog
      delDialogVisible: false,
      sceneCode: '' // 场景编码
    }
  },
  mounted() {
    this.request();
  },
  created() {
    this.getSceneCode();
  },
  methods: {
    ifbpPageInit(){
      this.request();
    },
    // 请求数据
    request(curPage, size) {
      this.loading = true;
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
        url: "/ifbp-demo-web/course/page",//后台业务实现接口-查询
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            this.loading = false;
            this.size = res.data.data.size;
            this.totalElements = res.data.data.totalElements;
            this.$nextTick(() => {
              if(this.$refs.tableRef) {
                this.cardData = res.data.data.content;
                this.$refs.tableRef.setTableData(res.data.data.content);
              } else {
                this.$set(this.tableData, 'uitemplateTableData', res.data.data.content)
              }
            });
          }
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
      if (!searchData) { return; }
      this.searchState = 'search';
      this.searchData = searchData;
      this.request();
    },

    // 跳转到添加地点页面
    add() {
      this.$router.push("/course/add");
    },

    // 表格中操作列按钮事件
    pageTableClick(icon, scope) {
      // 编辑按钮处理
      if (icon === "edit") {
        this.$router.push("/course/detail/" + scope.row.id + '?sceneCode=' + this.sceneCode);
      }
      // 删除按钮处理
      if (icon === "delete") {
        this.delDialogVisible = true;
        this.delId = scope.row.id;
      }
      // 打印预览按钮处理
      if (icon === 'print'){
        // this.$router.push();
        window.open('/ifbp-print/static/html/iprint/businessPreview.html?serverUrl='
                    + window.location.protocol+'//'+window.location.host
                    + '/ifbp-print/rest/printTemplate/replaceTemplateByScenecode?busicode=CoursePrintTpl1'
                    + '&scenecode=' + this.sceneCode + '&id=' + scope.row.id);
      }
    },

    // 删除处理
    deleteClick() {
      var vm = this;
      var data = this.delId;
      this.$http({
        url: "/ifbp-demo-web/course/deleteById",//后台业务实现接口-删除
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
    // 主体按钮区设置显示/隐藏列
    showHeaderSetting() {
      this.$refs.tableRef.setTransferVisible(true);
    },
    //卡片的事件
    courseCardEditClick(Item, index) {
      this.$router.push("/course/detail/" + Item.id +'?sceneCode=' + this.sceneCode);
    },
    courseCardDeleteClick(Item, index) {
      this.delDialogVisible = true;
      this.delId = Item.id;
    },
    // 场景编码
    getSceneCode(){
      this.sceneCode = window.location.href.split('?')[1].split('&')[0].split('=')[1];
    },
  }
}
</script>

<!-- 自定义样式 -->
<style>
.el-pagination {
    float: right;
    margin-top: 16px;
    padding: 0;
    color: #475669;
}
</style>