import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../layouts/default.vue'),
    children: [
      { path: '', component: () => import('../pages/index.vue') },
      { path: '/login', component: () => import('../pages/login.vue') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('../pages/404.vue')
  }
]

const Router = new VueRouter({
  // mode: 'history',
  // base: '',
  // scrollBehavior: () => ({ y: 0 }),
  routes
})

export default Router
