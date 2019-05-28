<template lang="html">
     <div class="account-demo">
       <el-row  :gutter="16">
           <el-col :span="8" v-for="(Item,index) in tableData">
           <div class="grid-content" @mouseover="select(Item,index)"
                @mouseout="cancelSelect(Item,index)">
               <div @click="cardClick(Item, index)" class="grid-top">
                   <div class="grid-top-left  leftmargin">
                       面向对象：{{Item.goal}}
                   </div>
                   <div class="grid-top-right  rightmargin">
                       ￥{{Item.low_fee}}
                   </div>
               </div>
               <div @click="cardClick(Item, index)" class="grid-center">
                   <div class="grid-center-left">
                       <div class="grid-date-content  leftmargin">
                           达到目标：{{Item.title}}
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

<!-- 页面逻辑处理 -->
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
      default: "ifbp-icon-date"
    },
    issysName: {
      type: String,
      default: "系统预置"
    }
  },
  methods: {
    cardEditClick(Item, index) {
    this.$emit('cardEditClick', Item, index);
    },
    cardDeleteClick(Item, index) {
    this.$emit('cardDeleteClick', Item, index);
    },
    //选中事件
    select(value, index) {
      this.$set(this.tableData[index], "isCardOperateShow", true)
      this.$emit('selectChange', [value]);
    },
    cancelSelect(value, index) {
      this.tableData[index].isCardOperateShow = false;
    },
    setCardData(carddata) {
      this.showdate = carddata;
    },
    amountFormat(value) {
      //如果num是负数，则获取她的符号
      var sign = value.indexOf("-") > 0 ? '-' : '';
      //如果存在小数点，则获取数字的小数部分
      let cents = value.indexOf(".") > 0 ? value.substr(value.indexOf(".")) : '';
      cents = cents.length > 1 ? cents : '.00';
      //获取数字的整数数部分
      var intvalue = value.indexOf(".") > 0 ? value.substring(0, (value.indexOf("."))) : value;

      for (var i = 0; i < Math.floor((intvalue.length - (1 + i)) / 3); i++) {
        intvalue = intvalue.substring(0, intvalue.length - (4 * i + 3)) + ',' +
          intvalue.substring(intvalue.length - (4 * i + 3));
      }
      //将数据（符号、整数部分、小数部分）整体组合返回
      return (sign + intvalue + cents);
    },
    getRefName(value, key) {
      const beanMap = value.beanMap[`${key}_ref`];
      if (beanMap !== null && beanMap !== undefined && beanMap !== '') {
        //普通参照和树型参照名称字段不一致
        if (beanMap[value[key]].name === undefined) {
          return beanMap[value[key]].refname;
        }
        return beanMap[value[key]].name;
      }
      return value[key];
    }
  },
}
</script>

<!-- 自定义样式 -->
<style>
.el-col {
  margin-bottom: 16px;
  min-width: 360px;
}

.el-row {
  overflow: auto;
  white-space: nowrap;
}

.grid-content {
  background: #FFFFFF;
  border-radius: 4px;
  height: 156px;
  border: 1px solid #F0F0F5;
}

.grid-content:hover {
  box-shadow: 0px 2px 4px 0px #E2E8EF;
  border-radius: 4px;
  background-color: #F3F6F9;
}

.grid-top {
  width: 100%;
  height: 38px;
}

.grid-center {
  width: 100%;
  height: 80px;
}

.grid-bottom {
  width: 100%;
  height: 38px;
}

.grid-top-left {
  margin-top: 16px;
  font-size: 14px;
  color: #75787B;
  /* width: 84px; */
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

.grid-top-right {
  margin-top: 14px;
  font-size: 24px;
  text-align: right;
  color: #FF3B30;
  line-height: 24px;
  float: right;
}

.grid-center-left {
  float: left;
}

.grid-center-right {
  float: right;
  width: 64px;
  height: 64px;
}
.grid-center-right .card-img {
  font-size: 64px;
  color: #dcebfd;

}
.doneinon {
  width: 64px;
  height: 64px;
}

.normalinon {
  height: 64px;
  height: 64px;
  clear: both;
  display: block;
  margin: auto;
}

.grid-bottom-operation {
  margin-top: 12px;
  float: right;
}
.grid-bottom-operation div {
  float: right;
  margin-right: 16px;
  height: 16px;
  font-size: 12px;
  color: #75787B;
  line-height: 16px;
}

.grid-bottom-operation i {
  float: right;
  margin-right: 16px;
  width: 16px;
  height: 16px;
  color:#75787B
}

.grid-date-content {
  margin-top: 12px;
  font-size: 14px;
  color: #75787B;
  line-height: 14px;
}

.btn-op:hover {
  color: #5CB0E6;
}

.topmargin {
  margin-top: 16px;
}

.rightmargin {
  margin-right: 16px;
}

.leftmargin {
  margin-left: 16px;
}
</style>
