import CModalLayer from './c-modal-layer.vue'

export default {
	// install(Vue, Parent) {
	// 	Parent.$modalContainer = []
	// 	console.log('options: ', Parent)

	// 	const root = new Vue(CModalLayer);
	// 	const container = document.createElement('c-modal-container')
	// 	container.id = 'c-modal-container'
	// 	document.body.appendChild(container)

	// 	root.register(Vue, CModalLayer, container, Parent)
	// 	Vue.prototype.$cmodal = root
	// }

	install(Vue) {
		Vue.prototype.$modalContainer = []
		
		const container = document.createElement('c-modal-container')
		container.id = 'modal-container'
		document.body.appendChild(container)


		class Modal {
			constructor() {
				this.vm = new Vue
				this.storage = this.vm.$modalContainer
			}

			created(instance) {
				this.storage.push(instance)
			}
			
			open(name) {
				console.log('open')
				// const Modal = Vue.extend(CModalLayer)
				// this.storage.push(new Modal);
				// console.log(this.storage)
				this.active(name)
				this.storage.find(curr => curr.name.includes(name)).open()
			}

			active(name) {
				this.storage.forEach(curr => {
					curr.isActive = curr.name === name;
				})
			}

			close(name) {
				const index = this.storage.findIndex(curr => curr.name.includes(name))
			}
		}

		Vue.prototype.$cModal = new Modal;
		Vue.component('c-modal', CModalLayer)
	}
}