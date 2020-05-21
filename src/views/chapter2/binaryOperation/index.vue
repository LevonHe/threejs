<template>
  <div id="binary-operation">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'imports-loader?THREE=three!threebsp';
export default {
  name: 'binaryOperation',
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      controls: null,
    };
  },
  mounted() {
    this.init();
    this.animate();
    this.loadGeometryOperation();
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
      this.camera.position.set(0, 100, 200);
      this.camera.lookAt(this.scene.position);

      // light
      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(0, 60, 0);
      spotLight.castShadow = true;
      this.scene.add(spotLight);

      // light
      const ambiColor = '#ffffff';
      const ambientLight = new THREE.AmbientLight(ambiColor);
      this.scene.add(ambientLight);

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
    loadGeometryOperation() {
      const sphere1 = new THREE.SphereGeometry(20, 20, 20);
      const sphere2 = new THREE.SphereGeometry(20, 20, 20);
      const mesh1 = new THREE.Mesh(sphere1, new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
      const mesh2 = new THREE.Mesh(sphere2, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
      mesh1.position.set(-15, 0, 0);
      mesh2.position.set(15, 0, 0);

      const sphereBSP1 = new ThreeBSP(mesh1);
      const sphereBSP2 = new ThreeBSP(mesh2);

      // const resultBSP = sphereBSP1.subtract(sphereBSP2);
      // const resultBSP = sphereBSP1.intersect(sphereBSP2);
      const resultBSP = sphereBSP1.union(sphereBSP2);
      const result = resultBSP.toMesh();
      result.geometry.computeFaceNormals();
      result.geometry.computeVertexNormals();

      var material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
      result.material = material;
      this.scene.add(mesh1);
      this.scene.add(mesh2);
      this.scene.add(result);
    },
  },
};
</script>
<style lang="less" scoped>
#binary-operation {
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
}
</style>
