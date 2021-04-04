import CModalLayer from './c-modal-layer.vue'

export default {
	install(Vue) {
		Vue.prototype.$modalContainerActive = []
		
		const container = document.createElement('c-modal-container')
		container.id = 'modal-container'
		document.body.appendChild(container)


		class Modal {
			constructor() {
				this.vm = new Vue
				this.initInstances = []
				this.storageInstances = this.vm.$modalContainerActive
			}

			created(instance) {
				this.initInstances.push(instance)
			}
			
			open(name) {
				const currVue = this.initInstances.find(curr => curr.name.includes(name))
				const existVue = this.storageInstances.some(curr => {
					return curr.name && curr.name.includes(name)
				})

				if (!existVue) {
					this.storageInstances.push(currVue)
				}

				this.active(name)
				currVue.open()
				console.log('open: ', this.storageInstances)
			}

			active(name) {
				const tmp = this.storageInstances
					.map(curr => {
						curr.isActive = curr.name === name
						return curr
					})
				const activeIndex = tmp.findIndex(curr => curr.isActive)
				tmp.push(...tmp.splice(activeIndex, 1))

				this.storageInstances = tmp.map((curr, i) => {
					curr.id = i
					console.log('act: ', curr.isActive)
					return curr
				})
			}

			close(name) {
				console.log('close name: ', name, this.storageInstances)
				const activeIndex = this.storageInstances.findIndex(curr => curr.name === name)
				if (activeIndex !== -1) {
					// console.log('activeIndes: ', activeIndex)
					this.storageInstances[activeIndex].isShow = false
					// this.vm.$delete(this.storageInstances, activeIndex)
					this.storageInstances.splice(activeIndex, 1)
				}
				
				// const lastIndex = this.storageInstances.length - 1
				// this.storageInstances[lastIndex].isShow = false
				// this.vm.$delete(this.storageInstances, lastIndex)
				if (this.storageInstances.length) {
					setTimeout(() => {
						this.storageInstances[this.storageInstances.length - 1].isActive = true
						console.log('close: ', this.storageInstances)

					}, 100)
				}

			}
		}

		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}