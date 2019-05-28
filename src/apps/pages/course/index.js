module.exports = {
  routes: [//页面路由
    {//列表页面(默认打开)
      name: 'course',
      path: '/course',
      component: './src/courseList.vue'
    },
    {//新增页面
      name: 'courseAdd',
      path: '/course/add',
      component: './src/courseAdd.vue'
    },
    {//编辑页面
      name: 'courseDetail',
      path: '/course/detail/:id',
      component: './src/courseDetail.vue'
    }
  ]
};
