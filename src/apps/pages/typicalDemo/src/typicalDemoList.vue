<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="典型页面"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
        <el-button type="primary" @click="addtypicalDemo" class="fl">新增</el-button>
        <el-button  @click="multiDeleteDialgShow" v-show="showDeleteButton">删除</el-button>
        <!-- 查询模板组件 -->
        <ifbp-search class="fr"
          :template-code="searchCode"
          @search="handleSearch">
        </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-no-data :search-state="searchState" :total-elements="totalElements">
      <ifbp-main-area type="list">
        <div class="ifbp-btn-line">
          <div class="fr">
            <i class="ifbp-icon-setting"  @click="showHeaderSetting" title="设置"></i>
          </div>
        </div>
        <!-- UI模板组件 -->
        <ifbp-template ref="typicalDemoTableRef"
                      tpl-id="typicalDemoTableId"
                      :funnode="typicalDemoTableFunnode"
                      :nexuskey="typicalDemoTableNexuskey"
                      :tpl-data="typicalDemoTableData"
                      :table-show-menu="false"
                      show-type="table"
                      :tpl-reset-fun="typicalDemoTableResetFun"
                      :components="typicalDemoComponents"
                      :methods="typicalDemoTableMethods"
                      @selection-change="customerSelectionChange"
                      @edit-table-click="typicalDemoTableEditClick"
                      @delete-table-click="typicalDemoTableDeleteClick">
        </ifbp-template>
        <!--分页组件-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalElements"
          >
        </el-pagination>
      </ifbp-main-area>
    </ifbp-no-data>

    <!--删除确认Dialog-->
    <ifbp-del-dialog
      v-model="delDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="deleteClick"
      >
    </ifbp-del-dialog>
    <ifbp-del-dialog
      v-model="multiDelDialogVisible"
      message="确认删除所选数据？删除后无法恢复。"
      @click="multiDeleteClick"
      >
    </ifbp-del-dialog>
  </ifbp-page>
</template>
<script>
// import ifbpPage  from './debug/ifbp-page'
// import ifbpBreadcrumb  from './debug/ifbp-breadcrumb'
// import ifbpButtonArea  from './debug/ifbp-button-area'
// import ifbpMainArea  from './debug/ifbp-main-area'
import IfbpTableTooltip from './debug/ifbp-table-tooltip'
export default {
  // components:{
  //   ifbpPage, ifbpBreadcrumb, ifbpButtonArea, ifbpMainArea
  // },
  data() {
    let vm = this;
    return {
      // 查询模板传入参数
      searchCode: "TYPICAL_SEARCH",
      searchData: "",
      searchState: "",
      // UI模板传入参数
      typicalDemoTableFunnode: "CJGL",
      typicalDemoTableNexuskey: "typical",
      typicalDemoTableData: {},
      typicalDemoComponents: {
        IfbpTableTooltip
      },
      typicalDemoTableResetFun: function($node) {
        // 增加默认的新增删除按钮
        var $table = this.getTableDom($node);
        // var avatarDom = $('el-table-column[prop="atext"]', $table);
        // if(avatarDom.length) {
        //   avatarDom.html(
        //   '<template scope="scope">'
        //   +'<el-tooltip placement="top" effect="normal">'  
        //   +'  <ifbp-table-tooltip slot="content" :name="scope.row.atext"></ifbp-table-tooltip>'  
        //   +'  <span ref="content">{{scope.row.atext}}</span>'  
        //   +'</el-tooltip>'
        //   +'</template>'
        //   );
        // };
        var operateHtml = this.getBaseTableOperateHtml();
        // 测试测试列多icon
        // var icons = [
        //   {
        //     title: '修改',
        //     icon: 'edit'
        //   },
        //   {
        //     title: '删除',
        //     icon: 'delete'
        //   },
        //   {
        //     title: '打印',
        //     icon: 'print'
        //   },
        //   {
        //     title: '修改',
        //     icon: 'edit'
        //   },
        //   {
        //     title: '修改',
        //     icon: 'edit'
        //   }
        // ];
        // var operateHtml = this.getTableOperateHtml(icons);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      typicalDemoTableMethods:{
        editTableRow(scope){
          vm.$router.push('/typicalDemo/detail/' + scope.row.id);
        }
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 0,
      size: 10,
      // 是否显示批量删除按钮
      showDeleteButton: false,
      // 是否显示删除dialog
      delDialogVisible: false,
      multiDelDialogVisible: false
    };
  },
  mounted() {
    console.log('typical demo list mounted');
    this.searchState = '';
    this.request();
  },
  methods: {
    ifbpPageInit(){
      console.log('typical demo list page init');
      this.searchState = '';
      this.request();
    },
    ifbpPageBeforeClose(){
      console.log('typical demo list close');
      return true;
    },
    // 请求数据
    request(curPage, size) {
      this.totalElements = 0;
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
        url: "/ifbp-app-sm-infoset-web/typical_demo/page",
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
            if(this.$refs.typicalDemoTableRef) {
              this.$refs.typicalDemoTableRef.setTableData(resData);
            } else {
              this.$set(this.typicalDemoTableData, 'uitemplateTableData',resData);
            }
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
      this.searchState = "search";
    },

    // 跳转到添加地点页面
    addtypicalDemo() {
      this.$router.push("/typicalDemo/add");
    },

    // table行的编辑操作
    typicalDemoTableEditClick(scope) {
      this.$router.push("/typicalDemo/detail/" + scope.row.id)
    },

    // table行的删除操作
    typicalDemoTableDeleteClick(scope) {
      this.delDialogVisible = true;
      this.delId = scope.row.id;
    },

    // 删除处理
    deleteClick() {
      var vm = this;
      var data = {
        id: this.delId
      };
      this.$http({
        url: "/ifbp-app-sm-infoset-web/typical_demo/delete",
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

    // table选中改变
    customerSelectionChange(selection) {
      if (selection && selection.length > 0) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }
    },

    // 批量删除点击处理
    multiDeleteDialgShow() {
      this.multiDelDialogVisible = true;
    },

    // 批量删除处理
    multiDeleteClick() {
      var tableSelections = this.$refs.typicalDemoTableRef
        .getTableComp()
        .getSelection();
      var delIds = [];
      if (tableSelections && tableSelections.length > 0) {
        for (var i = 0; i < tableSelections.length; i++) {
          var row = tableSelections[i];
          var id = row.id;
          delIds.push(id);
        }
      }
      console.log("multiDelete" + delIds);
      this.multiDelDialogVisible = false;
    },

    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(0, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val - 1, this.size);
    },

    showHeaderSetting() {
      this.$refs.typicalDemoTableRef.setTransferVisible(true);
    }
  }
};
</script>
<style>

</style>
