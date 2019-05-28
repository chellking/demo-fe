
<template>
<div>
    <div v-for="item in datas">
        <p class="compTwo-big">{{ item.test }}</p>
        <h1>1、img 引用</h1>
        <img class="compTwo-img" src="../../apps/assets/img/widget/demo.png?__inline" alt="">
        <h1>2、css background 引用</h1> 
        <div class="compTwo-bg compTwo-img"></div>
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
.compTwo-big {
    font-size: 30px;
}
.compTwo-img {
    height: 100px;
    width: 100px;
}
.compTwo-bg {
    background-image: url('../../apps/assets/img/widget/demo.png')
}
</style>
