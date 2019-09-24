<template>
    <app-main></app-main>
</template>

<script>
import { AppMain } from '../layout/components'
import ResizeMixin from '../layout/mixin/ResizeHandler'

export default {
  name: 'layoutDev',
  components: {
    AppMain
  },
  mixins: [ResizeMixin]
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
