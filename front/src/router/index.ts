import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/default.vue'),
    children: [
      { path: '/', component: () => import('../pages/Index.vue') },
      { path: '/login', component: () => import('../pages/Login.vue') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('../pages/404.vue')
  }
]

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: 'hash', // process.env.VUE_ROUTER_MODE,
  // base: process.env.VUE_ROUTER_BASE,
  // scrollBehavior: () => ({ y: 0 }),
  routes
})

export default Router
