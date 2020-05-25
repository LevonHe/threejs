<template>
  <div id="chapter3">
    <div id="config-info-box">
      <div class="config-box clearfix">
        <div class="sensor-container">
          <template v-if="sensorList.length > 0">
            <better-scroll :data="sensorList">
              <ul>
                <li v-for="item in sensorList" :key="item.id">
                  <div class="f-name mb-10">{{item.name}}</div>
                  <div class="f-value mb-15" v-if="item.variates && item.variates.length > 0">
                    <template v-for="subItem in item.variates">
                      <status-card
                        :key="subItem.identifier"
                        :item="subItem"
                        :sensor="item"
                        @handleRelease="handleReleaseSensor"
                      ></status-card>
                    </template>
                  </div>
                </li>
              </ul>
            </better-scroll>
          </template>
        </div>
        <div class="model-box">
          <general-box></general-box>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import BetterScroll from '@/components/betterScroll/scroll.vue';
import StatusCard from '@/components/cms-status-card/index.vue';
import GeneralBox from './general/index.vue';
import { processConfig } from '@/util/commonService';
export default {
  name: 'chapter3',
  components: {
    BetterScroll,
    StatusCard,
    GeneralBox,
  },
  data() {
    return {
      showSensorList: false,
      sensorList: [],
      configParam: [],
    };
  },
  computed: {
    ...mapState('cms/general', ['configReceived', 'sensorId', 'identifier', 'location']),
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    configReceived: {
      handler: function(value) {
        console.log('configReceived');
        if (!value) {
          this.INIT();
          return;
        }
        console.log('configReceived2');
        this.configParam.push({
          location: this.location,
          sensorId: this.sensorId,
          identifier: this.identifier,
        });
        this.$msg.success('绑定成功');
      },
    },
  },
  methods: {
    ...mapMutations({
      INIT: 'cms/general/INIT',
      CONFIG: 'cms/general/CONFIG',
    }),
    fetchData() {
      this.showSensorList = true;
      Promise.all([this.$api.geoListApi.getSensors(), this.$api.geoListApi.getConfig()])
        .then(([sensors, config]) => {
          if (!sensors || sensors.length === 0) {
            this.sensorList = [];
          } else {
            this.sensorList = sensors;
          }
          if (!config || config.length === 0) {
            this.configParam = [];
          } else {
            this.configParam = config;
          }
          if (this.sensorList.length > 0 && this.configParam.length > 0) {
            this.processSensorList(this.sensorList, this.configParam);
          }
        })
        .catch((err) => {
          this.$msg.error(err);
          this.sensorList = [];
          this.configParam = [];
        })
        .finally(() => {
          this.showSensorList = false;
          this.processConfigInfo(this.configParam, this.sensorList);
        });
    },
    processSensorList(sensorArr, configParamArr) {
      const sensorList = configParamArr.map((item) => item.sensorId);
      sensorArr.forEach((ele) => {
        if (sensorList.includes(ele.id) && ele.variates && ele.variates.length > 0) {
          const identifierList = configParamArr.filter((i) => i.sensorId === ele.id).map((item) => item.identifier);
          ele.variates.forEach((e) => {
            if (identifierList.includes(e.identifier)) {
              e.disable = true;
            }
          });
        }
      });
    },
    processConfigInfo(configParamArr, sensorArr) {
      const config = processConfig(configParamArr, sensorArr);
      this.CONFIG(config);
    },
    handleReleaseSensor($event) {
      if (!$event) {
        return;
      }
      this.configParam = this.configParam.filter(
        (item) => item.sensorId !== $event.sensorId || item.identifier !== $event.identifier
      );
      // this.putGeneralConfig(this.hierarchy.id, this.configParam);
      this.$msg.success('释放成功');
    },
  },
};
</script>
<style lang="less" scoped>
#chapter3 {
  height: 100% !important;
  min-height: 640px;
  min-width: 1250px;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  border-radius: 3px;
  #config-info-box {
    position: relative;
    height: 100%;
    min-height: 651px;
    .btn-disable {
      background-color: #a0cfff;
      border-color: #a0cfff;
      cursor: not-allowed;
    }
    .config-box {
      height: 600px;
      box-sizing: border-box;
      .sensor-container {
        width: 300px;
        height: 100%;
        overflow-y: auto;
        border: 1px solid #e4e4e4;
        border-radius: 3px;
        background-color: #fff;
        float: left;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          li {
            margin: 0;
            padding: 0;
          }
        }
        .f-name {
          font-size: 16px;
          font-weight: bold;
          text-align: left;
        }
        .f-value {
          text-align: left;
        }
      }
      .model-box {
        width: calc(100% - 310px);
        margin-left: 10px;
        height: 100%;
        float: left;
        box-sizing: border-box;
      }
    }
  }
}
</style>
