<template>
  <div id="statusCard" ref="currentDom" :class="item.disable ? 'disable' : ''" @mousedown="drag">
    <div
      class="status-name text-ellipsis d2-mb-10"
      :class="{ ERROR: alarmLevel === 'ERROR', WARN: alarmLevel === 'WARN' }"
    >{{ item.name || '--' }}</div>
    <div
      class="status-data clearfix"
      :class="{ ERROR: alarmLevel === 'ERROR', WARN: alarmLevel === 'WARN' }"
    >
      <span class="status-value">{{ getFloat(item.value, 2) }}</span>
      <span class="status-unit pull-right">{{ (item.metadata && item.metadata.unit) || '' }}</span>
    </div>
    <div class="release-btn" v-show="item.disable">
      <a class="cms-a-btn" @click="handleRelease" style="color: #31b1f5">{{ $t('common.release') }}</a>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getFloat } from '@/util/commonService';
export default {
  name: 'statusCard',
  props: {
    item: {
      type: Object,
      default: () => ({
        name: '',
        value: '',
        identifier: '',
        disable: false,
      }),
    },
    sensor: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isDrop: false, // 鼠标按下标志
      dom: null, // 当前dom元素
      parentNode: null,
      docScrollLeft: 0,
      docScrollTop: 0,
      domWidth: 0,
      domHeight: 0,
      x: 0, // 鼠标按下时鼠标距离dom元素最左边的距离
      y: 0, // 鼠标按下时鼠标距离dom元素最上边的距离
      parentLeft: 0, // 鼠标按下时父盒子的offsetLeft
      parentTop: 0, // 鼠标按下时父盒子的offsetTop
      maxX: 0, // 鼠标按下时x方向可拖拽的最大距离
      maxY: 0, // 鼠标按下时y方向可拖拽的最大距离
    };
  },
  computed: {
    alarmLevel() {
      if (
        this.sensor.alarmReasons &&
        this.sensor.alarmReasons.length > 0 &&
        this.sensor.alarmReasons.includes(this.item.identifier) &&
        this.sensor.alarmLevel &&
        this.sensor.alarmLevel !== 'OK'
      ) {
        return this.sensor.alarmLevel;
      }
      return '';
    },
  },
  methods: {
    ...mapMutations({
      SENSOR_ID: 'cms/general/SENSOR_ID',
      IDENTIFIER: 'cms/general/IDENTIFIER',
      GENERAL_RECEIVED: 'cms/general/GENERAL_RECEIVED',
    }),
    getFloat,
    drag(e) {
      if (this.item.disable) {
        return;
      }
      if (e) e.preventDefault();
      this.isDrop = true;
      // const currentDom = e.target;
      const currentDom = this.$refs.currentDom;
      // 计算
      this.domWidth = currentDom.offsetWidth;
      this.domHeight = currentDom.offsetHeight;
      const [domOffsetLeft, domOffsetTop, domScrollLeft, domScrollTop] = this.getRootOffset(currentDom);
      const bodyScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
      const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      const totalScrollLeft = bodyScrollLeft + domScrollLeft;
      const totalScrollTop = bodyScrollTop + domScrollTop;
      this.x = e.clientX + totalScrollLeft - domOffsetLeft;
      this.y = e.clientY + totalScrollTop - domOffsetTop;
      this.docScrollLeft = totalScrollLeft;
      this.docScrollTop = totalScrollTop;
      this.parentNode = document.getElementById('config-info-box');
      const [parentOffsetLeft, parentOffsetTop] = this.getRootOffset(this.parentNode);
      this.parentLeft = parentOffsetLeft;
      this.parentTop = parentOffsetTop;
      this.maxX = this.parentNode.offsetWidth - this.domWidth;
      this.maxY = this.parentNode.offsetHeight - this.domHeight;
      // 克隆
      // this.dom = e.target.cloneNode(true);
      this.dom = this.$refs.currentDom.cloneNode(true);

      let moveX = e.clientX + this.docScrollLeft - this.parentLeft - this.domWidth;
      let moveY = e.clientY + this.docScrollTop - this.parentTop - this.domHeight / 2;
      if (moveX >= this.maxX) {
        moveX = this.maxX;
      } else if (moveX < 0) {
        moveX = 0;
      }
      if (moveY >= this.maxY) {
        moveY = this.maxY;
      } else if (moveY < 0) {
        moveY = 0;
      }
      this.dom.style.width = this.domWidth + 'px';
      this.dom.style.height = this.domHeight + 'px';
      this.dom.style.position = 'absolute';
      this.dom.style.left = moveX + 'px';
      this.dom.style.top = moveY + 'px';
      this.dom.style.backgroundColor = '#ddf3ff';
      this.dom.style.borderStyle = 'dashed';
      this.dom.style.borderColor = '#31b1f5';
      this.dom.style.opacity = '0.7';
      this.dom.style.margin = 0;
      this.parentNode.appendChild(this.dom);
      // 监听
      document.addEventListener('mousemove', this.onmousemove, false);
      document.addEventListener('mouseup', this.onmouseup, false);
    },
    onmousemove(e) {
      if (!this.isDrop) {
        return;
      }
      if (e) e.preventDefault();
      let moveX = e.clientX + this.docScrollLeft - this.parentLeft - this.domWidth;
      let moveY = e.clientY + this.docScrollTop - this.parentTop - this.domHeight / 2;
      if (moveX >= this.maxX) {
        moveX = this.maxX;
      } else if (moveX < 0) {
        moveX = 0;
      }
      if (moveY >= this.maxY) {
        moveY = this.maxY;
      } else if (moveY < 0) {
        moveY = 0;
      }
      this.dom.style.left = moveX + 'px';
      this.dom.style.top = moveY + 'px';
    },
    onmouseup(e) {
      if (e) e.preventDefault();
      document.removeEventListener('mousemove', this.onmousemove, false);
      document.removeEventListener('mouseup', this.onmouseup, false);
      this.isDrop = false;
      this.parentNode.removeChild(this.dom);
      this.dom = null;
      this.docScrollLeft = 0;
      this.docScrollTop = 0;
      this.x = 0;
      this.y = 0;
      this.parentLeft = 0;
      this.parentTop = 0;
      this.maxX = 0;
      this.maxY = 0;
      this.changeState();
    },
    getRootOffset(el, pname = 'body') {
      let offsetLeft = el.offsetLeft;
      let offsetTop = el.offsetTop;
      let scrollLeft = el.scrollLeft;
      let scrollTop = el.scrollTop;
      if (el.offsetParent && el.offsetParent.tagName !== pname) {
        let p = this.getRootOffset(el.offsetParent, pname);
        offsetLeft += p[0];
        offsetTop += p[1];
        scrollLeft += p[2];
        scrollTop += p[3];
      }
      return [offsetLeft, offsetTop, scrollLeft, scrollTop];
    },
    changeState() {
      console.log('changeState');
      this.SENSOR_ID(this.sensor.id);
      this.IDENTIFIER(this.item.identifier);
      this.GENERAL_RECEIVED(true);
    },
    handleRelease() {
      this.$emit('handleRelease', {
        sensorId: this.sensor.id,
        identifier: this.item.identifier,
      });
    },
  },
};
</script>
<style lang="less">
#statusCard {
  position: relative;
  cursor: pointer;
  display: inline-block;
  width: calc(50% - 10px);
  background-color: #fff;
  color: #666;
  border: 1px solid #e4e4e4;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  margin: 5px;
  user-select: none;
  vertical-align: middle;
  .status-name {
    font-size: 12px;
    line-height: 16px;
    height: 16px;
    outline: none;
    &.focusing {
      outline: none;
    }
    &.ERROR {
      color: #ff5b5b;
    }
    &.WARN {
      color: #ffc71c;
    }
  }
  .status-data {
    font-size: 12px;
    line-height: 16px;
    height: 16px;
    outline: none;
    .status-value {
      display: inline-block;
      width: 78%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status-unit {
      display: inline-block;
      width: 20%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.focusing {
      outline: none;
    }
    &.ERROR {
      color: #ff5b5b;
    }
    &.WARN {
      color: #ffc71c;
    }
  }
  .release-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #31b1f5;
    border-radius: 3px;
    white-space: nowrap;
    opacity: 0;
  }
  &:hover {
    border-color: #31b1f5;
  }
  &:active {
    background-color: #ddf3ff;
    border-color: #31b1f5;
  }
  &.disable {
    cursor: not-allowed;
    background-color: #f0f0f0;
  }
  &.disable:hover {
    cursor: not-allowed;
    background-color: #f0f0f0;
    border-color: #e4e4e4;
    .release-btn {
      opacity: 1;
    }
  }
  &.disable:active {
    cursor: not-allowed;
    background-color: #f0f0f0;
    border-color: #e4e4e4;
  }
}
</style>
