<template>
<div>
    <div v-for="item in datas">
        <p class="common-big">{{ item.test  }}</p>
        <h1>1、img 引用</h1>
        <img class="common-img" src="../../apps/assets/img/widget/demo.png?__inline" alt="">
        <h1>2、css background 引用</h1> 
        <div class="common-bg common-img"></div>
    </div>
</div>
   
</template>

<script>
export default {
  props: {
    datas: []
  }
};
</script>

<style scoped>
.common-big {
    font-size: 35px;
}
.common-img {
    height: 100px;
    width: 100px;
}
.common-bg {
    background-image: url('../../apps/assets/img/widget/demo.png')
}
</style>
