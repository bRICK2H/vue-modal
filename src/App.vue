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

    
    <izi-modal
      name="header1"
      width="600"
      height="700"
      headerTitle="header1header1header1header1header1header1header1"
      :draggable="true"
      :header="true"
      :buttonClose="true"
      :layer="false"
    >
      <!-- <div slot="header">new headernew headernew headernew headernew header</div> -->
      <div slot="body-content">
        <div>
          {{ val }}
        </div>
        <button @click="openDialog">open dialog</button>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis dignissimos perspiciatis suscipit alias, optio aut est voluptatem, atque cumque hic nisi ipsa amet veritatis minus, unde culpa voluptates! Ducimus quas animi vitae minus, amet atque ut fuga incidunt culpa iusto deleniti tenetur officiis nemo eveniet officia. Quos nulla dolore distinctio natus corrupti esse officia, quae odit eius ut quibusdam vel reiciendis quas fugit explicabo voluptates possimus minima. Sunt eos, quisquam tenetur debitis, aspernatur voluptatum amet aliquam temporibus excepturi ex totam illo dolorum aliquid ab repudiandae hic in quia adipisci velit iure, reprehenderit voluptatem cumque. Ea ipsum modi vero tempora facilis!
        
        <div style="display:flex;">
          <!-- <c-select 
            width="200"
            v-model="val"
            :options="options"
            :behavior="true"
            :multiple="true"
            s_label="name"
            :reduce="o => o"
          /> -->
          <c-select 
            width="200"
            v-model="val"
            :options="options"
            :behavior="false"
            :multiple="true"
            s_label="name"
            :reduce="o => o.name"
          />
        </div>

        <div style="display:flex;">
          <!-- <v-select style="width:200px"
            label="name"
            v-model="val"
            :options="options"
            :multiple="true"
            :reduce="o => o"
          />
          <v-select style="width:200px"
            label="name"
            v-model="val"
            :options="options"
            :multiple="true"
            :reduce="o => o.name"
          /> -->
        </div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis dignissimos perspiciatis suscipit alias, optio aut est voluptatem, atque cumque hic nisi ipsa amet veritatis minus, unde culpa voluptates! Ducimus quas animi vitae minus, amet atque ut fuga incidunt culpa iusto deleniti tenetur officiis nemo eveniet officia. Quos nulla dolore distinctio natus corrupti esse officia, quae odit eius ut quibusdam vel reiciendis quas fugit explicabo voluptates possimus minima. Sunt eos, quisquam tenetur debitis, aspernatur voluptatum amet aliquam temporibus excepturi ex totam illo dolorum aliquid ab repudiandae hic in quia adipisci velit iure, reprehenderit voluptatem cumque. Ea ipsum modi vero tempora facilis!<br />
      </div>
    </izi-modal>
    <izi-modal
      name="header2"
      headerTitle="header2"
      height="300"
      :layer="false"
      :draggable="true"
      :top="20"
      :left="20"
      @opened="opened"
      @closed="closed"
      :beforeOpen="beforeOpen"
      :beforeClose="beforeClose"
    />
    <izi-modal
      name="header3"
      headerTitle="header3"
      :height="501"
      width="403"
      :top="70"
      :left="70"
      :layer="false"
      :layerClickToClose="true"
      :beforeClose="beforeClose"
    >

      <div slot="body">
        content3
        <izi-modal
          name="header4"
          headerTitle="header4"
          :top="70"
          :left="40"
        >
              <div slot="body">
                  <izi-modal
                  name="header5"
                  headerTitle="header5"
                  :top="50"
                  :left="20"
              >
                  <izi-modal
                    name="header6"
                    headerTitle="header6"
                    :top="30"
                    :left="20"
                  />
                  <div class="block-btn">
                    <button class="btn" @click="open('header6')">Open6</button>
                  </div>
                </izi-modal>
                <div class="block-btn">
                  <button class="btn" @click="open('header5')">Open5</button>
                </div>
              </div>
        </izi-modal>
        <div class="block-btn">
          <button class="btn" @click="open('header4')">Open4</button>
        </div>
      </div>

    </izi-modal>

    <!-- <modal name="my-first-modal"
      :draggable="true"
      :clickToClose="false"
    >
      This is my first modal
    
      <modal name="my-s-modal"
        :draggable="true"
        :clickToClose="false"
      >
          This is my s modal
      </modal>
      <button @click="$modal.show('my-s-modal')">modal-s</button>
    </modal>
    <button
    @click="$modal.show('my-first-modal')">modal-f</button> -->
    
  </div>
</template>

<script>
import CSelect from '../../vue-custom-select/src/plugin/c-select/src/c-select.vue'
import cSelect from './components/c-modal/select/main'

export default {
  name: 'App',
  components: {cSelect, CSelect},
  data: () => ({
    name: 'root',
    // val: ['cc'],
    // options: ['a', 'b', 'cc','incidunt culpa iusto deleniti tenetur officiis'],
    val: [],
    options: [
      { id: 1, name: 'Маникюр-хороший', price: 490 },
      { id: 2, name: 'Педикюр', price: 300 },
      { id: 3, name: 'Мужская косметология', price: 99 },
      { id: 4, name: 'Стикс-обертывания для тела', price: 33 },
    ]
  }),
  methods: {
    async beforeClose() {
      console.log('beforeClose')
      return await this.$iziDialog.open({
          width: 500,
          clickClose: false,
          type: 'warning',
          title: 'Are you ready?',
          text: 'Description this content',
          buttons: [
              { title: 'YES', result: true },
              { title: 'NO', result: false, color: true },
              { title: 'MAYBE', result: 'mb' },
              { title: 'ASDFASDFASDFSADFASF', result: 'ofc' },
          ] 
      })
    },
    opened(e) {
      console.log('opened', e)
    },
    closed(e) {
      console.log('closed', e)
    },
    beforeOpen() {
      console.log('beforeOpen')
    },
    beforeClose() {
      // return false
      console.log('beforeClose')
    },
    open(name) {
      this.$iziModal.open(name)
    },
    async openDialog() {
      //    const res = await this.$iDialog()
      //    const res = await this.$iDialog({})
      const res = await this.$iziDialog.open({
          width: 500,
          // layerClickToClose: false,
          type: 'warning',
          title: 'Are you ready?',
          text: 'Description this content',
          buttons: [
              { title: 'YES', result: 'yes',  color: true},
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
