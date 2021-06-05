<template>
  <div id="app">
    <div class="block-btn">
      <button class="btn" @click="open('header1')">Open</button>
    </div>
    <div class="block-btn">
      <button class="btn" @click="open('header2')">Open2</button>
    </div>
    <div class="block-btn">
      <button class="btn" @click="open('header3')">Open3</button>
    </div>

    
    <c-modal
      name="header1"
      headerName="header1"
      :top="30"
      :bClose="beforeClose"
    >
      <button @click="openDialog">open dialog</button>
    </c-modal>
    <c-modal
      name="header2"
      headerName="header2"
      :top="20"
      :left="20"
    />
    <c-modal
      name="header3"
      headerName="header3"
      :top="70"
      :left="70"
      :isLayer="true"
    >

      <div>
        content3
        <c-modal
          name="header4"
          headerName="header4"
          :top="70"
          :left="40"
        >
          <c-modal
            name="header5"
            headerName="header5"
            :top="50"
            :left="20"
          >
				<c-modal
					name="header6"
					headerName="header6"
					:top="30"
					:left="20"
				/>
				<div class="block-btn">
					<button class="btn" @click="open('header6')">Open6</button>
				</div>
			 </c-modal>
          <div class="block-btn">
            <button class="btn" @click="open('header5')">Open5</button>
          </div>
        </c-modal>
        <div class="block-btn">
          <button class="btn" @click="open('header4')">Open4</button>
        </div>
      </div>

    </c-modal>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data: () => ({
    name: 'root'
  }),
  methods: {
    async beforeClose() {
      console.log('beforeClose')
      return await this.$iDialog({
          width: 500,
          clickClose: false,
          type: 'warning',
          title: 'Are you ready?',
          text: 'Description this content',
          buttons: [
              { title: 'YES', result: 'yes', color: true },
              { title: 'NO', result: 'no' },
              { title: 'MAYBE', result: 'mb' },
              { title: 'ASDFASDFASDFSADFASF', result: 'ofc' },
          ] 
      })
    },
    open(name) {
      this.$cModal.open(name)
    },
    async openDialog() {
      //    const res = await this.$iDialog()
      //    const res = await this.$iDialog({})
      const res = await this.$iDialog({
          width: 500,
          clickClose: false,
          type: 'warning',
          title: 'Are you ready?',
          text: 'Description this content',
          buttons: [
              { title: 'YES', result: 'yes', color: true },
              { title: 'NO', result: 'no' },
              { title: 'MAYBE', result: 'mb' },
              { title: 'ASDFASDFASDFSADFASF', result: 'ofc' },
          ] 
      })

      console.log('res: ', res)
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.block-btn {
  margin: auto;
  display: inline-flex;
  justify-content: center;
}
.btn {
  display: block;
  padding: 10px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 30px 1px #000;
  background: #fff;
}
</style>
