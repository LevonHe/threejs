<template>
  <div id="geometry" class="clearfix">
    <div class="box pull-left">
      <scroll :data="geometryArr">
        <ul>
          <li v-for="geo in geometryArr" :key="geo.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentGeo === geo.value ? 'primary' : ''"
              @click="addGeo(geo.value)"
            >{{geo.label}}</el-button>
            <el-tooltip placement="right" :content="geo.content">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
        </ul>
      </scroll>
    </div>
    <div id="container" class="pull-right"></div>
    <div id="gui"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import dat from 'three/examples/jsm/libs/dat.gui.module';
import Scroll from '@/components/betterScroll/scroll';
import { geometryArr } from '@/config/selectTypes';

export default {
  name: 'chapter1',
  components: {
    Scroll,
  },
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      plane: null,
      cube: null,
      sphere: null,
      GUI: null,
      geometryArr,
      geoNameList: [],
    };
  },
  computed: {
    ...mapState('cms/three', ['currentGeo']),
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    ...mapMutations({
      CURRENT_GEO: 'cms/three/CURRENT_GEO',
    }),
    init() {
      // renderer
      this.container = document.getElementById('container');
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启反锯齿
        precision: 'highp', // 着色精度
        alpha: true, // 可以设置背景色透明
        premultipliedAlpha: false,
        stencil: false,
        preserveDrawingBuffer: true, // 保存绘图缓冲
      });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0x333333, 1);
      this.renderer.setPixelRatio(window.devicePixelRatio); // 兼容高清屏幕
      this.renderer.shadowMap.enabled = true;
      this.container.appendChild(this.renderer.domElement);

      // scene
      this.scene = new THREE.Scene();

      // camera
      this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 10000);
      this.camera.position.set(0, 50, 50);
      this.camera.lookAt(this.scene.position);

      // axes
      const axes = new THREE.AxesHelper(40);
      this.scene.add(axes);

      // plane
      const planeGeometry = new THREE.PlaneGeometry(120, 100, 1, 1);
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -Math.PI / 2;
      this.plane.position.set(0, 0, 0);
      this.plane.receiveShadow = true;
      this.scene.add(this.plane);

      // cube
      const cubeGeometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.set(-20, 5, 0);
      this.scene.add(this.cube);

      // sphere
      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff, wireframe: true });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.sphere.position.set(20, 4, 0);
      this.scene.add(this.sphere);

      // controls
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.enableRotate = true;
      this.orbitControls.minPolarAngle = 0;
      this.orbitControls.maxPolarAngle = Math.PI;
      this.orbitControls.minAzimuthAngle = -Math.PI / 2;
      this.orbitControls.maxAzimuthAngle = Math.PI / 2;
      this.orbitControls.enablePan = true;
      this.orbitControls.panSpeed = 1;
      this.orbitControls.enableZoom = true;
      this.orbitControls.screenSpacePanning = false;

      window.addEventListener('resize', this.onWindowResize, false);
    },
    animate() {
      this.orbitControls && this.orbitControls.update();
      this.renderer && this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    },
    onWindowResize: _.debounce(
      function() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      },
      300,
      { leading: false, trailing: true }
    ),
    addGeo(geoName) {
      this.CURRENT_GEO(geoName);

      this.scene.children.forEach((element) => {
        this.scene.remove(element);
      });

      if (this.GUI) {
        document.getElementById('gui').removeChild(this.GUI.domElement);
        this.GUI = null;
      }

      this.GUI && document.getElementById('gui').appendChild(this.GUI.domElement);
    },
  },
};
</script>
<style lang="less" scoped>
#geometry {
  background-color: #fff;
  height: 100%;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  font-size: 0;
  .box {
    width: 20%;
    height: 100%;
    font-size: 14px;
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
    .btn {
      margin: 5px;
    }
  }
  #container {
    width: calc(80% - 10px);
    height: 100%;
    overflow: hidden;
    outline: none;
    &:focus {
      outline: none;
    }
    canvas {
      outline: none;
      &:focus {
        outline: none;
      }
    }
  }
  #gui {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>