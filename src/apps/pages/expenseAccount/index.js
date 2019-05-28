module.exports = {
  routes: [
    {
      name:'expenseAccount',
      path:'/expenseAccount',
      component:'./src/expenseAccountList.vue'
    },
    {
      name:'expenseAccountDetail',
      path:'/expenseAccount/detail/:id',
      component:'./src/expenseAccountDetail.vue'
    },
  ]
}
