<template>
    <div class="operator-container">
      <div class="fl">
        <slot name="left"></slot>
      </div>
      <slot></slot>
    </div>

</template>
<script>
  export default {
    data: function(){
      return {}
    }
  }
</script>