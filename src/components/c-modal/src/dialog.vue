<template>
	<transition name="izi-dialog">
		<div class="izi-dialog-wrapper" v-if="isOpen"
			ref="izi-dialog-wrapper"
			tabindex="0"
			@keydown.esc="close($event, false)"
			@click="clickClose ? close($event, false) : false"
		>
			<div class="izi-dialog-container izi-dialog-wrapper__izi-dialog-container"
				:style="dialogWidth"
				@click.stop=""
			>
				<div class="izi-dialog-header">
					<!-- Icons -->
					<div class="izi-dialog-icon izi-dialog-container__izi-dialog-icon">
						<img :src="dialogIcon" alt="icon">
					</div>

					<!-- Content -->
					<div class="izi-dialog-content izi-dialog-container__izi-dialog-content">
						<p class="izi-dialog-title izi-dialog-content__izi-dialog-title">
							{{ title }}
						</p>
						<p class="izi-dialog-text izi-dialog-content__izi-dialog-text">
							{{ text }}
						</p>
					</div>
				</div>

				<!-- Buttons -->
				<div class="izi-dialog-buttons"
					ref="izi-dialog-buttons"
				>
					<button v-for="({ title, result, color }, i) of buttons"
						:key="i"
						class="izi-dialog-btn izi-dialog-buttons__izi-dialog-btn"
						:class="color ? 'izi-dialog-btn--black' : ''"
						@click="confirm($event, result)"
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
	info: require('../assets/img/info.png'),
	warning: require('../assets/img/warning.png')
}

export default {
	name: 'dialog',
	props: {
		clickClose: { default: true },
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
		handler: Function
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
		open(options) {
			if (this.isOpen) return
			this.isOpen = true
		},
		close(e, result = false) {
			this.handler(result)
			this.isOpen = false
		},
		confirm(e, result) {
			this.close(null, result)
		}
	},
	watch: {
		isOpen(val) {
			this.$nextTick(() => {
				const wrapper = this.$refs['izi-dialog-wrapper']

				if (wrapper) {
					this.$refs['izi-dialog-wrapper'].focus()
				}
			})
		}
	}
}
</script>

<style lang="scss">
	.izi-dialog-wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		background: rgba(0,0,0, .3);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999999;

		&__izi-dialog-container {
			margin: auto;
		}
	}
	.izi-dialog-container {
		box-sizing: border-box;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0px 20px 70px rgba(32, 31, 54, .7);
		padding: 24px;
		display: flex;
		flex-direction: column;

		&__izi-dialog-icon {
			margin-right: 24px;
		}
	}
	.izi-dialog-header {
		display: flex;
	}
	.izi-dialog-icon {
		width: auto;
	}
	.izi-dialog-content {
		width: 100%;

		&__izi-dialog-title {
			margin-bottom: 16px;
		}
		&__izi-dialog-text {
			margin-bottom: 32px;
		}
	}
	.izi-dialog-title {
		font-family: Inter;
		font-weight: bold;
		font-size: 20px;
		line-height: 28px;
	}
	.izi-dialog-text {
		font-size: 14px;
		line-height: 20px;
	}
	.izi-dialog-buttons {
		height: 48px;
		display: flex;
		justify-content: flex-end;
	}
	.izi-dialog-btn  {
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
	.izi-dialog-enter-active {
		animation: .4s enter-wrapper-dialog;
		@keyframes enter-wrapper-dialog {
			0% { opacity: 0; }
		}
	}
	.izi-dialog-enter-active .izi-dialog-container {
		animation: .4s enter-container-dialog;
		@keyframes enter-container-dialog {
			0% { transform: translateY(50vh); }
		}
	}
	.izi-dialog-leave-active {
		animation: .4s leave-wrapper-dialog;
		@keyframes leave-wrapper-dialog {
			100% { opacity: 0; }
		}
	}
	.izi-dialog-leave-active .izi-dialog-container {
		animation: .4s leave-container-dialog;
		@keyframes leave-container-dialog {
			100% { transform: translateY(-50vh); }
		}
	}
</style>