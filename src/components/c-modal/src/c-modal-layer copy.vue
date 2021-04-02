<template>
  <div class="modal-layer">

    <div class="modal-content modal-layer__modal-content"
      v-if="isVisible"
      :style="setStylePositionModal"
    >
      <div class="modal-content__header"
        @mousedown="grab"
        @mouseup="leave"
      >
        header
      </div>
      <div class="modal-content__body">
        <component :is="null" />
      </div>
    </div>
    
  </div>
</template>

<script>
// import oneBodyModal from('./components/one-body-modal');
import Vue from 'vue'

export default {
  name: `Modal`,
  components: {
    // oneBodyModal
  },
  data: () => ({
    container: null,
    root: null,
    modalComponent: null,
    parent: null,

    isVisible: true,
    
    isGrab: false,
    units: '%',
    top: 50,
    left: 50,
    offsetTop: 0,
    offsetLeft: 0,
    bodyComponent: null
  }),
  computed: {
    setStylePositionModal() {
      return { top: `${this.top}${this.units}`, left: `${this.left}${this.units}` }
    },
  },
  methods: {
    register(root, modalComponent, container, parent) {
      this.container = container;
      this.root = root;
      this.modalComponent = modalComponent;
      this.parent = parent;
    },
    create(options) {
      const Modal = this.root.extend(this.modalComponent);
      const fragment = document.createElement('template')
      this.container.appendChild(fragment)

      const modal = new Modal().$mount(fragment);
      console.log(options, modal)

      this.parent.$modalContainer.push(modal)
      // const test = new this.root(this.modalComponent)
      // const fragment = document.createElement('template')
      // this.container.appendChild(fragment)
      // test.$mount(fragment)
      console.log(this.parent);
    },
    open(options) {
      this.isVisible = true
      this.create(options)
    },
    close() {
      this.isVisible = false
    },
    toggle() {
      this.isVisible = !this.isVisible
    },
    grab(event) {
      this.isGrab = true;
      this.units = 'px';
      this.offsetTop = event.layerY;
      this.offsetLeft = event.layerX;
      this.top = event.clientY - event.layerY
      this.left = event.clientX - event.layerX
    },
    leave() {
      this.isGrab = false;
    },
  },
  created() {
    document.body.addEventListener('mousemove', e => {
      if (this.isGrab) {
        this.top = e.clientY - this.offsetTop
        this.left = e.clientX - this.offsetLeft
      }
    })
  }
}
</script>

<style lang="scss">
.modal-layer {
  // width: 100%;
  // height: 100%;
  // background: #999;
  // position: absolute;
  // top: 0;
  // left: 0;
  // z-index: -1;

  &__modal-content {
    position: absolute;
    z-index: 999;
    user-select: none;
  }
}
.modal-content {
  width: 300px;
  height: 200px;
  background: #fff;
  box-shadow: 0 0 10px 1px #fff;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);

  &__header {
    width: 100%;
    height: 48px;
    background: #ccc;
    border-bottom: 1px solid #999;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: grab;
    }
    &:active {
      cursor: grabbing;
    }
  }
  &__body {
    height: 100%;
    background: #ccc;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
