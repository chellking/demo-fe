<template>
  <div :class="type == 'list' ? 'list-main-container' : type == 'detail' ? 'detail-main-container' : '' + ' clearfix'">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props:{
      type:{
        type:String,
        default:'list'
      }
    },
    data: function(){
      return {}
    },
  }
</script>