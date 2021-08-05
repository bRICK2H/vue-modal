<template>
	<transition name="i-dialog">
		<div class="i-dialog-wrapper" v-if="isOpen"
			ref="i-dialog-wrapper"
			tabindex="0"
			@keyup.esc="close(false, $event)"
			@click="layerClickToClose ? close(false, $event) : false"
		>
			<div class="i-dialog-container i-dialog-wrapper__i-dialog-container"
				:style="dialogWidth"
				@click.stop=""
			>
				<div class="i-dialog-header">
					<!-- Icons -->
					<div class="i-dialog-icon i-dialog-container__i-dialog-icon">
						<img :src="dialogIcon" alt="icon">
					</div>

					<!-- Content -->
					<div class="i-dialog-content i-dialog-container__i-dialog-content">
						<p class="i-dialog-title i-dialog-content__i-dialog-title">
							{{ title }}
						</p>
						<p class="i-dialog-text i-dialog-content__i-dialog-text" v-html="text">
							{{ text }}
						</p>
					</div>
				</div>

				<!-- Buttons -->
				<div class="i-dialog-buttons"
					ref="i-dialog-buttons"
				>
					<button v-for="({ title, result, color }, i) of buttons"
						:key="i"
						class="i-dialog-btn i-dialog-buttons__i-dialog-btn"
						:class="color ? 'i-dialog-btn--black' : ''"
						@click="confirm(result, $event)"
					>
						{{ title }}
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
const ICONS = {
	info: require('./assets/img/info.png'),
	warning: require('./assets/img/warning.png')
}

export default {
	name: 'iziDialog',
	props: {
		layerClickToClose: { default: false },
		width: { default: 572 },
		title: { default: 'Вы уверены?' },
		text: { default: '' },
		type: { default: 'info' },
		buttons: {
			default: () => {
				return [
					{ title: 'Да', result: true, color: true },
					{ title: 'Нет', result: false }
				]
			}
		},
		handler: { default: () => false }
	},
	data: () => ({
		isOpen: false
	}),
	computed: {
		dialogWidth() {
			return { width: this.buttons.length > 2 ? 'auto' : `${this.width}px` }
		},
		dialogIcon() {
			return ICONS[this.type]
		},
	},
	methods: {
		open() {
			if (this.isOpen) return
			this.isOpen = true
		},
		close(result) {
			this.handler(result)
			this.isOpen = false
		},
		confirm(result) {
			this.close(result)
		}
	},
	watch: {
		isOpen() {
			this.$nextTick(() => {
				const wrapper = this.$refs['i-dialog-wrapper']

				if (wrapper) {
					this.$refs['i-dialog-wrapper'].focus()
				}
			})
		}
	}
}
</script>

<style lang="scss">
	.i-dialog-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		background: rgba(0,0,0, .3);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999999;

		&__i-dialog-container {
			margin: auto;
		}
	}
	.i-dialog-container {
		box-sizing: border-box;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0px 20px 70px rgba(32, 31, 54, .7);
		padding: 24px;
		display: flex;
		flex-direction: column;

		&__i-dialog-icon {
			margin-right: 24px;
		}
	}
	.i-dialog-header {
		display: flex;
	}
	.i-dialog-icon {
		width: auto;
	}
	.i-dialog-content {
		width: 100%;

		&__i-dialog-title {
			margin-bottom: 16px;
		}
		&__i-dialog-text {
			margin-bottom: 32px;
		}
	}
	.i-dialog-title {
		font-weight: bold;
		font-size: 20px;
		line-height: 28px;
	}
	.i-dialog-text {
		font-size: 14px;
		line-height: 20px;
	}
	.i-dialog-buttons {
		height: 48px;
		display: flex;
		justify-content: flex-end;
	}
	.i-dialog-btn  {
		height: 100%;
		min-width: 156px;
		padding: 13px 17.5px;
		font-size: 16px;
		font-weight: bold;
		outline: none;
		border: 2px solid #e4e4e4;
		background-color: #fff;
		color: #000;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: .1s;

		&:not(:last-of-type) {
			margin-right: 10px;
		}
		&:hover {
			cursor: pointer;
			transform: scale(0.99);
			background: rgba(0,0,0, .12)
		}
		&--black {
			background: #000;
			color: #fff;
			border: 2px solid #000;

			&:hover {
				background: rgba(0,0,0, .8)
			}
		}
	}
	.i-dialog-enter-active {
		animation: .4s enter-wrapper-dialog;
		@keyframes enter-wrapper-dialog {
			0% { opacity: 0; }
		}
	}
	.i-dialog-enter-active .i-dialog-container {
		animation: .4s enter-container-dialog;
		@keyframes enter-container-dialog {
			0% { transform: translateY(100vh); }
		}
	}
	.i-dialog-leave-active {
		animation: .4s leave-wrapper-dialog;
		@keyframes leave-wrapper-dialog {
			100% { opacity: 0; }
		}
	}
	.i-dialog-leave-active .i-dialog-container {
		animation: .4s leave-container-dialog;
		@keyframes leave-container-dialog {
			100% { transform: translateY(-50vh) perspective(500px) rotateX(-90deg); }
		}
	}
</style>