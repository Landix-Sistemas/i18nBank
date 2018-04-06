import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

import Quasar, * as All from 'quasar-framework/dist/quasar.mat.esm.js'
import 'quasar-extras/material-icons'
import 'quasar-extras/fontawesome'

require('quasar-framework/dist/umd/quasar.mat.min.css')
require('quasar-extras/roboto-font')

// components: {
//   QLayout,
//   QToolbar,
//   QToolbarTitle,
//   QBtn,
//   QCard,
//   QCardMain,
//   QModal,
//   QModalLayout,
//   QIcon,
//   QInput,
//   QSelect,
//   QSearch,
//   QCheckbox
// }


Vue.use(Quasar, {
  components: All,
  directives: All
})
All.LocalStorage.install({ $q: Vue.prototype.$q })

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
