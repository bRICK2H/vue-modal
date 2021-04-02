<template>
  <div class="modal-layer" :ref="name" v-show="isShow">

    <div class="modal-content modal-layer__modal-content"
      :style="setStylePositionModal"
      :class="{ 'modal-content--active': isActive }"
      @mousedown="$cModal.active(name)"
    >
      <div class="modal-content__header"
        @mousedown="grab"
        @mouseup="leave"
      >
        {{ headerName }}
      </div>
      <div class="modal-content__body">
        <component :is="null" />
      </div>
    </div>
    
  </div>
</template>

<script>

export default {
  name: `Modal`,
  components: {},
  props: {
    name: String,
    headerName: {
      type: String,
      default: ''
    },
    isLayer: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 50
    },
    left: {
      type: Number,
      default: 50
    }
  },
  data: () => ({
    isShow: false,
    isActive: false,
    
    isGrab: false,
    units: '%',
    fTop: 0,
    fLeft: 0,
    offsetTop: 0,
    offsetLeft: 0,
    bodyComponent: null
  }),
  computed: {
    setStylePositionModal() {
      return { top: `${this.fTop}${this.units}`, left: `${this.fLeft}${this.units}` }
    },
  },
  methods: {
    open() {
      this.isShow = true;
    },
    grab(event) {
      this.isGrab = true;
      this.units = 'px';
      this.offsetTop = event.layerY;
      this.offsetLeft = event.layerX;
      this.fTop = event.clientY - event.layerY
      this.fLeft = event.clientX - event.layerX
    },
    leave() {
      this.isGrab = false;
    },
  },
  watch: {
    isShow() {
      const countainer = document.getElementById('modal-container');
      countainer.appendChild(this.$refs[this.name])
      console.log(this.$modalContainer)
    }
  },
  created() {
    this.$cModal.created(this)
    this.fTop = this.top
    this.fLeft = this.left
    
    document.body.addEventListener('mousemove', e => {
      if (this.isGrab) {
        this.fTop = e.clientY - this.offsetTop
        this.fLeft = e.clientX - this.offsetLeft
      }
    })
    
    document.body.addEventListener('keyup', e => {
      if (this.isActive) this.$cModal.close(this.name)
    })

  },
}
</script>

<style lang="scss">
.modal-layer {
  &__modal-content {
    position: absolute;
    z-index: 999;
    user-select: none;
  }
}
.modal-content {
  width: 300px;
  height: 200px;
  border-radius: 4px;
  background: rgb(228, 227, 227);
  box-shadow: 0 7px 25px -3.5px rgb(131, 131, 131);
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  transition: box-shadow .2s;

  &--active {
    z-index: 1000;
    background: rgb(247, 247, 247);
    box-shadow: 0 15px 50px -7px #000;
  }

  &__header {
    width: 100%;
    height: 48px;
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
    // background: #eee;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
