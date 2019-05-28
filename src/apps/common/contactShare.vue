<template>
  <div id="shareList" class="list-panel">
      <el-button  type="primary" @click="share" v-if="isShare">分享</el-button>
      <div>
          <el-dialog v-model="dialogFormVisible" id="shareDialog" :before-close="handleClose">
            <div style="background: #fff;overflow:hidden;" v-show="!isHidden">
                  <div style="float: left;">
                      <div style="margin-bottom: 10px">
                          <span>数据已分享给下列人员：</span>
                          <el-button type="primary" @click="addShare">新增</el-button>
                          <el-button type="primary" @click="clearShare">清除所有分享</el-button>
                      </div>
                        <div style="height: 300px; width: 405px; overflow-x: hidden;">
                          <el-table
                            :data="shareList"
                            border
                            style="width: 100%">
                              <el-table-column
                                label="共享者"
                                prop="userName">
                              </el-table-column>
                              <el-table-column
                                label="权限"
                                prop="jurisdiction">
                              </el-table-column>
                              <el-table-column label="操作">
                                <template scope="scope">
                                  <el-tooltip class="item" 
                                              effect="dark" 
                                              placement="top-start" 
                                              :content="删除">
                                    <i class="el-icon-delete" type="primary" @click="deleteRow(scope.row)" v-show="shareList.length>0 && scope.row.userId!==owner"></i>
                                    <div>{{scope.row}}</div>
                                  </el-tooltip>
                                </template>
                              </el-table-column>
                          </el-table>
                    </div>
                  </div>
                  <div class="shareInfo">
                      <div>
                        <h5>——权限——</h5>
                        <strong>
                          所有者:
                        </strong>
                        <p>
                          数据的创建者,具有对数据的查看、新增、删除权限
                        </p>
                        <strong>
                          查看:
                        </strong>
                        <p>
                          具有对数据的查看权限
                        </p>
                        <strong>
                          修改:
                        </strong>
                        <p>
                          具有对数据的维护权限
                        </p>
                      </div>
                      <div>
                        <h5>——操作——</h5>
                        <strong>
                          清除所有分享:
                        </strong>
                        <p>
                          只保留所有者访问权限,删除其他用户的共享权限
                        </p>
                      </div>
                  </div>
                 <!--  <div style="float: right;">
                    <el-button @click="cancelFirst">取 消</el-button>
                    <el-button type="primary" @click="confirmFirst">确 定</el-button>
                  </div> -->
            </div>
            <div v-show="isHidden">
                  <div id="shareInput">
                    <el-input
                      class="share"
                      placeholder="请输入用户名称或编码"
                      icon="search"
                      v-model="searchInput"
                      :on-icon-click="handleIconClick">
                    </el-input>
                  </div>
                  <el-table
                    ref="multipleTable"
                    :data="userList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column
                      prop="user_name"
                      label="用户"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="user_code"
                      label="编码"
                      show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                   <el-pagination
                    id="staff-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
                  </el-pagination>
                  <div style="clear: both;"></div>
                  <div>
                    <el-button @click="cancelSecond">取 消</el-button>
                    <el-button type="primary" @click="confirmSecond">确 定</el-button>
                  </div>
            </div> 
          </el-dialog>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      owner:'',
      pkBusi:'',
      userIds:[],
      isHidden:false,
      currentPage: 1,
      size: 10,
      totalElements: 0,
      searchInput: '',
      userList: [],
      multipleSelection: [],
      shareList:[],
      isShare:false,
      dialogFormVisible: false
    };
  },
  props:['transferData'],
  methods: {
    handleClose(done) {
      var vm= this;
      this.$confirm('确认关闭？')
        .then(_ => {
          vm.isHidden=false;
          done();
        })
        .catch(_ => {});
    },
    sendHidden(msg){
      this.$emit('isHidd',msg);
    },
    deleteRow(row){
      var vm=this;
      var params = {
        "entityCode": "lxr",
        "pkBusi": this.pkBusi,
        "userId":row.userId
      }
      this.$http({
        url: '/ifbp-app-sm/share/bdsharerelate/deleteOneShareData',
        method: 'get',
        params: params
      }).then((res) => {
        if(res.data.success){
          vm.$message({
            type: 'success',
            message: '删除成功!'
          });
          vm.getShareList(vm.pkBusi,vm.owner);
        }
      }).catch(() => {
        this.$message.error('请求出错');
      });
    },
    isHiddenShare(owner){
        var vm=this;
        var params = {
          "entityCode": "lxr",
          "owner": owner
        }
        this.$http({
          url: '/ifbp-app-sm/share/bdshareconfig/getShareStateByBusiEntityCode',
          method: 'get',
          params: params
        }).then((res) => {
          if(res.data.success){
            var obj = res.data.data;
            if(obj.shreastate==1){
              vm.isShare=true;
              // vm.sendHidden(obj.currUser);
            }else{
              vm.isShare=false;
              // vm.sendHidden(obj.currUser);
            }
          }
        }).catch(() => {
          this.$message.error('请求出错');
        });
    },
    getShareList(pkBusi,owner){
      var vm=this;
      var params = {
        "entityCode": "lxr",
        "pkBusi": pkBusi,
        "owner": owner
      }
      this.$http({
        url: '/ifbp-app-sm/share/bdsharerelate/findAllRelateUsers',
        method: 'get',
        params: params
      }).then((res) => {
        // debugger;
        vm.shareList=res.data.data;
        vm.shareList.forEach(function(item,index){
          if(index==0){
            item.jurisdiction="所有者";
          }else{
            item.jurisdiction="查看、修改";
          }
        })
      }).catch(() => {
        this.$message.error('请求出错');
      });
    },
    insertShare(pkBusi){
        var vm=this;
        var params = {
          "entityCode": "lxr",
          "userIds":this.userIds.join(",")+',',
          "pkBusi":pkBusi,
          "operationType":'1'
        }
        this.$http({
          url: '/ifbp-app-sm/share/bdsharerelate/shareData',
          method: 'get',
          params: params
        }).then((res) => {
          if(res.data.success){
            vm.$message({
              type: 'success',
              message: '新增成功!'
            });
            vm.getShareList(vm.pkBusi,vm.owner);
          }
        }).catch(() => {
          this.$message.error('请求出错');
        });
    },
    addShare(){
      this.request();
      this.isHidden=true;
    },
    clearShare(){
      var vm=this;
      var params = {
        "entityCode": "lxr",
        "pkBusi": this.pkBusi,
        "owner": this.owner
      }
      this.$http({
        url: '/ifbp-app-sm/share/bdsharerelate/deleteAllShareData',
        method: 'get',
        params: params
      }).then((res) => {
        if(res.data.success){
          vm.$message({
            type: 'success',
            message: '清除成功!'
            });
          vm.getShareList(vm.pkBusi,vm.owner);
        }
      }).catch(() => {
        this.$message.error('清除失败');
      });
    },
    request(n, s) {
        var url;
        if(n===undefined){
          url = '/wbalone/userMGT/pagingListByRole?pn=1&ps=10&keyword='+this.searchInput;
        } else {
          url = '/wbalone/userMGT/pagingListByRole?pn='+ n +'&ps=' + s + '&keyword='+this.searchInput;
        }
        this.$http({
          url: url,
          method: 'get',
          dataType: 'json'
        }).then((res) => {
          if(res.data.status === 1){
            this.totalElements = res.data.data.totalElements ;       // 总条数
            this.size = res.data.data.size;                          // 每页的条数
            this.userList=res.data.data.content;
          }
        }).catch(() => {
          this.$message({
            message: '列表获取失败',
            type: 'error'
          });
        });
      },
    handleSizeChange(val) {
        this.request(1, val);
     },
    handleCurrentChange(val) {
      this.request(val, this.size);
    },
    handleIconClick() {
      this.request();
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    share(){
      this.dialogFormVisible=true;
    },
    cancelFirst(){
      this.dialogFormVisible=false;
    },
    confirmFirst(){
      this.dialogFormVisible=false;
    },
    cancelSecond(){
      this.isHidden=false;
      this.searchInput='';
    },
    confirmSecond(){
      this.userIds=[];
      var vm=this;
      this.isHidden=false;
      this.searchInput='';
      this.shareList.forEach(function(item_1,index_1){
        vm.multipleSelection.forEach(function(item,index){
          if(item_1.userName!=item.user_name){
            item.jurisdiction="查看、修改";
            item.userName=item.user_name;
            item.userId=item.id;
            vm.shareList.push(item);
          }
        })
      })
      this.shareList.forEach(function(item,index){
        vm.userIds.push(item.userId);
      });
      this.userIds=[...(new Set(this.userIds))];
      this.insertShare(this.pkBusi);
    },
     // 请求值数据
    require() {
      var vm=this;
      const url = '/ifbp-app-bd/bd/customer/personal/' + this.transferData;
      const self = this;
      return this.$http({
        url: url,
        method: 'GET',
      }).then((res) => {
        if(res.data.data){
          vm.owner=res.data.data.owner||'';
          vm.pkBusi=res.data.data.id||'';
          vm.isHiddenShare(vm.owner);
          vm.getShareList(vm.pkBusi,vm.owner);
        }else{

        }
      });
    },
  },
  created() {
    this.require();
  }
};
</script>
<style>
  #shareList #shareInput input.el-input__inner{
    height: 36px!important;
  }
</style>
<style scoped>
  .shareInfo{
    float: left;
    margin-left: 5px;
    height: 332px;
    width: 210px;
    padding: 10px;
  }
  .shareInfo h5{
    text-align: center;
    margin-bottom: 10px;
  }
</style>

  
