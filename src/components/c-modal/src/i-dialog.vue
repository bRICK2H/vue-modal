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
					<div v-if="type !== null"
						class="i-dialog-icon i-dialog-container__i-dialog-icon"
					>
						<img :src="dialogIcon" alt="icon">
					</div>

					<!-- Content -->
					<div class="i-dialog-content i-dialog-container__i-dialog-content">
						<p v-show="title !== null"
							class="i-dialog-title i-dialog-content__i-dialog-title"
						>
							{{ title }}
						</p>
						<p class="i-dialog-text i-dialog-content__i-dialog-text"
							ref="i-dialog-text"
							v-html="text"
							@scroll="scrollText($event)"
						>
							{{ text }}
						</p>
					</div>
				</div>

				<!-- Buttons -->
					<div class="i-dialog-buttons-container">
							<div
								class="i-dialog-buttons"
								ref="i-dialog-buttons"
							>
								<button v-for="({ title, result, color, locked = true }, i) of buttons"
									:key="i"
									:disabled="disabled && locked"
									:class="[defaultStyleButtons(color), disabledStyleButtons(locked), hoverStyleButtons(color, locked)]"
									class="i-dialog-btn i-dialog-buttons__i-dialog-btn"
									@click="confirm(result, $event)"
								>
									{{ title }}
								</button>
							</div>
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
		scrollToActive: { default: false },
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
		isOpen: false,
		disabled: false,
		isEntryToBottom: false
	}),
	computed: {
		dialogWidth() {
			return { width: this.buttons.length > 2 ? 'auto' : `${this.width}px` }
		},
		dialogIcon() {
			return this.type ? ICONS[this.type] : null
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
		},
		scrollText(e) {
			const { target } = e
			if (!this.scrollToActive || this.isEntryToBottom) return

			this.isEntryToBottom = target.scrollHeight - target.scrollTop <= (target.offsetHeight + 50)
			this.disabled = !this.isEntryToBottom
		},
		defaultStyleButtons(color) {
			return color ? 'i-dialog-btn--black' : ''
		},
		hoverStyleButtons(color, locked) {
			return color
				? this.disabled && locked
					? ''
					: 'i-dialog-btn--black-hover'
				: this.disabled && locked
					? ''
					: 'i-dialog-btn--white-hover'
		},
		disabledStyleButtons(locked) {
			return this.disabled && locked ? 'i-dialog-btn--disabled' : ''
		},
	},
	watch: {
		isOpen() {
			this.$nextTick(() => {
				const wrapper = this.$refs['i-dialog-wrapper']

				if (wrapper) {
					this.$refs['i-dialog-wrapper'].focus()
				}
			})
		},
		async scrollToActive(val) {
			await this.$nextTick()
			const el_text = this.$refs['i-dialog-text']

			this.disabled = val && el_text.scrollHeight > el_text.offsetHeight
		}
	},
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
		overflow: hidden;

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
		max-height: 50vh;
    	overflow: auto;
		font-size: 14px;
		line-height: 20px;
		padding: 0 10px;

		&::-webkit-scrollbar {
			width: 4px;
		}
		
		&::-webkit-scrollbar-track {
			border-radius: 20px;
			background-color: #eee;
		}
		
		&::-webkit-scrollbar-thumb {
			border-radius: 20px;
			background-color: #4bbac5;
		}
	}
	.i-dialog-buttons-container {
		min-height: 48px;
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
		transition: .2s;
		cursor: pointer;

		&:not(:last-of-type) {
			margin-right: 10px;
		}
		&--black {
			background: #000;
			color: #fff;
			border: 2px solid #000;
		}
		&--white-hover:hover {
			background: rgba(0,0,0, .12)
		}
		&--black-hover:hover {
			background: rgba(0,0,0, .8)
		}
		&--disabled {
			cursor: no-drop;
			opacity: .1;
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

	.i-dialog-btn-enter-active {
		animation: .2s i-dialog-btn-enter;
		@keyframes i-dialog-btn-enter {
			0% { transform: translateX(50%); }
		}
	}
	.i-dialog-btn-leave-active {
		animation: .2s i-dialog-btn-leave;
		@keyframes i-dialog-btn-leave {
			100% { transform: translateX(50%); }
		}
	}
</style>