export default {
  namespaced: true,
  state: {
    currentLight: '',
    modelName: 'Dragon 2.5_fbx.fbx',
    objReady: false,
  },
  mutations: {
    CURRENT_LIGHT(state, lightName) {
      state.currentLight = lightName;
    },
    MODEL_NAME(state, name) {
      state.modelName = name;
    },
    OBJ_READY(state, ready) {
      state.objReady = ready;
    },
  },
};
