import CModalLayer from './c-modal-layer.vue'

export default {
	install(Vue) {
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
					return curr
				})
			}

			close(id) {
				this.storageInstances[id].isActive = false
				this.storageInstances[id].isShow = false
				this.storageInstances.splice(id, 1)

				if (this.storageInstances.length) {
					const nextInstance = this.storageInstances[this.storageInstances.length - 1],
							ref = nextInstance.$refs,
							nextElement = ref[Object.keys(ref)]

					nextInstance.isActive = true
					nextElement.focus()
				}
			}
		}

		Vue.prototype.$modalContainerActive = []
		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}