<template>
	<div class="modal-layer"
		v-if="isShow"
		:ref="name"
		:tabindex="id"
		:class="setClassActiveLayerModal"
		:style="setStylePositionLevelLayerModal"
		@keyup.esc="$cModal.close(name)">

		<div class="modal-content modal-layer__modal-content"
			:style="[setStylePositionContentModal, setStylePositionLevelModal]"
			:class="setClassActiveContentModal"
			@mousedown="activate($event.target)"
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
			isShow: false,
			isActive: false,
			id: 0,
			zIndex: 999,

			isGrab: false,
			units: '%',
			fTop: 0,
			fLeft: 0,
			offsetTop: 0,
			offsetLeft: 0,
		}),
		computed: {
			setStylePositionContentModal() {
				return { top: `${this.fTop}${this.units}`, left: `${this.fLeft}${this.units}` }
			},
			setStylePositionLevelModal() {
				return { zIndex: `${this.zIndex + this.id}` }
			},
			setStylePositionLevelLayerModal() {
				return { zIndex: `${this.zIndex + (this.id - 1)}` }
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
				if (target.classList.contains('modal-header')
						|| target.classList.contains('modal-body')) {
					this.$cModal.active(this.name)
				}
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
		
		&__modal-content {
			position: absolute;
			user-select: none;
		}

		&--active {
			width: 100%;
			height: 100vh;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0,0,0, .3);
		}
	}

	.modal-content {
		width: 300px;
		height: 200px;
		border-radius: 4px;
		background: rgb(241, 241, 241);
		box-shadow: 0 7px 25px -3.5px rgb(131, 131, 131);
		filter: blur(.5px);
		display: flex;
		flex-direction: column;
		transform: translate(-50%, -50%);
		transition: box-shadow .2s;

		&--active {
			background: rgb(253, 250, 250);
			box-shadow: 0 15px 50px -7px #000;
			filter: blur(0);
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
</style>