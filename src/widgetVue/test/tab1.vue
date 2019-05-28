
<template>
<div>
    <div v-for="item in datas">
        <p>{{ item.test  }}</p>
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
</style>
