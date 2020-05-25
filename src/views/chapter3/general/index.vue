<template>
  <div id="generalChart">
    <div id="mus"></div>
    <template v-if="objReady && sensorNameArray && sensorNameArray.length > 0">
      <text-box-com
        v-for="item in sensorNameArray"
        :key="item.location"
        :item="item"
        @on-text-box-add="handleTextBoxListAdd"
        @on-text-box-remove="handleTextBoxListRemove"
      ></text-box-com>
    </template>
    <div class="progress"></div>
    <div class="reset" @click="handleSceneReset">{{ $t('common.reset') }}</div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import * as _ from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import TextBoxCom from './textBoxCom.vue';
import { fengdianSensorNames } from '@/util/selectTypes';

export default {
  name: 'generalChart',
  components: {
    TextBoxCom,
  },
  data() {
    return {
      container: null,
      renderer: null,
      camera: null,
      scene: null,
      rotateMeshes: [], // 存储模型中需要有转动动画的mesh集合
      orbitControls: null,
      progressBox: null,
      animation: true,
      objReady: false, // 风机模型加载完毕标志
      meshList: [], // 存储所有传感器mesh模型
      meshCoordinateObj: {}, // 存储所有传感器的中心点三维坐标
      textBoxList: [], // textbox组件的实例列表
      sensorNameArr: [], // 实际加载的模型中传感器名称列表
      textCoordinateObj: {}, // 文本框的二维坐标，从传感器位中心点的三维坐标计算的来
    };
  },
  computed: {
    ...mapState('cms/layout', ['collapsed']),
    ...mapState('cms/general', ['config', 'genaralReceived']),
    sensorNameArray() {
      const arr = [];
      if (!this.container || !this.container.clientWidth) {
        return arr;
      }
      this.sensorNameArr.forEach((ele, index) => {
        // ele：模型名称全写，loc：模型名称-分割的前两部分，name：模型名称-分割的最后部分
        const { loc, name } = this.getLocationName(ele);
        const item = this.config.find((i) => i.location === loc);
        let coordinate = this.textCoordinateObj[ele] || { x: 0, y: 0 };
        if (loc === 'sensor_outter') {
          coordinate = { x: 2, y: 3 };
        }
        if (item) {
          arr.push({ ...item, location: loc, name, coordinate });
        } else {
          arr.push({
            location: loc,
            name,
            sensorList: [],
            coordinate,
          });
        }
      });
      return arr;
    },
  },
  mounted() {
    this.init();
    this.animate();
    this.loadObject('/statics/');
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.animate = () => {};
    this.onWindowResize = () => {};
    this.container = null;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.rotateMeshes = [];
    this.orbitControls = null;
    this.progressBox = null;
    this.animation = true;
    this.objReady = false;
    this.meshList = [];
    this.meshCoordinateObj = {};
    this.textBoxList = [];
    this.sensorNameArr = [];
    this.textCoordinateObj = {};
  },
  watch: {
    genaralReceived: {
      handler: function(value, oldValue) {
        console.log('genaralReceived');
        if (!value) {
          this.INIT();
          return;
        }
        if (this.textBoxList.length === 0) {
          this.INIT();
          return;
        }
        const item = this.textBoxList.find((i) => i.hover);
        if (!item) {
          this.INIT();
          return;
        }
        console.log('genaralReceived2');
        this.LOCATION(item.item.location);
        this.CONFIG_RECEIVED(true);
      },
    },
    collapsed: {
      handler: function(val) {
        this.onWindowResize();
      },
    },
  },
  methods: {
    ...mapMutations({
      LOCATION: 'cms/general/LOCATION',
      CONFIG_RECEIVED: 'cms/general/CONFIG_RECEIVED',
      INIT: 'cms/general/INIT',
    }),
    getLocationName(name) {
      if (name.includes('_')) {
        return { loc: name, name: '' };
      }
      const nameArr = name.split('-');
      return { loc: `${nameArr[0] + '-' + nameArr[1]}`, name: nameArr[2] };
    },
    handleSceneReset() {
      // 重置轨迹控制球的设置，该操作要先于相机位置的设置
      this.orbitControls && this.orbitControls.reset();
      // 重新设置相机的位置
      this.camera.position.set(0, 0, 70);
    },
    handleTextBoxListAdd(textbox) {
      if (textbox) {
        this.textBoxList.push(textbox);
      }
    },
    handleTextBoxListRemove(textbox) {
      if (textbox) {
        this.textBoxList.splice(this.textBoxList.indexOf(textbox), 1);
      }
    },
    init() {
      // container
      this.container = document.getElementById('mus');
      this.progressBox = document.querySelector('.progress');

      // scene
      this.scene = new THREE.Scene();

      // renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启反锯齿
        precision: 'highp', // 着色精度
        alpha: true, // 可以设置背景色透明
        premultipliedAlpha: false,
        stencil: false,
        preserveDrawingBuffer: true, // 保存绘图缓冲
      });
      if (!this.container) {
        return;
      }
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio); // 兼容高清屏幕
      this.container.appendChild(this.renderer.domElement);

      // camera
      this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 10000);
      this.camera.position.set(0, 0, 70);
      this.camera.lookAt(this.scene.position);

      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.enableRotate = true;
      this.orbitControls.minPolarAngle = 0;
      this.orbitControls.maxPolarAngle = Math.PI;
      this.orbitControls.minAzimuthAngle = -Math.PI / 2;
      this.orbitControls.maxAzimuthAngle = Math.PI / 2;
      this.orbitControls.enablePan = true;
      this.orbitControls.panSpeed = 1;
      this.orbitControls.enableZoom = true;
      this.orbitControls.minDistance = 50;
      this.orbitControls.maxDistance = 500;
      this.orbitControls.screenSpacePanning = false;

      // light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65); // 从正上方照射的平行光，0.45强度
      directionalLight.position.set(800, 400, 0);
      directionalLight.position.multiplyScalar(0.6);
      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-1200, 400, 800);
      spotLight.castShadow = true;
      this.scene.add(directionalLight);
      this.scene.add(spotLight);

      window.addEventListener('resize', this.onWindowResize, false);
    },
    onWindowResize: _.debounce(
      function() {
        if (!this.container) {
          return;
        }
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      },
      300,
      { leading: false, trailing: true }
    ),
    animate() {
      this.orbitControls && this.orbitControls.update();

      if (this.animation && this.rotateMeshes.length > 0) {
        this.rotateMeshes.forEach((e) => {
          e.rotateX(Math.PI / 360);
        });
      }
      if (this.objReady && this.meshList.length) {
        this.compute2DCoordinate();
        this.drawLines(this.meshList);
      }
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
      requestAnimationFrame(this.animate);
    },
    loadObject(path) {
      new MTLLoader().setPath(path).load('machine.mtl', (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath(path)
          .load(
            'machine.obj',
            (obj) => {
              if (!this.camera || !this.scene) {
                return;
              }
              this.sensorNameArr = [];
              this.rotateMeshes = [];
              this.meshList = [];
              this.meshCoordinateObj = {};
              this.objReady = false;

              this.camera && this.camera.position.set(0, 0, 70);
              obj.position.set(48, 0, 0);
              this.sensorNameArr.push('sensor_outter');

              obj.children.forEach((e) => {
                // 需要旋转的mesh
                if (e.name.includes('rotate')) {
                  this.rotateMeshes.push(e);
                }
                if (fengdianSensorNames.includes(e.name) || e.name.includes('sensor-')) {
                  // 存储所有传感器mesh
                  this.meshList.push(e);
                  // 存储所有传感器的名称
                  this.sensorNameArr.push(e.name);
                  let newE = e;
                  newE.geometry.computeBoundingBox();
                  const compensate = 48;
                  const x =
                    compensate +
                    newE.geometry.boundingBox.min.x +
                    (newE.geometry.boundingBox.max.x - newE.geometry.boundingBox.min.x) / 2;
                  const y =
                    newE.geometry.boundingBox.min.y +
                    (newE.geometry.boundingBox.max.y - newE.geometry.boundingBox.min.y) / 2;
                  const z =
                    newE.geometry.boundingBox.min.z +
                    (newE.geometry.boundingBox.max.z - newE.geometry.boundingBox.min.z) / 2;
                  // 存储传感器名称及其对应的目标
                  this.meshCoordinateObj[e.name] = { x, y, z };
                  newE = null;
                }
              });
              this.compute2DCoordinate();
              this.scene && this.scene.add(obj);
              this.objReady = true;
            },
            (xhr) => {
              const _this = this;
              if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                const percent = Math.round(percentComplete);
                this.progressBox && (this.progressBox.innerHTML = percent + '%');
                if (percent >= 100) {
                  setTimeout(() => {
                    _this.progressBox && (_this.progressBox.style.display = 'none');
                  }, 300);
                }
              } else {
                this.progressBox.innerHTML = 'loading...';
                setTimeout(() => {
                  _this.progressBox && (_this.progressBox.style.display = 'none');
                }, 2300);
              }
            },
            (err) => {
              console.log('---obj load error---');
              console.log(err);
            }
          );
      });
    },
    compute2DCoordinate() {
      this.textCoordinateObj = {};
      if (!this.camera || !this.container || !this.meshList || this.meshList.length === 0) {
        return;
      }
      this.meshList.forEach((ele, index) => {
        const meshCoordinate = this.meshCoordinateObj[ele.name];
        const vector3D = new THREE.Vector3(meshCoordinate.x, meshCoordinate.y, meshCoordinate.z);
        vector3D.project(this.camera);
        // 转换后的传感器位置的二维坐标
        const x = Math.round((0.5 + vector3D.x / 2) * this.container.clientWidth);
        const y = Math.round((0.5 - vector3D.y / 2) * this.container.clientHeight);
        // 文本框的二维坐标
        let X;
        let Y;
        let loc;
        X = ((x - this.container.clientWidth * 0.05) * 100) / this.container.clientWidth;

        let idx;
        const nameNum = ele.name.split('-')[1];
        const num = parseInt(nameNum);
        if (typeof num === 'number' && !isNaN(num)) {
          idx = num;
        } else {
          idx = index;
        }
        if (idx % 2 === 0) {
          Y = ((y + 100) * 100) / this.container.clientHeight;
          loc = 'top';
        } else {
          Y = ((y - 250) * 100) / this.container.clientHeight;
          loc = 'bottom';
        }
        this.textCoordinateObj[ele.name] = { x: X, y: Y, loc };
      });
    },
    drawLines(meshList) {
      if (!this.scene || !this.container) {
        return;
      }
      meshList.every((ele, index) => {
        this.scene.children.every((e) => {
          if (e.name === 'line_' + ele.name) {
            this.scene.remove(e);
            return false;
          }
          return true;
        });
        const geometry = new THREE.Geometry();
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        // 第一个点
        const meshCoordinate = this.meshCoordinateObj[ele.name]; // 模型中心点三维坐标
        geometry.vertices.push(new THREE.Vector3(meshCoordinate.x, meshCoordinate.y, meshCoordinate.z));
        // 第二个点
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;

        const coordinate = this.textCoordinateObj[ele.name];
        if (!coordinate || coordinate.loc === 'none') {
          return true;
        }
        let posX;
        let posY;
        if (coordinate.loc === 'top') {
          posX = ((w * (coordinate.x / 100) + w * 0.05) / w) * 2 - 1;
          posY = -((h * (coordinate.y / 100) - 10) / h) * 2 + 1;
        } else if (coordinate.loc === 'bottom') {
          posX = ((w * (coordinate.x / 100) + w * 0.05) / w) * 2 - 1;
          posY = -((h * (coordinate.y / 100) + 160) / h) * 2 + 1;
        }
        let vec = new THREE.Vector3(posX, posY, -1);
        vec.unproject(this.camera);
        geometry.vertices.push(vec);
        vec = null;

        const line = new THREE.Line(geometry, material);
        line.name = 'line_' + ele.name;
        this.scene.add(line);
        return true;
      });
    },
  },
};
</script>
<style lang="less" scoped>
#generalChart {
  position: relative;
  height: 100%;
  overflow: hidden;
  #mus {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background-image: url(/statics/bg.png);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .progress {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    line-height: 600px;
  }
  .reset {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 50%;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    color: #141930;
    cursor: pointer;
    background: url('../../../assets/images/icom-reset-default.png');
    &:hover {
      background: url('../../../assets/images/icom-reset-hover.png');
    }
  }
}
</style>
