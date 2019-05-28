<template>
  <div class='ifbp-table-tooltip'>
    {{this.name}}
  </div>
</template>
<script>

  export default {
    props:{
      name:{
      }
    },
    data: function(){
      return {}
    }
  }
</script>

<style>
.ifbp-table-tooltip{
  width: 200px;
  height: 200px;
  background: red;
}
</style>
