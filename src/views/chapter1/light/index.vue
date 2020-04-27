<template>
  <div id="light" class="clearfix">
    <div class="box pull-left">
      <el-button class="btn" size="medium" @click="addLight('AmbientLight')">AmbientLight</el-button>
      <el-button class="btn" size="medium" @click="addLight('PointLight')">PointLight</el-button>
      <el-button class="btn" size="medium" @click="addLight('SpotLight')">SpotLight</el-button>
      <el-button class="btn" size="medium" @click="addLight('DirectionalLight')">DirectionalLight</el-button>
    </div>
    <div id="container" class="pull-right"></div>
    <div id="gui"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import dat, { controllers } from 'three/examples/jsm/libs/dat.gui.module';
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
    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
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

      // plane
      const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.set(15, 0, 0);
      this.plane.receiveShadow = true;
      this.scene.add(this.plane);

      // cube
      const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.set(-4, 3, 0);
      this.scene.add(this.cube);

      // sphere
      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff, wireframe: true });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.sphere.position.set(20, 4, 2);
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
      this.scene.children.forEach((element) => {
        if (['AmbientLight', 'PointLight', 'SpotLight', 'DirectionalLight'].includes(element.type)) {
          this.scene.remove(element);
        }
      });
      if (this.GUI) {
        document.getElementById('gui').removeChild(this.GUI.domElement);
        this.GUI = null;
      }
      if (lightName === 'AmbientLight') {
        // AmbientLight
        const ambiColor = '#0c0c0c';
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
        const pointColor = '#ccffcc';
        const pointLight = new THREE.PointLight(pointColor);
        pointLight.position.set(10, 10, 10);
        pointLight.intensity = 1;
        pointLight.distance = 0;
        this.scene.add(pointLight);

        // GUI
        const controls = new (function() {
          this.intensity = 1;
          this.distance = 0;
        })();
        this.GUI = new dat.GUI();
        this.GUI.add(controls, 'intensity', 0, 3).onChange(function(e) {
          pointLight.intensity = e;
        });
        this.GUI.add(controls, 'distance', 0, 100).onChange(function(e) {
          pointLight.distance = e;
        });
      }
      if (lightName === 'SpotLight') {
        // SpotLight
        const spotColor = '#ffffff';
        const spotLight = new THREE.SpotLight(spotColor);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        spotLight.target = this.plane;
        this.scene.add(spotLight);

        // GUI
        const controls = new (function() {
          this.spotColor = spotColor;
          this.target = 'Plane';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'spotColor').onChange(function(e) {
          spotLight.color = new THREE.Color(e);
        });
        const _this = this;
        this.GUI.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e) {
          switch (e) {
            case 'Plane':
              spotLight.target = _this.plane;
              break;
            case 'Sphere':
              spotLight.target = _this.sphere;
              break;
            case 'Cube':
              spotLight.target = _this.cube;
              break;
          }
        });
      }
      if (lightName === 'DirectionalLight') {
        // DirectionalLight
        const directionColor = '#ff5808';
        const directionDistance = 0;
        const directionIntensity = 0.5;
        const directionCastShadow = true;
        const directionalLight = new THREE.DirectionalLight(directionColor);
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = directionCastShadow;
        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;

        directionalLight.distance = directionDistance;
        directionalLight.intensity = directionIntensity;
        directionalLight.shadow.mapHeight = 1024;
        directionalLight.shadow.mapWidth = 1024;
        directionalLight.target = this.plane;
        this.scene.add(directionalLight);

        // GUI
        const controls = new (function() {
          this.directionalColor = directionColor;
          this.directionIntensity = directionIntensity;
          this.directionDistance = directionDistance;
          this.directionCastShadow = directionCastShadow;
          this.target = 'Plane';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'directionalColor').onChange(function(e) {
          directionalLight.color = new THREE.Color(e);
        });
        this.GUI.add(controls, 'directionIntensity', 0, 5).onChange(function(e) {
          directionalLight.intensity = e;
        });
        this.GUI.add(controls, 'directionDistance', 0, 200).onChange(function(e) {
          directionalLight.distance = e;
        });
        this.GUI.add(controls, 'directionCastShadow').onChange(function(e) {
          directionalLight.castShadow = e;
        });

        const _this = this;
        this.GUI.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e) {
          switch (e) {
            case 'Plane':
              directionalLight.target = _this.plane;
              break;
            case 'Sphere':
              directionalLight.target = _this.sphere;
              break;
            case 'Cube':
              directionalLight.target = _this.cube;
              break;
          }
        });
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
    width: 30%;
    height: 100%;
    font-size: 14px;
    .btn {
      margin: 5px;
    }
  }
  #container {
    width: 70%;
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