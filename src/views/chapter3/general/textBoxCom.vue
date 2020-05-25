<template>
  <div
    ref="boxDom"
    class="debug"
    :style="{
      left: item.coordinate.x + '%',
      top: item.coordinate.y + '%',
      height: item.location === 'sensor_outter' ? '335px' : '150px',
    }"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <!-- <div class="location">
      <span class="dot"></span>
      {{ item.location.substr(7) }}
    </div>-->
    <template v-if="item.sensorList && item.sensorList.length > 0">
      <better-scroll ref="wrapper" :data="item.sensorList">
        <ul class="sensor-box">
          <li v-for="(s, index) in item.sensorList" :key="s.sensorId" class="sensor">
            <div
              class="sensorName"
              :class="{ ERROR: s.alarmLevel === 'ERROR', WARN: s.alarmLevel === 'WARN' }"
            >
              <span class="order">{{ index + 1 + '.' }}</span>
              {{ s.sensorName }}
            </div>
            <template v-if="s.identifierList && s.identifierList.length > 0">
              <div
                class="identifier"
                v-for="(i, index) in s.identifierList"
                :key="i.identifier + index"
              >
                <div
                  class="identifierName"
                  :class="{ ERROR: i.alarmLevel === 'ERROR', WARN: i.alarmLevel === 'WARN' }"
                >
                  <!-- <div>{{ i.identifierName + ': ' }}</div> -->
                  <div class="identifierValue" v-if="i.identifier">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="i.identifierName + ': ' + (getFloat(i.value, 2) || '--') + ' ' + ((i.metadata && i.metadata.unit) || '')"
                      placement="left"
                      :open-delay="500"
                    >
                      <span>
                        <span class="value">{{ getFloat(i.value, 2) || '--' }}</span>
                        <span class="unit">{{ i.metadata && i.metadata.unit || '' }}</span>
                      </span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </better-scroll>
    </template>
    <div v-else class="nodata">{{ $t('common.noData') }}</div>
  </div>
</template>
<script>
import betterScroll from '@/components/betterScroll/scroll.vue';
import { getFloat, isValueExist } from '@/util/commonService';

export default {
  name: 'textbox',
  components: {
    betterScroll,
  },
  props: {
    item: {
      type: Object,
      default: () => ({
        location: '',
        sensorList: [],
      }),
    },
  },
  data() {
    return {
      hover: false,
    };
  },
  mounted() {
    this.$emit('on-text-box-add', this);
  },
  beforeDestroy() {
    this.$emit('on-text-box-remove', this);
  },
  methods: {
    // 保留小数位数方法
    getFloat,
    isValueExist,
    handleMouseOver() {
      this.hover = true;
    },
    handleMouseLeave() {
      this.hover = false;
    },
  },
};
</script>
<style lang="less">
.debug {
  width: 10%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #fff;
  user-select: none;
  text-align: left;
  overflow-x: hidden;
  cursor: pointer;
  &:hover {
    border: 1px solid #fff;
  }
  .location {
    font-size: 12px;
    font-weight: bold;
    background-color: #000;
    padding: 5px;
    white-space: nowrap;
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border: none;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 3px;
      vertical-align: middle;
    }
  }
  .sensor-box {
    margin: 0;
    padding: 0;
    .sensor {
      margin: 0;
      padding: 0;
      list-style: none;
      .sensorName {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 4px;
        .order {
          margin-right: 2px;
        }
        &.ERROR {
          color: #ff5b5b;
        }
        &.WARN {
          color: #ffc71c;
        }
      }
      .identifier {
        margin-bottom: 2px;
        .identifierName {
          font-size: 12px;
          .identifierValue {
            font-size: 12px;
            white-space: nowrap;
            display: flex;
            .unit {
              margin-left: 5px;
            }
          }
          &.ERROR {
            color: #ff5b5b;
          }
          &.WARN {
            color: #ffc71c;
          }
        }
      }
    }
  }
  .nodata {
    padding: 10px;
    font-size: 12px;
  }
}
</style>
