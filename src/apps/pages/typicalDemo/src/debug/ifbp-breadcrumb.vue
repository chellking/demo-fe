<template>
  <div class="title-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in pathArray" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
      // <h2 class="name"><slot></slot></h2>
  export default {
    props:{
      name:{
        type:String
      },
    },
    data: function(){
      return {
        // pathArray:[{'name':'首页','path':'/'},{'name':'列表','path':'/typicalDemo/add'}] 
        pathArray:[] 
      }
    },
    created: function(){
      // debugger;
      var currPath = window.vueInstance.$route.path;
      var pathStatck;
      var tile = this.$context.getCurrentTile();
      if (!tile){
        var tilecode = this.$context.getCurrentTileCode();
        if (tilecode){
          var tileInfo = this.$context.getTileByCode(tilecode);
          if (tileInfo){
            tile = this.$context.createTile(tilecode, tileInfo.label, tileInfo.path);
          }
        }
      }
      if (tile){
        tile.pushPath({name:this.name,path:currPath});
        pathStatck = tile.getPathStack();
      }else{
        pathStatck = [{name:this.name,path:currPath}];
      }
      this.pathArray = pathStatck;
    }
  }
</script>