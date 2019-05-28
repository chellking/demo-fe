<template>
<div>
    <div v-for="item in datas">
        <p class="compOne-big">{{ item.test  }}</p>
        <h1>1、img 引用</h1>
        <img class="compOne-img" src="../../apps/assets/img/widget/demo.png?__inline" alt="">
        <h1>2、css background 引用</h1> 
        <div class="compOne-bg compOne-img"></div>
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
.compOne-big {
    font-size: 40px;
}
.compOne-img {
    height: 100px;
    width: 100px;
}
.compOne-bg {
    background-image: url('../../apps/assets/img/widget/demo.png')
}
</style>
