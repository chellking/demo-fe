<template>
    <ifbp-page :noPadding="true">
        <md-layout ref="mdLayout" :aside-width="asideWidth" :container-class="topClass1">
          <div slot="master">
              <md-page :container-class="topClass2">
                 <h4 slot="title" class="header-title">薪资核发({{leftSideArr.length}})
                    <i class="toggle-icon ifbp-icon-format-indent-decrease" @click="toggleLeft"></i>
                 </h4>
                 <div slot="content">
                    <ul>
                      <li class="aside-item" v-for="(item,index) in leftSideArr" :key="index" @click="handleClickItem(item)">
                        <h4 class="aside-item-hd">{{item.date}}<span>{{item.num}}人</span></h4>
                        <div class="aside-item-info">
                            {{item.info}}
                        </div>
                        <p class="aside-item-state">{{item.state}}</p>
                      </li> 
                    </ul>
                 </div>
                 <!-- 页脚右侧按钮 -->
                 <div slot="footer">
                    <el-dropdown slot="left">
                      <i class="ifbp-icon-filter footer-icon"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>汇总方案</el-dropdown-item>
                        <el-dropdown-item>其他方案</el-dropdown-item>
                        <el-dropdown-item>非汇总方案</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>      
                 </div>  
              </md-page>
          </div>
          <div slot="detail">
              <!-- 右侧详情页面 -->
              <md-page :showFooter="true" :showExpandbtn="true" :container-class="topClass3">
                  <span slot="title" class="header-title">资金下发详情</span>
                  <div slot="content">
                     <el-button type="primary" @click="handleFirstChild()">新增-全屏</el-button>
                     <el-button type="primary" @click="handleSecondChild()">新增-普通</el-button>
                     <el-button type="primary" @click="handleThirdChild()">新增-自定义</el-button>
                  </div>
                  <template slot="footer">
                    <el-button type="primary" style="margin-right:10px;" @click="logSth('import')">导出</el-button>
                    <el-button type="default" style="margin-right:10px;" @click="logSth('test')">测试</el-button>
                  </template>
              </md-page>
              <!-- 弹出新增页面 -->
              <md-child-page ref="firstPanel" :fullscreen="true" @close="handleCloseChild" :container-class="topClass4">
                  <md-page>
                    <div slot="title" class="md-child-header">
                        <span class="md-header-func">
                            <i class="el-icon-arrow-left header-icon" @click="handleCancel1"></i>
                        </span>
                        <span class="md-header-title">新增</span>
                    </div>
                    <div slot="content" class="md-child-section">
                      <p>这是新增页1</p>
                    </div>
                    <template slot="footer">
                        <el-button type="primary" style="margin-right:10px;" @click="handleCancel1">保存</el-button>
                        <el-button type="default" @click="handleCancel1">取消</el-button>
                    </template>
                  </md-page>
              </md-child-page>
              <!-- 弹出新增页面 -->
              <md-child-page ref="secondPanel" :fullscreen="false" @close="handleCloseChild">
                  <md-page>
                    <div slot="title" class="md-child-header">
                        <span class="md-header-func">
                            <i class="el-icon-arrow-left header-icon" @click="handleCancel2"></i>
                        </span>
                        <span class="md-header-title">新增-normal</span>
                    </div>
                    <div slot="content" class="md-child-section">
                      <div style="height:600px;">
                        <p>这是新增页-normal</p>
                      </div>
                    </div>
                    <template slot="footer">
                        <el-button type="primary" style="margin-right:10px;" @click="handleCancel2">保存</el-button>
                        <el-button type="default" @click="handleCancel2">取消</el-button>
                    </template>
                  </md-page>
              </md-child-page>
              <!-- 弹出新增页面3 -->
              <md-child-page ref="thirdPanel" :width="1200" @close="handleCloseChild">
                 <p>这是第三个页面</p>
                 <el-button type="primary" @click="handleCancel3">退出</el-button>
              </md-child-page> 
          </div>
        </md-layout>
    </ifbp-page>
</template>
<script>
     import MdLayout from 'ifbp-business/mdlayout';
     import MdPage from 'ifbp-business/mdpage';
     import MdChildPage from 'ifbp-business/mdchildpage';

  export default {
    components:{
      "md-layout" : MdLayout,
      "md-page" : MdPage,
      "md-child-page" : MdChildPage
    },
    data(){
      return {
        leftSideArr:[
          {id:'01',date:"2018-07",num:23,info:"正式员工月度工资月度工资月度工资",state:'已完成'},
          {id:'02',date:"2018-08",num:23,info:"正式员工月度工资月度工资月度工资",state:'未完成'},
          {id:'03',date:"2018-09",num:23,info:"正式员工月度工资月度工资月度工资",state:'已完成'},
          {id:'04',date:"2018-10",num:23,info:"正式员工月度工资月度工资月度工资",state:'已完成'},
          {id:'05',date:"2018-11",num:23,info:"正式员工月度工资月度工资月度工资",state:'已完成'},
          {id:'06',date:"2018-12",num:23,info:"正式员工月度工资月度工资月度工资",state:'已完成'}
        ],
        asideWidth:240,
        //可以传递多个class给相应的组件顶层;
        topClass1:["a","b","c"],
        topClass2:["d","e","f"],
        topClass3:["g","h","i"],
        topClass4:["l","k","j"]
      };
    },
    methods: {
      handleFirstChild(){
        this.$refs.firstPanel.showChildPage();
      },
      handleSecondChild(){
        this.$refs.secondPanel.showChildPage();
      },
      handleThirdChild(){
        this.$refs.thirdPanel.showChildPage();
      },
      handleCancel1(){
        this.$refs.firstPanel.hideChildPage();
      },
      handleCancel2(){
        this.$refs.secondPanel.hideChildPage();
      },
      handleCancel3(){
        this.$refs.thirdPanel.hideChildPage();
      },
      handleClickItem(id){
        this.$refs.mdLayout.listItemClick(id);
      },
      handleCloseChild(){
        console.log("已关闭--do sth");
      },
      logSth(msg){
        console.log(msg);
      },
      // 切换左侧边栏
      toggleLeft(){
        this.$refs.mdLayout.toggleLeft();
      }
    }
  }
</script>
<style>
  /* 左侧样式 */
  .aside-item{
    list-style: none;
    height:6rem;
    position:relative;
    padding:5px 8px;
    border-bottom:1px solid #eeeeee;
    cursor: pointer;
  }
  .aside-item-hd{
    height:2rem;
    line-height:2rem;
    font-size:12px;
    font-weight: bold;
    color:#75787B;
  }
  .aside-item-hd>span{
    font-size:14px;
    font-weight:normal;
    color:red;
    float:right;
  }
  .aside-item-info{
    font-size: 16px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 22px;
    height:44px;
  }
  .aside-item-state{
    float:right;
    font-size: 14px;
    color: #75787B;
    letter-spacing: 0;
    text-align: right;
    line-height: 14px;
  }
  .footer-icon{
    color:#fff;
    cursor:pointer;
  }
  
</style>
