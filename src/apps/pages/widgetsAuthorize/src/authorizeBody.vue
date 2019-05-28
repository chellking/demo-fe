<template>
		<div class="persioncontain">
			<div class="persionbox" v-for="(app,inx) in group" v-if="!app.hidden">
				<div class="persionbox-remove" v-if = "app.checked && showIcon">
					<i class="ifbp-icon-power-off el-icon-circle-close" @click="handleChange(app,inx)"></i>
				</div>
				<div class="persionbox-remove" v-if = "!app.checked && showIcon">
					<div style = "height: 18px;width: 18px;border-radius:50%;background: #5CB0E6;">
						<i class="ifbp-icon-add" @click = "handleChange(app,inx)"></i>
					</div>
					
				</div>
				<div class="card-title" :title="app.name">{{app.name}}</div>
				<div class="subtitle"> {{app.descr }} </div>
				<div class="img-and-dynamic">
					<span class="img-area">
            		<i class="iconfont_form appIcon iconfont icon-component" style="color: #44bde4;"></i></span>
            		<!-- <i :class="['iconfont_form appIcon', app.appIcon ? app.appIcon :  'icon-C-app']"></i></span> -->
				</div>
				<div class="card-footer"> {{app.footer ? app.footer :''}} </div>
			</div>
		</div>
</template>

<script>
export default {
  name: "PermissionBody",
  data() {
    return {
      groups: []
    };
  },
  props: {
    group: {
      type: Array,
      default: ""
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    deep: true,
    group(value) {
      this.groups = value;
    }
  },
  methods: {
    handleChange(app, inx) {
      this.$emit("handleChange", app, inx);
    }
  }
};
</script>

<style scoped>
.persioncontain {
  display: -webkit-flex;
  /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 8px;
}

.persionbox {
  height: 144px;
  width: 144px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #f2f2f7;
  border-radius: 4px;
  margin: 8px;
  position: relative;
}
.persionbox-remove {
  position: absolute;
  top: 8px;
  right: 8px;
}
.ifbp-icon-power-off {
  color: #c8c8cd;
}

.persionbox .card-title {
  font-size: 16px;
  line-height: 16px;
  color: #333;
  white-space: nowrap;
  font-weight: 400;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
}

.persionbox .subtitle {
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: 40px;
  color: #666;
  font-weight: 400;
  text-align: left;
  text-overflow: ellipsis;
}

.persionbox .img-and-dynamic {
  text-align: right;
  height: 60px;
  line-height: 60px;
}
.ifbp-icon-add {
  color: white;
}
</style>