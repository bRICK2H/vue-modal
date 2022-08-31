# modal-component

```
### main.js
```js
Vue.use(vmodal) || Vue.use(vmodal, { name: 'template-name' })
```

## Modal config:
| Name 						| Type 							| Default 			| Description 	|
| ---- 						| :--: 							| :-----: 			| ----------- 	|
| ***name** 				| `String` 						| **''** 			| Название, открытие/закрытие модального окна зависит от этого имени, обязательный параметр  |
| headerTitle 				| `String` 						| **''** 			| Название в шапке |
| header 					| `Boolean` 					| **true** 			| Показать верхний блок шапки |
| buttonClose 				| `Boolean` 					| **true** 			| Показать кнопку (крест) закрытия модального окна |
| closeButtonPosition 	| `String` 						| **right** 		| Позиция отображения кнопки закрытия, 'left' || 'right' |
| layer	 					| `Boolean` 					| **true** 			| Показать внешний слой (background) модалки |
| layerClickToClose 		| `Boolean` 					| **true** 			| Закрыть модальное окно по клику на внешний слой модалки |
| draggable 				| `Boolean`						| **false** 		| Включить перемещения модального окна (drag'n'drop работает только по шапке) |
| scrollable 				| `Boolean`						| **false** 		| Включить скролл для контента |
| calcContent 				| `Boolean` 					| **false** 		| Расчитать минимальную ширину и высоту для контента модалки (расчет идет исходя из ширины и высоты самого контера со смещением до нужного размера, что бы не было размытия) |
| left 						| `[Number, String]` 		| **50** 			| Первоначальное положение по оси X, если не указано, то расположежние устанавливается по центру отностильно окна  |
| top 						| `[Number, String]` 		| **50** 			| Первоначальное положение по оси Y, если не указано, то расположежние устанавливается по центру отностильно окна  |
| width 						| `[Number, String]` 		| **'auto'** 		| Ширина модального окна (px) |
| height 					| `[Number, String]` 		| **'auto'** 		| Высота модального окна (px) |
| padding 					| `[Number, String]` 		| **100** 			| Padding для тела модального окна |
| transition 				| `String` 						| **default** 		| Имя текущей анимации, в коллекции есть ['default', 'rotate'] |
| isMobileMode 			| `Boolean` 					| **true** 			| Включить мобильный режим |
| beforeOpen 				| `Function` 					| **() => true** 	| Возможность определеить какую-либо логику до открытия модалки или вовсе запретить открытие |
| beforeClose 				| `Function` 					| **() => true** 	| Возможность определеить какую-либо логику до закрытия модалки или вовсе отменить закрытие |

### $events:
```js
	// Модальное окно открылось
	this.$emit('opened', $event)

	// Модальное окно закрылось
	this.$emit('closed', $event)

	// Модальное окно открыто и активно
	this.$emit('active', { name, active })

	// Возврат координат модального окна, после перемещения
	this.$emit('drag-coords', { x, y })

	// Возвращает высоту модального окна
	this.$emit('body-height', value)
```

#### Example
```html
	<izi-modal
		name="services"
		headerTitle="Some title"
		width="1000"
		:height="600"
	/>
	<izi-modal
		name="resource"
		@opened="openModal"
		@closed="closeModal"
	>
		<div slot="header-content">
			Own header
		</div>
		<div slot="body-content">
			Own body
		</div>
	</izi-modal>
```
```javascript
	// Открыть модальное окно
	this.$vmodal.open(name* = '', callback = () => ({}))
	// Закрыть модальное окно
	this.$vmodal.close(name* = '')
	// Для включения диалога при закрытии модалки для кастомной кнопки закрытия, нужно добавить параметр { dialog: true } или true
	this.$vmodal.close(name* = '', dialog = false, callback = () => ({}))
```
## Dialog config:
| Name 					| Type 							| Default 			| Description 													|
| ---- 					| :--: 							| :-----: 			| ----------- 													|
| width 					| `[Number, String]` 		| **572** 			| Ширина   														|
| closeEsc 				| `Bolean` 						| **true** 			| Закрыть диалог с помощью Escape   					|
| title 					| `String` 						| **Вы уверены?** | Заголовок  													|
| text 					| `String` 						| **''** 			| Описание 														|
| paddingTxt			| `[String, Number]` 		| **'0'** 			| Внутренние отступы для текста 							|
| type 					| `String` 						| **info** 			| Тип иконки, в коллекции есть ['info', 'warning'] |
| layerClickToClose	| `Boolean` 					| **false** 		| Показывать внешний слой (background) модалки 		|
| scrollToActive		| `Boolean` 					| **false** 		| Включить режим договора (кнопки заблокированы до момента (* если есть скролл), пока весь контент не будет проскролен) |
| buttons 				| `Array` 						| **[{ title: 'Да', result: true, color: true },{ title: 'Нет', result: false }]** 		| Вывод кнопок в диалоге, result - ответ пользователя, color - выделение кнопки |

#### Example
```javascript
	/**
	 * Открыть диалоговое окно и получить результат
	 * * Обратить внимание на параметр locked, по умолчанию в компоненте он установлен как true (блокировать кнопку если scrollToActive = true), но для конкретной кнопки можно отключить этот режим установив locked: false
	*/

	async beforeCloseModal() {
		// Вы этом случае получаешь дефолтный шаблон диалога
		return await this.$iziDialog.open()
		// Либо можно детальнее модифицировать
		return await this.$iziDialog.open({
			width: 500,
			title: 'Вы уверены?',
			text: 'Какое-то описание, если требуется',
			type: 'warning',
			paddingTxt: '0 10',
			layerClickToClose: false,
			scrollToActive: true,
			buttons: [
				{ title: 'Да', result: true },
				{ title: 'Нет', result: false, color: true , locked: false },
				{ title: 'Может быть', result: 'maybe' }
			]
		})
	}
```
