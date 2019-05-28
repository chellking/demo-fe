<template>
  <div>
    <div v-if="isSponsor && this.showBtnOfSpzt" class="flow-button-style" id="initiateFlow">
      <!-- 客户管理提交按钮 -->
      <el-button type="primary" @click="initiateProcess" class="flow-button-submit">提交</el-button>    
    </div>
    <!-- 流程部分 -->
    <div v-if="params.processKey" class="list-panel1">
      <!-- 流程步骤 -->
        <div class="step fl">
          <div style="position: relative;">
            <el-steps :space="286" :active="3">
              <!-- 第一步 -->
              <el-step v-if='listData.length > 0' class="first-step">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="firstStep" placement="top">
                        <span>[{{listData[0].activeName}}]{{listData[0].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[0].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="normal" :content="listData[0].deleteReason" placement="top">
                      <p class="titleAction" @click="showList">{{listData[0].deleteReason}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-more" style="cursor: pointer;" @click="showList"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤(非同意) -->
              <el-step v-if='isNext && listData.length > 0 && !isEnd && listData[listData.length-1].deleteReason != "同意"' class="second-step">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].message" 
                      :disabled="listData[listData.length-1].message ? false : true"
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}}：{{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-edit"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤(同意) -->
              <el-step v-if='isNext && listData.length > 0 && !isEnd && listData[listData.length-1].deleteReason == "同意"' class="second-step-agree">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].message" 
                      :disabled="listData[listData.length-1].message ? false : true"
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}}：{{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>
              

               <!-- 审批结束的第二步骤(同意) -->
              <el-step 
                v-if='isNext && listData.length > 0 && isEnd && listData[listData.length-2].deleteReason == "同意"'
                class="agree-status second-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStepAgree" placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip  
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-2].message"
                      :disabled="listData[listData.length-2].message ? false : true" 
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-2].deleteReason}} {{listData[listData.length-2].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>

               <!-- 审批结束的第二步骤(不同意，拒绝，驳回) -->
              <el-step 
                v-if='isNext && listData.length > 0 && isEnd && (listData[listData.length-2].deleteReason == "拒绝" || listData[listData.length-2].deleteReason == "不同意" || listData[listData.length-2].deleteReason == "驳回")'
                class="refuse-status refuse-second-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStepAgree" placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip  
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-2].message"
                      :disabled="listData[listData.length-2].message ? false : true" 
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-2].deleteReason}} {{listData[listData.length-2].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-close"></div>
                  </div>
              </el-step>

               <!-- 没审批结束最后一步 -->
              <el-step v-if='!isEnd' class="end-false">
                  <div slot="description">
                    <el-tooltip class="item" effect="normal" :content="waitApproves.join()" placement="top">
                      <p class="waitAction">
                        <a>待：</a>
                        <span>{{waitApproves.join()}}</span>
                        <a>处理</a>
                      </p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-edit"></div>
                  </div>
              </el-step>

               <!-- 审批结束最后一步(同意) -->
              <el-step 
                v-if='isEnd && listData.length > 0 && listData[listData.length-1].deleteReason == "同意"'
                class="agree-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].message"
                      :disabled="listData[listData.length-1].message ? false : true" 
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}} {{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-check"></div>
                  </div>
              </el-step>

              <!-- 审批结束最后一步(拒绝，不同意，驳回) -->
              <el-step 
                v-if='isEnd && listData.length > 0 && (listData[listData.length-1].deleteReason == "拒绝" || listData[listData.length-1].deleteReason == "不同意" || listData[listData.length-1].deleteReason == "驳回")'
                class="refuse-status">
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="normal" :content="secondStep" placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip 
                      class="item" 
                      effect="normal" 
                      :content="listData[listData.length-1].message"
                      :disabled="listData[listData.length-1].message ? false : true" 
                      placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}} {{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber ifbp-icon-close"></div>
                  </div>
              </el-step>

            </el-steps>
          </div>
        </div>  
      <!-- 按钮 -->
      <div class="fl" v-if="this.showBtn != false || this.showBtn == undefined" style="margin-top:36px;margin-left:2px;">
        <!-- 待办任务不能有撤回按钮 -->
        <ul class="btnLists" v-if="this.params.stateFlage != 'his' && !isEnd && isAgree">
          <li v-for="item in consentBtn" :key="item.key">
            <el-button v-if="item.key!='assignAble'" type="primary" @click="clickButton(item.key)">{{item.value}}</el-button>
          </li>
          <li v-for="item in defaultBtn" :key="item.key">
            <el-button v-if="item.key!='assignAble'" @click="clickButton(item.key)">{{item.value}}</el-button>
          </li>
          <li class="more-btn">
            <el-dropdown menu-align="start">
              <el-button class="ifbp-icon-more btn-more">
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in hiddenBtn" :key="item.key" @click.native="clickButton(item.key)">{{item.value}}</el-dropdown-item>
                <el-dropdown-item @click.native="checkFlow">查看流程图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>

        <!-- 会签任务,待认领,已办(全部流程结束或者下一个环节处理完),抄送的任务只显示查看流程图按钮 -->
        <ul v-else-if="this.params.stateFlage == 'copyFor' ||
                      this.params.stateFlage == 'claim' ||
                      (this.params.stateFlage == 'his' && (this.endActivityId || (!this.endActivityId && this.beenProcessed ))) ||
                      (this.params.stateFlage == 'todo' && ((this.endActivityId && (this.action == 'refuse' || this.action == 'reject')) || (!this.endActivityId && this.beenProcessed )))" 
            style="height: 85px">
          <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
        </ul>

        <ul v-else style="height: 85px">
          <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
          <el-button type="primary" @click="revocation" style="margin-left: 10px;">撤回</el-button>
        </ul>
      </div>
      <!-- 提交下拉 -->
      <div class="statusLists" v-show="isHiddenList" style="background: #fff">
        <a></a>
        <!-- 小三角 -->
        <span class="triangle"></span>
        <ul>
          <li v-for="(item,index) in listData" :key="item.startTime" style="min-width:390px;">
            <em>{{index+1}}</em>
            <div class="div-content">
              <strong>[{{item.activeName}}]</strong>
              <span style="font-size:14px;color:#333;font-weight:700">{{item.userName}}</span>
              <div style="float:right;margin-left:10px;font-size:14px;color:#888;display:inline-block">{{item.startTime}}</div>
            </div>
            <p>
              <span style="font-size:14px;color:#888">{{item.taskDispearFlag ? "***" : item.deleteReason}} {{item.message}}</span>
            </p>
          </li>
        </ul>
      </div> 

      <!-- 弹框 -->
      <div>
        <el-dialog :title="defaultMap[this.action]" v-model="dialogFormVisible" size="tiny">
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
          <template v-if="action === 'rejectAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
              <el-form-item label="驳回到：" :label-width="formLabelWidth">
                <el-select v-model='rejectTo' placeholder="请选择节点">
                  <el-option
                    v-for="node in nodeList"
                    :key="node.value"
                    :label="node.key"
                    :value="node.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'assignAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
              <el-form-item label="人员：" :label-width="formLabelWidth">
                <el-select v-model='rejectTo' placeholder="请选择人员">
                  <el-option
                    v-for="node in nodeList"
                    :key="node.value"
                    :label="node.key"
                    :value="node.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'refuseAble'">
            <el-form label-position="left">
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'aggreeAble'">
            <el-form label-position="left">
              <el-form-item label="环节与指派：" :label-width="formLabelWidth" v-show="designateList.length">
                <div v-for="item in designateList" :key="item.participants_01">
                  <p>{{item.activityName}}</p>
                  <el-select v-model="item.participants_01" multiple @change="test" placeholder="请选择">
                    <el-option
                      v-for="item_01 in item.participants"
                      :label="item_01.name"
                      :value="item_01.id"
                      :key="item_01.id">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="审批意见：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="opinion" :rows="2" placeholder="同意"></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="action === 'addsignAble'||action === 'delegateAble'" class="addsign">
            <el-form label-position="left">
              <el-form-item label="人员：" :label-width="formLabelWidth">
                <el-select v-model='userId' placeholder="请选择人员">
                  <el-option
                    v-for="person in personList"
                    :key="person.value"
                    :label="person.key"
                    :value="person.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-dialog>
        <el-dialog
          v-model="dialogVisible" size='full'>
          <div style="height: 1000px">
            <iframe :src="flowUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="提示"
          v-model="isHidRevocation"
          size="tiny">
          <span>确定撤回？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isHidRevocation = false">取 消</el-button>
            <el-button type="primary" @click="sureRevocation">确 定</el-button>
          </span>
        </el-dialog>
      </div>     
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 任务结束标志
      endActivityId: '',
      // 历史记录
      historicalRecords: [],
      // 索引
      indexKey: '',
      // 下环节是否被处理
      beenProcessed: false,
      isHidRevocation: false,
      designateList: [],
      remoteUserId: "",
      dialogVisible: false,
      flowUrl: "",
      isAgree: true,
      author: "",
      isNext: false,
      isEnd: false,
      waitApproves: [],
      titleNumber: "...",
      isSponsor: false,
      params: {},
      params_01: {},
      pk: "",
      isifr: false,
      action: "",
      linkIframe: "",
      opinion: "",
      rejectTo: "",
      userId: "",
      nodeList: [],
      personList: [],
      isHiddenList: false,
      approveUrl: "",
      listData: [],
      isShowBtn:false,
      btnLists: [
        {
          value: "同意",
          key: "agree"
        },
        {
          value: "驳回",
          key: "reject"
        },
        {
          value: "委派",
          key: "weipai"
        },
        {
          value: "不同意",
          key: "disagree"
        }
      ],
      defaultBtn:[],
      hiddenBtn:[],
      consentBtn:[],
      multiinstanceModel:'',
      btnValue:'',
      dialogTableVisible: false,
      dialogFormVisible: false,
      defaultMap: {
        assignAble: "指派",
        rejectAble: "驳回",
        delegateAble: "改派",
        addsignAble: "加签",
        aggreeAble: "同意",
        refuseAble: "拒绝"
      },
      formLabelWidth: "96px",
      BXHeaderSubmit: false,
    };
  },
  computed:{
    firstStep(){
      return '[' + this.listData[0].activeName + ']' + this.listData[0].userName;
    },
    secondStep(){
      return '[' + this.listData[this.listData.length-1].activeName + ']' + this.listData[this.listData.length-1].userName;
    },
    secondStepAgree(){
      return '[' + this.listData[this.listData.length-2].activeName + ']' + this.listData[this.listData.length-2].userName;
    },
  },
  // 
  props:["passValue","showBtn","showBtnOfSpzt","templatePk"],
  methods: {
    //撤回确定事件
    sureRevocation() {
      var vm = this;
      var params = {
        taskId: this.params.task_id,
        processInstanceId: this.params.processInstanceId,
        processKey: this.params.processKey,
        businessKey: this.params.businessKey,
        activityId: this.params.activityId,
      };
      this.$http({
        url: "/ifbp-bpm-service/proc/withdraw",
        method: "get",
        params: params
      }).then(res => {
          if (res.data.success) {
            vm.params.task_id = res.data.map.value.id;
            this.$message({
              message: "撤回成功！",
              type: "success"
            });
            vm.isAgree = true;
            this.requestHistory();
            //让默认按钮和同意按钮清空，重新调接口赋值
            this.defaultBtn = [];
            this.consentBtn = [];
            this.hiddenBtn = [];
            this.requestAction();
            this.requestPerson();
            this.approveState();
          } else {
            vm.$message({
              message: res.data.errorMessage,
              type: "error"
            });
          }
        this.isHidRevocation = false;
      }).catch(e => {
          this.$message.error(e);
      });
      this.$emit('afterAction','withDraw');
    },
    revocation() {
      this.isHidRevocation = true;
    },
    test(item) {

    },
    checkFlow() {
      // this.dialogVisible=true;
      this.flowUrl =
        "/ifbp-bpm-service/static/vendor/diagram-viewer/index.html?processDefinitionId=" +
        this.params.processDefinitionId +
        "&processInstanceId=" +
        this.params.processInstanceId;
      window.open(this.flowUrl);
    },
    requestPerson() {
      this.$http({
        url: "/ifbp-bpm-service/identity/users?size=1000&start=1"
      }).then(res => {
        var newList = res.data.data;
        // 将取到的值处理一下
        var curList = [];
        newList.forEach(item => {
          var obj = {
            key: item.name,
            value: item.userid
          };
          curList.push(obj);
        });
        this.personList = curList;
      });
    },
    requestAction() {
      this.$http({
        url:
          "/ifbp-bpm-service/task/operation?processDefinitionId=" +
          this.params.processDefinitionId +
          "&activityId=" +
          this.params.activityId,
        method: "post"
      }).then(res => {
        var curArr = res.data.data;
        var btnOrder = {
          aggreeAble: 1,
          rejectAble: 2,
          refuseAble: 3,
          assignAble: 4,
          delegateAble: 5,
          addsignAble: 6
        };
        var curList = [];
        curArr.forEach(action => {
          curList.push({
            key: action.op,
            value: action.text ? action.text : this.defaultMap[action.op]
          });
        });
        curList.sort((a, b) => btnOrder[a.key] > btnOrder[b.key]);
        this.btnLists = curList;
        let temporary = [];
        curList.forEach((item,index)=>{
          if(item.key == "aggreeAble" || item.key == "rejectAble" || item.key == "refuseAble"){
            if(item.key == "aggreeAble"){
              this.consentBtn.push(item);
            }else{
              this.defaultBtn.push(item);
            }
          }else{
            temporary.push(item);
          }
        });
        temporary.forEach(item=>{
          if(item.key != "assignAble"){
            this.hiddenBtn.push(item);
          }
        });
      });
    },
    getAssignment() {
      var vm = this;
      var params = {
        taskId: this.params.task_id
      };
      this.$http({
        url: "/ifbp-bpm-service/task/assign-checking",
        method: "get",
        params: params
      }).then(res => {
          if (res.data.status) {
            vm.designateList = res.data.data.assignInfoItems;
            vm.designateList.forEach(function(item, index) {
              vm.$set(item, "participants_01", []);
              item.participants_02 = [];
            });
          } else {
            
          }
        }).catch(() => {
          // this.$message.error("去掉代理失败");
        });
    },
    requestHistory() {
      var vm = this;
      this.$http({
        url: "/ifbp-bpm-service/proc/approval-detail",
        params: {
          processInstanceId: this.params.processInstanceId,
          taskId: this.params.task_id
        }
      }).then(res => {
          if (res.data.status === 1) {
            vm.historicalRecords = res.data.data.historicTasks;
            vm.endActivityId = res.data.data.endActivityId;
            // 找到当前环节在审批历史中的位置
            vm.historicalRecords.forEach((item,i)=>{
              if(item.id == this.$route.query.task_id){
                this.indexKey = i;
              }
            });
            // 判断当前环节是不是最后环节
            if(vm.historicalRecords.length == this.indexKey){
              this.beenProcessed = true;
            }else{
              let jointlySign = vm.historicalRecords[this.indexKey].activity.properties.multiinstanceModel;
              // 不是最后环节,判断此环节是不是会签
              if( jointlySign == "Sign" || jointlySign == "Sequential"){
                this.beenProcessed = true;
              }else{
                if(vm.historicalRecords[this.indexKey].deleteReason != null && (vm.historicalRecords[this.indexKey].deleteReason.indexOf('refuse') != -1 || vm.historicalRecords[this.indexKey].deleteReason.indexOf('reject') != -1)){
                  this.beenProcessed = true;
                }
                // 下一环节处理了,无撤回按钮
                if(vm.historicalRecords[this.indexKey + 1] && vm.historicalRecords[this.indexKey + 1].deleteReason != null){
                  this.beenProcessed = true;
                }
              }
            }
            vm.listData = [];
            vm.waitApproves = [];
            var hisData = res.data.data.historicTasks;
            this.multiinstanceModel = hisData[hisData.length-1].activity.properties.multiinstanceModel;
            var Time = res.data.data.startTime;
            // 获取第一环节代理人
            vm.$http({
                url: "/ifbp-bpm-service/identity/info/" + res.data.data.startUserId,
                method: "get"
              }).then(res_01 => {
                var resList_01 = res_01.data.data;
                var userName_01 = "";
                if (res_01.data.status === 1) {
                  userName_01 = resList_01.name;
                } else {
                  userName_01 = "此任务待认领";
                }
                vm.listData.push({
                  deleteReason: "提交",
                  userName: userName_01,
                  activeName: res.data.data.name,
                  startTime: new Date(Time).toLocaleString(),
                  compareTime: Time
                });
                // 获取除了第一环节的代理人
                hisData.forEach(function(item, index) {
                  vm.$http({
                      url: "/ifbp-bpm-service/identity/info/" + item.assignee,
                      method: "get"
                    }).then(res_02 => {
                      // 获取审批意见(将英文转为中文)
                      var deleteReason = "";
                      if (item.deleteReason == "completed") {
                        deleteReason = "同意";
                      } else if (item.deleteReason == "jumpToActivity") {
                        deleteReason = "驳回";
                      } else if (item.deleteReason == "ACTIVITI_DELETED") {
                        deleteReason = "驳回并中止";
                      } else if (item.deleteReason == "withdraw") {
                        deleteReason = "审批后撤回";
                      } else if (item.deleteReason == "jump") {
                        deleteReason = "调整";
                      } else if (item.deleteReason == "stop") {
                        deleteReason = "终止";
                      } else if (item.deleteReason == "refuse") {
                        deleteReason = "拒绝";
                      } else if (
                        item.deleteReason &&
                        item.deleteReason.indexOf("reject") >= 0
                      ) {
                        deleteReason = "驳回";
                      } else if (item.deleteReason == "deleted" || item.deleteReason == "Delete" || item.deleteReason == "delete") {
                        deleteReason = "删除";
                      } else if (item.deleteReason == null) {
                        deleteReason = "待审批";
                      } else {
                        deleteReason = "未知:" + item.deleteReason;
                      }
                      // 获取处理第一环节的代理人
                      var userName_02 = "";
                      if (res_02.data.status === 1) {
                        userName_02 = res_02.data.data.name;
                      } else {
                        userName_02 = "此任务待认领";
                      }

                      // 时间处理
                      var curTime;
                      if (item.endTime) {
                        curTime = item.endTime;
                      } else {
                        curTime = " ";
                      }

                      // 处理历史记录信息
                      var message;
                      if (item.taskComments) {
                        if (item.taskComments[0]) {
                          // let messageArray = [];
                          // item.taskComments.forEach(v=>{
                          //   messageArray.push(v.message);
                          // });
                          // message = messageArray.join(' ');
                          message = item.taskComments[0].message;
                        } else {
                          message = " ";
                        }
                      } else {
                        message = "";
                      }
                      // 审批历史记录
                      if (deleteReason != "删除" && deleteReason != "待审批" && deleteReason != "审批后撤回") {
                        vm.listData.push({
                          deleteReason: deleteReason,
                          userName: userName_02,
                          activeName: item.activity.name,
                          startTime: curTime,
                          compareTime: curTime,
                          message: message,
                          taskDispearFlag: item.taskDispearFlag,
                        });
                      } else if (deleteReason == "待审批") {
                        var user = "";
                        user = "[" + item.activity.name + "]" + userName_02;
                        vm.waitApproves.push(user);
                      } else if (deleteReason == "审批后撤回") {
                        vm.listData.push({
                          deleteReason: deleteReason,
                          userName: userName_02,
                          activeName: item.activity.name,
                          startTime: curTime,
                          compareTime: curTime,
                          message: "",
                          taskDispearFlag: item.taskDispearFlag,
                        });
                      }

                      if (vm.listData.length > 2) {
                        vm.isNext = true;
                      }
                      
                      // 审批历史时间处理
                      vm.listData.sort(function(a, b) {
                        return (new Date(a.compareTime).getTime() - new Date(b.compareTime).getTime()); //时间正序
                      });
                      vm.listData.forEach(function(item, index) {
                        if ( new Date(item.startTime).toLocaleString() != "Invalid Date"){
                          item.startTime = new Date(item.startTime).toLocaleString();
                        }
                      });
                    }).catch(() => {
                      this.$message.error("请求失败");
                    });
                });
              }).catch(() => {
                this.$message.error("请求失败");
              });
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          this.$message.error("审批历史请求失败");
        });
    },

    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    showList() {
      this.isHiddenList = !this.isHiddenList;
    },
    customEvents(){
      // var sss = this.sss;
      // if(){
      //   var returnValue  = sss.call(this);
      // }
      var data = this.params;
      if (this.action === "aggreeAble") {
        //判断btnLists（数组）里面有没有"assignAble"，如果有的话，会出现下拉,掉接口
        this.btnLists.forEach(item => {
          if (Object.values(item).indexOf("assignAble") != -1) {
            this.getAssignment();
          }
        });
        this.dialogFormVisible = true;
      } else if (this.action === "refuseAble") {
        this.dialogFormVisible = true;
      } else if (this.action === "rejectAble") {
        this.$http.get("/ifbp-bpm-service/task/reject-check", {
            params: {
              taskId: data.task_id
            }
          }).then(response => {
            if (response.data.status === 0) {
              this.$message.error(response.data.msg);
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              newList.forEach(item => {
                var obj = {
                  key: item.name,
                  value: item.activityId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          }).catch(error => {

          });
      } else if (this.action === "assignAble") {
        this.getAssignment();
      } else if (this.action === "addsignAble") {
        this.dialogFormVisible = true;
      } else if (this.action === "delegateAble") {
        this.dialogFormVisible = true;
      } else if (this.action === "assignAble") {
        this.dialogFormVisible = true;
      }
    },
    clickButton(action) {
      if(this.passValue == true){
        this.action = action;
        this.$emit("callBack",action);
      }else if(this.passValue == undefined || this.passValue == false){
        var data = this.params;
        this.action = action;
        if (this.action === "aggreeAble") {
          //判断btnLists（数组）里面有没有"assignAble"，如果有的话，会出现下拉,掉接口
          this.btnLists.forEach(item => {
            if (Object.values(item).indexOf("assignAble") != -1) {
              this.getAssignment();
            }
          });
          this.dialogFormVisible = true;
        } else if (this.action === "refuseAble") {
          this.dialogFormVisible = true;
        } else if (this.action === "rejectAble") {
          this.$http.get("/ifbp-bpm-service/task/reject-check", {
            params: {
              taskId: data.task_id
            }
          }).then(response => {
            // 获取驳回下拉列表
            console.log("驳回列表");
            console.log(response);
            if (response.data.status === 0) {
              this.$message.error(response.data.msg);
              // this.nodeList = [{
              //   key: '制单人(拒绝)',
              //   value: 'REJECTTOINIT'
              // }];
              // this.dialogFormVisible = true;
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              newList.forEach(item => {
                var obj = {
                  key: item.name,
                  value: item.activityId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          }).catch(error => {

          });
        } else if (this.action === "assignAble") {
          this.getAssignment();
        } else if (this.action === "addsignAble") {
          this.dialogFormVisible = true;
        } else if (this.action === "delegateAble") {
          this.dialogFormVisible = true;
        } else if (this.action === "assignAble") {
          this.dialogFormVisible = true;
        }
      }
    },
    waitApprove() {
      this.$http({
        url:
          "/ifbp-bpm-service/proc/" +
          this.params.processInstanceId +
          "/todoActivity",
        method: "get"
      }).then(res => {
          this.waitApproves = res.data.data.name;
        }).catch(() => {
          this.$message.error("请求失败");
        });
    },

    getOpinion() {
      this.$http.get("/ifbp-bpm-service/proc/approval-comments", {
          params: {
            processInstanceId: this.params.processInstanceId
          }
        }).then(res => {

        }).catch(error => {

        });
    },

    approveState() {
      this.$http({
        url:
          "/ifbp-bpm-service/proc/" + this.params.processInstanceId + "/status",
        method: "get"
      }).then(res => {
          if (res.data.data.status === "run") {
            this.isEnd = false;
          } else {
            this.isEnd = true;
          }
        }).catch(() => {
          this.$message.error("请求失败");
        });
    },

    confirm() {
      var vm = this;
      this.data = this.curdata;
      var designateListStr = "";
      if (this.action === "aggreeAble") {
        this.designateList.forEach(function(item, index) {
          for (var i = 0; i < item.participants_01.length; i++) {
            var itemId = item.participants_01[i];
            item.participants_02.push({
              id: itemId
            });
          }
        });
        if (!this.designateList.length > 0) {
          designateListStr = "";
        } else {
          designateListStr = JSON.stringify(this.designateList);
        }

        this.$http({
          url: "/ifbp-bpm-service/approval/action",
          method: "post",
          data: {
            taskId: this.params.task_id,
            action: "agree",
            comment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey,
            assignInfo: designateListStr,
            activityId: this.params.activityId
          }
        }).then(response => {
            if (response && response.data && response.data.status === 1) {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: "已审批同意"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
          });
      } else if (this.action === "refuseAble") {
        this.$http({
          url: "/ifbp-bpm-service/task/refuse",
          method: "get",
          params: {
            taskId: this.params.task_id,
            auditComment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          }
        }).then(response => {
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === 1) {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: "已拒绝流程"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
            this.$message({
              type: "error",
              message: "请求失败"
            });
          });
      } else if (this.action === "rejectAble") {
        // 驳回
        var params;
        if (this.rejectTo === "REJECTTOINIT") {
          params = {
            rejectToInit: "true",
            action: "reject",
            rejectReason: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          };
        } else {
          params = {
            taskId: this.params.task_id,
            action: "reject",
            comment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            activityId: this.rejectTo,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          };
          if (this.rejectTo === "") {
            this.$message({
              type: "error",
              message: "请选择有效的节点"
            });
            return;
          }
        }
        this.$http({
          url: "/ifbp-bpm-service/approval/action",
          method: "post",
          data: params
        }).then(response => {
            // 1代表成功 0代表失败
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === 1) {
              this.$message({
                type: "success",
                message: "驳回成功"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
          });
      } else if (this.action === "delegateAble") {
        this.$http({
          url: "/ifbp-bpm-service/task/delegate",
          method: "post",
          data: {
            taskId: this.params.task_id,
            assign: this.userId,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          }
        }).then(response => {
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === 1) {
              this.$message({
                type: "success",
                message: "改派成功"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
          });
      } else if (this.action === "addsignAble") {
        var arrIds = [];
        arrIds.push(this.userId);
        this.$http({
          url: "/ifbp-bpm-service/task/signAdd",
          method: "post",
          data: {
            taskId: this.params.task_id,
            assigns: arrIds,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          }
        }).then(response => {
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === 1) {
              this.$message({
                type: "success",
                message: "加签成功"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
          });
      } else if (this.action === "assignAble") {
        this.nodeList.forEach(function(item, index) {
          if (item.value == vm.rejectTo) {
            vm.remoteUserId = item.remoteUserId;
          }
        });
        this.$http({
          url: "/ifbp-bpm-service/approval/action",
          method: "post",
          data: {
            taskId: this.params.task_id,
            action: "agree",
            comment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            activityId: this.rejectTo,
            remoteUserId: vm.remoteUserId
          }
        }).then(response => {
            this.dialogFormVisible = false;
            if (response && response.data && response.data.status === 1) {
              this.dialogFormVisible = false;
              this.$message({
                type: "success",
                message: "指派成功"
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree = false;
              this.requestPerson();
              this.approveState();
            } else if (
              response &&
              response.data &&
              response.data.status === 0
            ) {
              this.$message({
                type: "error",
                message: response.data.msg
              });
            }
          }).catch(error => {
            this.dialogFormVisible = false;
          });
      }
      this.rejectTo = "";
      this.opinion = "";
      this.userId = "";
      this.$emit("afterAction",this.action);
    },
    cancel() {
      this.dialogFormVisible = false;
      this.rejectTo = "";
      this.opinion = "";
      this.userId = "";
    },

    isEnable() {
      var sceneCode = this.params_01.sceneCode;
      if (sceneCode !== "undefined" && sceneCode) {
        this.$http.get("/ifbp-bpm-service/bmp_proc/check", {
            params: {
              buzicode: "BXD",
              sceneCode: sceneCode
            }
          }).then(res => {
            this.isSponsor = res.data.data.enabled;
          }).catch(error => {

          });
      }
    },

    getParams() {
      var data = {};
      var tmp;
      var paramPK = location.href.split("?")[0].split("/");
      this.pk = paramPK[paramPK.length - 1];
      var paramStr = location.href.split("?")[1];
      if (paramStr) {
        var paramsArr = paramStr.split("&");
        paramsArr.forEach(v => {
          tmp = v.split("=");
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      if (data.sceneCode) {
        this.params_01 = data;
      } else {
        this.params = data;
      }
    },
    // 处理传入组件的值
    doParams() {
      var data = {};
      var tmp;
      var paramStr = this.childMsg.split("?")[1];
      if (paramStr) {
        var paramsArr = paramStr.split("&");
        paramsArr.forEach(v => {
          tmp = v.split("=");
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      this.params = data;
    },

    getUser() {
      this.$http({
        url:
          "/ifbp-bpm-service/identity/info/07016fea-dfc7-11e7-b686-005056944e95",
        method: "get"
      }).then(res => {

        }).catch(() => {
          this.$message.error("请求失败");
        });
    },
    initiateProcess() {
      var promise1 = this.initiateProcessBefore();
      Promise.all([promise1]).then(() => {
        if(this.BXHeaderSubmit){
          this.initiateProcessAfter();
        }
      });
    },
    // 提交的时候需要首先发送一个请求
    initiateProcessBefore() {
      return this.$http({
        url: '/ifbp-demo-web/BXHeader/submit',
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json",
        method: 'post',
        data: this.templatePk
      }).then((res) => {
        if(res.data.success === true){
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
        sceneCode: this.params_01.sceneCode,
        processInstanceName: "报销单流程",
        businessKey: this.pk,
        mdPK: this.pk
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
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          this.$message.error("发起失败");
        });
    }
  },
  created() {
    this.getParams();
    this.isEnable();
    if (this.params.processKey) {
      this.requestHistory();
      this.requestAction();
      this.requestPerson();
      this.approveState();
    }
  },
  watch:{
    multiinstanceModel:{
      handler:function(val){
        if(val == "Sign" || val == "Sequential"){
          this.defaultBtn = [];
        }
      },
      deep:true
    }
  }
};
</script>

<style scoped>
  /* 提交按钮样式 */
  .flow-button-style{
    background-color: #fff;
  }
  .flow-button-submit{
    margin: 16px 0 16px 16px;
  }
  ul,li{ 
    padding:0;
    margin:0;
    list-style:none
  }
  .list-panel1 {
    height: 104px;
    width: 100%;
    background-color: #fff;
    margin-bottom: 16px;
    position: relative;
  }

  .step {
    position: relative;
    /* height: 104px; */
    margin-top: 28px;
    margin-left: 34px;
  }
  
  .waitAction {
    position: absolute;
    left: 65px;
    top: 16px;
    font-size: 14px;
    color: #333333;
    line-height: 21px;
    width: 196px;
  }
.waitAction span {
  color: #5CB0E6;
  width:132px;
  display:inline-block;
  text-overflow : ellipsis; 
  white-space : nowrap; 
  overflow : hidden;
  line-height: 18px;
  vertical-align: sub;
}
.titleNumber {
  position: absolute;
  left: 4px;
  top: 4px;
  color: #fff;
  line-height: 48px;
  text-align: center;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
}
.titleNumber::before{
  color: #00A753;
  font-size: 26px;
  line-height: 40px;
}
.ifbp-icon-check:before{
  font-weight: 700;
}
.ifbp-icon-edit:before{
  font-size: 22px;
  color: #C0CCDA;
}
.ifbp-icon-close:before{
  color: #FF3B30;
  font-weight: 700;
  font-size: 26px;
}
.titleText {
  position: absolute;
  left: 72px;
  top: -14px;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  /* width: 180px; */
}
.titleText span {
  display: inline-block;
  height: 18px;
  overflow: hidden;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 212px;
}
.titleData {
  font-size: 12px;
  color: #888888;
  margin-top: -5px;
  font-weight: normal;
}
.titleAction {
  font-size: 14px;
  color: #475669;
  position: absolute;
  left: 72px;
  top: 30px;
  width: 166px;
  height: 14px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#search-container {
  height: 100px;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: none !important;
}

.first_step .statuss {
  overflow: hidden;
}

.first_step .statuss span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #25c8ff;
  vertical-align: middle;
  text-align: center;
  line-height: 20px;
  color: #ddd;
}

.first_step .statuss em {
  display: inline-block;
  height: 3px;
  width: 200px;
  background: #25c8ff;
}

.first_step .statuss i {
  position: absolute;
  right: -10px;
  top: 30px;
  font-style: normal;
}

.first_step strong {
  text-align: center;
  width: 200px;
  position: absolute;
  left: 50%;
  top: -30px;
  margin-left: -100px;
  font-weight: normal;
}

.first_step .submissionTime {
  text-align: center;
}

.first_step p {
  width: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 20px;
  text-align: center;
}

.first_step p em {
  font-style: normal;
}

.btnLists {
  display: inline-block;
  overflow: hidden;
  /* height: 220px; */
}
.btnLists .more-btn{
  position: relative;
  /* width: 150px; */
}

.btnLists li {
  float: left;
  margin-left: 5px;
}
.hiddenBtnList{
  position: absolute;
  left: -5px;
  top: 36px;
  z-index: 800;
}
.hiddenBtnList li{
  float:none;
  margin-bottom: 10px;
  margin-right: 5px;
}
.hiddenBtnList a {
  position: absolute;
  top:-16px;
  left: 48px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #D2D2D7;
  border-left: 10px solid transparent;
}
.statusLists {
  position: absolute;
  left: 0px;
  top: 82px;
  z-index: 800;
  border: 1px solid #eee;
}
.statusLists a{
  position: absolute;
  top:-16px;
  left: 46px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #eee;
  border-left: 10px solid transparent;
}
.statusLists .triangle{
  position: absolute;
  top:-14px;
  left: 46px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
}
.statusLists ul {
  height: 426px;
  overflow-x: hidden;
}

.statusLists li {
  background: #fff;
  position: relative;
}
.statusLists li .div-content{
  margin-left: 20px;
  line-height: 24px;
}
.statusLists li em {
  font-style: normal;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #C0CCDA;
  vertical-align: middle;
  text-align: center;
  line-height: 18px;
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 15px;
  left: 16px;
}

.statusLists li span {
  margin-left: 10px;
}

.statusLists li strong {
  font-weight: 700;
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}

.statusLists li {
  padding: 10px 16px;
  padding-bottom: 0px;
}

.statusLists li p {
  /* padding-top: 10px; */
  margin-left: 20px;
  border-bottom: 1px solid #E6E6EB;
  padding-bottom: 8px;
  line-height: 24px;
}

.clickList {
  cursor: pointer;
}
.el-dropdown-menu__item{
  width: 102px;
  padding: 0 16px;
}
</style> 
<style>
.step .el-step__head.is-text{
  width: 44px !important;
  height: 44px !important;
}
/* 第一步流程的样式 */
.step .first-step .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .first-step.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 未审批的第二步样式 */
.step .second-step .el-step__head.is-text{
  background-color: #C0CCDA !important;
  border-color: #C0CCDA !important;
}

.step .second-step-agree .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .second-step-agree.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 结束状态的时候样式 */
.step .el-step__head.is-text.is-finish{
  background-color: #00A753;
  border-color: #00A753;
}
.step .end-false .el-step__head.is-text{
  width: 44px !important;
  height: 44px !important;
  background-color: #C0CCDA !important;
  border-color: #C0CCDA !important;
}
/* 审批最后一步（拒绝，驳回，不同意） */
.step .refuse-status .el-step__head.is-text{
  background-color: #FF3B30;
  border-color: #FF3B30;
}
/* 审批最后一步（同意） */
.step .agree-status .el-step__head.is-text{
  background-color: #00A753;
  border-color: #00A753;
}
.step .el-step.is-horizontal .el-step__line{
  top:22px !important;
  margin-left: 14px;
}
/* 审批第二步同意时线的样式 */
.step .second-status.el-step.is-horizontal .el-step__line{
  background-color: #00A753;
}
/* 审批第二步不同意时线的样式 */
.step .refuse-second-status.el-step.is-horizontal .el-step__line{
  background-color: #FF3B30;
}
.btnLists .more-btn .btn-more{
  width: 32px !important;
  min-width: 32px !important;
  padding-left: 1px !important;
}
.btnLists .more-btn .btn-more::before{
  margin-left: 6px !important;
}
</style>
