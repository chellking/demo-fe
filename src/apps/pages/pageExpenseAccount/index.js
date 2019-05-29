module.exports = {
    routes: [
        {
            name: 'pageExpenseAccount',
            path: '/pageExpenseAccountDemo',
            component: './src/pageExpenseAccountList.vue'
        },
        {
            name: 'pageExpenseAccountDetail',
            path: '/pageExpenseAccountDemo/detail/:id',
            component: './src/pageExpenseAccountDetail.vue'
        },
    ]
}
