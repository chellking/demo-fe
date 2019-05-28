define(['text!./index.html', 'jquery', 'css!./index.css'], function(template, $) {
    function init(el) {
        new Vue({
            el: '#' + el,
            template: template,
            data: function() {
                return {
                    todoType: 'todo',
                    dialogVisible: false,
                    billtype: '',
                    options: [{
                        value: 'todo',
                        label: '待办'
                    }, {
                        value: 'claim',
                        label: '待领'
                    }],
                    size: 3,
                    todoListValue: '',
                    task: '',
                    opinion: '',
                    time: '',
                    billTypeArr: [],
                    runType: ''
                };
            },
            methods: {
                /**
                 * 日期转换方法
                 * */
                MillisecondToDate: function(msd) {
                    var time = parseFloat(msd) / 1000;
                    if (null != time && "" != time) {
                        if (time > 60 && time < 60 * 60) {
                            time = parseInt(time / 60.0) + "分钟";
                        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                            time = parseInt(time / 3600.0) + "小时";
                        } else if (time >= 60 * 60 * 24) {
                            time = parseInt(time / 86400.0) + "天";
                        } else {
                            time = parseInt(time) + "秒";
                        }
                        return time
                    }
                },
                /**
                 * 事项列表数据
                 * */
                getData: function() {
                    var self = this;
                    self.$http({
                        method: 'get',
                        url: '/riart/task/pageList?pn=1&ps=3&billtype=' + this.billtype
                    }).then(function(res) {
                        if (res.data.status === true) {
                            if (res.data.data.content.length) {
                                // var vm = JSON.parse(JSON.stringify(res.data.data.data));
                                var vm = res.data.data.content;
                                // self.time = self.MillisecondToDate(new Date() - new Date(vm[0].dealTime));
                                var billTypeSet = {}; //不用ES6的 Set结构
                                vm.forEach(function(v, i) {
                                    vm[i].dealTime = new Date(v.dealTime).toLocaleDateString();
                                    vm[i].dealMan = vm[i].dealMan ? vm[i].dealMan : '佚名';
                                    vm[i].fee = Math.floor(vm[i].fee);
                                    vm[i].label = vm[i].label.split(' ').join('  ');
                                    vm[i].time = self.MillisecondToDate(new Date() - new Date(vm[i].dealTime))
                                        // self.billTypeArr.push(v.billtype)
                                    billTypeSet[v.billtype] = 1;
                                });
                                for (var key in billTypeSet) {
                                    self.billTypeArr.push(key);
                                }
                                // self.billTypeArr = Array.from(new Set([...self.billTypeArr]));
                            }
                            self.size = res.data.data.total > 0 ? 3 : 0;
                            self.todoListValue = res.data.data.content;
                        }
                    });
                },
                search: function(item, index) {
                    this.billtype = item;
                    this.getData();
                    var span = document.querySelectorAll('.billtype span');
                    $('.billtype span').removeClass('active');
                    $(span[index]).addClass('active')
                },
                /**
                 * 按钮操作
                 * @param action
                 * @url: /riart/fbpworkflows/doAction
                 * */
                showDialog: function(item, type) {
                    this.task = item;
                    this.runType = type;
                    this.dialogVisible = true;
                },
                action: function() {
                    var self = this;
                    var obj = {};
                    self.dialogVisible = false; //后台接口还没，暂时在这里先加上关闭对话框

                    if (self.runType === 'agree') {
                        if (self.opinion === "") {
                            self.opinion = '同意';
                        }
                        obj.param_note = self.opinion;
                        var em = {};
                        em.nolockandconsist = 'Y';
                        obj.eParam = em;
                    } else if (self.runType === 'reject') {
                        obj.param_note = self.opinion;
                        obj.param_reject_activity = self.task.dealMan;
                    }
                    debugger
                    self.$http({
                        method: 'post',
                        url: '/riart/fbpworkflows/doAction',
                        data: {
                            action: self.runType,
                            param: JSON.stringify(obj),
                            billType: self.task.billtype,
                            billId: self.task.billid,
                            userId: self.task.userId
                        }
                    }).then(function(response) {
                        if (response && response.data && (response.data.status === true)) {
                            if (self.runType === 'reject') {
                                self.$message({
                                    type: 'success',
                                    message: '驳回成功'
                                });
                            } else if (self.runType === 'agree') {
                                this.$message({
                                    type: 'success',
                                    message: '已审批同意'
                                });
                            }
                            self.dialogVisible = false;
                            self.getData();
                        } else if (response && response.data && (response.data.status === false)) {
                            self.$message({
                                type: 'error',
                                message: response.data.msg
                            });
                        }
                    }).catch(function(res) {
                        self.$message.error(res.data.msg);
                    });
                },
                jumpMore: function() {
                    var messageCenter = {
                        path: '/flowTask',
                        label: '任务中心',
                        appIcon: 'cyan icon-xitong',
                        code :'bpmtaskcenter'
                      };
                      window.top.vueInstance.$children[0].addEditableTabs("/flowTask",messageCenter)
                }
            },
            created: function() {
                this.getData();
            }
        });
    }

    return {
        init: init
    }
});