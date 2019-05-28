module.exports = {
  routes: [
    {
      name:'pageExpenseAccount',
      path:'/pageExpenseAccount',
      component:'./src/pageExpenseAccountList.vue'
    },
    {
      name:'pageExpenseAccountDetail',
      path:'/pageExpenseAccount/detail/:id',
      component:'./src/pageExpenseAccountDetail.vue'
    },
  ]
}
