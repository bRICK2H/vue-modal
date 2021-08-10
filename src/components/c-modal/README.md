# izi-modal-component

### Install
```
npm i inowave-izi-modal-component@git+https://repo.izibook.ru/scm/wvm/izi-modal-component.git
```
### main.js
```js
import iziModal from 'inowave-izi-modal-component'
Vue.use(iziModal)
```

## Modal config:
| Name 					| Type 							| Default 			| Description 	|
| ---- 					| :--: 							| :-----: 			| ----------- 	|
| ***name** 			| `String` 						| **''** 			| Название, открытие/закрытие модального окна зависит от этого имени, обязательный параметр  |
| headerTitle 			| `String` 						| **''** 			| Название в шапке |
| header 				| `Boolean` 					| **true** 			| Показывать верхний блок шапки |
| buttonClose 			| `Boolean` 					| **true** 			| Показывать кнопку (крест) закрытия модального окна |
| layer	 				| `Boolean` 					| **true** 			| Показывать внешний слой (background) модалки |
| layerClickToClose 	| `Boolean` 					| **false** 		| Не закрывать модальное окно по клику на внешний слой модалки |
| draggable 			| `Boolean`						| **false** 		| Отключить перемещения модального окна (drag'n'drop работает только по шапке) |
| left 					| `[Number, String]` 		| **50** 			| Первоначальное положение модалки по оси X, если не указано, то растоположежние устанавливается по центру отностильно окна  |
| top 					| `[Number, String]` 		| **50** 			| Первоначальное положение модалки по оси Y, если не указано, то растоположежние устанавливается по центру отностильно окна  |
| width 					| `[Number, String]` 		| **1000** 			| Ширина модального окна |
| minWidth 				| `[Number, String]` 		| **400** 			| Минамальная ширина модального окна |
| height 				| `[Number, String]` 		| **800** 			| Высота модального окна |
| minHeight 			| `[Number, String]` 		| **200** 			| Минамальная высота модального окна |
| padding 				| `[Number, String]` 		| **100** 			| Padding для тела модального окна |
| transition 			| `String` 						| **default** 		| Имя текущей анимации, в коллекции есть ['default', 'rotate'] |
| beforeOpen 			| `Function` 					| **() => true** 	| Возможность определеить какую-либо логику до открытия модалки или вовсе запретить открытие |
| beforeClose 			| `Function` 					| **() => true** 	| Возможность определеить какую-либо логику до закрытия модалки или вовсе отменить закрытие |

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
	this.$iziModal.open('services')
	// Закрыть модальное окно
	this.$iziModal.close('services')
```
## Dialog config:
| Name 					| Type 							| Default 			| Description 	|
| ---- 					| :--: 							| :-----: 			| ----------- 	|
| width 					| `[Number, String]` 		| **572** 			| Ширина   |
| title 					| `String` 						| **Вы уверены?** | Заголовок  |
| text 					| `String` 						| **''** 			| Описание |
| type 					| `String` 						| **info** 			| Тип иконки, в коллекции есть ['info', 'warning'] |
| layerClickToClose	| `Boolean` 					| **false** 		| Показывать внешний слой (background) модалки |
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