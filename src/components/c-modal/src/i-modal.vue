<template>
	<transition :name="transition">
		<div class="i-modal-layer"
			v-if="isShow"
			:ref="name"
			:class="setClassActiveLayerModal"
			:style="setStylePositionLevelLayerModal"
			tabindex="0"
			@keyup.esc="close"
			@click="layerClickToClose ? close() : false"
		>

			<div class="i-modal-container i-modal-layer__i-modal-container"
				:style="[setStylePositionContainerModal, setStylePositionLevelModal]"
				:class="setClassActiveContainerModal"
				@mousedown="activate($event.target)"
				@click.stop=""
			>
				<div class="i-modal-content i-modal-layer__i-modal-content"
					:class="setClassActiveContentModal"
				>
					<div v-show="header"
						class="i-modal-header i-modal-content__i-modal-header"
						:class="{ 'i-modal-header--draggable': draggable }"
						@mousedown="draggable ? grab($event) : false"
						@mouseup="draggable ? leave() : false"
					>

						<slot name="header-content">
							<span class="i-header-title i-modal-header__i-header-title">
								{{ headerTitle }}
							</span>		
						</slot>

						<span v-if="buttonClose"
							class="i-header-close i-modal-header__i-header-close"
							@click="close"
							@mousedown.stop=""
						>
							<c-close />
						</span>
					</div>
					<div class="i-modal-body i-modal-content__i-modal-body"
						:class="{ 'i-modal-body--radius': header }"
						:style="{ padding: `${padding}px` }"
					>
						<span v-if="buttonClose && !header"
							class="i-body-close i-modal-body__i-body-close"
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
		name: `iziModal`,
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
			minWidth: {
				type: [Number, String],
				default: 400
			},
			minHeight: {
				type: [Number, String],
				default: 200
			},
			padding: {
				type: [Number, String],
				default: 32
			},
			transition: {
				type: String,
				default: 'rotate'
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
			type: 'Modal',
			isShow: false,
			isActive: false,
			index: 0,
			zIndex: 999,
			isGrab: false,
			units: '%',
			fTop: 0,
			fLeft: 0,
			offsetTop: 0,
			offsetLeft: 0
		}),
		computed: {
			setStylePositionContainerModal() {
				return {
					top: `${this.fTop}${this.units}`,
					left: `${this.fLeft}${this.units}`,
					width: this.width === 'auto' ? this.width : `${this.width % 2 ? this.width - 1 : this.width}px`,
					height: this.height === 'auto' ? this.height : `${this.height % 2 ? this.height - 1 : this.height}px`,
					minWidth: `${this.minWidth}px`,
					minHeight: `${this.minHeight}px`,
				}
			},
			setStylePositionLevelModal() {
				return { zIndex: `${this.zIndex + this.index}` }
			},
			setStylePositionLevelLayerModal() {
				if (this.layer)
					return { zIndex: `${this.zIndex + (this.index - 1)}` }
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
				this.$iziModal.active(this.name)
			},
			grab(e) {
				this.isGrab = true;
				this.units = 'px';
				this.offsetTop = e.layerY;
				this.offsetLeft = e.layerX;
				this.fTop = e.clientY - e.layerY
				this.fLeft = e.clientX - e.layerX
			},
			leave() {
				this.isGrab = false;
			},
			async close() {
				const isDialog = this.isActive
					? await this.beforeClose()
					: false

				if (!this.isActive) this.$iziModal.active(this.name)
				if (isDialog || isDialog === undefined || typeof isDialog === 'string') {
					this.$iziModal.close(this.name)
				} else {
					if (this.$refs[this.name]) {
						this.$refs[this.name].focus()
					}
				}
			},
		},
		created() {
			this.$iziModal.created(this, this.name)
			this.fTop = +this.top
			this.fLeft = +this.left

			document.body.addEventListener('mousemove', e => {
				if (this.isGrab) {
					this.fTop = e.clientY - this.offsetTop
					this.fLeft = e.clientX - this.offsetLeft
				}
			})
		},
		mounted() {
			this.$nextTick(() => {
				// определить auto, bclosed, bopened
				console.log(this.$refs[this.name])
			})
		}
	}
</script>

<style lang="scss">
	.i-modal-layer {
		user-select: none;
		
		&__i-modal-container {
			position: fixed;
			transform: translate(-50%, -50%) perspective(1000px) rotateX(0deg);
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
	}

	.i-modal-content {
		height: inherit;
		opacity: .3;
		
		&--active {
			opacity: 1;
		}
	}

	.i-modal-header {
		width: 100%;
		height: auto;
		font-size: 20px;
		position: relative;
		font-weight: bold;
		border-bottom: 2px solid #eeedf7;
		padding-right: 64px;
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
			top: 20px;
			right: 20px;

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
		height: 100%;
		position: relative;
		border-radius: 12px;
		overflow: overlay;

		&--radius {
			border-top-right-radius: 0;
			border-top-left-radius: 0;
		}
		&__i-body-close {
			position: absolute;
			top: 20px;
			right: 20px;

			&:hover {
				filter: brightness(0);
				animation: cross-move .4s forwards;

				@keyframes cross-move {
					100% { transform: scale(1.1) rotate(90deg) }
				}
			}
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
			0% { transform: translate(-50%, 100vh); }
		}
	}
	.rotate-enter-active .i-modal-container {
		animation: .4s rotate-enter;
		@keyframes rotate-enter {
			0% { transform: translate(-50%, -50%) perspective(1000px) rotateY(-90deg); }
		}
	}
	.default-leave-active .i-modal-container {
		animation: .4s default-leave;
		@keyframes default-leave {
			100% { transform: translate(-50%, -100vh); }
		}
	}
	.rotate-leave-active .i-modal-container {
		animation: .4s rotate-leave;
		@keyframes rotate-leave {
			100% { transform: translate(-50%, -100vh) perspective(1000px) rotateX(-90deg); }
		}
	}
</style>