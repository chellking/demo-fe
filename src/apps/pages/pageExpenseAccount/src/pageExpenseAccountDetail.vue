<template lang="html">
    <ifbp-page>
        <!-- 节点title -->
        <ifbp-breadcrumb name="差旅报销单详情"></ifbp-breadcrumb>
        <!-- <process ref="initiate" :showBtnOfSpzt="showBtnOfSpzt" :templatePk="templatePk" @callBack="processCallback" :passValue="passValue=true" @afterAction="processAfterCallback"></process> -->
        <ifbp-button-area v-if="this.isSponsor && this.showBtnOfSpzt">
            <el-button type="primary" @click="initiateProcess">提交</el-button>
        </ifbp-button-area>
        <ifbp-initiate-flow v-if="!this.showBtnOfSpzt && this.showBtn" ref="initiate" :templatePk="templatePk"
                            @callBack="processCallback" :passValue="passValue=true"
                            @afterAction="processAfterCallback"></ifbp-initiate-flow>
        <!-- 主体区域 -->
        <ifbp-main-area type="detail" style="margin-top:8px;">
            <ifbp-panel-group :navbar="true" :base-nav-bar-top="baseNavBarTop" :base-scroll-top="baseScrollTop">
                <!-- 主表区域 -->
                <ifbp-panel id="pageExpenseAccount" :icons="pageExpenseAccountIcons" title="报销单" :main-title="true">
                    <ifbp-template
                            ref="pageExpenseAccountDetail"
                            tpl-id="pageExpenseAccountDetail"
                            :tpl-data="pageExpenseAccountDetailData"
                            :editable="formEdit"
                            :form-show-message="formEdit"
                    >
                    </ifbp-template>
                    <!-- 下方按钮区 -->
                    <ifbp-form-button-area v-if="formEdit">
                        <el-button type="primary" @click="pageFormConfirm">保存</el-button>
                        <el-button @click="pageFormCancel">取消</el-button>
                    </ifbp-form-button-area>
                </ifbp-panel>
                <!-- 其他UI模板区域 -->
                <ifbp-panel id="pageHotel" :icons="pageHotelIcons" title="住宿报销单" :right-icons="pageHotelRightIcons">
                    <ifbp-template
                            ref="pageHotel"
                            tpl-id="pageHotel"
                            :tpl-data="pageHotelData"
                            :table-show-menu="false"
                            :tpl-reset-fun="pageHotelResetFun"
                            :editable="pageHotelEditable"
                            :delete-button-show="!pageHotelEditable"
                            :cancel-button-show="pageHotelEditable"
                            :table-oper-vif="tableOperVif"
                            @update:editable="val => {this.pageHotelEditable = val}"
                            @expand="(row, expanded) => {this.tableOperVif = !expanded}"
                            :confirm-clear-edit="false"
                            @table-click="pageHotelClick"
                            @form-confirm-click="pageHotelFormConfirm"
                            @form-delete-click="pageHotelDeleteClick"
                    >
                    </ifbp-template>
                    <!-- 删除确认Dialog -->
                    <ifbp-del-dialog
                            v-model="pageHotelDelDialogVisible"
                            message="确认删除该数据？删除后无法恢复。"
                            @click="pageHotelDelDialogClick"
                    >
                    </ifbp-del-dialog>
                </ifbp-panel>
                <!-- 动态区域 -->
                <ifbp-dynamic-panel
                        class="pageDynamicClass"
                        ref="pageDynamic"
                        :default-crud="'false'"
                        :dynamic-no-code-right-icons="dynamicRightIcons"
                        :dynamic-no-code-reset-funs="pageDynamicNoCodeResetFuns"
                        @after-create="dynamicPageAfterCreate"
                        @form-confirm-click="dynamicFormConfirmClick"
                        @table-click="dynamicPageTableClick"
                        @update:editable="function(item, index ,editable){editableChange(item, index, editable)}"
                        @form-delete-click="pageDynamicFormDelete"
                >
                </ifbp-dynamic-panel>
                <!-- 删除确认Dialog -->
                <ifbp-del-dialog
                        v-model="dynamicPageDelDialogVisible"
                        message="确认删除该数据？删除后无法恢复。"
                        @click="dynamicPageDelDialogClick"
                >
                </ifbp-del-dialog>
            </ifbp-panel-group>
        </ifbp-main-area>
    </ifbp-page>
</template>

<script>
    import pageModelMixin from "../../../../common/pageModelMixin.js"; // 平台封装的页面定制相关逻辑
    // import pageMixin from "../../../../common/pageMixin.js"; // 平台封装的页面相关逻辑
    import pageLazyMixin from "ifbp-business/pageLazyMixin/index.js";
    import pageHotel from "./pageHotel.js"; // 其他UI模板逻辑处理
    import pageDynamic from "./pageDynamic.js"; // 动态区域逻辑处理
    import process from "./process.vue"; // 流程组件
    export default {
        mixins: [pageModelMixin, pageLazyMixin, pageHotel, pageDynamic],
        components: {process},
        beforeCreate() {
            let nowTime = (new Date()).getTime()
            window.beforeCreate = nowTime;
            console.log('before create:' + nowTime);
        },
        data() {
            let vm = this;
            let id = this.$root.$router.currentRoute.params.id;
            return {
                id: id,
                // 主表编辑状态
                formEdit: true,
                // UI模板相关变量
                pageExpenseAccountDetailData: {},
                // 主表panel左侧按钮
                pageExpenseAccountIcons: [
                    {
                        icon: "create-square",
                        show: false,
                        click() {
                            vm.formEdit = !vm.formEdit;
                            vm.pageExpenseAccountIcons[0].show = false;
                        }
                    }
                ],
                // 动态确定右侧导航栏高度
                baseNavBarTop: 115,
                baseScrollTop: 116,
                // 根据审批状态是否显示提交
                showBtnOfSpzt: false,
                isSponsor: false,
                // 单据pk
                templatePk: '',
                // 场景编码
                sceneCode: '',
                // 业务编码
                businessKey: '',
                // 控制是否显示操作按钮,false不显示,默认是true
                showBtn: false,
            };
        },
        methods: {
            // 请求主表数据
            requestPageDetail() {
                if (!this.id || this.id === "undefined") return;
                return this.$http({
                    url: "/demo-web/BXHeader/getById",
                    method: "post",
                    data: this.id,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json"
                })
                    .then(res => {
                        if (res.data.success === true) {
                            let resData = res.data.data || {};
                            // 根据返回的审批状态决定是否显示提交按钮
                            if (resData.spzt === "0" || resData.spzt === "-1" || resData.spzt === undefined || resData.spzt === null) {
                                this.showBtnOfSpzt = true;
                            } else {
                                this.baseNavBarTop = 43;
                                this.baseScrollTop = 44;
                            }
                            this.templatePk = resData.pk;
                            this.$nextTick(() => {
                                if (this.$refs.pageExpenseAccountDetail) {
                                    this.$refs.pageExpenseAccountDetail.setFormData(resData);
                                } else {
                                    this.$set(
                                        this.pageExpenseAccountDetailData,
                                        "uitemplateFormData",
                                        resData
                                    );
                                }
                            });
                            this.baseData = JSON.parse(JSON.stringify(resData));
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    })
                    .catch(e => {
                        this.$message({
                            message: "基本信息详情获取失败",
                            type: "error"
                        });
                    });
            },
            // 主表区域保存按钮处理
            pageFormConfirm() {
                let vm = this;
                let url = "/demo-web/BXHeader/update";
                this.$refs.pageExpenseAccountDetail.validate(valid => {
                    if (valid) {
                        let data = vm.$refs.pageExpenseAccountDetail.getFormData();
                        if (!vm.id || vm.id === "undefined") {
                            url = "/demo-web/BXHeader/create";
                        }
                        vm
                            .$http({
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
                                    if (!vm.id || vm.id === "undefined") {
                                        vm.$message({
                                            message: "保存成功"
                                        });
                                    } else {
                                        vm.$message({
                                            message: "修改成功"
                                        });
                                    }
                                    if (!vm.id || vm.id === "undefined") {
                                        vm.id = res.data.data.pk;
                                    }
                                    let resData = res.data.data || {};
                                    vm.$refs.pageExpenseAccountDetail.setFormData(resData);
                                    vm.baseData = JSON.parse(JSON.stringify(resData));
                                    vm.formEdit = false;
                                    vm.pageExpenseAccountIcons[0].show = true;
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
                        this.$message("校验未通过");
                    }
                });
            },
            // 主表取消按钮处理
            pageFormCancel() {
                this.formEdit = false;
                this.pageExpenseAccountIcons[0].show = true;
                if (this.baseData) {
                    this.$refs.pageExpenseAccountDetail.setFormData(this.baseData);
                } else {
                    this.$refs.pageExpenseAccountDetail.resetFormData();
                }
            },
            // 流程的回调函数
            processCallback(action) {
                //action为按钮的类型,从流程的组件中传过来的,同意=>aggreeAble,驳回=>rejectAble,拒绝=>refuseAble,指派=>assignAble...
                //可以根据自己的需要，调用流程组件中的方法
                this.$refs.initiate.customEvents();
            },
            // 流程按钮确定后的事件(撤回=>withDraw,同意=>aggreeAble,驳回=>rejectAble,拒绝=>refuseAble,指派=>assignAble...)
            processAfterCallback(action) {

            },
            // 云审流程的提交按钮是否显示
            isEnable() {
                var sceneCode = this.sceneCode;
                if (sceneCode !== "undefined" && sceneCode) {
                    return this.$http.get("/ifbp-bpm-service/bmp_proc/check", {
                        params: {
                            buzicode: "BXD",
                            sceneCode: sceneCode
                        }
                    }).then((res) => {
                        this.isSponsor = res.data.data.enabled;
                    }).catch(error => {
                    });
                }
            },
            // 流程提交发送的请求
            initiateProcess() {
                var promise1 = this.initiateProcessBefore();
                Promise.all([promise1]).then(() => {
                    if (this.BXHeaderSubmit) {
                        this.initiateProcessAfter();
                    }
                });
            },
            // 提交的时候需要首先发送一个请求
            initiateProcessBefore() {
                return this.$http({
                    url: '/demo-web/BXHeader/submit',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    dataType: "application/json",
                    method: 'post',
                    data: this.templatePk
                }).then((res) => {
                    if (res.data.success === true) {
                        this.BXHeaderSubmit = true;
                    }
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '请求出错'
                    });
                });
            },
            initiateProcessAfter() {
                var params = {
                    buzicode: "BXD",
                    sceneCode: this.sceneCode,
                    processInstanceName: "报销单流程",
                    businessKey: this.businessKey,
                    mdPK: this.businessKey
                };
                this.$http({
                    url: "/ifbp-bpm-service/proc/start",
                    method: "post",
                    data: params
                }).then(res => {
                    if (res.data.status === 1) {
                        this.$message({
                            type: "success",
                            message: "发起流程成功"
                        });
                        this.isSponsor = false;
                        this.baseNavBarTop = 43;
                        this.baseScrollTop = 44;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(() => {
                    this.$message.error("发起失败");
                });
            },
            // 获取场景编码
            getSceneCode() {
                this.sceneCode = window.location.href.split('?')[1].split('&')[0].split('=')[1];
                let paramPK = location.href.split("?")[0].split("/");
                this.businessKey = paramPK[paramPK.length - 1];
                if (location.href.indexOf("processKey") !== -1) {
                    this.showBtn = true;
                } else {
                    this.showBtn = false;
                }
            },
        },
        created() {
        },
        mounted() {
            const self = this;
            this.getSceneCode();
            var promise1 = this.requestPageDetail();
            var promise = this.isEnable();
            if (this.id && this.id !== "undefined") {
                this.formEdit = false;
                this.pageExpenseAccountIcons[0].show = true;
            }
            if (this.$route.params.id === 'undefined') {
                this.baseNavBarTop = 43;
                this.baseScrollTop = 44;
            } else {
                Promise.all([promise1, promise]).then(() => {
                    if (window.location.hash.indexOf('processKey') !== -1) {
                        self.baseNavBarTop = 163;
                        self.baseScrollTop = 164;
                    } else if (self.isSponsor && self.showBtnOfSpzt) {
                        self.baseNavBarTop = 115;
                        self.baseScrollTop = 116;
                    } else {
                        self.baseNavBarTop = 43;
                        self.baseScrollTop = 44;
                    }
                });
            }
        }
    };
</script>
<style lang="css">
</style>
