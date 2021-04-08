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
    />
    <c-modal
      name="header2"
      headerName="header2"
      :top="20"
      :left="20"
    />
    <c-modal
      name="header3"
      headerName="header3"
      :isLayer="false"
      :top="70"
      :left="70"
    >

      <div>
        content3
        <c-modal
          name="header4"
          headerName="header4"
          :top="70"
          :left="40"
        >
          <!-- <c-modal
            name="header5"
            headerName="header5"
            :top="50"
            :left="20"
          />
          <div class="block-btn">
            <button class="btn" @click="open('header5')">Open5</button>
          </div> -->
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
    open(name) {
      this.$cModal.open(name)
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
