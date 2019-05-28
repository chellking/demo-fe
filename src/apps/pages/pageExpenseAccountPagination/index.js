module.exports = {
  routes: [
    {
      name:'pageExpenseAccountPagination',
      path:'/pageExpenseAccountPagination',
      component:'./src/pageExpenseAccountPaginationList.vue'
    },
    {
      name:'pageExpenseAccountPaginationDetail',
      path:'/pageExpenseAccountPagination/detail/:id',
      component:'./src/pageExpenseAccountPaginationDetail.vue'
    },
  ]
}
