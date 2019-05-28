<template>
  <ifbp-page>
    <ifbp-breadcrumb name="员工信息"></ifbp-breadcrumb>
    <!--search-->
    <ifbp-button-area>
        <el-button type="primary" class="fl" @click="addUserBtn">新增</el-button>
        <ifbp-search
          class="fr"
          :template-code="templateCode"
          @search="handleSearch">
        </ifbp-search>
    </ifbp-button-area>
    <!-- 用户信息列表 -->
    <ifbp-no-data :search-state="searchState" :total-elements="totalElements">
    <ifbp-main-area>
      <div class="ifbp-btn-line">
        <div class="fr">
          <ifbp-table-card-icon 
            :show-table="showTable" 
            @update:showTable="value => this.showTable = value">
          </ifbp-table-card-icon>
          <i class="ifbp-icon-setting" :class='{"disabled":!showTable}' @click="showHeaderSetting" title="设置"></i>
        </div>
      </div>
      <!--list-->
      <ifbp-template 
                    v-show="showTable"
                    ref="staffTableRef"
                    tpl-id="staffTableId"
                    :tpl-data="staffTableData"
                    show-type="table"
                    :funnode="funnode"
                    :nexuskey="nexuskey"
                    :tpl-reset-fun="staffTableResetFun"
                    :table-show-menu="false"
                    :methods="staffMethods"
                    @delete-table-click="deleteTableRow"
                    @power-table-click="stateTableRow">
      </ifbp-template>
      <staff-info-card
        v-show="!showTable"
        :table-data="cardData"
        @cardEditClick="staffCardEditClick"
        @cardDeleteClick="staffCardDeleteClick"
        @cardEnabledClick="staffCardEnabledClick"
        @cardClick="staffCardClick"
        >
      </staff-info-card>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
    </ifbp-main-area>
    </ifbp-no-data>
    <el-dialog
        title="提示"
        v-model="delDialogVisible"
        :modal="true"
        size="tiny">
        <span>确认删除该员工？删除后无法恢复。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteClick">确 定</el-button>
        </span>
    </el-dialog>
  </ifbp-page>
</template>
<script>
  import StaffInfoCard from './staff-info-card.vue'
  export default {
    components: {
      StaffInfoCard
    },
    data(){
      var vm = this;
      return {
        // 搜索模板
        templateCode: 'YGGL_QUERY',
        searchTemplate: '',
        searchState: "",
        // 模板列表
        loading: false,
        staffTableData: {
          psndoc_t: [],
        },
        funnode:'YGGL',
        nexuskey:'STAFF_INFO',
        staffTableResetFun($node) {
            //获取table,此id为ui模板上面的表格Id
            let $table = $node.find("el-table");
            //定义操作
            let operateArr = [
                {
                    icon: 'power',
                    title: '启用/停用'
                },
                {
                    title: "删除",
                    icon: "delete"
                }
            ];
            //获取操作按钮html片段
            let operateHtml = this.getTableOperateHtml(operateArr);
            $table.append(operateHtml);
            // 为头像添加图片
            // background-color: #F5F5FA;
            // <p  v-if="!scope.row.avatar" style="background-color: #F5F5FA;width: 24px; height: 32px;position:relative;">
            let avatarDom = $('el-table-column[prop="avatar"]', $table);
            if(avatarDom.length) {
              avatarDom.html(
                `<template scope="scope"><div style="width: 24px; height: 32px; margin: 1px;"><p style="width: 24px; height: 32px;line-height:32px; position: relative; " v-if="!scope.row.avatar"><ifbp-table-image :name="scope.row.name" :index="parseInt(Math.random()*7)" style="width:24px;height:24px;line-height:24px;font-size:12px;"></ifbp-table-image></p><img v-else style="width:100%;display: block;position:relative;top:50%;transform:translateY(-50%); "` + `:src="'/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar='+scope.row.avatar"></img></div></template>`
              );
            };
            // 为员工编码添加hover的模拟事件
            let codeDom = $('el-table-column[prop="code"]',$table);
            if(codeDom.length){
              codeDom.html(
                '<template scope="scope"><a @click="editTableRow(scope)">{{scope.row.code}}</a></template>'
              );
            }
            return $node[0].outerHTML;
        },
        staffMethods:{
          editTableRow(scope){
            vm.$router.push('/staff/detail/' + scope.row.id);
          }
        },
        size: 12,
        currentPage: 1,
        totalElements: null,
        enablestate: '',
        isEdit: false,
        delDialogVisible: false,
        delId:'',
        //卡片列表切换
        showTable: true,
        cardData: [],
        searchType: ''
      };
    },
    created(){
      this.request();
    },
    methods: {
      ifbpPageInit(){
        this.request();
      },
      /**
       *   获取列表请求
       **/
      request() {
        var extraParams = this.getExtraParam();
        this.loading = true;
        var url;
        var search = this.searchTemplate;
        if(search !== ''){
          search = JSON.stringify(search);
        }
        var searchType = this.searchType;
        // if(n===undefined){
        //   url = '/ifbp-app-bd/bd/psn/psndoc/pageList?pn=1&ps=10&sortColumn=' + extraParams +'&qtAggVO=' + search;
        // } else {
        //   url = '/ifbp-app-bd/bd/psn/psndoc/pageList?pn='+ n +'&ps=' + s + extraParams  +'&qtAggVO=' + search;
        // }
        // url = '/ifbp-app-bd/bd/psn/psndoc/pageList?pn='+ this.currentPage +'&ps=' + this.size + extraParams  +'&qtAggVO=' + search;
        var params = {
          pn: this.currentPage,
          ps: this.size,
          qtAggVO: search
        };
        params[searchType] = extraParams;
        if(extraParams !== ''){
          url = '/ifbp-app-bd/bd/psn/psndoc/pageListForOrgId'
        } else{
          url = '/ifbp-app-bd/bd/psn/psndoc/pageList'
        }
        this.$http({
          url: url,
          method: 'POST',
          dataType: 'json',
          data: params
        }).then((res) => {
          if(res.data.success === true){
              this.loading = false;
              this.totalElements = res.data.data.totalElements ;       // 总条数
              this.size = res.data.data.size;                          // 每页的条数
              this.$nextTick(() => {
                if(this.$refs.staffTableRef) {
                  this.cardData = res.data.data.content;
                  this.$refs.staffTableRef.setTableData(res.data.data.content);
                } else {
                  this.$set(this.staffTableData, 'uitemplateTableData', res.data.data.content);
                }
              });
          }
        }).catch(() => {
          this.$message({
            message: '列表获取失败',
            type: 'error'
          });
        });
      },
      handleSearch(searchTemplate){
        this.searchState = 'search';
        this.searchTemplate = searchTemplate;
        this.request();
      },
      handleSizeChange(val) {
        this.size = val;
        this.request();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.request();
      },
      getExtraParam() {
        var paramStr = window.location.href.split('?')[1];
        var extraStr;
        var params = {};
        var tmp;
        if (paramStr) {
          paramStr.split('&').forEach((singleParam) => {
            tmp = singleParam.split('=');
            params[tmp[0]] = tmp[1];
          });
          if(params.search_pk_dept){
            extraStr = params.search_pk_org ? params.search_pk_org : params.search_pk_dept;
            this.searchType = 'pk_dept';
          } else {
            extraStr = params.search_pk_org ? params.search_pk_org : '';
            this.searchType = 'pk_org';
          }
          if (!extraStr) {
            extraStr = '';
          }
        } else {
          extraStr = '';
        }
        return extraStr;
      },
      /**
       *  一些控制页面状态的方法
       *  都在按钮上绑着
       **/
      search() {
        this.request();
      },
      // 跳转到添加用户页面
      addUserBtn() {
        this.$router.push('/staff/add');
        this.isEdit = true;
      },
      editTableRow(scope){
        this.$router.push('/staff/detail/' + scope.row.id)
      },
      deleteTableRow(scope) {
        this.delDialogVisible = true;
        this.delId = scope.row.id;
      },
      /**
       *  启用状态修改
       *  2（启用），3(停用)
       * */
      stateTableRow(scope) {
        var state = scope.row.enablestate === "2"?3:2;
        this.$http({
          url: '/ifbp-app-bd/bd/psn/psndoc/optUserState/' + scope.row.id + '?state=' + state ,
          method: 'get'
        }).then((res) => {
          if (res.data.success === true) {
            if (state === 2){
              this.$message({
                message: '启用成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: '停用成功',
                type: 'warning'
              });
            }
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: 'Network error',
            type: 'error'
          });
        });

      },
      deleteClick() {
        this.$http({
          url: '/ifbp-app-bd/bd/psn/psndoc/' + this.delId,
          method: 'delete'
        }).then((res) => {
          if (res.data.success === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.delDialogVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: 'Network error',
            type: 'error'
          });
        });
      },
      staffCardEnabledClick(column) {
        var state = column.enablestate === "2"?3:2;
        this.$http({
          url: '/ifbp-app-bd/bd/psn/psndoc/optUserState/' + column.id + '?state=' + state ,
          method: 'get'
        }).then((res) => {
          if (res.data.success === true) {
            if (state === 2){
              this.$message({
                message: '启用成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: '停用成功',
                type: 'warning'
              });
            }
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: 'Network error',
            type: 'error'
          });
        });
      },
      staffCardClick(column){
        this.$router.push('/staff/detail/' + column.id + "?edit=false");
      },
      staffCardEditClick(column) {
        this.$router.push('/staff/detail/' + column.id + "?edit=true");
      },
      // 卡片的删除操作
      staffCardDeleteClick(column) {
        this.delDialogVisible = true;
        this.delId = column.id;
      },
      //设置表头
      showHeaderSetting() {
        if (this.showTable) {
          this.$refs.staffTableRef.setTransferVisible(true);
        }
      },
    }
  };
</script>
