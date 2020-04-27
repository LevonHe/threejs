<template>
  <div id="chapter1">
    <div id="container"></div>
    <div id="stats"></div>
    <div id="gui"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import dat from 'three/examples/jsm/libs/dat.gui.module';
export default {
  name: 'chapter1',
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      stats: null,
      controls: null,
      GUI: null,
      cube: null,
      sphere: null,
      step: 0,
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
      this.renderer.setClearColor(0xeeeeee, 1);
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
      const axes = new THREE.AxesHelper(20);
      this.scene.add(axes);

      // plane
      const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
      // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.set(15, 0, 0);
      plane.receiveShadow = true;
      this.scene.add(plane);

      // cube
      const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.set(-4, 3, 0);
      this.cube.castShadow = true;
      this.scene.add(this.cube);

      // sphere
      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true });
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff, wireframe: true });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.sphere.position.set(20, 4, 2);
      this.sphere.castShadow = true;
      this.scene.add(this.sphere);

      // light
      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);

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

      // stats
      this.stats = new Stats();
      this.stats.setMode(0);
      this.stats.domElement.style.position = 'absolute';
      document.getElementById('stats').appendChild(this.stats.domElement);

      // GUI
      this.controls = new (function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
      })();
      this.GUI = new dat.GUI();
      this.GUI.add(this.controls, 'rotationSpeed', 0, 0.5);
      this.GUI.add(this.controls, 'bouncingSpeed', 0, 0.5);
      // this.GUI.domElement.style.position = 'absolute';
      document.getElementById('gui').appendChild(this.GUI.domElement);

      window.addEventListener('resize', this.onWindowResize, false);
    },
    animate() {
      // 旋转立方体
      this.cube.rotation.x += this.controls.rotationSpeed;
      // this.cube.rotation.y += 0.02;
      // this.cube.rotation.z += 0.02;
      // 弹跳小球
      this.step += this.controls.bouncingSpeed;
      this.sphere.position.x = 20 + 10 * Math.cos(this.step);
      this.sphere.position.y = 2 + 10 * Math.abs(Math.sin(this.step));

      this.stats && this.stats.update();
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
  },
};
</script>
<style lang="less" scoped>
#chapter1 {
  background-color: #fff;
  height: 100%;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  font-size: 0;
  #container {
    width: 100%;
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
  #stats {
    position: absolute;
    left: 20px;
    top: 20px;
  }
  #gui {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>