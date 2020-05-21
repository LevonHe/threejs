<template>
  <div id="three">
    <div class="three-box clearfix">
      <div class="name-box pull-left">
        <scroll ref="wrapper" :data="arrList">
          <ul>
            <li v-for="(arr, index) in arrList" :key="index">
              <text-button :text="arr"></text-button>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="model-box pull-left">
        <model-element></model-element>
      </div>
    </div>
  </div>
</template>
<script>
import Scroll from '@/components/betterScroll/scroll.vue';
import ModelElement from './model.vue';
import TextButton from './textButton.vue';

export default {
  name: 'three',
  components: {
    Scroll,
    ModelElement,
    TextButton,
  },
  data() {
    return {
      scroll: null,
      arrList: ['Dragon 2.5_fbx.fbx', 'Dragon_Baked_Actions_fbx_7.4_binary.fbx', 'teapot-claraio.json', 'machine.obj'],
    };
  },
};
</script>
<style lang="less" scoped>
#three {
  position: relative;
  height: 100%;
  .three-box {
    height: calc(100% - 93px);
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    padding: 10px;
  }
  .name-box {
    width: 300px;
    height: calc(100% - 93px) !important;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    ul {
      margin: 0;
      padding: 0;
      li {
        margin: 0;
        padding: 0;
        list-style: none;
      }
    }
  }
  .model-box {
    width: calc(100% - 310px);
    height: 100% !important;
    margin-left: 10px;
    box-sizing: border-box;
  }
}
</style>