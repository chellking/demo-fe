<template lang="html">
  <div class="account-demo">
    <el-row  :gutter="16">
      <el-col :span="8" v-for="(Item,index) in tableData">
        <div class="grid-content" @mouseover="select(Item,index)" @mouseout="cancelSelect(Item,index)">
          <div @click="cardClick(Item, index)" class="grid-top">
            <div class="grid-top-left  leftmargin">
            {{Item.pk_billtype}}
            </div>
            <div class="grid-top-right  rightmargin" v-if="!Item.tatal">
            {{Item.total}}
            </div>
            <div class="grid-top-right  rightmargin" v-else>
            ￥{{Item.total}}
            </div>
          </div>
          <div @click="cardClick(Item, index)" class="grid-center">
            <div class="grid-center-left">
              <div class="grid-date-content  leftmargin">
              {{changeData(Item.djrq)}}
              </div>
            </div>
            <div class="grid-center-right topmargin rightmargin">
              <i :class="iconName" class="card-img"></i>
            </div>
          </div>
          <div class="grid-bottom">
            <div v-show="Item.isCardOperateShow">
              <div  v-show="true" class="grid-bottom-operation "  @click="cardDeleteClick(Item, index)">
                <i class="ifbp-icon-delete btn-op" title="删除"></i>
              </div>
              <div v-show="true" class="grid-bottom-operation" @click="cardEditClick(Item, index)">
                <i  class="ifbp-icon-edit btn-op" title="编辑"></i>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: []
    },
    strongLine: {
      type: Number,
      default: 1
    },
    iconName: {
      type: String,
      default: "ifbp-icon-search"
    },
    issysName: {
      type: String,
      default: "系统预置"
    }
  },
  methods: {
    // 编辑按钮处理
    cardEditClick(Item, index) {
      this.$emit("cardEditClick", Item, index);
    },
    // 删除按钮处理
    cardDeleteClick(Item, index) {
      this.$emit("cardDeleteClick", Item, index);
    },
    // 卡片mouseover处理
    select(value, index) {
      this.$set(this.tableData[index], "isCardOperateShow", true);
      this.$emit("selectChange", [value]);
    },
    // 卡片mouseout处理
    cancelSelect(value, index) {
      this.tableData[index].isCardOperateShow = false;
    },
    // 时间戳转换为日期格式
    changeData(value){
      if(value){
        var date = new Date(value);
        var Y,M,D,h,m,s;
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        // h = date.getHours() + ':';
        // m = date.getMinutes() + ':';
        // s = date.getSeconds();
        return Y+M+D;
      }
    },
  }
};
</script>

<style>
.account-demo {
  margin-top: 16px;
}
.account-demo .el-col {
  margin-bottom: 16px;
  min-width: 360px;
}

.account-demo .el-row {
  overflow: auto;
  white-space: nowrap;
}

.account-demo .grid-content {
  background: #ffffff;
  border-radius: 4px;
  height: 156px;
  border: 1px solid #f0f0f5;
}

.account-demo .grid-content:hover {
  box-shadow: 0px 2px 4px 0px #e2e8ef;
  border-radius: 4px;
  background-color: #f3f6f9;
}

.account-demo .grid-top {
  width: 100%;
  height: 38px;
}

.account-demo .grid-center {
  width: 100%;
  height: 80px;
}

.account-demo .grid-bottom {
  width: 100%;
  height: 38px;
}

.account-demo .grid-top-left {
  margin-top: 16px;
  font-size: 14px;
  color: #75787b;
  width: 84px;
  float: left;
  line-height: 16px;
  word-break: keep-all;
  /* 不换行 */
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
  /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}

.account-demo .grid-top-right {
  margin-top: 14px;
  font-size: 24px;
  text-align: right;
  color: #ff3b30;
  line-height: 24px;
  float: right;
}

.account-demo .grid-center-left {
  float: left;
}

.account-demo .grid-center-right {
  float: right;
  width: 64px;
  height: 64px;
}
.account-demo .grid-center-right .card-img {
  font-size: 64px;
  color: #dcebfd;
}
.account-demo .doneinon {
  width: 64px;
  height: 64px;
}

.account-demo .normalinon {
  height: 64px;
  height: 64px;
  clear: both;
  display: block;
  margin: auto;
}

.account-demo .grid-bottom-operation {
  margin-top: 12px;
  float: right;
}
.account-demo .grid-bottom-operation div {
  float: right;
  margin-right: 16px;
  height: 16px;
  font-size: 12px;
  color: #75787b;
  line-height: 16px;
}

.account-demo .grid-bottom-operation i {
  float: right;
  margin-right: 16px;
  width: 16px;
  height: 16px;
  color: #75787b;
}

.account-demo .grid-date-content {
  margin-top: 12px;
  font-size: 14px;
  color: #75787b;
  line-height: 14px;
}

.account-demo .btn-op:hover {
  color: #5cb0e6;
}

.account-demo .topmargin {
  margin-top: 16px;
}

.account-demo .rightmargin {
  margin-right: 16px;
}

.account-demo .leftmargin {
  margin-left: 16px;
}
</style>
