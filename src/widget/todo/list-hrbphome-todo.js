define(["text!./index.html", 'jquery'], function(template, $) {
    function init(el) {
        new Vue({
            el: '#' + el,
            template: template,
            data: function() {
                return ({
                    todoType: 'todo',
                    dialogVisible: false,
                    options: [{
                        value: 'todo',
                        label: '待办'
                    }, {
                        value: 'claim',
                        label: '待领'
                    }],
                    size: 3,
                    todoListValue: {},
                    taskId: '',
                    params: {},
                    designateList: [],
                    comment: '同意',
                    time: '',
                    formLabelWidth: '96px'
                });
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
                        url: "/ifbp-app-sm/tag/tag_include_rel/jchpk",
                        headers: { 'Content-Type': 'application/json' },
                        method: "get",
                        dataType: "json"
                    }).then(function(res) {
                        var list = [];
                        res.data.tagRels.forEach(function(item, index) {
                            list.push(item.relPk);
                        });
                        var extPresident = list.join(',');
                        self.$http({
                            method: 'get',
                            url: '/ifbp-bpm-service/task/queryTasks?start=0&size=3&taskFlag=' + self.todoType + '&extPresident=' + extPresident
                        }).then(function(res) {
                            if (res.data.status === 1) {
                                if (res.data.data.data) {
                                    // var vm = JSON.parse(JSON.stringify(res.data.data.data));
                                    var vm = res.data.data.data;
                                    if (vm.length > 0) {
                                        self.time = self.MillisecondToDate(new Date() - new Date(vm[0].startTime));
                                        vm.forEach(function(v, i) {
                                            vm[i].startTime = new Date(v.startTime).toLocaleString();
                                            vm[i].startParticipantName = vm[i].startParticipantName ? vm[i].startParticipantName : '佚名';
                                            self.$http({
                                                method: 'get',
                                                url: '/ifbp-bpm-service/task/operation?processDefinitionId=' + vm[i].processDefinitionId + '&activityId=' + vm[i].activityId
                                            }).then(function(re) {
                                                vm[i].taskName = re.data.data[1].text;
                                            });
                                        });
                                    }
                                    self.size = res.data.data.total > 0 ? 3 : 0;
                                    self.todoListValue = res.data.data;
                                } else {
                                    self.todoListValue["data"] = [];
                                }
                            } else {
                                self.todoListValue["data"] = [];
                                self.$message.error(res.data.msg);
                            }
                        });
                    });
                },
                /**
                 * 同意操作
                 * @param: taskId、action、comment
                 * @url: /approval/action
                 * */
                showDialog: function(item) {
                    this.dialogVisible = true;
                    this.taskId = item.id;
                    this.params = item;
                    this.getAssignment();
                },
                getAssignment: function() {
                    var self = this;
                    var params = {
                        taskId: this.params.id
                    };
                    this.$http({
                        url: "/ifbp-bpm-service/task/assign-checking",
                        method: "get",
                        params: params
                    }).then(function(res) {
                        if (res.data.status) {
                            self.designateList = res.data.data.assignInfoItems;
                            self.designateList.forEach(function(item, index) {
                                self.$set(item, "participants_01", []);
                                item.participants_02 = [];
                            });
                        } else {

                        }
                    }).catch(() => {
                        // this.$message.error("去掉代理失败");
                    });
                },
                doClaim: function(item) {
                    var self = this;
                    var params = {
                        taskId: item.id
                    };
                    this.$http({
                        url: "/ifbp-bpm-service/task/claim",
                        method: "post",
                        params: params
                    }).then(function(res) {
                        if (res.data.status === 1) {
                            self.dialogVisible = false;
                            self.$message.success(res.data.msg);
                            self.getData();
                        } else {
                            self.$message.error(res.data.msg);
                        }
                    }).catch(function(res) {
                        self.$message.error(res.data.msg);
                    });
                },
                action: function() {
                    var self = this;
                    var designateListStr = "";
                    self.designateList.forEach(function(item, index) {
                        for (var i = 0; i < item.participants_01.length; i++) {
                            var itemId = item.participants_01[i];
                            item.participants_02.push({
                                id: itemId
                            });
                        }
                    });
                    if (!self.designateList.length > 0) {
                        designateListStr = "";
                    } else {
                        designateListStr = JSON.stringify(self.designateList);
                    }
                    self.$http({
                        method: 'post',
                        url: '/ifbp-bpm-service/approval/action',
                        data: {
                            taskId: self.taskId,
                            action: 'agree', // 传'reject'为驳回功能
                            comment: self.comment,
                            processInstanceId: this.params.processInstanceId,
                            processDefinitionId: this.params.processDefinitionId,
                            processKey: this.params.processKey,
                            businessKey: this.params.businessKey,
                            assignInfo: designateListStr,
                            activityId: this.params.activityId
                        }
                    }).then(function(res) {
                        if (res.data.status === 1) {
                            self.dialogVisible = false;
                            self.$message.success(res.data.msg);
                            self.getData();
                        } else {
                            self.$message.error(res.data.msg);
                        }
                    }).catch(function(res) {
                        self.$message.error(res.data.msg);
                    });
                },
                /**
                 * 查看详情跳转
                 * */
                jumpMoreInfo: function(item) {
                    var self = this;
                    self.$http({
                        method: 'get',
                        url: '/ifbp-bpm-service/task/queryFormCode?processKey=' + item.processKey + '&formKey=' + item.formKey
                    }).then(function(res) {
                        if (res.data.status === '1') {
                            var hash = res.data.url;
                            var urlStr = hash + encodeURIComponent(item.businessKey) +
                                '?processKey=' + encodeURIComponent(item.processKey) +
                                '&processInstanceId=' + encodeURIComponent(item.processInstanceId) +
                                '&processDefinitionId=' + encodeURIComponent(item.processDefinitionId) +
                                '&task_id=' + encodeURIComponent(item.id) +
                                '&activityId=' + encodeURIComponent(item.activityId) +
                                '&processDefinitionName=' + encodeURIComponent(item.processDefinitionName) +
                                '&processInstanceName' + encodeURIComponent(item.processInstanceName) +
                                '&stateFlage=' + encodeURIComponent(self.todoType) +
                                '&approveUrl=' + hash +
                                '&businessKey=' + encodeURIComponent(item.businessKey);
                            try {
                                window.top.vueInstance.$children[0].$router.push(urlStr);
                            } catch (e) {
                                window.parent.location.href = urlStr;
                            }
                        } else {
                            self.$message.error('出错了');
                        }
                    }).catch(function(res) {
                        // console.log(res);
                        self.$message.error('出错了');
                    });
                },
                jumpMore: function() {
                    window.location.hash = '/ifr/ifbp-bpm-service$flowTask-index.html';
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