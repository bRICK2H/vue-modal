import cSelect from './c-select.vue'

export default {
	install(Vue) {
		Vue.component('cSelect', cSelect)
		
		Vue.prototype.$select = []
		Vue.prototype.$test = () => {
			console.log('here', this)
		}
		
	}
}