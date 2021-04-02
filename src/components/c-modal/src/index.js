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
				this.active(name)
				this.storage.find(curr => curr.name.includes(name)).open()
			}

			active(name) {
				this.storage.forEach(curr => {
					curr.isActive = curr.name === name;
				})
			}

			close(name) {
				const index = this.storage.findIndex(curr => curr.isActive)
				console.log('close', name)
				this.storage[index].isActive = false
				this.storage[index].isShow = false
				this.storage.unshift(...this.storage.splice(index, 1))

				const is_show = this.storage.some(curr => curr.isShow)

				console.log(this.storage, is_show)
				if (is_show) {
					console.log('length')
					this.storage[this.storage.length - 1].isActive = true
				} else {
					console.log('else')
					this.storage.forEach(curr => {
						console.log(curr.isActive, curr.name, curr.isShow)
					})
				}
				
				// const index = this.storage.findIndex(curr => curr.name.includes(name))
				// this.storage[index].isShow = false
				// this.vm.$delete(this.storage, index)
				// this.storage[this.storage.length - 1].isActive = true;
				// console.log(index, name, this.storage)

				// const index = this.storage.findIndex(curr => curr.isActive)
				// this.storage[index].isShow = false
				// this.vm.$delete(this.storage, index)
				// // this.storage[this.storage.length - 1].isActive = true;
				// console.log(index, name, this.storage)
			}
		}

		Vue.prototype.$cModal = new Modal;
		Vue.component('c-modal', CModalLayer)
	}
}