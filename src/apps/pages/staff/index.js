module.exports = {
  routes: [
    {
      path: '/staff',
      component: './src/staff-info.vue'
    },
    {
      path: '/staff/detail/:id',
      component: './src/staff-detail.vue'
    },
    {
      path: '/staff/add',
      component: './src/staff-add.vue'
    }
  ]
};
