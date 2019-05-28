<template lang="html">
  <div>
      <!-- 卡片 -->
      <ul class="card-area" v-if="tableData && tableData.length">
          <li v-for="(column,index) in tableData" class="staff-card" @click="cardClick(column)">
              <div class="card-div"  @mouseover="showCardEdit" @mouseout="hideCardEdit">
                  <div class="fl staff-card-img">
                    <!-- <i class="ifbp-icon-account card-icon-account" v-if="!column.avatar"></i> -->
                    <ifbp-table-image class="card-icon-account" v-if="!column.avatar" :name="column.name" :index="parseInt(Math.random()*7)"></ifbp-table-image>
                    <img v-else :src="'/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar='+column.avatar"/>
                  </div>
                  <div class="fl" style="width: calc(100% - 64px)">
                      <div style="width: 100%">
                          <div class="staff-card-icon-title">
                            <span :title="column.name">{{column.name}}</span>
                          </div>
                          <div class="staff-card-icon">
                            <i class="ifbp-icon-edit" @click='cardEditClick($event,column)' title="编辑"></i>
                            <i class="ifbp-icon-delete" @click='cardDeleteClick(column)' title="删除"></i>
                            <i class="ifbp-icon-power" @click='cardEnabledClick(column)' title="启用"></i>
                          </div>
                      </div>
                      <div class="staff-card-infomation" :title="column.mobile">{{column.mobile}}</div>
                      <div class="staff-card-infomation" :title="column.email">{{column.email}}</div>
                      
                  </div>
              </div>
          </li>
      </ul>
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
      default: "ifbp-icon-print"
    },
    issysName: {
      type: String,
      default: "系统预置"
    }
  },
  methods: {
    cardClick(column) {
      this.$emit("cardClick", column);
    },
    cardEditClick(e,column) {
      console.log(e);
      if(e && e.stopPropagation){
        e.stopPropagation(); 
      } else {
        window.event.cancelBubble = true; 
      }
      this.$emit("cardEditClick", column);
    },
    cardDeleteClick(column) {
      this.$emit("cardDeleteClick", column);
    },
    cardEnabledClick(column) {
      this.$emit("cardEnabledClick", column);
    },
    showCardEdit() {
      this.showIcon = true;
    },
    hideCardEdit() {
      this.showIcon = false;
    }
  },
  data() {
    return {
      showIcon: false
    };
  }
};
</script>

<style>
.card-div:hover {
  background: #f3f6f9;
}
.card-area .print-tpl-mgr-main-area {
  position: relative;
  height: 95px;
}
/* 卡片左侧内容 */
.card-area .print-tpl-mgr-l-area {
  vertical-align: top;
  width: 100%;
  box-sizing: border-box;
  padding-right: 96px;
  overflow: hidden;
}
.card-area .print-tpl-mgr-l-area label {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  height: 18px;
  margin-bottom: 8px;
  color: #75787b;
}
.card-area .print-tpl-mgr-l-area label.strong {
  font-size: 18px;
  height: 22px;
  color: #2d2d2d;
  margin: 4px 0 12px;
}
/* 卡片右侧内容 */
.card-area .print-tpl-mgr-r-area {
  box-sizing: border-box;
  width: 96px;
  padding-left: 16px;
  margin-top: 32px;
  position: absolute;
  right: 0;
}
.card-area .print-tpl-mgr-r-area label {
  display: block;
  width: auto;
  height: 18px;
  margin-bottom: 10px;
}
.card-area .print-tpl-mgr-r-area span {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  background: #a6b7cb;
  border-radius: 2px 0 0 2px;
}
.print-card-area i {
  margin-left: 16px;
  color: #75787b;
  cursor: pointer;
}
.print-card-area i:first-child {
  margin-left: 0;
}
.print-card-area i:hover {
  color: #0089fa;
}

.staff-card:hover {
  cursor: pointer;
}
.staff-card-img {
  width: 64px;
  /* height: 96px; */
}
.staff-card-img > img {
  width: 100%;
  height: 100%;
}
.staff-card-icon-title {
  width: calc(100% - 156px);
  margin-left: 16px;
  display: inline-block;
  color: #333333;
}
.staff-card-icon-title > span {
  width: 100%;
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.staff-card:hover .staff-card-icon {
  display: block;
}
.staff-card-icon {
  display: none;
  float: right;
  margin-right: 16px;
  color: #75787b;
}
.staff-card-icon > i:hover {
  cursor: pointer;
  color: #0089fa;
}
.staff-card-icon > i {
  width: 16px;
  height: 16px;
  margin-left: 16px;
}
.staff-card-infomation {
  margin-left: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #666666;
}
/*  icon显示  */
.card-div > .staff-card-img > .card-icon-account {
  width: 64px;
  height: 64px;
  font-size: 32px;
  line-height: 64px;
  /* font-size: 64px;
    color: #C8C8CD;
    display: inline-block;
    margin: 16px, 248px, 70px, 16px; */
}
</style>
