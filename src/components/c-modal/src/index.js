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
				const MODALS_HELL = []
				
				const gen = function* (stateModals, currModal) {
					if (currModal) {
						const CHILD_INDEX = currModal.$children.reduce((acc, modal) => {
							if ('name' in modal) {
								const CHILD_INDEX = stateModals.findIndex(item => item.name === modal.name)
								acc = currModal.isShow ? CHILD_INDEX : -1
							}
	
							return acc
						}, -1)

						yield CHILD_INDEX
						
						// if (CHILD_INDEX !== -1 && stateModals[CHILD_INDEX].isShow) {
						// 	console.log('good')
						// 	console.log(stateModals[CHILD_INDEX])
						// 	return
						// } else if (CHILD_INDEX === -1) {
						// 	console.log('else ch')
						// }

						MODALS_HELL.unshift(currModal)
						yield* gen(stateModals, stateModals[CHILD_INDEX])
					} else {
						console.log('else', MODALS_HELL)
						MODALS_HELL.forEach((curr, i) => {
							setTimeout(() => {
								curr.isShow = false;
							}, i * 100)
						})
					}
				
				}

				const iterator = gen(this.stateModals, this.stateModals[CURR_INDEX])

				for(const item of iterator) {
					console.log('item: ', item, iterator)
				}
				
				
				// console.log('before: ', this.stateModals)
				// const MODALS_HELL = []
				// const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)

				// const REC = function (stateModals, currModal) {
				// 	const CHILD_INDEX = currModal.$children.reduce((acc, modal) => {
				// 		if ('name' in modal && modal.name) {
				// 			const CHILD_INDEX = stateModals.findIndex(item => item.name === modal.name)
				// 			acc = stateModals[CHILD_INDEX].isShow ? CHILD_INDEX : -1
				// 		}

				// 		return acc
				// 	}, -1)

				// 	// console.log('CHILD_INDEX', CHILD_INDEX)
				// 	MODALS_HELL.unshift(currModal)

				// 	return CHILD_INDEX !== -1
				// 		? REC(stateModals, stateModals[CHILD_INDEX])
				// 		: MODALS_HELL
				// }

				// console.log('REC: ', REC(this.stateModals, this.stateModals[CURR_INDEX]))

				// new Promise((resolve) => {
				// 	console.log('MODALS_HELL: ', MODALS_HELL)
				// 	MODALS_HELL.forEach((curr, i) => {
				// 		setTimeout(() => {
				// 			const EX_INDEX = this.stateModals.findIndex(modal => modal.name === curr.name)
				// 			curr.isActive = false
				// 			curr.isShow = false
				// 			this.stateModals.unshift(...this.stateModals.splice(EX_INDEX, 1))
				// 		}, i * 100)
				// 	})

				// 	if (MODALS_HELL.length === 1) {
				// 		console.log('1')
				// 		resolve()
				// 	} else if (MODALS_HELL.length === 2) {
				// 		console.log('2')
				// 	} else {
				// 		console.log('> 2')
				// 	}

				// }).then(() => {
				// 	console.log('currModal: ', this.stateModals[CURR_INDEX])
				// 	this.stateModals[CURR_INDEX].isActive = false
				// 	this.stateModals[CURR_INDEX].isShow = false
				// 	// this.lstateModals.unshift(...this.stateModals.splice(CURR_INDEX, 1))

				// 	const CURR_ACTIVE_INDEX = this.stateModals
				// 		.map(curr => curr.isShow)
				// 		.lastIndexOf(true)

				// 	if (CURR_ACTIVE_INDEX !== -1) {
				// 		this.stateModals[CURR_ACTIVE_INDEX].isActive = true
				// 		const REF = this.stateModals[CURR_ACTIVE_INDEX].$refs,
				// 			NEXT_ELEMENT = REF[Object.keys(REF)]

				// 		NEXT_ELEMENT.focus()
				// 	}
				// })


				
				
				
				
				
				// nested
				// const CHILD_INDEX = this.stateModals[CURR_INDEX].$children.reduce((acc, modal) => {
				// 	if ('name' in modal) {
				// 		const CHILD_INDEX = this.stateModals.findIndex(item => item.name === modal.name)
				// 		acc = this.stateModals[CHILD_INDEX].isShow ? CHILD_INDEX : -1
				// 	}

				// 	return acc
				// }, -1)


				// new Promise((resolve) => {
				// 	if (CHILD_INDEX !== -1) {
				// 		this.stateModals[CHILD_INDEX].isShow = false
				// 	} 

				// 	resolve()
				// }).then(() => {
				// 	this.stateModals[CURR_INDEX].isActive = false
				// 	this.stateModals[CURR_INDEX].isShow = false
				// 	this.stateModals.unshift(...this.stateModals.splice(CURR_INDEX, 1))
					
				// 	const CURR_ACTIVE_INDEX = this.stateModals
				// 		.map(curr => curr.isShow)
				// 		.lastIndexOf(true)

				// 	if (CURR_ACTIVE_INDEX !== -1) {
				// 		this.stateModals[CURR_ACTIVE_INDEX].isActive = true
				// 		const REF = this.stateModals[CURR_ACTIVE_INDEX].$refs,
				// 			NEXT_ELEMENT = REF[Object.keys(REF)]

				// 		NEXT_ELEMENT.focus()
				// 	}
				// })

			}
		}

		Vue.prototype.$cModal = new Modal
		Vue.component('c-modal', CModalLayer)
	}
}