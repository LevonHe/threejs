<template>
  <div id="light" class="clearfix">
    <div class="box pull-left">
      <div>
        <h3>基础光源</h3>
        <template v-for="light in basicLightArr">
          <div :key="light.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentLight === light.value ? 'primary' : ''"
              @click="addLight(light.value)"
            >{{light.label}}</el-button>
            <el-tooltip placement="right" :content="light.content">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
      </div>
      <div>
        <h3>特殊光源</h3>
        <template v-for="light in specialLightArr">
          <div :key="light.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentLight === light.value ? 'primary' : ''"
              @click="addLight(light.value)"
            >{{light.label}}</el-button>
            <el-tooltip placement="right" :content="light.content">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
      </div>
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
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { basicLightArr, specialLightArr } from '@/config/selectTypes';

export default {
  name: 'chapter1',
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
      basicLightArr,
      specialLightArr,
      lightNameList: [
        'AmbientLight',
        'PointLight',
        'SpotLight',
        'DirectionalLight',
        'HemisphereLight',
        'RectAreaLight',
        'Lensflare',
      ],
    };
  },
  computed: {
    ...mapState('cms/three', ['currentLight']),
  },
  mounted() {
    this.init();
    this.animate();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.animate = () => {};
    this.onWindowResize = () => {};
    this.container = null;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.orbitControls = null;
  },
  methods: {
    ...mapMutations({
      CURRENT_LIGHT: 'cms/three/CURRENT_LIGHT',
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

      RectAreaLightUniformsLib.init();

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
    addLight(lightName) {
      this.CURRENT_LIGHT(lightName);

      this.scene.children.forEach((element) => {
        if (this.lightNameList.includes(element.type)) {
          this.scene.remove(element);
        }
        if (element.name === 'AreaFloor') {
          this.scene.remove(element);
        }
      });

      if (this.GUI) {
        document.getElementById('gui').removeChild(this.GUI.domElement);
        this.GUI = null;
      }

      if (lightName === 'AmbientLight') {
        // AmbientLight
        const ambiColor = '#ffffff';
        const ambientLight = new THREE.AmbientLight(ambiColor);
        this.scene.add(ambientLight);

        // GUI
        const controls = new (function() {
          this.ambientColor = ambiColor;
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'ambientColor').onChange(function(e) {
          ambientLight.color = new THREE.Color(e);
        });
      }

      if (lightName === 'PointLight') {
        // PointLight
        const pointColor = '#ffffff';
        const pointLight = new THREE.PointLight(pointColor);
        pointLight.position.set(0, 20, 0);
        pointLight.intensity = 1;
        pointLight.distance = 0;
        pointLight.visible = true;

        const pointLightHelper = new THREE.PointLightHelper(pointLight);
        pointLightHelper.color = pointColor;
        pointLight.add(pointLightHelper);
        this.scene.add(pointLight);

        // GUI
        const controls = new (function() {
          this.color = pointColor;
          this.intensity = 1;
          this.distance = 0;
          this.visible = true;
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          const c = new THREE.Color(e);
          pointLightHelper.color = c;
          pointLightHelper.update();
          pointLight.color = c;
        });
        this.GUI.add(controls, 'intensity', 0, 3).onChange(function(e) {
          pointLight.intensity = e;
        });
        this.GUI.add(controls, 'distance', 0, 100).onChange(function(e) {
          pointLight.distance = e;
        });
        this.GUI.add(controls, 'visible').onChange(function(e) {
          pointLight.visible = e;
        });
      }

      if (lightName === 'SpotLight') {
        // SpotLight
        const spotColor = '#ffffff';
        const spotLight = new THREE.SpotLight(spotColor);
        spotLight.angle = Math.PI / 3;
        spotLight.intensity = 1;
        spotLight.position.set(0, 20, 0);
        spotLight.target = this.plane;
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        spotLightHelper.color = spotColor;
        spotLight.add(spotLightHelper);
        this.scene.add(spotLight);

        // GUI
        const controls = new (function() {
          this.color = spotColor;
          this.angle = 60;
          this.intensity = 1;
          this.target = 'Plane';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          const c = new THREE.Color(e);
          spotLight.color = c;
          spotLightHelper.color = c;
          spotLightHelper.update();
        });
        this.GUI.add(controls, 'angle', 0, 90).onChange(function(e) {
          spotLight.angle = (e / 180) * Math.PI;
          spotLightHelper.update();
        });
        this.GUI.add(controls, 'intensity', 0, 3).onChange(function(e) {
          spotLight.intensity = e;
        });
        const _this = this;
        this.GUI.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e) {
          switch (e) {
            case 'Plane':
              spotLight.target = _this.plane;
              spotLightHelper.update();
              break;
            case 'Sphere':
              spotLight.target = _this.sphere;
              spotLightHelper.update();
              break;
            case 'Cube':
              spotLight.target = _this.cube;
              spotLightHelper.update();
              break;
          }
        });
      }

      if (lightName === 'DirectionalLight') {
        // DirectionalLight
        const directionColor = '#ffffff';
        const directionalLight = new THREE.DirectionalLight(directionColor);
        directionalLight.position.set(0, 20, 0);
        directionalLight.intensity = 1;
        directionalLight.target = this.plane;
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        directionalLightHelper.color = directionColor;
        directionalLight.add(directionalLightHelper);
        this.scene.add(directionalLight);

        // GUI
        const controls = new (function() {
          this.color = directionColor;
          this.intensity = 1;
          this.target = 'Plane';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          const c = new THREE.Color(e);
          directionalLightHelper.color = c;
          directionalLightHelper.update();
          directionalLight.color = c;
        });
        this.GUI.add(controls, 'intensity', 0, 3).onChange(function(e) {
          directionalLight.intensity = e;
        });

        const _this = this;
        this.GUI.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e) {
          switch (e) {
            case 'Plane':
              directionalLight.target = _this.plane;
              directionalLightHelper.update();
              break;
            case 'Sphere':
              directionalLight.target = _this.sphere;
              directionalLightHelper.update();
              break;
            case 'Cube':
              directionalLight.target = _this.cube;
              directionalLightHelper.update();
              break;
          }
        });
      }

      if (lightName === 'HemisphereLight') {
        // HemisphereLight
        const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 1);
        hemiLight.position.set(0, 100, 0);
        this.scene.add(hemiLight);
        // GUI
        const controls = new (function() {
          this.color = '#0000ff';
          this.groundColor = '#00ff00';
          this.intensity = 1;
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          hemiLight.color = new THREE.Color(e);
        });
        this.GUI.addColor(controls, 'groundColor').onChange(function(e) {
          hemiLight.groundColor = new THREE.Color(e);
        });
        this.GUI.add(controls, 'intensity', 0, 3).onChange(function(e) {
          hemiLight.intensity = e;
        });
      }

      if (lightName === 'RectAreaLight') {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        const geoFloor = new THREE.BoxBufferGeometry(60, 1, 50);
        const matStdFloor = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0, metalness: 0 });
        const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
        mshStdFloor.position.set(30, 0, -25);
        mshStdFloor.name = 'AreaFloor';
        this.scene.add(mshStdFloor);

        const rectLight = new THREE.RectAreaLight(0xffffff, 1, 60, 10);
        rectLight.position.set(0, 5, -50);
        rectLight.rotation.x = -Math.PI;
        const rectLightHelper = new RectAreaLightHelper(rectLight);
        rectLightHelper.color = '#ffffff';
        rectLight.add(rectLightHelper);

        this.scene.add(rectLight);

        // GUI
        const controls = new (function() {
          this.color = '#ffffff';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          const c = new THREE.Color(e);
          rectLightHelper.color = c;
          rectLightHelper.update();
          rectLight.color = c;
        });
      }

      if (lightName === 'LensFlare') {
        const light = new THREE.PointLight(0xffffff);
        light.position.set(0, 0, -50);
        light.castShadow = true;
        light.target = this.plane;
        // LensFlare
        const lensFlare = new Lensflare();
        lensFlare.addElement(
          new LensflareElement(
            new THREE.TextureLoader().load('/statics/lensflare0.png'),
            300,
            0.0,
            new THREE.Color(0xff0000)
          )
        );
        light.add(lensFlare);
        this.scene.add(light);
      }

      this.GUI && document.getElementById('gui').appendChild(this.GUI.domElement);
    },
  },
};
</script>
<style lang="less" scoped>
#light {
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
    .btn {
      margin: 5px;
    }
  }
  #container {
    width: 80%;
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