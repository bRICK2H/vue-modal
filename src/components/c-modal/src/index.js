import CModalLayer from './c-modal-layer.vue'

export default {
	install(Vue) {
		const MODAL_CONTAINER = document.createElement('c-modal-container')
		MODAL_CONTAINER.id = 'modal-container'
		document.body.appendChild(MODAL_CONTAINER)


		class Modal {
			constructor() {
				this.vm = new Vue
				// this.initInstances = []
				// this.stateInstances = []
				this.stateModals = []
			}

			created(instance, name) {
				const EXIST_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				if (EXIST_INDEX === -1) {
					this.stateModals.push(instance)
				}
				
				console.log('created: ', this.stateModals)
			}

			// created(instance, name) {
			// 	const EXIST_INDEX = this.initInstances.findIndex(curr => curr.name === name)
			// 	if (EXIST_INDEX) {
			// 		this.initInstances.splice(EXIST_INDEX, 1, instance)
			// 	}
				
			// 	this.initInstances.push(instance)

			// }
			
			async open(name) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				this.stateModals[CURR_INDEX]['isShow'] = true
				
				await this.vm.$nextTick()
				console.log(this.stateModals, CURR_INDEX, name, this.stateModals[CURR_INDEX].$refs[name])/
				MODAL_CONTAINER.appendChild(this.stateModals[CURR_INDEX].$refs[name])
				this.stateModals[CURR_INDEX].$refs[name].focus()
	
				this.active(name)
				console.log('open: ', this.stateModals)
			}

			active(name) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)

				this.stateModals = this.stateModals.map(curr => {
					curr.isActive = curr.name === name
					return curr
				})
				this.stateModals.push(...this.stateModals.splice(CURR_INDEX, 1))
			}

			close(name) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				this.stateModals[CURR_INDEX].isActive = false
				this.stateModals[CURR_INDEX].isShow = false
				this.stateModals.unshift(...this.stateModals.splice(CURR_INDEX, 1))

				const MODIFY_STATE_MODAL = this.stateModals.reduce((acc, curr) => {
					acc.push(curr.isShow)
					return acc
				}, [])
				console.log('MODIFY_STATE_MODAL: ', MODIFY_STATE_MODAL)
				const CURR_ACTIVE_INDEX = MODIFY_STATE_MODAL.lastIndexOf(true)
				console.log(CURR_ACTIVE_INDEX)
				if (CURR_ACTIVE_INDEX !== -1) {
					this.stateModals[CURR_ACTIVE_INDEX].isActive = true
					const REF = this.stateModals[CURR_ACTIVE_INDEX].$refs,
							NEXT_ELEMENT = REF[Object.keys(REF)]

					console.log({ REF, NEXT_ELEMENT }, this.stateModals)
					NEXT_ELEMENT.focus()
				}
			}
			
			// async open(name) {
			// 	const CURR_MODAL = this.initInstances.find(curr => curr.name.includes(name))
			// 	const MATCH_ON_EXISTING = this.stateInstances.some(curr => {
			// 		return curr.name && curr.name.includes(name)
			// 	})
				
			// 	CURR_MODAL.isShow = true

			// 	if (!MATCH_ON_EXISTING) {
			// 		this.stateInstances.push(CURR_MODAL)
			// 	}
			// 	this.active(name)

			// 	await this.vm.$nextTick()
			// 	MODAL_CONTAINER.appendChild(CURR_MODAL.$refs[name])
			// 	CURR_MODAL.$refs[name].focus()
			// }

			// active(name) {
			// 	// console.log('active name', name)
			// 	const TEMP_STATE_INSTANCES = this.stateInstances.map(curr => {
			// 		curr.isActive = curr.name === name; return curr
			// 	})
			// 	const ACTIVE_INDEX = TEMP_STATE_INSTANCES.findIndex(curr => curr.isActive)
			// 	TEMP_STATE_INSTANCES.push(...TEMP_STATE_INSTANCES.splice(ACTIVE_INDEX, 1))

			// 	this.stateInstances = TEMP_STATE_INSTANCES.map((curr, i) => {
			// 		curr.id = i; return curr
			// 	})
			// }

			// close(id) {
			// 	this.stateInstances[id].isActive = false
			// 	this.stateInstances[id].isShow = false
			// 	this.stateInstances.splice(id, 1)

			// 	if (this.stateInstances.length) {
			// 		const NEXT_INSTANCE = this.stateInstances[this.stateInstances.length - 1],
			// 				REF = NEXT_INSTANCE.$refs,
			// 				NEXT_ELEMENT = REF[Object.keys(REF)]

			// 		NEXT_INSTANCE.isActive = true
			// 		NEXT_ELEMENT.focus()
			// 	}
			// }
		}

		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}