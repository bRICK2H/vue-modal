import CModalLayer from './c-modal-layer.vue'

export default {
	install(Vue) {
		const MODAL_CONTAINER = document.createElement('c-modal-container')
		MODAL_CONTAINER.id = 'modal-container'
		document.body.appendChild(MODAL_CONTAINER)


		class Modal {
			constructor() {
				this.vm = new Vue
				this.stateModals = []
			}

			created(instance, name) {
				const EXIST_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				if (EXIST_INDEX === -1) {
					this.stateModals.push(instance)
				} else {
					this.stateModals.splice(EXIST_INDEX, 1, instance)
				}
			}
			
			async open(name) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				this.stateModals[CURR_INDEX]['isShow'] = true
				
				await this.vm.$nextTick()
				MODAL_CONTAINER.appendChild(this.stateModals[CURR_INDEX].$refs[name])
				this.stateModals[CURR_INDEX].$refs[name].focus()
	
				this.active(name)
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
				const CHILD_INDEX = this.stateModals[CURR_INDEX].$children.reduce((acc, modal) => {
					if ('name' in modal) {
						const CHILD_INDEX = this.stateModals.findIndex(item => item.name === modal.name)
						acc = this.stateModals[CHILD_INDEX].isShow ? CHILD_INDEX : -1
					}

					return acc
				}, -1)


				new Promise((resolve) => {
					if (CHILD_INDEX !== -1) {
						this.stateModals[CHILD_INDEX].isShow = false
					} 

					resolve()
				}).then(() => {
					this.stateModals[CURR_INDEX].isActive = false
					this.stateModals[CURR_INDEX].isShow = false
					this.stateModals.unshift(...this.stateModals.splice(CURR_INDEX, 1))
					
					const CURR_ACTIVE_INDEX = this.stateModals
						.map(curr => curr.isShow)
						.lastIndexOf(true)

					if (CURR_ACTIVE_INDEX !== -1) {
						this.stateModals[CURR_ACTIVE_INDEX].isActive = true
						const REF = this.stateModals[CURR_ACTIVE_INDEX].$refs,
							NEXT_ELEMENT = REF[Object.keys(REF)]

						NEXT_ELEMENT.focus()
					}
				})

			}
		}

		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}