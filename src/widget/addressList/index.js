define(['text!./addressList.html', 'css!./addressList.css', 'css!../common/common.css'], function(template) {
  function init(el) {
    new Vue({
      el: '#' + el,
      template: template,
      data: function() {
        return {
          // 搜索框内容
          filterStr: null,
          // 用户或部门列表
          filterResult: null,
          // 用户信息
          currentUser: null,
          // 部门员工列表
          departmentUsers: null,
          // 是否显示部门leader
          showLeader: true,
          // 无结果
          noResult: false,
          // local vars
          _requestTimer: null
        }
      },
      methods: {
        getFilterResult: function() {
          if (this._requestTimer) {
            clearTimeout(this._requestTimer);
            this._requestTimer = null;
          }
          // console.log(this.filterStr);
          var filterStr = this.filterStr;
          var vm = this;
          // 重置搜索结果状态
          this.resetSearchStatus();
          if (!filterStr) {
            return;
          }
          /**
           * mock
           */
          // var resData = {};
          // resData.data = mockData.filterResult;

          this.$http({
            url: '/ifbp-app-bd/bd/psn/psndoc/addressList',
            noLoading: true,
            method: 'post',
            data: {
              'keyword': filterStr
            }
          }).then(function(res) {
            var resData = res.data;
            vm.noResult = true;
            if (!resData || !resData.success) {
              vm.$message({
                message: resData && resData.error && resData.error.errorMessage || '信息获取失败',
                type: 'error'
              });
              return;
            }
            var filterResult = [];
            var resLists = resData.data;
            var psndocArr = resLists.psndoc;
            var deptArr = resLists.dept;
            if (Array.isArray(psndocArr) && psndocArr.length) {
              for (var i = 0; i < psndocArr.length; i++) {
                var psndoc = psndocArr[i];
                psndoc.fe_type = 'psndoc';
                psndoc.fe_avatar = psndoc.avatar || '';
                psndoc.fe_title = psndoc.name;
                var deptName = '';
                if (psndoc.dept_name) {
                  deptName = psndoc.dept_name;
                } else if (psndoc.pk_dept && psndoc.beanMap && psndoc.beanMap.pk_dept_ref) {
                  var beanMapRef = psndoc.beanMap.pk_dept_ref[psndoc.pk_dept];
                  deptName = beanMapRef && beanMapRef.name;
                }
                psndoc.fe_subtitle = deptName || '';
                psndoc.fe_content = psndoc.mobile;
                filterResult.push(psndoc);
              }
            }
            if (Array.isArray(deptArr) && deptArr.length) {
              for (var i = 0; i < deptArr.length; i++) {
                var dept = deptArr[i];
                dept.fe_type = 'dept';
                dept.id = dept.deptId;
                dept.fe_avatar = dept.principalAvatar || '';
                dept.fe_title = dept.deptName;
                dept.fe_subtitle = dept.psnNum;
                dept.fe_content = dept.principalName || '';
                filterResult.push(dept);
              }
            }
            if (Array.isArray(filterResult) && filterResult.length) {
              vm.noResult = false;
              vm.filterResult = filterResult;
            }
          }).catch(function(err) {
            vm.noResult = true;
            vm.$message({
              message: err,
              type: 'error'
            });
          });
        },
        // 重置搜索状态
        resetSearchStatus: function() {
          this.noResult = false;
          this.filterResult = null;
          this.currentUser = null;
          this.departmentUsers = null;
        },
        // 搜索结果列表项点击事件
        filterResultClicked: function(item) {
          switch (item.fe_type) {
            case 'psndoc':
              this.getUserInfo(item.id);
              break;
            case 'dept':
              this.getDepartmentInfo(item.id);
              break;
            default:
              break;
          }
        },
        // 获取用户信息
        getUserInfo: function(id) {
          // console.log('getUserInfo: ', id);
          if (!id) {
            return;
          }
          var vm = this;
          // 重置搜索结果状态
          this.resetSearchStatus();

          /**
           * mock
           */
          // var resData = {};
          // resData.data = mockData.userInfo;
          this.$http({
            url: '/ifbp-app-bd/bd/psn/psndoc/address/jobInfor?id=' + id,
            noLoading: true,
            method: 'get'
          }).then(function(res) {
            var resData = res.data;
            vm.noResult = true;
            if (!resData || !resData.success) {
              vm.$message({
                message: resData && resData.error && resData.error.errorMessage || '员工信息获取失败',
                type: 'error'
              });
              return;
            }
            // 员工的基本信息
            var resUserInfo = resData.data;
            var psndoc = resUserInfo.psndoc;
            var psnjob = resUserInfo.psnjob;
            var userInfo = {
              id: psndoc.id,
              avatar: psndoc.avatar || '',
              name: psndoc.name,
              mobile: psndoc.mobile,
              email: psndoc.email,
              jobname: psnjob && psnjob.jobname || '',
              psncode: psnjob && psnjob.psncode,
              corpName: resUserInfo.corpName || '',
              corpId: resUserInfo.corpId,
              deptName: resUserInfo.deptName || '',
              deptId: resUserInfo.deptId,
              bossName: resUserInfo.bossName,
              bossId: resUserInfo.bossId,
              subordinate: resUserInfo.subordinate,
            };
            vm.currentUser = userInfo;
          }).catch(function(err) {
            vm.noResult = true;
            vm.$message({
              message: err,
              type: 'error'
            });
          });
        },
        /**
         * 获取部门人员列表
         * @param id 部门id
         * @param filterUserId 是否从列表中滤除制定id用户
         */
        getDepartmentInfo: function(id, filterUserId) {
          // console.log('getDepartmentInfo: ', id);
          if (filterUserId) {
            this.showLeader = false;
          }
          // console.log('showLeader: ', this.showLeader);
          var vm = this;
          /**
           * mock
           */
          // var resData = {};
          // resData.data = mockData.departmentInfo;
          this.$http({
            url: '/ifbp-app-bd/bd/org/dept/addressList?deptId=' + id,
            noLoading: true,
            method: 'get'
          }).then(function(res) {
            var resData = res.data;
            vm.noResult = true;
            if (!resData || !resData.success) {
              vm.$message({
                message: resData && resData.error && resData.error.errorMessage || '部门信息获取失败',
                type: 'error'
              });
              return;
            }
            var resDepartmentInfo = resData.data;
            if (!resDepartmentInfo) {
              vm.$message.error('未获取到部门信息');
              return;
            }
            var deptUsers = resDepartmentInfo.psndocList;
            if (!Array.isArray(deptUsers) || !deptUsers.length) {
              vm.$message.error('未获取到该部门人员列表');
            }
            var deptUsersArr = [];
            for (var i = 0; i < deptUsers.length; i++) {
              var user = deptUsers[i];
              if (filterUserId && user.id === filterUserId) {
                continue;
              }
              deptUsersArr.push(user);
            }
            vm.departmentUsers = deptUsersArr;
          }).catch(function(err) {
            vm.noResult = true;
            vm.$message({
              message: err,
              type: 'error'
            });
          });
        },
        // 搜索框值变化
        filterStrChange: function() {
          if (this._requestTimer) {
            clearTimeout(this._requestTimer);
          }
          var vm = this;
          this._requestTimer = setTimeout(function() {
            vm._requestTimer = null;
            vm.getFilterResult();
          }, 1000);
        },
        backBtnClicked: function() {
          this.departmentUsers = null;
          this.showLeader = true;
        }
      },
      mounted: function() {
        
      },
      created: function() {

      }
    })
  }
  return {
    init: init
  }
})