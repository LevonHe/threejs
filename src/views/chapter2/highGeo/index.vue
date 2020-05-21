<template>
  <div id="high-geo">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
export default {
  name: 'highGeo',
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
    // this.loadConvexGeometry();
    // this.loadLatheGeometry();
    // this.loadExtrudeGeometry();
    // this.loadTubeGeometry();
    // this.loadTextGeometry();
    this.loadMergeGeometry();
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
    loadConvexGeometry() {
      const points = [];
      for (let i = 0; i < 20; i += 1) {
        const randomX = -15 + Math.round(Math.random() * 50);
        const randomY = -15 + Math.round(Math.random() * 50);
        const randomZ = -15 + Math.round(Math.random() * 50);
        points.push(new THREE.Vector3(randomX, randomY, randomZ));
      }
      const convexGeometry = new ConvexGeometry(points);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
      const mesh = new THREE.Mesh(convexGeometry, material);
      this.scene.add(mesh);
    },
    loadLatheGeometry() {
      const points = [];
      const height = 5;
      const count = 30;
      for (let i = 0; i < count; i += 1) {
        points.push(new THREE.Vector3((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, 0, i - count + count / 2));
      }
      const geometry = new THREE.LatheGeometry(points, 12, 0, Math.PI);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: false });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    },
    loadExtrudeGeometry() {
      const pts = [];
      const numPts = 5;
      for (let i = 0; i < numPts * 2; i += 1) {
        const l = i % 2 == 1 ? 10 : 20;
        const a = (i / numPts) * Math.PI;
        pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
      }

      const randomPoints = [];
      for (var i = 0; i < 10; i++) {
        randomPoints.push(
          new THREE.Vector3((i - 4.5) * 50, THREE.MathUtils.randFloat(-50, 50), THREE.MathUtils.randFloat(-50, 50))
        );
      }
      const randomSpline = new THREE.CatmullRomCurve3(randomPoints);
      const extrudeSettings = {
        steps: 200,
        bevelEnabled: false,
        extrudePath: randomSpline,
      };

      const geometry = new THREE.ExtrudeBufferGeometry(new THREE.Shape(pts), extrudeSettings);
      const material = new THREE.MeshLambertMaterial({ color: 0xff8000, wireframe: false });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    },
    loadTubeGeometry() {
      const points = [];
      for (let i = 0; i < 30; i += 1) {
        const x = -20 + Math.round(Math.random() * 50);
        const y = -15 + Math.round(Math.random() * 40);
        const z = -20 + Math.round(Math.random() * 40);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points));
      const mat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
      const mesh = new THREE.Mesh(geo, mat);
      this.scene.add(mesh);
    },
    loadTextGeometry() {
      const _this = this;
      new THREE.FontLoader().load('/statics/droid_sans_bold.typeface.json', function(font) {
        const options = {
          font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelSegments: 5,
        };
        const mat = new THREE.MeshNormalMaterial({
          flatShading: THREE.FlatShading,
          transparent: true,
          opacity: 1,
        });
        const text1 = new THREE.TextGeometry('Hello', options);
        const text2 = new THREE.TextGeometry('world!', options);
        const mesh1 = new THREE.Mesh(text1, mat);
        const mesh2 = new THREE.Mesh(text2, mat);
        mesh1.position.set(-200, 0, 0);
        mesh2.position.set(200, 0, 0);
        _this.scene.add(mesh1);
        _this.scene.add(mesh2);
      });
    },
    loadMergeGeometry() {
      const geometry = new THREE.Geometry();
      const material = new THREE.MeshLambertMaterial();
      for (let i = 0; i < 100; i += 1) {
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(i * 10, i, 1);
        cube.updateMatrix();
        geometry.merge(cube.geometry, cube.matrix);
      }
      this.scene.add(new THREE.Mesh(geometry, material));
    },
  },
};
</script>
<style lang="less" scoped>
#high-geo {
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