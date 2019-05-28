module.exports = {
  routes: [
    {
      name: 'typicalDemo',
      path: '/typicalDemo',
      component: './src/typicalDemoList.vue'
    },
    {
      name: 'typicalDemoadd',
      path: '/typicalDemo/add',
      component: './src/typicalDemoDetail.vue'
    },
    {
      name: 'typicalDemodetail',
      path: '/typicalDemo/detail/:id',
      component: './src/typicalDemoDetail.vue'
    }
  ]
};
