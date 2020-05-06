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
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';
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
      GUI: null,
      geometryArr,
      geoNameList: [
        'CircleGeometry',
        'PlaneGeometry',
        'BoxGeometry',
        'SphereGeometry',
        'CylinderGeometry',
        'TorusGeometry',
        'OctahedronGeometry',
        'TubeGeometry',
        'ParametricGeometry',
        'TextGeometry',
      ],
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

      const ambiColor = '#ffffff';
      const ambientLight = new THREE.AmbientLight(ambiColor);
      this.scene.add(ambientLight);

      if (geoName === 'CircleGeometry') {
        const geo = new THREE.CircleGeometry(20, 8, 0, 2 * Math.PI);
        const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const circle = new THREE.Mesh(geo, mat);
        circle.position.set(0, 10, 0);
        this.scene.add(circle);
      }

      if (geoName === 'PlaneGeometry') {
        // plane
        const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        this.scene.add(plane);
      }

      if (geoName === 'BoxGeometry') {
        // cube
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, 0);
        this.scene.add(cube);
      }

      if (geoName === 'SphereGeometry') {
        // sphere
        const sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff, wireframe: true });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        this.scene.add(sphere);
      }

      if (geoName === 'CylinderGeometry') {
        const geo = new THREE.CylinderGeometry(20, 20, 60, 8, 8, false);
        const mat = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: true });
        const cylinder = new THREE.Mesh(geo, mat);
        cylinder.position.set(0, 0, 0);
        this.scene.add(cylinder);
      }

      if (geoName === 'TorusGeometry') {
        const geo = new THREE.TorusGeometry(30, 8, 10, 20, 2 * Math.PI);
        const mat = new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: true });
        const torus = new THREE.Mesh(geo, mat);
        torus.position.set(0, 0, 0);
        this.scene.add(torus);
      }

      if (geoName === 'OctahedronGeometry') {
        const geo = new THREE.OctahedronGeometry(3);
        const mat = new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: true });
        const torus = new THREE.Mesh(geo, mat);
        torus.position.set(0, 0, 0);
        this.scene.add(torus);
      }

      if (geoName === 'TubeGeometry') {
        const points = [];
        for (let i = 0; i < 5; i += 1) {
          const x = -20 + Math.round(Math.random() * 50);
          const y = -15 + Math.round(Math.random() * 40);
          const z = -20 + Math.round(Math.random() * 40);
          points.push(new THREE.Vector3(x, y, z));
        }
        const spGroup = new THREE.Object3D();
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
        points.forEach((point) => {
          const spGeom = new THREE.SphereGeometry(0.2);
          const spMesh = new THREE.Mesh(spGeom, material);
          spMesh.position.copy(point);
          spGroup.add(spMesh);
        });

        this.scene.add(spGroup);

        const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, 1, 8, false);

        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 });
        const wireFrameMat = new THREE.MeshBasicMaterial({ wireframe: true });

        const mesh = SceneUtils.createMultiMaterialObject(geo, [meshMaterial, wireFrameMat]);

        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
      }

      if (geoName === 'ParametricGeometry') {
        const geo = new THREE.ParametricGeometry(ParametricGeometries.klein, 25, 25);
        const mat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
      }

      if (geoName === 'TextGeometry') {
        const _this = this;
        new THREE.FontLoader().load('/statics/droid_sans_bold.typeface.json', function(font) {
          const geo = new THREE.TextGeometry('Three.js', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelSegments: 5,
          });
          const mat = new THREE.MeshNormalMaterial({
            flatShading: THREE.FlatShading,
            transparent: true,
            opacity: 1,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(0, 0, 0);
          _this.scene.add(mesh);
        });
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