define(['text!./index.html', 'css!./index.css', 'css!./fonts/iconfont.css', 'css!../common/common.css'], function(template) {
    function init(el) {
        new Vue({
            el: '#' + el,
            template: template,
            data: function() {
                return {
                    rowPersent: 8,
                    showpage: 1,
                    appLists: [{
                            appIcon: 'cyan icon-liuchengdingyi',
                            label: '组织管理',
                            path: '/HR010003',
                            code: 'orgMgt'
                        },
                        {
                            appIcon: 'cyan icon-adminmanagement',
                            label: '员工管理',
                            path: "/staff",
                            code: "usermgr",
                        },
                        {
                            appIcon: 'cyan icon-appicon',
                            label: '用户管理',
                            path: "/userInfo",
                            code: "userInfo",
                        },
                        {
                            appIcon: 'cyan icon-rolemanagement',
                            label: '角色管理',
                            path: "/roleManagement",
                            code: "roleManagement",
                        },
                        {
                            appIcon: 'cyan  icon-appicon',
                            label: '附件管理',
                            path: "/materialList",
                            code: "materialList",
                        },
                        {
                            appIcon: 'cyan icon-shenqing',
                            label: '自定义档案',
                            path: "/defdoc",
                            code: "ifbpdefdoc",
                        },
                        {
                            appIcon: 'cyan icon-liuchengshezhi',
                            label: '参数配置',
                            path: "/tenementList",
                            code: "cspz-zh",
                        },
                        {
                            appIcon: 'cyan icon-bumen',
                            label: '客户管理',
                            path: "/crm/crmList?sceneCode=DEFAULT",
                            code: "crm",
                        },
                        {
                            appIcon: 'cyan icon-bumen',
                            label: '供应商管理',
                            path: "/dealer/agencylist",
                            code: "agencylist",
                        },
                        {
                            appIcon: 'cyan icon-xitong',
                            label: '任务中心',
                            path: "/flowTask",
                            code: "bpmtaskcenter",
                        },
                        {
                            appIcon: 'iconfont icon-jiaosefenpeiyonghu cyan',
                            label: '流程代理设置',
                            path: "/proxySetting",
                            code: "proxySetting",
                        },

                    ]

                }
            },
            computed: {
                //总共显示多少条数据
                listcount: function() {
                    return this.appLists.length;
                },
                //当前展示的数据
                showList: function() {
                    var maxnum = (24 / this.rowPersent) * 3; //每页最多展示多少数据
                    var pagenum = parseInt(this.appLists.length / maxnum) //最多展示多少页
                    return this.appLists.slice((this.showpage - 1) * maxnum, maxnum * this.showpage);
                },
                //总页数
                showCount: function() {
                    var maxnum = (24 / this.rowPersent) * 3; //每页最多展示多少数据
                    var pagenum = Math.ceil(this.appLists.length / maxnum) //最多展示多少页
                    return pagenum;
                }
            },
            created: function() {},
            mounted: function() {

            },
            methods: {
                changePage: function(page) {
                    this.showpage = page;
                },
                goRight: function() {
                    this.showpage === this.showCount ? this.showpage = 1 : this.showpage += 1;
                },
                getUrlParam: function(item) {
                    window.vueInstance.$children[0].addEditableTabs(item.path, item);
                },
                goLeft: function() {
                    this.showpage === 1 ? this.showpage = this.showCount : this.showpage -= 1;
                },

            }
        })
    }
    return {
        init: init
    }
});