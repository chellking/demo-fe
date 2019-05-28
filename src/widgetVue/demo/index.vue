<template>
  <div>  
    <p class="demo-big">{{ msg }}</p>
    <h1>img 引用图片</h1>
    <img class="demo-common-img" src="../../apps/assets/img/widget/demo.png?__inline" alt="">
    <h1>css background 引用图片</h1>
    <div class="demo-bg demo-common-img"></div>
    <comp-one :datas="dataOne"></comp-one>
    <comp-two :datas="dataTwo"></comp-two>
    <common :datas="dataCommon"></common>
  </div>
</template>

<script>
import compOne from './compOne.vue'
import compTwo from './compTwo.vue'
import common from '../commonVue/common.vue'
export default {
    data(){
        return {
            msg: "我是demo",
            dataOne: [
                {test:"我是组件一"},
            ],
            dataTwo: [
                {test:"我是组件二"},
            ],
            dataCommon: [
                {test:"我是common组件"},
            ]
        }
    },
    components: {
        compOne,
        compTwo,
        common
    }
}
</script>

<style scoped>
.demo-big {
    font-size: 50px;
}
.demo-common-img {
    width: 100px;
    height: 100px;
}
.demo-bg {
    background-image: url('../../apps/assets/img/widget/demo.png');
}
</style>
