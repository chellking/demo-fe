<template>
	<div>
		<div style="height: 44px;margin-left:40px;font-size: 14px;line-height: 40px;">角色分配用户</div>
		<div style="display:flex;height: 100%;">
			<div style="height: 100%;float: left;margin-right: 16px;margin-left: 24px;">
				<div class="white-bg-color"  @mousewheel="mouseWheel" id="mouseWheel">
					<div class="handleSerach">
						
						<el-input placeholder="搜索角色名称" icon="search" style="width: 182px;margin-right: 8px;margin-bottom: 8px;float: left;" v-model="input1" @change="handleIconClickRole" :on-icon-click="handleIconClickRole">
						</el-input>
						<i class="ifbp-icon-filter" @click = "openRoleDialog"></i>
					</div>
					<li @click="showRolePersion(item,1)" :class="['roleClass',{is_active:activeRole == item.roleName}]" v-for="(item,index) in roleList">

						<div class="roleName">{{item.roleName}} </div>					
						<div class="roleCode" style="width: auto;min-width: 36px;">{{item.labelName}}</div>
						<div class="roleCode" style="width: auto;padding-left: 4px;">{{item.roleCode}} </div>
					</li>
					<div class="norole" v-if = "roleList.length == 0">
						没有找到<span style="font-weight: bolder;">{{input1}}</span>的相关内容
					</div>
				</div>
			</div>
			<div style="height: 100%;width: 100%;float: right;margin-right: 24px;">	
				<div class = "areasearch">					
					<el-button type="primary" @click="conUser"  style="margin-top: 16px;margin-left: 16px;">分配用户</el-button>
					<el-input placeholder="请输入用户名称或编码" icon="search" style="width: 224px;margin-right: 16px;margin-top: 16px;float: right;" v-model="input2" :on-icon-click="handleIconClick">
					</el-input>
				</div>
				<div class="permission-body">
					
					<div class="permission-title">
						已分配用户
					</div>
					
					<con-user :users = "userList" :showIconCut = true  @handleChange="deleteUser"></con-user>

					<div class="permission-icon" v-if="userList && userList.length == 0">
						<div class="permission-norole">

							<i class="ifbp-icon-patch" v-if="role"></i>
							<i class="ifbp-icon-person el-icon-pt-yonghu1" v-else></i>
							<span>{{ role ? "此角色尚未分配用户" : "请选择角色" }}</span>
						</div>
					</div>
					
				</div>
			</div>
		</div>		
		<el-dialog  :before-close="closeDialog" size="large" custom-class='permission-dialog' width="100%" title='分配用户' :visible.sync="dialogFormVisible">
			<div>
				<div class="permission-header">
					<el-input placeholder="请输入用户名称或编码" icon="search" style="width: 288px;float: right;" v-model="input2"  :on-icon-click="handleIconClickCon">
					</el-input>
				</div>
				<div>
					<span class="roleconremark">已分配用户</span>
					<con-user :users = "userList" :showIconCut = true @handleChange="removerUser"></con-user>
				</div>
				<div>
					<span class="roleconremark">未分配用户</span>
					<con-user :users = "userListUnchecked" @handleChange="addUser" :showIconAdd = true></con-user>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="saveRoleApp">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :before-close="closeRoleDialog" title='筛选角色' size="small" :visible.sync="dialogRole">
			<div>
				<span>类型:</span>
				<li :class="['rolelabel',{is_active:label==item.label}]" @click="fliterRoleByLabel(item)" v-for="(item,index) in roleLabelList">{{item.labelName}}</li>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeRoleDialog">取 消</el-button>
				<el-button type="primary" @click="filterRoleApp">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import conUser from "./conUser";
  import curl from "../../../assets/url.json";
  export default {
    components: {
		conUser
 	},
 	computed: {
 		roleLabelList(){
 			var list = [];
 			list.push({
 				label:'',
				labelName:'全部'
 			})
 			this.roleList.map(item=>{
 				if(item.label){
 					list.push({
 						label:item.label,
 						labelName:item.labelName
 					})
 				}
 			});			
 			const res = new Map();
			return list.filter((a) => !res.has(a.label) && res.set(a.label, 1))
 		}
 	},
    data(){
    	return{
    		input1:'',
    		input2:'',
    		roleList:[],
    		currentPage:1,
    		pageSize:10,
    		sorttype:'',
			role:null,
    		roleType:"",
    		userList:[],//已分配用户
    		userList_copy:[],//临时数组
    		userListUnchecked:[],//未分配用户
    		dialogFormVisible:false,
    		totalpage:1,
    		dialogRole:false,
    		label:"",
    		activeRole:""
    	}
    },
    methods:{
    	mouseWheel(){
			var rolebox = document.getElementById("mouseWheel");
			var scrollTop = rolebox.scrollTop;
			var scrollheight = rolebox.scrollHeight;
			var clientHeight = rolebox.clientHeight;
			//滚动条滚动到页面最底部加载分页
			if(scrollheight == scrollTop + clientHeight) {
				//避免向后台发送不必要的请求 加载到最后一页数据就不在发送请求
				if(this.totalpage > this.currentPage) {
					this.currentPage += 1;
					this.updateRoleList();
				}
			}
    	},
    	handleIconClickRole(){
    		this.currentPage = 1;
    		this.updateRoleList("filter");
    	},
    	handleIconClick(){
    		this.showRolePersion(this.role,1);
    	},
    	handleIconClickCon(){
    		this.showRolePersion(this.role,1);
    		this.showRolePersion(this.role,2);
    	},
    	updateRoleList(message){
            var url = curl.roleCon.searchRole+'?pn='+this.currentPage+'&ps='+this.pageSize+'&sortType=&search_LIKE_role_name='+this.input1+'&search_LIKE_role_code=&search_LIKE_label='+this.label
	        this.$http({
		        url: url,
		        method: "get",
		        dataType: "json"
	        }).then(res => {
	        	this.totalpage = res.data.data.totalPages
	        	if(message=="filter"){
	        		this.roleList = res.data.data.content
	        	}else{
	        		this.roleList = this.roleList.concat(res.data.data.content);
	        	}

	        })
    	},
	    showRolePersion(item,flag) {
		 var roleid = item.id;
		 var roleCode = item.roleCode;
		 this.role = item;	 
		 this.activeRole = item.roleName;
	     var url =  curl.roleCon.getUser + "?pn=1&ps=100&sortColumn=&flag="+flag+"&keyword="+this.input2+"&roleCode="+roleCode+"&roleId="+roleid;
	     this.$http({
	        url: url,
	        method: "get",
	        dataType: "json"
	     }).then(res => {	   
	     	if(flag == 1){
	     		this.userList = res.data.data.content;
     			this.userList_copy = this.userList.slice(0);
	     	}else{
	     		this.userListUnchecked = res.data.data.content;	
	     	}
         }).catch(() => {
	        this.$message({
	           message: "接口调用失败！",
	           type: "error"
	        });
         });
	    }, 
	    showPermission() {
	      var showPer = false;
	      this.userList.map((group, inx) => {
	        group.app.map((item, index) => {
	          if (item.checked) {
	            showPer = true;
	          }
	        });
	      });
	      return showPer;
	    },
	    
	    //打开dialog
	    conUser(){
	    	if(this.role){
	    		
				this.dialogFormVisible = true;
				this.input2 = "";
				this.showRolePersion(this.role,2)
			} else {
				this.$message({
					type: "success",
					message: "请选择角色!"
		        });
			}
	    },
	    
	    deleteUser(user,index){
	    	var list = [user.id];
	    		this.$confirm("你确定要取消该用户吗?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {				
			    	this.assignUserRole(list,2).then(res=>{
			    		if(res.data.status == 1){
			    			this.$message({
			    				type:"success",
			    				message:"操作成功!"
			    			})
			    			this.showRolePersion(this.role, 1);
			    		}
			    	}).catch(e=>{
			    		
			    	})
				}).catch(e=>{
					this.$message({
	    				type:"info",
	    				message:"已取消!"
	    			})
				})
	    },
	    removerUser(user,index){	    	
	    	this.userList.splice(index,1);
	    	this.userListUnchecked.push(user);
	    },
	    addUser(user,index){	    	
	    	this.userListUnchecked.splice(index,1);
	    	this.userList.push(user);
	    },
	    saveRoleApp(){
	    	//通过比较userList和userList_copy 判断少了哪个 多了哪个
	        var addList = [];
	        var cutList = [];
	        var repeatedList = [];
	        this.userList_copy.map((user, index) => {
	        	this.userList.map((item) => {
	        		if(user.id == item.id) {
	        			repeatedList.push(item)
	        		}
	        	})
	        });

	        this.userList.map((item) => {
	        	var flag = false;
	        	repeatedList.map((user, index) => {
	        		if(item.id == user.id) {
	        			flag = true;
	        		}
	        	});
	        	!flag ? addList.push(item.id) : "";
	        })

	        this.userList_copy.map((item) => {
    			var flag = false;
    			repeatedList.map((user, index) => {
    				if(item.id == user.id) {
    					flag = true;
    				}
    			});
    			!flag ? cutList.push(item.id) :"";
    		})           	 
	    	this.$http.all([ this.assignUserRole(cutList,2),this.assignUserRole(addList,1)])
	    	.then(this.$http.spread((res, response) => {
	    		if(res.data.status == 1 || response.data.status == 1){
	    			this.$message({
	    				type:"success",
	    				message:"操作成功!"
	    			})
	    			this.showRolePersion(this.role, 1);					 
	    		}else{
    				this.$message({
	    				type:"error",
	    				message:"操作失败!"
	    			})
	    		}
	    		this.dialogFormVisible = false;
	    		this.input2 = "";
	    	})).catch(e=>{
	    		console.log(e);
	    	})
	    },
	    closeDialog(){
			this.showRolePersion(this.role, 1);
			this.dialogFormVisible = false;
			this.input2 = "";
	    },
	    assignUserRole(list,flag){
	    	
	    	var data = {
	    		roleCode:this.role.roleCode,
	    		roleId:this.role.id,
	    		userIds:list,
	    		flag:flag
	    	}
    	    var assignUser = this.$http({
		        url: curl.roleCon.assignUserRole,
		        method: "post",
		        data: data,
		        dataType: "json"
	        })
    	    return assignUser;

	    },
	    openRoleDialog(){
	    	this.dialogRole = true;
	    },
	    fliterRoleByLabel(item){
	    	this.label = item.label;
	    },
	    closeRoleDialog(){
	    	this.dialogRole = false;
	    	this.label = "";
	    },
	    filterRoleApp(){
	    	this.currentPage = 1;
	    	this.updateRoleList("filter");
	    	this.dialogRole = false;
	    	this.label = "";
	    }
    },
    created(){
    	this.updateRoleList();
    }
  }  
</script>

<style>
.white-bg-color {
  background: #fff;
  height: 100%;
  overflow: auto;
}

.roleClass {
  list-style-type: none;
  height: 48px;
}

.white-bg-color li:hover{
  cursor: pointer;
  background: #eaf9ff;
}
.white-bg-color li:hover .roleName,.white-bg-color li:hover .roleCode,li.roleClass.is_active .roleName,li.roleClass.is_active .roleCode{
  color: #5cb0e6 !important;
}
li.roleClass.is_active{
  cursor: pointer;
  background: #eaf9ff;
}
.roleName {
  font-size: 14px;
  color: #2d2d2d;
  padding-left: 16px;
  padding-top: 4px;
}
.roleCode {
  display: inline-block;
  font-size: 12px;
  color: #75787b;
  padding-left: 16px;
  padding-bottom: 8px;
}

.role-header {
  height: 64px;
  line-height: 64px;
  background: #fff;
}

.role-header button {
  margin-left: 16px;
}

.permission-body {
  background: #fff;
  height: calc(100% - 80px);
  margin-top: 15px;
  overflow: auto;
}

.permission-title {
  font-size: 16px;
  color: #2d2d2d;
  padding: 16px;
  font-weight: bolder;
}

.permission-norole {
  text-align: center;
  padding-top: 100px;
}

.permission-norole i {
  color: #c8c8cd;
  font-size: 96px;
}

.permission-norole span {
  font-size: 20px;
  margin-top: 32px;
  color: #333333;
  display: block;
}

.permission-header {
  height: 60px;
}

.persion-groupName {
  font-size: 16px;
  color: #2d2d2d;
  display: block;
  margin: 8px 0 8px 16px;
}

.handleSerach {
  width: 232px;
  padding-left: 8px;
  padding-top: 16px;
}
.handleSerach .ifbp-icon-filter{
    margin-top: 6px;
    padding-bottom: 20px;
    margin-left: 8px;
}

.permission-dialog .el-dialog__body {
  max-height: 480px !important;
}
.norole {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: #151515;
}
.areasearch{
	height: 64px;
	background: #FFFFFF;
}



.permission-body {
  background: #fff;
  height: calc(100% - 80px);
  margin-top: 15px;
  overflow: auto;
}
li.rolelabel {
    list-style: none;
    font-size: 14px;
    color: #2D2D2D;
    display: inline-block;
    padding: 5px 8px;
    margin-left: 16px;
}
li.rolelabel:hover{
	background: #5CB0E6;
	color: #FFFFFF;
	cursor: pointer;
}
li.is_active{
	background: #5CB0E6;
	color: #FFFFFF;
}
.roleconremark{
    margin-left: 16px;
    font-size: 14px;
    font-weight: 600;
}


</style>