module.exports = {
  routes: [
    {
      name:'pageExpenseAccountNew',
      path:'/pageExpenseAccountNew',
      component:'./src/pageExpenseAccountListNew.vue'
    },
    {
      name:'pageExpenseAccountDetailNew',
      path:'/pageExpenseAccount/new/detail/:id',
      component:'./src/pageExpenseAccountDetailNew.vue'
    },
  ]
}
