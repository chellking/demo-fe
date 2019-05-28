<template>
    <div class="form-button-div">
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
<style>
  .form-button-div{
    /* border-top: 1px dotted #cecece; */
    /*padding-top: 10px;*/
    /*padding-right: 15px;*/
    /*position: relative;
    margin-top: 16px;
    margin-bottom: 4px;
    overflow: hidden;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;*/
  }
  .form-button-div .el-button{
    /*float: right;
    margin-right: 16px;*/
  }
</style>
