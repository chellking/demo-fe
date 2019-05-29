<template lang="html">
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="报销单1"></ifbp-breadcrumb>
        <!-- 按钮区域 -->
        <ifbp-button-area>
            <!-- 根据页面定制控制的权限来显示对应的按钮 -->
            <el-button type="primary" v-for="item in mainBtns" @click="triggerClick(item)"
                       v-text="item.displayname"></el-button>
            <!-- 查询模板组件 -->
            <ifbp-search class="fr"
                         :template-code="searchCode"
                         @search="handleSearch">
            </ifbp-search>
        </ifbp-button-area>
        <!-- 主体区域 -->
        <ifbp-main-area type="list">
            <!-- 主体按钮区 -->
            <div class="ifbp-btn-line">
                <div class="fr">
                    <ifbp-table-card-icon
                            :show-table="showTable"
                            @update:showTable="value => this.showTable = value">
                    </ifbp-table-card-icon>
                    <i class="ifbp-icon-setting" @click="showHeaderSetting" title="设置"></i>
                </div>
            </div>
            <!-- UI模板组件   tpl-id="pageExpenseAccountList"-->
            <ifbp-template
                    ref="pageExpenseAccount"

                    :tpl-data="pageExpenseAccountData"
                    :funnode="tableFunnode"
                    :nexuskey="tableNexuskey"
                    :tplResetFun="pageExpenseAccountResetFun"
                    @table-click="pageTableClick"
                    :methods="pageExpenseAccountMethods"
                    :table-show-menu="false"
                    v-show="showTable"
            >
            </ifbp-template>
            <!-- 卡片展示 -->
            <page-expense-account-card
                    v-show="!showTable"
                    :table-data="pageEData"
                    @cardEditClick="pageExpenseAccountCardEditClick"
                    @cardDeleteClick="pageExpenseAccountCardDeleteClick"
            >
            </page-expense-account-card>
            <!-- 分页组件 -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="curPage"
                    :page-sizes="[12,24,48,96]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
        </ifbp-main-area>
        <!-- 删除确认Dialog -->
        <ifbp-del-dialog v-model="delDialogVisible" message="确定删除该数据？删除后无法恢复" @click="deleteClick">
        </ifbp-del-dialog>
    </ifbp-page>
</template>

<script>
    import pageExpenseAccountCard from "./pageExpenseAccountCard.vue";
    import pageModelMixin from "../../../common/pageModelMixin.js";

    export default {
        mixins: [pageModelMixin],
        components: {
            pageExpenseAccountCard
        },
        data() {
            var vm = this;
            return {
                // UI模板传入参数
                tableFunnode: "BXD",//平台UI模板定义值
                tableNexuskey: "BXD_HEADER",//平台UI模板定义值
                // 查询模板传入参数
                searchCode: "BXD_SEARCH",
                searchData: "",

                showTable: true,
                // 按钮区
                mainBtns: [],
                // UI模板相关变量
                pageExpenseAccountData: {},
                pageExpenseAccountResetFun: function ($node) {
                    var $table = this.getTableDom($node);
                    //编码添加超链接,点击跳转到对应的详情页
                    let codeDom = $('el-table-column[prop="djbh"]', $table);
                    if (codeDom.length) {
                        codeDom.html(
                            '<template scope="scope"><a @click="pageEditTableRowClick(scope)">{{scope.row.djbh}}</a></template>'
                        );
                    }
                    var icons = [
                        {
                            title: "修改",
                            icon: "edit"
                        },
                        {
                            icon: "print",
                            title: "打印预览"
                        },
                        {
                            icon: "delete",
                            title: "删除"
                        }
                    ];
                    var operateHtml = this.getTableOperateHtml(icons);
                    $table.append(operateHtml);
                    return $node[0].outerHTML;
                },
                //UI模板的methods方法
                pageExpenseAccountMethods: {
                    pageEditTableRowClick(scope) {
                        vm.$router.push("/pageExpenseAccount/detail/" + scope.row.pk + '?sceneCode=' + this.sceneCode);
                    }
                },
                // 卡片相关变量
                pageEData: [],
                // 分页相关变量
                curPage: 0,
                size: 12,
                totalElements: 0,
                // 删除相关变量
                delDialogVisible: false,
                delId: "",
                sceneCode: '' // 场景编码
            };
        },
        methods: {
            // 列表请求数据
            requestPage(curPage, size) {
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
                        this.pageEData = res.data.data.content || [];
                        var resData = res.data.data.content || [];
                        this.$nextTick(() => {
                            if (this.$refs.pageExpenseAccount) {
                                this.$refs.pageExpenseAccount.setTableData(resData);
                            } else {
                                this.$set(
                                    this.pageExpenseAccountData,
                                    "uitemplateTableData",
                                    resData
                                );
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
            // 查询组件执行查询
            handleSearch(data) {
                if (!data) {
                    return;
                }
                this.searchData = data;
                this.requestPage();
            },
            // 表格中操作列按钮事件
            pageTableClick(icon, scope) {
                // 编辑按钮处理
                if (icon === "edit") {
                    this.$router.push("/pageExpenseAccount/detail/" + scope.row.pk + '?sceneCode=' + this.sceneCode);
                }
                // 删除按钮处理
                if (icon === "delete") {
                    this.delDialogVisible = true;
                    this.delId = scope.row.pk;
                }
                // 打印预览按钮处理
                if (icon === 'print') {
                    // this.$router.push();
                    window.open('/ifbp-print/static/html/iprint/businessPreview.html?serverUrl='
                        + window.location.protocol + '//' + window.location.host
                        + '/ifbp-print/rest/printTemplate/replaceTemplateByScenecode?busicode=BXD'
                        + '&scenecode=' + this.sceneCode + '&pk=' + scope.row.pk);
                }
            },
            // 删除逻辑处理
            deleteClick() {
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
                            this.requestPage(0, this.size);
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
                this.requestPage(0, val);
            },
            // 翻页标签改变当前页
            handleCurrentChange(val) {
                this.requestPage(val - 1, this.size);
            },
            // 主体按钮区设置显示/隐藏列
            showHeaderSetting() {
                this.$refs.pageExpenseAccount.setTransferVisible(true);
            },
            // 卡片区的编辑按钮处理
            pageExpenseAccountCardEditClick(column, index) {
                this.$router.push("/pageExpenseAccount/detail/" + column.pk + '?sceneCode=' + this.sceneCode);
            },
            // 卡片区的删除按钮处理
            pageExpenseAccountCardDeleteClick(column, index) {
                this.delDialogVisible = true;
                this.delId = column.pk;
            },
            // 新增按钮处理
            add() {
                this.$router.push("/pageExpenseAccount/detail/" + undefined);
            },
            getSceneCode() {
                this.sceneCode = window.location.href.split('?')[1].split('&')[0].split('=')[1];
            },
        },
        mounted() {
            this.requestPage();
        },
        created() {
            // 获取页面配置信息
            // this.getPageModel(function (pageModel) {
            //     // 获取按钮
            //     this.mainBtns = pageModel.getButtons("pageExpenseAccountList");
            // });
            this.getSceneCode();
        }
    };
</script>

<style lang="css">
</style>
