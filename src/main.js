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

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect)

Vue.use(cModal)

// pack
import VModal from 'vue-js-modal'
Vue.use(VModal)

new Vue({
  render: h => h(App),
}).$mount('#app')