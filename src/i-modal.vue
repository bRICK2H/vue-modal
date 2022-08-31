<template>
	<transition :name="transition"
		@enter="$emit('opened', $event)"
		@leave="$emit('closed', $event)"
	>
		<div class="i-modal-layer"
			v-if="isShow"
			:name="name"
			:ref="name"
			:class="setClassActiveLayerModal"
			:style="[setStylePositionLevelLayerModal, createVariablePositionModal]"
			tabindex="0"
			@keyup.esc="close($event)"
			@mousedown="layerClickToClose ? close($event) : false"
		>

			<div class="i-modal-container i-modal-layer__i-modal-container"
				:ref="containerRef"
				:style="[
					setStylePositionLevelModal,
					setStylePositionContainerModal,
					{ '--border-radius': isMobileMode ? '0' : '12px' }
				]"
				:class="setClassActiveContainerModal"
				@mousedown.stop="activate($event.target)"
			>
				<div class="i-modal-content i-modal-layer__i-modal-content"
					:ref="contentRef"
					:class="setClassActiveContentModal"
				>
					<div v-show="header"
						class="i-modal-header i-modal-content__i-modal-header"
						:ref="headerRef"
						:class="{ 'i-modal-header--draggable': draggable }"
						:style="setStylePositionPadding"
						@mousedown="draggable ? grab($event) : false"
						@mouseup="draggable ? leave() : false"
					>

						<slot name="header-content">
							<span class="i-header-title i-modal-header__i-header-title">
								{{ headerTitle }}
							</span>		
						</slot>

						<span v-show="buttonClose"
							class="i-header-close i-modal-header__i-header-close"
							:style="[setStyleHeaderTop, setStylePositionButtonClose]"
							@click="close"
							@mousedown.stop=""
						>
							<c-close />
						</span>
					</div>
					<div class="i-modal-body i-modal-content__i-modal-body"
						:class="{ 'i-modal-body--radius': header }"
						:style="setStyleBody"
						:ref="bodyRef"
					>
						<span v-show="buttonClose && !header"
							class="i-body-close i-modal-body__i-body-close"
							:style="setStylePositionButtonClose"
							@click="close"
						>
							<c-close />
						</span>
						<slot name="body-content" />
					</div>
				</div>
			</div>

		</div>
	</transition>
</template>

<script>
	import CClose from './components/svg/c-close'

	export default {
		name: ``,
		components: { CClose },
		props: {
			name: String,
			headerTitle: {
				type: String,
				default: ''
			},
			layer: {
				type: Boolean,
				default: true
			},
			header: {
				type: Boolean,
				default: true
			},
			layerClickToClose: {
				type: Boolean,
				default: true
			},
			buttonClose: {
				type: Boolean,
				default: true
			},
			closeButtonPosition: {
				type: String,
				default: 'right'
			},
			draggable: {
				type: Boolean,
				default: false
			},
			top: {
				type: [Number, String],
				default: 50
			},
			left: {
				type: [Number, String],
				default: 50
			},
			width: {
				type: [Number, String],
				default: 'auto'
			},
			height: {
				type: [Number, String],
				default: 'auto'
			},
			padding: {
				type: [Number, String],
				default: 32
			},
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			scrollable: {
				type: Boolean,
				default: false,
			},
			transition: {
				type: String,
				default: 'default'
			},
			isMobileMode: {
				type: Boolean,
				default: true
			},
			beforeOpen: {
				type: Function,
				default: () => true
			},
			beforeClose: {
				type: Function,
				default: () => true
			},
		},
		data: () => ({
			bodyRef: '',
			headerRef: '',
			containerRef: '',
			type: 'Modal',
			isShow: false,
			isActive: false,
			index: 0,
			isGrab: false,
			fTop: 0,
			fLeft: 0,
			offsetTop: 0,
			offsetLeft: 0,
			timeID: null,
			headerHeight: 0,
			initWidth: 0,
			initHeight: 0,
			totalWidth: 0,
			totalHeight: 0,
			pageWidth: 0,
			pageHeight: 0,
			initContentWidth: 0,
			initContentHeight: 0,
		}),
		computed: {
			isUsedModal() {
				return this.isActive && this.isShow
			},
			isSetCoords() {
				const props = this.$options.propsData
				return typeof (props?.top && props?.left) === 'number'
			},
			setStylePositionContainerModal() {
				return {
					top: `${this.fTop}px`,
					left: `${this.fLeft}px`,
					width: this.totalWidth ? `${this.totalWidth}px` : 'auto',
					height: this.totalHeight ? `${this.totalHeight}px` : 'auto'
				}
			},
			setStylePositionLevelModal() {
				return { zIndex: `${this.zIndex + this.index}` }
			},
			setStylePositionLevelLayerModal() {
				if (this.layer)
					return { zIndex: `${this.zIndex + (this.index - 1)}` }
			},
			createVariablePositionModal() {
				return {
					'--entryHeight': `${this.pageHeight + this.totalHeight}px`
				}
			},
			setStyleBody() {
				return {
					padding: String(this.padding).split(' ').map(p => `${p}px`).join(' '),
					height: this.header
						? `calc(100% - ${this.headerHeight}px)`
						: '100%',
					overflow: this.scrollable ? 'auto' : 'hidden'
				}
			},
			setStyleHeaderTop() {
				return { top: this.headerHeight > 50 ? '20px' : `${(this.headerHeight / 2) - 12.5}px` }
			},
			setStylePositionButtonClose() {
				return this.closeButtonPosition === 'left'
					? { left: '20px' }
					: { right: '20px' }
			},
			setStylePositionPadding() {
				if (!this.buttonClose) return null
				
				return this.closeButtonPosition === 'left'
					? { paddingLeft: '64px' }
					: { paddingRight: '64px' }
			},
			setClassActiveContainerModal() {
				return { 'i-modal-container--active': this.isActive }
			},
			setClassActiveContentModal() {
				return { 'i-modal-content--active': this.isActive }
			},
			setClassActiveLayerModal() {
				return { 'i-modal-layer--active': this.layer }
			}
		},
		methods: {
			activate(target) {
				if(target.tagName === 'BUTTON') return
				this.$.active(this.name)
			},
			grab(e) {
				this.isGrab = true;
				this.offsetTop = e.layerY;
				this.offsetLeft = e.layerX;
				this.fTop = e.clientY - e.layerY
				this.fLeft = e.clientX - e.layerX
			},
			leave() {
				this.isGrab = false;
				this.$emit('drag-coords', { x: this.fLeft, y: this.fTop })
			},
			async close(e) {
				const { key } = e
				const isDialog = this.isActive
					? await this.beforeClose()
					: false

				if (!this.isActive) this.$.active(this.name)
				if (isDialog || isDialog === undefined || typeof isDialog === 'string') {
					this.$.totalClose(this.name)
				} else {
					if (this.$refs[this.name] && key === 'Escape') {
						this.$refs[this.name].focus()
					}
				}
			},
			async setAdaptiveModal() {
				const bodyNode = this.$refs[this.bodyRef]
					, isMobile = innerWidth <= 768 && this.isMobileMode

				this.pageWidth = innerWidth
				this.pageHeight = innerHeight

				if (isMobile) {
					this.totalWidth = innerWidth
					this.totalHeight = innerHeight
				} else {
					this.totalWidth = this.width !== 'auto'
						? this.initWidth > innerWidth
							? innerWidth
							: this.initWidth
						: null
					this.totalHeight = this.height !== 'auto' ? this.initHeight : null
				}

				if (this.isSetCoords) {
					this.fLeft = isMobile
						? 0
						: innerWidth - this.initWidth <= +this.left
							? innerWidth - this.initWidth
							: +this.left
					this.fTop = isMobile ? 0 : +this.top
				} else {
					await this.$nextTick()

					const contentNode = this.$refs[this.contentRef]
						,	contentWidth = contentNode.offsetWidth
						,  contentHeight = contentNode.offsetHeight
					
					this.fLeft = isMobile
						? 0
						: this.initWidth > innerWidth
							? 0
							: (innerWidth - this.initWidth) / 2
					this.fTop = isMobile
						? 0 : (innerHeight - contentHeight) / 2
				}

				Promise.resolve().then(() =>  this.$emit('body-height', bodyNode.offsetHeight))
			}
		},
		watch: {
			async isShow(show) {
				await this.$nextTick()

				if (show) {
					const {
						containerWidth,
						containerHeight
					} = await Promise.resolve()
							.then(() => {
								const containerNode = this.$refs[this.containerRef]
								return {
									containerWidth: containerNode.offsetWidth,
									containerHeight: containerNode.offsetHeight
								}
							})

					const headerNode = this.$refs[this.headerRef]

					this.initWidth = this.width !== 'auto' ? this.width : containerWidth
					this.initHeight = this.height !== 'auto' ? this.height : containerHeight
					this.headerHeight = headerNode.offsetHeight

					if (this.isSetCoords) {
						this.fLeft = +this.left
						this.fTop = +this.top
					}

					this.setAdaptiveModal()
				}
			},
			isUsedModal(active) {
				this.$emit('active', { name: this.name, active })
			},
			name(name) {
				this.$.created(this, this.name)
			}
		},
		created() {
			this.bodyRef = `body-ref:${String(Math.random()).slice(2, 10)}`
			this.headerRef = `header-ref:${String(Math.random()).slice(2, 10)}`
			this.contentRef = `header-ref:${String(Math.random()).slice(2, 10)}`
			this.containerRef = `body-ref:${String(Math.random()).slice(2, 10)}`
			

			this.$.created(this, this.name)
			
			window.addEventListener('resize', ({ target }) => {
				if (this.isShow) {
					clearInterval(this.timeID)
					this.timeID = setTimeout(() => this.setAdaptiveModal())
				}
			})

			// Закрываем модальное окно, при изменение location href
			window.addEventListener('popstate', () => {
				if (this.isShow) {
					this.$.totalClose(this.name)
				}
			})

			document.body.addEventListener('mousemove', e => {
				if (this.isGrab) {
					this.fTop = e.clientY - this.offsetTop
					this.fLeft = e.clientX - this.offsetLeft
				}
			})

		},
		beforeDestroy() {
			if (this.isShow) {
				this.$.totalClose(this.name)
			}
		}
	}
</script>

<style lang="scss">
	.i-modal-layer {
		user-select: none;
		
		&__i-modal-container {
			position: fixed;
			transform: perspective(1000px) rotateX(0deg);
		}

		&--active {
			width: 100%;
			height: 100vh;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0,0,0, .5);
		}
	}

	.i-modal-container {
		user-select: none;
		border-radius: 12px;
		box-shadow: 0 7px 25px -3.5px #5b5b5b;
		background-color: #dfdfdf;
		filter: blur(1px);
		display: flex;
		flex-direction: column;
		transition: box-shadow .2s;

		&--active {
			background: #fff;
			box-shadow: 0px 20px 70px rgba(32, 31, 54, .7);
			filter: blur(0);
		}

		@media screen and (max-width: 768px) {
			& { border-radius: var(--border-radius); }
		}
	}

	.i-modal-content {
		height: 100%;
		opacity: .3;
		
		&--active {
			opacity: 1;
		}
	}

	// .body-content {
	// 	width: fit-content;
	// }

	.i-modal-header {
		width: 100%;
		height: auto;
		font-size: 20px;
		position: relative;
		font-weight: bold;
		border-bottom: 2px solid #eeedf7;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		display: flex;
		align-items: center;


		&--draggable {
			&:hover {
				cursor: grab;
			}

			&:active {
				cursor: grabbing;
			}
		}

		&__i-header-title {
			margin: 32px 0 32px 32px;
		}
		&__i-header-close {
			position: absolute;

			&:hover {
				filter: brightness(0);
				animation: cross-move .4s forwards;

				@keyframes cross-move {
					100% { transform: scale(1.1) rotate(90deg) }
				}
			}
		}
	}
	.i-header-title {
		word-break: break-all;
	}
	.i-header-close,
	.i-body-close {
		height: auto;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.i-modal-body {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 12px;

		&--radius {
			border-top-right-radius: 0;
			border-top-left-radius: 0;
		}
		&__i-body-close {
			position: absolute;
			top: 20px;
			z-index: 10;

			&:hover {
				filter: brightness(0);
				animation: cross-move .4s forwards;

				@keyframes cross-move {
					100% { transform: scale(1.1) rotate(90deg) }
				}
			}
		}

		@media screen and (max-width: 768px) {
			& { border-radius: 0px; }
		}
	}

	.default-enter-active,
	.rotate-enter-active {
		animation: .4s common-enter;
		@keyframes common-enter {
			0% { opacity: 0; }
		}
	}
	.default-leave-active,
	.rotate-leave-active {
		animation: .4s common-leave;
		@keyframes common-leave {
			100% { opacity: 0; }
		}
	}
	.default-enter-active .i-modal-container {
		animation: .4s default-enter;
		@keyframes default-enter {
			0% { top: var(--entryHeight) }
		}
	}
	.rotate-enter-active .i-modal-container {
		animation: .4s rotate-enter;
		@keyframes rotate-enter {
			0% { transform: perspective(1000px) rotateY(-90deg); }
		}
	}
	.default-leave-active .i-modal-container {
		animation: .4s default-leave;
		@keyframes default-leave {
			100% { top: var(--entryHeight) }
		}
	}
	.rotate-leave-active .i-modal-container {
		animation: .4s rotate-leave;
		@keyframes rotate-leave {
			100% { transform: perspective(1000px) rotateX(-90deg); }
		}
	}
</style>