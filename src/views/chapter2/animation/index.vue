<template>
  <div id="animation">
    <div class="model-box pull-left">
      <model-element></model-element>
    </div>
  </div>
</template>
<script>
import ModelElement from './model.vue';

export default {
  name: 'animation',
  components: {
    ModelElement,
  },
};
</script>
<style lang="less" scoped>
#animation {
  position: relative;
  height: 100%;
  .model-box {
    width: 100%;
    height: 100% !important;
    margin-left: 10px;
    box-sizing: border-box;
  }
}
</style>