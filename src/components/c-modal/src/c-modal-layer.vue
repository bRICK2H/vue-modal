<template>
	<transition name="modal">
		<div class="modal-layer"
			v-if="isShow"
			:ref="name"
			:tabindex="index"
			:class="setClassActiveLayerModal"
			:style="setStylePositionLevelLayerModal"
			@keyup.esc="(isLayer && isCloseOnLayer) || !isLayer ? $cModal.close(name) : false"
			@mousedown="isCloseOnLayer ? $cModal.close(name) : false"
		>

			<div class="modal-container modal-layer__modal-container"
				:style="[setStylePositionContainerModal, setStylePositionLevelModal]"
				:class="setClassActiveContainerModal"
				@mousedown="activate($event.target)"
			>
				<div class="modal-content modal-layer__modal-content"
					:class="setClassActiveContentModal"
				>
					<div class="modal-header modal-content__modal-header"
						@mousedown="grab"
						@mouseup="leave"
					>
						{{ headerName }}

						<span class="modal-header__icon-close"
							@click="isActive ? $cModal.close(name) : $cModal.active(name)"
							@mousedown.stop=""
						>
							<c-close />
						</span>
					</div>
					<div class="modal-body modal-content__modal-body">
						<slot />
					</div>
				</div>
			</div>

		</div>
	</transition>
</template>

<script>
	import CClose from './components/svg/c-close'

	export default {
		name: `Modal`,
		components: { CClose },
		props: {
			name: String,
			headerName: {
				type: String,
				default: ''
			},
			isLayer: {
				type: Boolean,
				default: false
			},
			isCloseOnLayer: {
				type: Boolean,
				default: false
			},
			top: {
				type: Number,
				default: 50
			},
			left: {
				type: Number,
				default: 50
			}
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
			offsetLeft: 0,
		}),
		computed: {
			setStylePositionContainerModal() {
				return { top: `${this.fTop}${this.units}`, left: `${this.fLeft}${this.units}` }
			},
			setStylePositionLevelModal() {
				return { zIndex: `${this.zIndex + this.index}` }
			},
			setStylePositionLevelLayerModal() {
				if (this.isLayer)
					return { zIndex: `${this.zIndex + (this.index - 1)}` }
			},
			setClassActiveContainerModal() {
				return { 'modal-container--active': this.isActive }
			},
			setClassActiveContentModal() {
				return { 'modal-content--active': this.isActive }
			},
			setClassActiveLayerModal() {
				return { 'modal-layer--active': this.isLayer }
			}
		},
		methods: {
			activate(target) {
				if(target.tagName === 'BUTTON') return
				this.$cModal.active(this.name)
			},

			grab(event) {
				this.isGrab = true;
				this.units = 'px';
				this.offsetTop = event.layerY;
				this.offsetLeft = event.layerX;
				this.fTop = event.clientY - event.layerY
				this.fLeft = event.clientX - event.layerX
			},
			leave() {
				this.isGrab = false;
			},
		},
		created() {
			console.log('created')
			this.$cModal.created(this, this.name)
			this.fTop = this.top
			this.fLeft = this.left

			document.body.addEventListener('mousemove', e => {
				if (this.isGrab) {
					this.fTop = e.clientY - this.offsetTop
					this.fLeft = e.clientX - this.offsetLeft
				}
			})
		},
	}
</script>

<style lang="scss">
	.modal-layer {
		
		&__modal-container {
			position: fixed;
			user-select: none;
		}

		&--active {
			width: 100%;
			height: 100vh;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(150, 150, 150, .9);
		}
	}

	.modal-container {
		width: 300px;
		height: 200px;
		border-radius: 4px;
		box-shadow: 0 7px 25px -3.5px #5b5b5b;
		background: rgba(0,0,0, .1);
		filter: blur(1px);
		display: flex;
		flex-direction: column;
		transform: translate(-50%, -50%) perspective(500px) rotateX(0deg);
		transition: box-shadow .2s;
		

		&--active {
			background: rgb(250, 250, 250);
			box-shadow: 0 15px 50px -7px #000;
			filter: blur(0);
		}
	}

	.modal-content {
		opacity: .3;
		
		&--active {
			opacity: 1;
		}

		// &__modal-header {}
		// &__body {}
	}

	.modal-header {
		width: 100%;
		height: 48px;
		position: relative;
		border-bottom: 1px solid #999;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			cursor: grab;
		}

		&:active {
			cursor: grabbing;
		}

		&__icon-close {
			height: auto;
			display: flex;
			align-items: center;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
			cursor: pointer;

			&:hover {
				filter: brightness(0);
				transform: translateY(-50%) scale(.9);
			}
		}
	}

	.modal-body {
		height: 100%;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}

	.modal-enter-active,
	.modal-leave-active {
		animation: layer .2s
	}
	.modal-enter-active .modal-container {
		animation: modal-enter .2s;
	}
	@keyframes modal-enter {
		0% { transform: translate(-50%, -50%) perspective(500px) rotateX(90deg); }
		100% { transform: translate(-50%, -50%) perspective(500px) rotateX(0deg); }
	}
	.modal-leave-active .modal-container {
		animation: modal-leave .3s;
	}
	@keyframes modal-leave {
		100% { transform: translate(-50%, 100vh); }
	}
</style>