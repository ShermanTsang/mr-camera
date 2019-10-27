import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/index').default
    },
    {
      path: '/home/',
      name: 'home',
      component: require('@/pages/home').default
    },
    {
      path: '/workspace/',
      name: 'workspace',
      component: require('@/pages/workspace').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
