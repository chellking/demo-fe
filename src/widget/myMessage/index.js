define(['text!./index.html', 'jquery', 'css!./index.css'], function(template, $) {
    function init(el) {
        new Vue({
            el: '#' + el,
            template: template,
            data: function() {
                return {
                    infoType: [{
                            "name": "全部",
                            "number": 0
                        },
                        {
                            "name": "审批",
                            "number": 0
                        },
                        {
                            "name": "预警",
                            "number": 0
                        }
                    ],
                    messageListValue: [],
                    noticeNumber: 0,
                    warningNumber: 0,
                    day: '',
                    type: '',
                    size: 4,
                    total: 0
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
                getDatas: function(pn, ps) {
                    var that = this;
                    that.arr = [];
                    var data;
                    if (pn === undefined) {
                        data = {
                            "title_creator": "",
                            "timePeriod": that.day,
                            "type": that.type,
                            "messageType": "",
                            "pn": 1,
                            "ps": 10
                        }
                    } else {
                        data = {
                            "title_creator": "",
                            "timePeriod": that.day,
                            "type": that.type,
                            "messageType": "",
                            "pn": pn,
                            "ps": ps
                        }
                    }
                    that.$http({
                        url: '/ifbp-app-sm/sm/messageCenter/pageList',
                        method: 'post',
                        // data: JSON.stringify(data)
                        data: data
                    }).then(function(res) {
                        that.showtable = true;
                        if (res.data.success) {
                            var data = JSON.parse(JSON.stringify(res.data.data.content));
                            data.forEach(function(v) {
                                if (v.creataor_name === 'null') {
                                    v.creataor_name = '系统';
                                }
                                // v.send_time = new Date(v.send_time).toLocaleString();
                                v.send_time = that.$traceBackRender(v.send_time);
                            });
                            that.messageListValue = data;
                            if (data.length < 4) {
                                that.size = that.messageListValue.length;
                            } else {
                                that.size = 4;
                            }
                        } else {
                            that.$message({
                                message: res.data.error.errorMessage,
                                type: 'error'
                            });
                        }
                    });
                    that.getMessageCount();
                },
                getMessageCount: function() {
                    var that = this;
                    var url = '/ifbp-app-sm/sm/messageCenter/queryNum';
                    that.$http({
                        url: url,
                        noLoading: true,
                        method: 'get'
                    }).then(function(res) {
                        if (res.data.success === true) {
                            that.total = res.data.data.spcount + res.data.data.yjcount;
                            that.infoType[0]["number"] = res.data.data.spcount + res.data.data.yjcount;
                            that.infoType[1]["number"] = res.data.data.spcount;
                            that.infoType[2]["number"] = res.data.data.yjcount;
                        }
                    }).catch(function(e) {

                    });
                },
                getMessageData: function(item, index) {
                    if (item.name == "全部") {
                        this.type = "";
                    } else {
                        this.type = item.name;
                    }
                    this.getDatas();
                    var span = document.querySelectorAll('.my-message>span');
                    $('.my-message span').removeClass('active');
                    $(span[index]).addClass('active')
                },
                /**
                 * 查看详情跳转
                 * */
                // jumpMoreInfo: function(item) {
                //     window.top.vueInstance.$children[0].$router.push({ name: 'messageCenter' });
                // },
                jumpMore: function() {
                    var messageCenter = {
                        path: '/messageCenter',
                        label: '消息中心',
                        appIcon: 'el-icon-pt-daohang-xiaoxi',
                        code :'messageCenter'
                      };
                      window.top.vueInstance.$children[0].addEditableTabs("/messageCenter",messageCenter)
                }
            },
            created: function() {
                this.getDatas();
            },
            mounted: function() {
                if (this.type == "") {
                    var span = document.querySelectorAll('.my-message span');
                    $('.my-message span').removeClass('active');
                    $(span[0]).addClass('active')
                }
            }
        })
    }

    return {
        init: init
    }
});