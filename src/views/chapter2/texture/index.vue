<template>
  <div id="texture">
    <div id="container"></div>
    <video
      id="video"
      style="display:none; position: absolute; left: 15px; top: 75px;"
      src="/statics/sintel.mp4"
      controls="true"
      autoplay="true"
      loop
    ></video>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'texture',
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      videoTexture: null,
      video: null,
    };
  },
  mounted() {
    this.init();
    this.animate();
    // this.loadMesh();
    // this.loadBumpMesh();
    this.loadNormalMesh();
    // this.loadVideoTexture();
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
    this.video = null;
    this.videoTexture = null;
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

      // AmbientLight
      const ambiColor = '#ffffff';
      const ambientLight = new THREE.AmbientLight(ambiColor);
      this.scene.add(ambientLight);

      // controls
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.enableRotate = true;
      this.orbitControls.minPolarAngle = -Math.PI;
      this.orbitControls.maxPolarAngle = Math.PI;
      this.orbitControls.minAzimuthAngle = -Math.PI;
      this.orbitControls.maxAzimuthAngle = Math.PI;
      this.orbitControls.enablePan = true;
      this.orbitControls.panSpeed = 1;
      this.orbitControls.enableZoom = true;
      this.orbitControls.screenSpacePanning = false;

      window.addEventListener('resize', this.onWindowResize, false);
    },
    animate() {
      this.orbitControls && this.orbitControls.update();
      if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        if (this.videoTexture) {
          this.videoTexture.needsUpdate = true;
        }
      }
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
    loadMesh() {
      const cubeGeometry = new THREE.BoxGeometry(40, 40, 40);
      const cube = this.createMesh(cubeGeometry, '/statics/Dragon_Nor_mirror2.jpg');
      cube.position.set(0, 0, 0);
      this.scene.add(cube);
    },
    loadBumpMesh() {
      const cubeGeometry = new THREE.BoxGeometry(40, 40, 40);
      const cube = this.createMesh(cubeGeometry, '/statics/stone.jpg', '/statics/stone-bump.jpg');
      cube.position.set(-30, 0, 0);
      this.scene.add(cube);
    },
    createMesh(geo, url, bump) {
      const texture = new THREE.TextureLoader().load(url);
      const mat = new THREE.MeshPhongMaterial();
      mat.map = texture;

      if (bump) {
        const bump = new THREE.TextureLoader().load(bump);
        mat.bumpMap = bump;
        mat.bumpScale = 0.2;
      }

      const mesh = new THREE.Mesh(geo, mat);
      return mesh;
    },
    loadNormalMesh() {
      const cubeGeometry = new THREE.BoxGeometry(40, 40, 40);
      const cube = this.createNormalMesh(cubeGeometry, '/statics/bathroom.jpg', '/statics/bathroom-normal.jpg');
      cube.position.set(30, 0, 0);
      this.scene.add(cube);
    },
    createNormalMesh(geo, url, normal) {
      const texture = new THREE.TextureLoader().load(url);
      const nor = new THREE.TextureLoader().load(normal);

      const mat = new THREE.MeshPhongMaterial();
      mat.map = texture;
      mat.normalMap = nor;

      const mesh = new THREE.Mesh(geo, mat);
      return mesh;
    },
    loadVideoTexture() {
      this.video = document.getElementById('video');
      const texture = new THREE.Texture(this.video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      this.videoTexture = texture;

      const materialArray = [];
      materialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
      materialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
      materialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
      materialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
      materialArray.push(new THREE.MeshBasicMaterial({ map: this.videoTexture }));
      materialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));

      const geo = new THREE.BoxGeometry(240, 102, 10);
      const mesh = new THREE.Mesh(geo, materialArray);
      mesh.position.set(0, 0, 0);
      this.video.play();
      this.scene.add(mesh);
    },
  },
};
</script>
<style lang="less" scoped>
#texture {
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