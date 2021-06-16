<template>
	<div class="select-container"
		:style="setStyleToSelect"
		ref="select-container"
	>

		<!-- Select -->
		<div class="v-selected select-container__v-selected"
			:class="[
				{ 'v-selected--only': !multiple || (!Object.keys(selected).length && !cloneOptions.length)},
				{ 'v-selected--active': isOpenSelect },
			]"
			:tabindex="tabindex"
			ref="selected"
			@blur="blur($event)"
			@keydown.enter="enterToFocus($event)"
			@keydown.up.down.prevent="arrowToFocus($event)"
			@click="(!multiple && cloneOptions.length) || (!Object.keys(selected).length && !cloneOptions.length)
				? toggleSelect()
				: false
			"
		>
			<div v-if="!Object.keys(selected).length"
				class="select-title v-selected__select-title"
				key="title"
			>
				* {{ title }}
				
			</div>
			<template v-else>
				<div class="select-name v-selected__select-name"
					:class="{'select-name--multiple': multiple}"
					v-for="(select, i) of multiple ? selected : [selected]"
					:key="`sl${i}`"
				>
					<span class="select-box-name select-name__select-box-name"
						:class="{
							'select-box-name--pale': !multiple && isOpenSelect,
							'select-box-name--multiple': multiple,
							'select-box-name--mr': multiple && (!clearable && Object.keys(selected).length !== 1 || clearable)
						}"
						:title="innerReduce(select, s_label)"
					>
						<slot name="select" v-bind="select">
							{{ innerReduce(select, s_label) }}
						</slot>
					</span>
					<div>
						<i-close v-if="multiple && (!clearable && Object.keys(selected).length !== 1 || clearable)"
							class="select-name__close"
							@click.native="drop(i)"
						/>
					</div>
				</div>
			</template>

			<template v-if="multiple">
				<i-add v-if="cloneOptions.length"
					class="multiple-add"
					:class="[
						{ 'multiple-add--hover': cloneOptions.length },
					]"
					@click.native="cloneOptions.length
						? toggleSelect()
						: false
					"
				/>
			</template>
			<template v-else>
				<div class="v-selected__wrap-icons"
					:class="{'v-selected__wrap-icons--has-item': Object.keys(selected).length && clearable}"
				>
					<template v-if="clearable">
						<i-close v-if="Object.keys(selected).length"
							@click.native.stop="drop(0)"
						/>
						<i-hor-line v-if="Object.keys(selected).length" />
					</template>
					<i-arrow-down class="rotate-arraw-down"
						:class="{'rotate-arraw-down--active': isOpenSelect}"
					/>
				</div>
			</template>
		</div>
		
		<!-- Optiions -->
		<transition name="dropdown-list">
			<ul v-show="isOpenSelect"
				class="dropdown-list select-container__dropdown-list"
				:class="{ 'dropdown-list--active': isOpenSelect }"
				:style="[setStylesToDropDownList]"
				:ref="uniquedd"
				:tabindex="tabindex"
			>
				<li v-if="!Object.keys(selected).length && !cloneOptions.length"
					class="option-empty" :class="[...classes]"
				>
					Данные отсутствуют
				</li>

				<template v-else>
					<li class="option"
						:class="[...classes, { 'option--arrow': currOptionArrow === i + 1 }]"
						v-for="(option, i) of cloneOptions"
						:key="i"
						@mouseenter="hoverOption(i + 1)"
						@click="select(option)"
					>
						<!-- :title="innerReduce(option, o_label)" -->

						<div class="option__name">
							<slot name="option" v-bind="option" >
									{{ innerReduce(option, s_label) }}
									<!-- {{ innerReduce(option, o_label) }} -->
									<!-- {{ option }} -->
							</slot>
						</div>
						
					</li>
				</template>
			</ul>
		</transition>
	</div>
</template>

<script>
import iClose from './components/svg/close-svg' 
import iAdd from './components/svg/add-svg' 
import iArrowDown from './components/svg/arrow-down-svg'
import iHorLine from './components/svg/hor-line-svg'

export default {
	name: 'cSelect',
	components: { 
		iAdd,
		iClose,
		iHorLine,
		iArrowDown
	},
	props: {
		title: {
			type: String,
			default: 'Добавить'
		},
		// value: {
		// 	type: Array,
		// 	default: () => ([])
		// },
		value: null,
		options: {
			type: Array,
			default: () => ([])
		},
		reduce: {
			type: Function,
			default: option => option,
		},
		s_label: {
			type: [String, Array, Function],
			default: ''
		},
		o_label: {
			type:  [String, Array, Function],
			default: ''
		},
		multiple: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		width: {
			type: [String, Number],
			default: 150
		},
		behavior: {
			type: Boolean,
			default: false
		},
		classes: {
			type: Array,
			default: () => ([])
		}
	},
	data: () => ({
		isLoadWithChangedValue: false,
		isOpenSelect: false,
		cloneOptions: [],

		tabindex: 0,
		currOptionArrow: 1,
		uniquedd: `dropdown-list:${Math.random()}`,
		currSelectCoords: {},
		selected: [],
		isStopReactiveChanges: false,
	}),
	computed: {
		setStylesToDropDownList() {
			const { top, left, width, height } = this.currSelectCoords

			return {
				width: `${width}px`,
				top: this.behavior
					? `${top + height - 2}px`
					: `${height - 2}px`,
				left: this.behavior
					? `${left}px`
					: 0
			}
		},
		setStyleToSelect() {
			return {
				width: `${+this.width}px`,
				minWidth: `${+this.width}px`,
			}
		},
		isTransferredReducer() {
			return JSON.stringify(this.value) !== JSON.stringify(this.value.map(curr => this.reduce(curr)))
		}
	},
	methods: {
		select(option) {
			console.log('option: ', option)
			if (this.multiple) {
				this.selected.push(option)
				console.log(this.selected)
			} else {
				// this.selected.splice(0, 1, option)
				this.selected = option
			}
			
			// const selectedIndex = this.cloneOptions.findIndex(curr => {
			// 	return  JSON.stringify(curr) === JSON.stringify(option)
			// })

			// if (this.multiple) {
			// 	this.selected.push(...this.cloneOptions.splice(selectedIndex, 1))
			// } else {
			// 	if (this.Object.keys(selected).length) {
			// 		this.cloneOptions.push(...this.selected.splice(0, 1))
			// 	}

			// 	this.selected = this.cloneOptions.splice(selectedIndex, 1)
			// }

			// this.$emit('input', this.outerReduce(this.selected))
		},
		drop(i) {
			// this.cloneOptions.push(...this.selected.splice(i, 1))
			// this.$emit('input', this.outerReduce(this.selected))
			if (this.multiple) {
				this.selected.splice(i, 1)
			} else {
				// this.selected = []
				this.selected = ''
			}
		},
		enterToFocus(e) {
			if (this.cloneOptions.length) {
				this.toggleSelect()
			}

			if (!this.isOpenSelect) {
				this.select(this.cloneOptions[this.currOptionArrow - 1])
			}
		},
		arrowToFocus(e) {
			if (!this.isOpenSelect) return

			const { key } = e

			this.currOptionArrow += key === 'ArrowUp' ? -1 : 1
			if (this.currOptionArrow > this.cloneOptions.length) {
				this.currOptionArrow = 1
			} else if (this.currOptionArrow <= 0) {
				this.currOptionArrow = this.cloneOptions.length
			}
		},
		hoverOption(index) {
			this.currOptionArrow = index
		},
		blur(e) {
			const { relatedTarget } = e

			if (relatedTarget && relatedTarget.classList.contains('dropdown-list')) {
				this.$refs['selected'].focus()
				return
			}

			this.isOpenSelect = false
		},
		outerReduce(arr) {
		return arr.map(c => this.reduce(c) === undefined ? c : this.reduce(c))
		},
		innerReduce(el, label) {
			if (Array.isArray(el)) {
				return el.flat().join(', ')
			} else if (typeof el === 'object') {
				if (Array.isArray(label)) {
					return  label.map(l => el[l]).join(', ')
				} else if (typeof label === 'function') {
					if (label(el) === undefined) {
						console.warn(`[select]: ${label} Не верно введено имя свойства объекта.`)
						return el
					} else if (Array.isArray(label(el))) {
						return label(el).join(', ')
					} else if (typeof label(el) === 'object') {
						return Object.values(label(el)).join(', ')
					} else {
						return label(el)
					}
				} else {
					return label in el
						? el[label]
						: Object.values(el).join(', ')
				}
			} else {
				return el
			}
		},
		toggleSelect() { this.isOpenSelect = !this.isOpenSelect },
		setCurrSelectCoords() {
			const { top, left, width } = this.$refs['selected'].getBoundingClientRect()
			const height = this.$refs['selected'].offsetHeight

			this.$nextTick(() => {
				this.$set(this.currSelectCoords, 'top', top)
				this.$set(this.currSelectCoords, 'left', left)
				this.$set(this.currSelectCoords, 'width', width)
				this.$set(this.currSelectCoords, 'height', height)
			})
		},
		updateOptions(selected) {
			this.cloneOptions = this.options.filter(curr => !JSON.stringify(selected).includes(JSON.stringify(curr)))
		},

	},
	watch: {
		value: {
			immediate: true,
			deep: true,
			handler(value) {
				// Начинать от сюда
				console.log(this.isTransferredReducer, value, this.selected)
				if (JSON.stringify(value) !== JSON.stringify(this.selected)) {
					if (this.multiple) {
						if (Array.isArray(value)) {
							if (this.isTransferredReducer) {
								this.selected = !this.options.some(curr => {
									return JSON.stringify(this.reduce(value)).includes(JSON.stringify(this.reduce(curr)))
								})
									? []
									: JSON.parse(JSON.stringify(value)).map(curr => {
										console.log('curr: ', this.reduce(curr))
										return this.reduce(curr)
									})
								console.log('HERE? ', this.selected)
							} else {
								this.selected = !this.options.some(curr => JSON.stringify(value).includes(JSON.stringify(curr)))
									? []
									: JSON.parse(JSON.stringify(value))
							}
						} else {
							this.selected = []
							this.isStopReactiveChanges = true
							console.warn('[select]: При множественном выборе (multiple:true), value ожидает массив здначений по умолчанию!')
						}
					} else {
						if (!Array.isArray(value)) {
							this.selected = !this.options.some(curr => JSON.stringify(value) === JSON.stringify(curr))
								? null
								: value
						} else {
							this.selected = null
							this.isStopReactiveChanges = true
							console.warn('[select]: При единственном выборе (multiple:false), value ожидает примитивный тип данных!')
						}
					}
				}
				
				this.updateOptions(this.selected)
			}
		},
		selected: {
			// immediate: true, // под вопросом
			deep: true,
			handler(selected) {
				console.log('TOTAL SELECTED: ', selected)
				this.isOpenSelect = false

				if (this.isStopReactiveChanges) {
					this.isStopReactiveChanges = false
				} else {
					// const tmp = selected.map(curr => {
					// 	return this.reduce(curr)
					// })
					// console.log('tmp: ', this.outerReduce(selected))
					this.$emit('input', selected)
				}
			}
		},
		// value: {
		// 	immediate: true,
		// 	deep: true,
		// 	handler(value) {
		// 		console.log('val: ', value, this.uniquedd)

		// 		console.log(JSON.stringify(value), JSON.stringify(this.selected))
		// 		if (JSON.stringify(value) !== JSON.stringify(this.selected)) {
		// 			if (this.multiple) {
		// 				if (Array.isArray(value)) {
		// 					this.selected = !this.options.some(curr => value.includes(curr))
		// 						? []
		// 						: JSON.parse(JSON.stringify(value))
		// 				} else {
		// 					this.selected = []
		// 					this.isStopReactiveChanges = true
		// 					console.warn('[select]: При множественном выборе (multiple:true), value ожидает массив здначений по умолчанию!')
		// 				}
		// 			} else {
		// 				if (!Array.isArray(value)) {
		// 					console.log('here', this.uniquedd)
		// 					this.selected = !this.options.some(curr => value === curr)
		// 						? []
		// 						: [value]
		// 				} else {
		// 					console.log(value)
		// 					this.selected = []
		// 					this.isStopReactiveChanges = true
		// 					console.warn('[select]: При единственном выборе (multiple:false), value ожидает примитивный тип данных!')
		// 				}
		// 			}
		// 		}
				
		// 		this.updateOptions(this.selected)
		// 	}
		// },
		// selected: {
		// 	deep: true,
		// 	immediate: true,
		// 	handler(selected) {
		// 		this.isOpenSelect = false

		// 		console.log('selected', selected, this.uniquedd)

		// 		if (this.isStopReactiveChanges) {
		// 			this.isStopReactiveChanges = false
		// 			console.log('here')
		// 			return
		// 		}

		// 		this.$emit('input', this.multiple ? selected : selected[0])
		// 	}
		// },

		// value: {
		// 	immediate: true,
		// 	deep: true,
		// 	handler(value) {
		// 		if (JSON.stringify(value) !== JSON.stringify(this.selected)) {
		// 			if (this.multiple) {
		// 				if (value && Array.isArray(value)) {
		// 					this.selected = [...value]
		// 					this.updateOptions(this.selected)
		// 					console.log(this.selected, this.cloneOptions, this.options)
		// 				} else {
		// 					console.warn('При множественном выборе (multiple:true), необходимо передовать массив из выбранных по умолчанию элементов!')
		// 				}
		// 			}
		// 		}

		// 		// if (!this.multiple) {
		// 		// 	if (value && !Array.isArray(value)) {
		// 		// 		this.selected.push(value)
		// 		// 		this.cloneOptions = this.options.filter(curr => !this.selected.includes(curr))
		// 		// 	}
		// 		// }
		// 	}
		// },
		// selected: {
		// 	deep: true,
		// 	handler(selected) {
		// 		this.isOpenSelect = false
		// 		this.$emit('input', selected)
		// 		this.updateOptions(selected)
				
		// 	}
		// },
		// value: {
		// 	immediate: true,
		// 	handler(value) {
		// 		if (value.length) {
		// 			if (!this.isLoadWithChangedValue) {
		// 				if(this.multiple) {
		// 					this.selected = value
		// 					this.cloneOptions = this.options.filter(opt => {
		// 						return !(value.map(val => JSON.stringify(val)).includes(JSON.stringify(opt)))
		// 					})
		// 				} else {
		// 					if (value.length > 1) {
		// 						const unique = Array.from(new Set([...value, ...this.options].map(JSON.stringify))).map(JSON.parse)
		// 						this.selected = value.slice(0, 1)
		// 						this.cloneOptions = unique.filter(uq => {
		// 							return value.slice(1).map(val => JSON.stringify(val)).includes(JSON.stringify(uq))
		// 						})
		// 						console.warn(`[custom_select]: "v-model/value" должен принимать массив из одного элемента, т.к. свойство multiple="false". В данном случае selected будет равен [0-му элементу] все остальное уйдет в options`)
		// 					} else {
		// 						this.selected = value
		// 						this.cloneOptions = [...value, ...this.options].filter(el => {
		// 							return !(value.map(val => JSON.stringify(val)).includes(JSON.stringify(el)))
		// 						})
		// 					}
		// 				}

		// 				this.isLoadWithChangedValue = true
		// 			} 
		// 		}
		// 	}
		// },
		// options: {
		// 	immediate: true,
		// 	handler(options) {
		// 		if (this.value) {
		// 			this.cloneOptions = options.filter(opt => {
		// 				return !(this.value.map(val => JSON.stringify(val)).includes(JSON.stringify(opt)))
		// 			})
		// 		} else {
		// 			this.cloneOptions = JSON.parse(JSON.stringify(options))
		// 		}
		// 	}
		// },
		// selected() {
		// 	this.isOpenSelect = false
		// },
		isOpenSelect(opened) {
			this.isStopReactiveChanges = false
			this.setCurrSelectCoords()

			if (this.behavior && opened) {
				const DOMLocalNames = Object.values(document.body.children).map(curr => curr.localName)
				
				if (!(DOMLocalNames.includes('drop-down-container'))) {
					const DOMRef = document.createElement('drop-down-container')
					document.body.appendChild(DOMRef)
				}

				const DropDownContainer = document.querySelector('drop-down-container')
				this.$refs[this.uniquedd].setAttribute('unique-name', this.uniquedd)
				DropDownContainer.appendChild(this.$refs[this.uniquedd])
			}
		},
	},
	async mounted() {
		await this.$nextTick()

		// window.addEventListener('resize', () => {
		// 	if (this.$refs['selected']) this.setSelectCoords()
		// })

		if (this.behavior && this.$refs['select-container']) {
			let start = true
			let primaryEl = this.$refs['select-container'].parentElement

			while(start) {
				primaryEl = primaryEl.parentElement
				const primaryElOverfow = getComputedStyle(primaryEl).overflow

				if (primaryEl.tagName === 'BODY') start = false
				if (primaryElOverfow === 'scroll' || primaryElOverfow === 'auto') {
					primaryEl.addEventListener('scroll', () => {
						if (this.isOpenSelect && this.behavior) {
							this.setCurrSelectCoords()
							// this.isOpenSelect = false
						}
					})
	
					start = false
				}
			}
		}
	},
	beforeDestroy() {
		if (this.behavior) {
			const DropDownContainer = document.querySelector('drop-down-container')
	
			if (DropDownContainer && DropDownContainer.children.length) {
				DropDownContainer.children.forEach(curr => {
					if (curr.getAttribute('unique-name') === this.uniquedd) {
						DropDownContainer.removeChild(curr)
					}
				})
			}
		}
	},
}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');

	.select-container * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
	}

	.select-container {
		user-select: none;
		min-height: 44px;
		position: relative;
		border-radius: 8px;

		&__v-selected {
			position: relative;
			top: 0;
			left: 0;
			z-index: 1000;
		}
		&__dropdown-list {
			position: absolute;
			left: 0;
			z-index: 1000;
			background-color: #fff;
		}
	}
	.v-selected {
		width: 100%;
		min-height: 44px;
		background: #fff;
		border: 2px solid #eeedf7;
		border-radius: 8px;
		padding: 2px;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		&:focus {
			outline: none;
		}
		&:focus-visible {
			border: 2px solid #dfdfdf;
		}
		&--only {
			cursor: pointer;
		}
		&--active {
			border: 2px solid #dfdfdf;
			border-bottom: 2px solid transparent;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
		&__select-name {
			margin: 1.5px;
		}
		&__wrap-icons {
			width: auto;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;
			align-items: center;

			&--has-item {
				width: 60px;
				height: 100%;
				background: #fff;
			}
		}
	}
	.select-name {
		width: inherit;
		height: 32px;
		font-size: 14px;
		font-weight: 500;
		color: #1F1F33;
		padding: 6px 12px;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		&--multiple {
			width: auto;
			max-width: calc(100% - 40px);
			background: #F6F6FB;
			border-radius: 8px;
		}
		&__close {
			cursor: pointer;

			&:hover {
				filter: invert(.5)
			}
		}
	}
	.select-box-name {
		width: calc(100% - 70px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;

		&--multiple {
			width: auto
		}
		&--pale {
			color: #b7b7cc;
		}
		&--mr {
			margin-right: 10px;
		}
	}
	.select-title {
		padding: 0 2px 0 6px;
		display: flex;
		align-items: center;
		color: #b7b7cc;
		font-weight: 300;
	}
	.dropdown-list {
		width: 100%;
		font-family: 'Inter', sans-serif;
		border: 2px solid #eeedf7;
		border-top: none;
		padding-top: 3px;
		border-bottom-right-radius: 8px;
		border-bottom-left-radius: 8px;
		color: #000;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 7px -7px #828282;

		&--active {
			border: 2px solid #dfdfdf;
			border-top: none;
			z-index: 1010;
		}
	}
	.option, .option-empty {
		position: relative;
		list-style: none;
		cursor: pointer;
		padding: 10px 0;
	}
	.option-empty {
		font-size: 14px;
		text-align: center;
	}
	.option {
		padding: 20px 0;
		text-align: left;

		&--arrow {
			background-color: #dfdfdf;
		}
		&__name {
			width: 100%;
			height: auto;
			display: inline-block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.multiple-add {
		cursor: pointer;

		&--disabled {
			filter: invert(.1)
		}
		&--hover {
			&:hover {
				filter: invert(.03);
			}
		}
	}
	.rotate-arraw-down {
		transform: rotate(0);
		transition: 0.2s ease-out;

		&--active {
			transform: rotate(-180deg);
		}
	}
	
	.dropdown-list-enter-active {
		animation: open-list .4s;

		@keyframes open-list {
			0% { opacity: 0; transform: translateX(50px); }
			20% { box-shadow: 0 3px 7px #fff; }
			100% { opacity: 1; }
		}
	}
	.dropdown-list-leave-active {
		animation: hide-list .4s;

		@keyframes hide-list {
			40% { box-shadow: 0 3px 7px #fff; }
			100% { transform: scale(0); opacity: 0; z-index: 999; }
		}
	}
</style>