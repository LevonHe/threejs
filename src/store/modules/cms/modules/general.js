export default {
  namespaced: true,
  state: {
    sensorId: '', // 传感器id
    identifier: '', // 变量类型
    location: '', // 传感器位置: engine, gearbox, bearing, outter,
    genaralReceived: false,
    configReceived: false,
    config: [],
  },
  mutations: {
    SENSOR_ID(state, sensorId) {
      state.sensorId = sensorId;
    },
    IDENTIFIER(state, identifier) {
      state.identifier = identifier;
    },
    LOCATION(state, location) {
      state.location = location;
    },
    GENERAL_RECEIVED(state, genaralReceived) {
      state.genaralReceived = genaralReceived;
    },
    CONFIG_RECEIVED(state, configReceived) {
      state.configReceived = configReceived;
    },
    CONFIG(state, config) {
      state.config = config;
    },
    INIT(state) {
      state.sensorId = '';
      state.identifier = '';
      state.location = '';
      state.genaralReceived = false;
      state.configReceived = false;
    },
  },
};
