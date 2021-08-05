import IModal from './i-modal.vue'
import IDialog from './i-dialog.vue'

export default {
	install(Vue) {
		const MODAL_CONTAINER = document.createElement('izi-modal-container')
		const DIALOG_CONTAINER = document.createElement('izi-dialog')
		const ref_dialog = document.createElement('ref-dialog')

		document.body.appendChild(MODAL_CONTAINER)
		MODAL_CONTAINER.appendChild(DIALOG_CONTAINER)
		DIALOG_CONTAINER.appendChild(ref_dialog)

		class Dialog {
			constructor() {
				this.properties = ['width', 'clickClose', 'title', 'text', 'type', 'buttons']
				this.dialog = new Vue(IDialog).$mount('ref-dialog')
			}
			open(options = {}) {
				return new Promise(resolve => {
					this.dialog.$set(this.dialog.$props, 'handler', result => resolve(result))
					this.properties.forEach(property => {
						if (options[property] !== undefined) {
							this.dialog.$set(
								this.dialog.$props,
								property,
								options[property]
							)
						}
					})

					this.dialog.open()
				})
			}
		}

		class Modal {
			constructor(modalContainer) {
				this.vm = new Vue
				this.stateModals = []
				this.modalContainer = modalContainer
			}

			created(instance, name) {
				const EXIST_INDEX = this.stateModals.findIndex(curr => curr.name === name)

				if (EXIST_INDEX === -1) {
					this.stateModals.push(instance)
				} else {
					this.stateModals.splice(EXIST_INDEX, 1, instance)
				}
			}

			async open(name, f_cb = () => ({})) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)
				const BEFORE_OPEN = await this.stateModals[CURR_INDEX].beforeOpen()

				if (BEFORE_OPEN === false) return;
				this.stateModals[CURR_INDEX]['isShow'] = true

				await this.vm.$nextTick()
				MODAL_CONTAINER.appendChild(this.stateModals[CURR_INDEX].$refs[name])
				this.stateModals[CURR_INDEX].$refs[name].focus()

				this.active(name)
				f_cb()
			}

			active(name) {
				const CURR_INDEX = this.stateModals.findIndex(curr => curr.name === name)

				this.stateModals.push(...this.stateModals.splice(CURR_INDEX, 1))
				this.stateModals = this.stateModals.map((curr, index) => {
					curr.isActive = curr.name === name
					curr.index = index
					return curr
				})
			}

			close(name, f_cb = () => ({})) {
				const MODALS_HELL = []
				const CURR_MODAL = this.stateModals.find(curr => curr.name === name)
				const MODAL_GENERATOR = function* (currModal) {
					if (currModal) {
						const MODAL_RESULT = currModal.$children.reduce((acc, modal) => {
							if ('type' in modal && modal.type === 'Modal') {
								const { isShow } = modal

								acc = {
									nextModal: isShow ? modal : null,
									isChild: true,
									isChildOpen: isShow,
									aboutModal: isShow
										? 'has an open child'
										: 'has a closed child',
									childModal: isShow ? modal : null,
									currModal,
									parentModal: currModal.$parent.type === 'Modal'
										? currModal.$parent
										: null
								}
							} else {
								acc = {
									nextModal: null,
									isChild: false,
									aboutModal: 'don\'t have a child',
									childModal: null,
									currModal,
									parentModal: currModal.$parent.type === 'Modal'
										? currModal.$parent
										: null
								}
							}

							return acc
						}, { nextModal: null })

						if (!MODAL_RESULT.nextModal) {
							yield MODAL_RESULT; return
						}

						yield MODAL_RESULT
						yield* MODAL_GENERATOR(MODAL_RESULT.nextModal)
					}
				}

				const MODAL_ITERATOR = MODAL_GENERATOR(CURR_MODAL)

				for (const result of MODAL_ITERATOR) {
					const { currModal } = result
					MODALS_HELL.unshift(currModal)
				}

				MODALS_HELL.forEach((curr, i) => {
					if (this.stateModals.map(modal => modal.name === curr.name)) {
						const INDEX_MODAL_IN_STATE = this.stateModals.findIndex(modal => modal.name === curr.name)

						setTimeout(() => {
							new Promise((resolve => {
								curr.isShow = false
								curr.isActive = false
								this.stateModals.unshift(...this.stateModals.splice(INDEX_MODAL_IN_STATE, 1))

								const CURR_ACTIVE_INDEX = this.stateModals
									.map(curr => curr.isShow)
									.lastIndexOf(true)

								if (CURR_ACTIVE_INDEX !== -1) {
									this.stateModals[CURR_ACTIVE_INDEX].isActive = true
									const REF = this.stateModals[CURR_ACTIVE_INDEX].$refs,
										NEXT_ELEMENT = REF[Object.keys(REF)]

									NEXT_ELEMENT.focus()
								}

								resolve()

							})).then(() => {
								this.clearComments()
								f_cb()
							})

						}, i * 100)

					}
				})
			}

			clearComments() {
				if (this.modalContainer.firstChild) {
					this.modalContainer.childNodes.forEach(curr => {
						if (curr.nodeName === '#comment') {
							this.modalContainer.removeChild(curr)
						}
					})
				}
			}
		}

		Vue.prototype.$iziModal = new Modal(MODAL_CONTAINER)
		Vue.prototype.$iziDialog = new Dialog

		Vue.component('izi-modal', IModal)
	}
}