define(['text!./index.html', 'jquery', 'css!./index.css'], function (template, $) {
    function init(el) {
      new Vue({
        el: '#' + el,
        template: template,
        data: function () {
          var check_condition = function (rule, value, callback) {
            if (!value) {
              return callback(new Error('不能为空'));
            } else {
              callback();
            }
          };
          return {
            loading: false,
            //show_:元素是否展示
            show_month_schedule: false,
            show_schedule_dialog: false,
            show_schedule: true,
            show_WM: true,
            week_or_month: "week",
            //日程弹窗字段：
            add_or_check_edit: "add",
            edit_schedule_index: 0,
            edit_or_check: true, //true: edit
            schedule_title: "",
            schedule: {
              title: "",
              date1: "",
              time1: "08:00",
              date2: "",
              time2: "08:00",
              all_day: "",
              repeat: "",
              repeat_data: {},
              position: "",
              attendee: [],
              notify: [],
              attendee_person_data: [],
              notify_person_data: [],
              attendee_select_data: [],
              notify_select_data: [],
              remark: "",
              notice: {
                styles: {},
                types: {}
              },
              notice_data: [],
              importance: "",
              importance_data: {}
            },
            notice_styles: {},
            notice_types: {},
            schedule_datas: [
              // {
              //     "title": "日程的标题显示在这里",
              //     "date1": "2017",
              //     "time1": "14:00",
              //     "date2": "2017",
              //     "time2": "15:00",
              //     "position": "位置信息",
              //     "remark": "日程的标题显示在这里日程的标题显示在这里日程的标题显示在这里日程的标题显示在这里日程的标题显示在这里日程的标题显示在这里"
              // },
              // {
              //     "title": "日程的标题显示在这里日程的标题显示在这里",
              //     "date1": "2017",
              //     "time1": "14:00",
              //     "date2": "2017",
              //     "time2": "15:00",
              //     "position": "位置信息"
              // }
            ],
            date1_options: {
              disabledDate: function (time) {
                return time.getTime() < Date.now() - 8.64e7;
              }
            },
            schedule_rules: {
              title: [{
                validator: check_condition,
                trigger: 'blur'
              }],
              date1: [{
                validator: check_condition,
                trigger: 'blur'
              }],
              time1: [{
                validator: check_condition,
                trigger: 'blur'
              }],
              date2: [{
                validator: check_condition,
                trigger: 'blur'
              }],
              time2: [{
                validator: check_condition,
                trigger: 'blur'
              }]
            },
            //默认展示字段
            current_date: "",
            updata_time: "5分钟",
            //逻辑字段
            active_week: true,
            active_month: false,
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            days: [],
            current_days: []
  
          }
        },
        created: function () {
          this.initData();
          let current_date = new Date();
          this.current_date = current_date.getFullYear() + '年' + (current_date.getMonth() + 1) + '月';
        },
        computed: {
          date2_options: function () {
            var ll = new Date(this.schedule.date1);
            return {
              disabledDate: function (time) {
                return time.getTime() < ll.getTime();
              }
            }
          }
        },
        methods: {
          getLabel: function (value, flag) {
            let obj = {};
            let data = [];
            if (flag == "attendee") {
              data = this.schedule.attendee_person_data;
              var attendee_select_data = [];
              for (let j = 0; j < value.length; j++) {
                for (let i = 0; i < data.length; i++) {
                  if (data[i]['user_id'] == value[j]) {
                    attendee_select_data.push(data[i]);
                  }
                }
              }
              this.schedule.attendee_select_data = attendee_select_data;
              let hash = {};
              this.schedule.attendee_select_data = this.schedule.attendee_select_data.reduce(function (item, next) {
                hash[next.user_id] ? '' : hash[next.user_id] = true && item.push(next);
                return item
              }, [])
            } else if (flag == "notify") {
              data = this.schedule.notify_person_data;
              var notify_select_data = [];
              for (let j = 0; j < value.length; j++) {
                for (let i = 0; i < data.length; i++) {
                  if (data[i]['user_id'] == value[j]) {
                    notify_select_data.push(data[i]);
                  }
                }
              }
              this.schedule.notify_select_data = notify_select_data;
              let hashs = {};
              this.schedule.notify_select_data = this.schedule.notify_select_data.reduce(function (item, next) {
                hashs[next.user_id] ? '' : hashs[next.user_id] = true && item.push(next);
                return item
              }, [])
            }
          },
          getLabelAttendee: function (value) {
            this.getLabel(value, 'attendee');
          },
          getLabelNotify: function (value) {
            this.getLabel(value, 'notify');
          },
          getPersonInfo: function (key_word, flag) {
            let vm = this;
            if (key_word != '') {
              let query_data = {
                "keyword": key_word
              }
              vm.$http({
                method: 'post',
                url: '/baseapp/calendar/schedule/queryuser',
                data: query_data
              }).then(function (res) {
                if (res.data.success) {
                  if (flag == "attendee") {
                    vm.schedule.attendee_person_data.unshift.apply(vm.schedule.attendee_person_data, res.data.data);
                    let hash = {};
                    vm.schedule.attendee_person_data = vm.schedule.attendee_person_data.reduce(function (item, next) {
                      hash[next.user_id] ? '' : hash[next.user_id] = true && item.push(next);
                      return item
                    }, [])
                    //   vm.schedule.attendee_person_data.reverse();
                  } else if (flag == "notify") {
                    vm.schedule.notify_person_data.unshift.apply(vm.schedule.notify_person_data, res.data.data);
                    let hash = {};
                    vm.schedule.notify_person_data = vm.schedule.notify_person_data.reduce(function (item, next) {
                      hash[next.user_id] ? '' : hash[next.user_id] = true && item.push(next);
                      return item
                    }, [])
                    //   vm.schedule.notify_person_data.reverse();
                  }
                } else {
                  vm.$message({
                    message: res.data.message,
                    type: 'warning'
                  });
                }
              }).catch(function (err) {
                // console.log(err);
              });
            }
          },
          getPersonInfoAttendee: function (key_word) {
            this.getPersonInfo(key_word, 'attendee');
          },
          getPersonInfoNotify: function (key_word) {
            this.getPersonInfo(key_word, 'notify');
          },
          deleteSchedule: function () {
            let vm = this;
            vm.$http({
              method: 'post',
              url: '/baseapp/calendar/schedule/delete',
              data: {
                "pk_schedule": this.schedule_datas[this.edit_schedule_index]["pk_schedule"]
              }
            }).then(function (res) {
              if (res.status == 200 && res.data.success) {
                vm.$message({
                  message: res.data.message,
                  type: 'success'
                });
                vm.show_schedule_dialog = false;
                vm.initCalendar();
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                });
              }
  
              // Object.assign(this.schedule, data);
            }).catch(function (err) {
            //   console.log(err);
            });
  
          },
          editSchedule: function () {
            //   Object.assign(this.schedule, this.schedule_datas[this.edit_schedule_index]);
            this.edit_or_check = true;
            this.add_or_check_edit = "edit";
            this.schedule_title = "编辑日程";
          },
          checkScheduleDetail: function (index) {
            let vm = this;
            vm.$http({
              method: 'post',
              url: '/baseapp/calendar/schedule/get',
              data: {
                "pk_schedule": this.schedule_datas[index]["pk_schedule"]
              }
            }).then(function (res) {
              if (res.status == 200 && res.data.success) {
                Object.assign(vm.schedule, res.data.data);
                var attendee = res.data.data.attendees;
                for (var i = 0; i < attendee.length; i++) {
                  attendee[i].user_id = attendee[i].beanMap.pk_users_ref[attendee[i].pk_users].code;
                  attendee[i].user_name = attendee[i].beanMap.pk_users_ref[attendee[i].pk_users].name;
                }
                vm.schedule.attendee_person_data = attendee.concat();
  
                var notify_persons = res.data.data.notify_persons;
                for (var j = 0; j < notify_persons.length; j++) {
                  notify_persons[j].user_id = notify_persons[j].beanMap.pk_users_ref[notify_persons[j].pk_users].code;
                  notify_persons[j].user_name = notify_persons[j].beanMap.pk_users_ref[notify_persons[j].pk_users].name;
                }
                vm.schedule.notify_person_data = notify_persons.concat();
  
  
                var schedule_attendee = [];
                for (var q = 0; q < attendee.length; q++) {
                  schedule_attendee.push(attendee[q].user_id);
                }
                vm.schedule.attendee = schedule_attendee;
                var schedule_notify = [];
                for (var r = 0; r < notify_persons.length; r++) {
                  schedule_notify.push(notify_persons[r].user_id);
                }
                vm.schedule.notify = schedule_notify;
  
                vm.schedule.attendee_select_data = attendee;
                vm.schedule.notify_select_data = notify_persons;
  
                vm.schedule.repeat = res.data.data.repeat_rule_type;
                vm.schedule.notice_data = res.data.data.scheduleremind;
                var start_date = new Date(res.data.data.begindate);
                vm.schedule.date1 = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
                var end_date = new Date(res.data.data.enddate);
                vm.schedule.date2 = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate();
                vm.edit_schedule_index = index;
                vm.edit_or_check = false;
                vm.show_schedule_dialog = true;
                vm.add_or_check_edit = "check";
                vm.schedule_title = "日程详情";
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                });
              }
              // Object.assign(this.schedule, data);
            }).catch(function (err) {
            //   console.log(err);
            });
          },
          addSchedule: function () {
            if (this.schedule.pk_schedule) {
              this.schedule.pk_schedule = "";
            }
            this.add_or_check = true;
            this.show_schedule_dialog = true;
            this.add_or_check_edit = "add";
            this.schedule_title = "添加日程";
            let current_date = new Date();
            this.schedule.date1 = current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate();
            this.schedule.date2 = current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate();
            this.schedule.repeat = 0;
            this.schedule.importance = 0;
          },
          closeScheduleDialog: function (formName, done) {
            if (this.add_or_check_edit == "add") {
              this.edit_or_check = true;
              this.cleanForm();
              this.show_schedule_dialog = false;
            } else if (this.add_or_check_edit == "edit") {
              this.show_schedule_dialog = true;
              this.edit_or_check = false;
              this.checkScheduleDetail(this.edit_schedule_index);
            } else if (this.add_or_check_edit == "check") {
              this.show_schedule_dialog = false;
              this.edit_or_check = true;
              this.cleanForm();
            }
            this.initCalendar();
          },
          cleanForm: function () {
            var current_date = new Date();
            this.schedule.title = "";
            this.schedule.date1 = current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate();
            this.schedule.time1 = "08:00";
            this.schedule.date2 = current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate();
            this.schedule.repeat = "0";
            this.schedule.position = "";
            this.schedule.attendee = [];
            this.schedule.notify = [];
            this.schedule.remark = "";
            this.schedule.notice_data = [];
            this.schedule.importance = "0";
          },
          saveSchedule: function (formName) {
            let vm = this;
            vm.$refs[formName].validate(function (valid) {
              if (valid) {
                for (var i = 0; i < vm.schedule.attendee_select_data.length; i++) {
                  if (vm.schedule.attendee_select_data[i].pk_users) {
                    vm.schedule.attendee_select_data[i]["pk_users"] = vm.schedule.attendee_select_data[i].pk_users;
                  } else {
                    vm.schedule.attendee_select_data[i]["pk_users"] = vm.schedule.attendee_select_data[i].user_id;
                  }
                }
                for (var j = 0; j < vm.schedule.notify_select_data.length; j++) {
                  if (vm.schedule.notify_select_data[j].pk_users) {
                    vm.schedule.notify_select_data[j]["pk_users"] = vm.schedule.notify_select_data[j].pk_users;
                  } else {
                    vm.schedule.notify_select_data[j]["pk_users"] = vm.schedule.notify_select_data[j].user_id;
                  }
                }
                let schedule_data = {
                  "attendee_select_data": vm.schedule.attendee_select_data,
                  "notify_select_data": vm.schedule.notify_select_data,
                  "start_date": new Date(vm.schedule.date1 + ' ' + vm.schedule.time1).getTime(),
                  "end_date": new Date(vm.schedule.date2 + ' ' + vm.schedule.time2).getTime(),
                  "repeat_rule_type": vm.schedule.repeat
                };
                Object.assign(schedule_data, vm.schedule);
                schedule_data.attendees = schedule_data.attendee_select_data;
                schedule_data.notify_persons = schedule_data.notify_select_data;
                vm.$http({
                  method: 'post',
                  url: '/baseapp/calendar/schedule/saveOrUpdate',
                  data: schedule_data
                }).then(function (res) {
                  if (res.data.success) {
                    vm.$message({
                      message: res.data.message,
                      type: 'success'
                    });
                  } else {
                    vm.$message({
                      message: res.data.message,
                      type: 'warning'
                    });
                  }
  
                  vm.edit_or_check = false;
                  vm.add_or_check_edit = "check";
                  vm.schedule_title = "日程详情";
                }).catch(function (err) {
                //   console.log(err);
                });
              } else {
                return false;
              }
            })
          },
          deteleNotice: function (index) {
            this.schedule.notice_data.splice(index, 1);
          },
          addNotice: function () {
            let notice = {
              "notice_style": "0",
              "notice_number": "10",
              "notice_type": "0"
            };
            this.schedule.notice_data.push(notice);
          },
          setDate2: function (value) {
            let date1 = new Date(this.schedule.date1);
            let date2 = new Date(this.schedule.date2);
            if (date2 < date1) {
              this.schedule.date2 = date1.getTime();
            }
          },
          initSchdule: function () {
            let vm = this;
            vm.$http({
              method: 'get',
              url: '/baseapp/calendar/schedule/getenumdata'
            }).then(function (res) {
              if (res.status == 200 && res.data.success) {
                vm.schedule.repeat_data = res.data.repeat_rule_type;
                vm.schedule.notice.styles = res.data.notice_style;
                vm.schedule.notice.types = res.data.notice_type;
                vm.schedule.importance_data = res.data.importance;
              }
              // Object.assign(this.schedule, data);
            }).catch(function (err) {
            //   console.log(err);
            });
          },
          goBackToday: function () {
            this.initCalendar();
          },
          changeMonth: function () {
  
          },
          changeWM: function (flag, el) {
            this.week_or_month = flag;
            var brother_nodes = el.target.parentNode.children;
            for (let i = 0; i < brother_nodes.length; i++) {
              brother_nodes[i].style.color = "#888"
            }
            el.target.style.color = "#333";
            if (flag == 'week') {
              this.active_week = true;
              this.show_WM = true;
              this.show_schedule = true;
              this.show_month_schedule = false;
            } else {
              this.active_week = false;
              this.show_WM = false;
              this.show_schedule = false;
            }
            this.initCalendar();
          },
          formatDate: function (year, month, day) {
            const y = year
            let m = month
            if (m < 10) m = '0' + m
            let d = day
            if (d < 10) d = '0' + d
            return y + '-' + m + '-' + d
          },
          initCalendar: function (cur) {
            let date = ''
            if (cur) {
              date = new Date(cur)
            } else {
              date = new Date()
            }
            this.currentDay = date.getDate() // 今日日期 几号
            // alert(this.currentDay);
            this.currentYear = date.getFullYear() // 当前年份
            this.currentMonth = date.getMonth() + 1 // 当前月份
            this.currentWeek = date.getDay() // 1...6,0  // 星期几
            // if (this.currentWeek === 0) {
            //     this.currentWeek = 7;
            // }
            const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay) // 今日日期 年-月-日
            this.days.length = 0
            // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
            /* eslint-disabled */
            for (let i = this.currentWeek; i >= 0; i -= 1) {
              const d = new Date(str);
              d.setDate(d.getDate() - i);
              this.days.push(d);
            }
            if (this.week_or_month == "week") {
              for (let i = 1; i <= 6 - this.currentWeek; i += 1) {
                const d = new Date(str);
                d.setDate(d.getDate() + i);
                this.days.push(d);
              }
            } else {
              for (let i = 1; i <= 41 - this.currentWeek; i += 1) {
                const d = new Date(str);
                d.setDate(d.getDate() + i);
                this.days.push(d);
              }
            }


            // 平台后端未开发 暂时使用 日后删除 --》开始
            var times = [];
            for(var h = 0; h < this.days.length; h++){
                var time_s = {
                    "time": this.days[h],
                    "schedules": []
                }
                times.push(time_s);
            }
// --》结束

            var data = {
              // "from": new Date(this.days[0].toLocaleDateString() + ' 00:00:00').getTime(),
              "from": this.days[0].getTime(),
              "to": this.days[this.days.length - 1].getTime()
            };

            // 平台后端未开发 暂时使用 日后删除 --》开始
            this.days = times;

// --》结束

            // 请求当前展示日期是否有日程
            let vm = this;
            vm.$http({
              method: 'post',
              url: '/baseapp/calendar/schedule/fromTo',
              data: data
            }).then(function (res) {
              if (res.status == 200 && res.data.status) {
                var schedule_data = res.data.data;
                var new_days = [];
                for (var i = 0; i < schedule_data.length; i++) {
                  for (var j = 0; j < vm.days.length; j++) {
                    if (schedule_data[i]["theDate"] == new Date(vm.days[j].toLocaleDateString() + ' 00:00:00').getTime()) {
                      var cur_data = {
                        "time": vm.days[j],
                        "schedules": schedule_data[i].schedules
                      }
                      new_days.push(cur_data);
                    }
                  }
                }
                vm.current_days = new_days;
                vm.updata_time = vm.$traceBackRender(res.data.ts);
              }
              vm.pick(new Date());
            }).catch(function (err) {
              console.log(err);
            });
          },
          pickPre: function () {
            let year = this.currentYear;
            let month = this.currentMonth;
            if (this.week_or_month == "week") {
              //上个星期
              const d = this.days[0]; // 如果当期日期是7号或者小于7号
              d.setDate(d.getDate() - 7);
              this.initCalendar(d);
            } else {
              //上个月
              var d = new Date(this.formatDate(year, month, 1));
              d.setDate(0);
              this.current_date = d.getFullYear() + '年' + (d.getMonth() + 1) + ' 月';
              this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            }
          },
          pickNext: function () {
            let year = this.currentYear;
            let month = this.currentMonth;
            if (this.week_or_month == "week") {
              //下个星期
              const d = this.days[6]; // 如果当期日期是7号或者小于7号
              d.setDate(d.getDate() + 7);
              this.initCalendar(d);
            } else {
              //下个月
              const d = new Date(this.formatDate(year, month, 1));
              d.setDate(42);
              this.current_date = d.getFullYear() + ' 年' + (d.getMonth() + 1) + ' 月';
              this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            }
          },
          // 当前选择日期
          pick: function (date, e) {
            if (e) {
              $(".day").removeClass('schedule-calendar-active');
              if (e.target.nodeName == "SPAN") {
                $(e.target).addClass('schedule-calendar-active');
                if (this.week_or_month == "month") {
                  this.show_month_schedule = true;
                  $("#month-schedule").css({
                    "top": e.pageY + 10,
                    "left": e.pageX + 10
                  });
                }
                if (date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() == new Date().getDate()) {}
              } else {
                this.show_month_schedule = false;
              }
            }
  
            for (var i = 0; i < this.current_days.length; i++) {
              if (this.current_days[i].time.toLocaleDateString() == date.toLocaleDateString()) {
                this.schedule_datas = this.current_days[i].schedules;
                //   for(var k = 0; k < this.schedule_datas.lenght; k++){
                //     this.schedule_datas["time"] = "";
                //     this.schedule_datas[k]["time"] = this.dealTime(this.schedule_datas[k].begindate) + ' - ' + this.dealTime(this.schedule_datas[k].enddate);
                //   }
                break;
              }
            }
          },
          dealTime: function (time) {
            var hours = new Date(time).getHours();
            var minutes = new Date(time).getMinutes();
            if (hours < 10) {
              hours = '0' + hours;
            };
            if (minutes < 10) {
              minutes = '0' + minutes;
            };
            return hours + ':' + minutes
          },
          Es6Assign: function () {
            if (!Object.assign) {
              Object.defineProperty(Object, "assign", {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function (target, firstSource) {
                  "use strict";
                  if (target === undefined || target === null)
                    throw new TypeError("Cannot convert first argument to object");
                  var to = Object(target);
                  for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) continue;
                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                      var nextKey = keysArray[nextIndex];
                      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                      if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                    }
                  }
                  return to;
                }
              });
            }
          },
          initData: function () {
            this.initCalendar();
            this.initSchdule();
            this.Es6Assign();
            var schedule_widths = $('.schedule');
            for(var i = 0; i < schedule_widths.length; i++){
                if($(schedule_widths[i]).width() <= 400){
                    $($('.schedule-today-btn')[i]).hide();
                    break;
                } else {
                    $('.schedule-today-btn').show();
                }
            }
            $(window).resize(function () {
                for(var i = 0; i < schedule_widths.length; i++){
                    if($(schedule_widths[i]).width() <= 400){
                        $($('.schedule-today-btn')[i]).hide();
                        break;
                    } else {
                        $('.schedule-today-btn').show();
                    }
                }
            });
          }
        }
      });
    }
  
    return {
      init: init
    }
  });
  