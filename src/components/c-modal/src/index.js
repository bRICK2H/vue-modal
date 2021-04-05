import CModalLayer from './c-modal-layer.vue'

export default {
	install(Vue) {
		const MODAL_CONTAINER = document.createElement('c-modal-container')
		MODAL_CONTAINER.id = 'modal-container'
		document.body.appendChild(MODAL_CONTAINER)


		class Modal {
			constructor() {
				this.vm = new Vue
				this.initInstances = []
				this.stateInstances = []
			}

			created(instance, name) {
				const EXIST_INDEX = this.initInstances.findIndex(curr => curr.name === name)
				if (EXIST_INDEX) {
					this.initInstances.splice(EXIST_INDEX, 1, instance)
				}
				
				this.initInstances.push(instance)

			}
			
			async open(name) {
				const CURR_MODAL = this.initInstances.find(curr => curr.name.includes(name))
				const MATCH_ON_EXISTING = this.stateInstances.some(curr => {
					return curr.name && curr.name.includes(name)
				})
				
				CURR_MODAL.isShow = true

				if (!MATCH_ON_EXISTING) {
					this.stateInstances.push(CURR_MODAL)
				}
				this.active(name)

				await this.vm.$nextTick()
				MODAL_CONTAINER.appendChild(CURR_MODAL.$refs[name])
				CURR_MODAL.$refs[name].focus()
			}

			active(name) {
				// console.log('active name', name)
				const TEMP_STATE_INSTANCES = this.stateInstances.map(curr => {
					curr.isActive = curr.name === name; return curr
				})
				const ACTIVE_INDEX = TEMP_STATE_INSTANCES.findIndex(curr => curr.isActive)
				TEMP_STATE_INSTANCES.push(...TEMP_STATE_INSTANCES.splice(ACTIVE_INDEX, 1))

				this.stateInstances = TEMP_STATE_INSTANCES.map((curr, i) => {
					curr.id = i; return curr
				})
			}

			close(id) {
				this.stateInstances[id].isActive = false
				this.stateInstances[id].isShow = false
				this.stateInstances.splice(id, 1)

				if (this.stateInstances.length) {
					const NEXT_INSTANCE = this.stateInstances[this.stateInstances.length - 1],
							REF = NEXT_INSTANCE.$refs,
							NEXT_ELEMENT = REF[Object.keys(REF)]

					NEXT_INSTANCE.isActive = true
					NEXT_ELEMENT.focus()
				}
			}
		}

		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}