export default {
  data: function(){
    return{
    }
  },
  created(){
    this.$pageMgr.createdPage(this);
  },
  mounted(){
    this.$pageMgr.mountedPage(this);
  },
  destroyed(){
    this.$pageMgr.destroyedPage(this);
  },
  methods:{
    getPageModel: function(callback){
      this.$pageMgr.getPageModel(this, callback);
    },
    triggerClick: function(btn){
      var args = [];
      if (arguments.length > 1){
        for(var i = 1; i < arguments.length; i++){
          args.push(arguments[i]);
        }
      }
      this.$pageMgr.triggerClick(this, btn, args);
    }
  }
}