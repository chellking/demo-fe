<template>
  <div class="ifbp-panel" :id="id">
    <div class="ifbp-panel-title">
        <h3 @click="toggleShow">{{title}}</h3>
        <i v-for="icon in icons"  v-if="typeof icon.show === 'undefined' || icon.show"
            :class="[
              'el-icon-' + icon.icon
            ]"
            @click="icon.click">
          </i>
    </div>
    <div class="ifbp-panel-body" v-show="showBody">
        <slot></slot>
    </div>
  </div>
</template>

<script>
import emitter from "./emitter";
export default {
  name: "IfbpPanel",

  componentName: "IfbpPanel",

  mixins: [emitter],
  
  props: {
    title: String,
    icons: Array,
    id: String,
    showBody: {
      type: Boolean,
      default: true
    }
  },

  methods:{
    toggleShow(){
      this.showBody = !this.showBody;
    }
  },

  mounted(){
    this.dispatch("IfbpPanelGroup", "childChange");
  },
  
  destroyed(){
    this.dispatch("IfbpPanelGroup", "childChange");
  },

  // computed: {
  //   hasBody() {
  //     return (
  //       this.$slots && this.$slots.default && this.$slots.default.length > 0
  //     );
  //   }
  // }
};
</script>

<style>
</style>
