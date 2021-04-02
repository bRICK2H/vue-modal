<template>
  <div id="app">
    <div class="block-btn">
      <button @click="open('header1')">Open</button>
    </div>
    <div class="block-btn">
      <button @click="open('header2')">Open2</button>
    </div>
    <div class="block-btn">
      <button @click="open('header3')">Open3</button>
    </div>

    
    <c-modal
      name="header1"
      headerName="header1"
      :isLayer="true"
      :top="30"
    />
    <c-modal
      name="header2"
      headerName="header2"
      :isLayer="true"
      :top="20"
      :left="20"
    />
    <c-modal
      name="header3"
      headerName="header3"
      :isLayer="true"
      :top="70"
      :left="70"
    />
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
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 30px 1px #000;
  background: #fff;
}
</style>
