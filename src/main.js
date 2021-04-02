import Vue from 'vue'
import App from './App.vue'

// import initModal from './components/c-modal'
// const { loader, } = initModal;


// Vue.config.productionTip = false

// const parent = new Vue({
//   render: h => h(App),
// }).$mount('#app')

// Vue.use(loader, parent)

import cModal from './components/c-modal'
Vue.config.productionTip = false

Vue.use(cModal)

new Vue({
  render: h => h(App),
}).$mount('#app')