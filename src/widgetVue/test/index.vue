<template>
  <div>
    <p class="big">{{ msg }}</p>
    <tab-ding :datas="datas"></tab-ding>
    <p>分割线</p>
    <tab1-ding :datas="datas"></tab1-ding>

    <!-- <common-ding :datas="datas"></common-ding> -->
  </div>
</template>

<script>
import tabDing from './tab.vue'
import tab1Ding from './tab1.vue'
// import commonDing from './commonVue/common.vue'
export default {
    data(){
        return {
            msg: "我是test",
            datas: [
                {test:"1111"},
                {test:"2222"},
                {test:"3333"}
            ]
        }
    },
    components: {
        tabDing,
        tab1Ding
        // commonDing
    }
}
</script>

<style scoped>
.big {
    font-size: 50px;
}
</style>
