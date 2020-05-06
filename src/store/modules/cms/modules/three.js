export default {
  namespaced: true,
  state: {
    currentLight: '',
    currentMaterial: '',
    currentGeo: '',
    modelName: 'Dragon 2.5_fbx.fbx',
    objReady: false,
  },
  mutations: {
    CURRENT_LIGHT(state, lightName) {
      state.currentLight = lightName;
    },
    CURRENT_MATERIAL(state, materialName) {
      state.currentMaterial = materialName;
    },
    CURRENT_GEO(state, geoName) {
      state.currentGeo = geoName;
    },
    MODEL_NAME(state, name) {
      state.modelName = name;
    },
    OBJ_READY(state, ready) {
      state.objReady = ready;
    },
  },
};
