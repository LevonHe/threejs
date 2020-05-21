<template>
  <div id="material" class="clearfix">
    <div class="box pull-left">
      <div>
        <h3>简单网格材质</h3>
        <template v-for="material in materialArr1">
          <div :key="material.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentMaterial === material.value ? 'primary' : ''"
              @click="addMaterial(material.value)"
            >{{material.label}}</el-button>
            <el-tooltip placement="right" :content="material.content">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
      </div>
      <div>
        <h3>高级材质</h3>
        <template v-for="material in materialArr2">
          <div :key="material.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentMaterial === material.value ? 'primary' : ''"
              @click="addMaterial(material.value)"
            >{{material.label}}</el-button>
            <el-tooltip placement="right" :content="material.content">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
      </div>
      <div>
        <h3>高级材质</h3>
        <template v-for="material in materialArr3">
          <div :key="material.value">
            <el-button
              class="btn"
              size="medium"
              :type="currentMaterial === material.value ? 'primary' : ''"
              @click="addMaterial(material.value)"
            >{{material.label}}</el-button>
            <el-tooltip placement="right" :content="material.content">
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
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils';
import { materialArr1, materialArr2, materialArr3 } from '@/config/selectTypes';

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
      materialArr1,
      materialArr2,
      materialArr3,
      materialNameList: [
        'MeshBasicMaterial',
        'MeshNormalMaterial',
        'MeshLambertMaterial',
        'MeshPhoneMaterial',
        'LineBasicMaterial',
        'LineDashMaterial',
      ],
    };
  },
  computed: {
    ...mapState('cms/three', ['currentMaterial']),
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
      CURRENT_MATERIAL: 'cms/three/CURRENT_MATERIAL',
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
      this.renderer.setClearColor(0x000000, 1);
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
    addMaterial(materialName) {
      this.CURRENT_MATERIAL(materialName);

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

      if (materialName === 'MeshBasicMaterial') {
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        const cubeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          name: 'material-1',
          opacity: 1,
          transparent: true,
          wireframe: true,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 5, 0);
        this.scene.add(cube);

        // GUI
        const controls = new (function() {
          this.color = '#ff0000';
          this.opacity = 1;
          this.transparent = true;
          this.wireframe = true;
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          cubeMaterial.color = new THREE.Color(e);
        });
        this.GUI.add(controls, 'opacity', 0, 1).onChange(function(e) {
          cubeMaterial.opacity = e;
        });
        this.GUI.add(controls, 'transparent').onChange(function(e) {
          cubeMaterial.transparent = e;
        });
        this.GUI.add(controls, 'wireframe').onChange(function(e) {
          cubeMaterial.wireframe = e;
        });
      }

      if (materialName === 'MeshNormalMaterial') {
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        const cubeMaterial = new THREE.MeshNormalMaterial({
          wireframe: true,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 5, 0);
        for (let f = 0; f < cube.geometry.faces.length; f += 1) {
          const face = cube.geometry.faces[f];
          const centroid = new THREE.Vector3(0, 0, 0);
          centroid.add(cube.geometry.vertices[face.a]);
          centroid.add(cube.geometry.vertices[face.b]);
          centroid.add(cube.geometry.vertices[face.c]);
          centroid.divideScalar(3);

          const arrow = new THREE.ArrowHelper(face.normal, centroid, 2, 0x0000ff, 0.5, 0.5);
          cube.add(arrow);
        }

        this.scene.add(cube);
      }

      if (materialName === 'MeshLambertMaterial') {
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff, emissive: 0xff00000 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 5, 0);
        this.scene.add(cube);

        // GUI
        const controls = new (function() {
          this.color = '#0000ff';
          this.emissive = '#ff0000';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          cubeMaterial.color = new THREE.Color(e);
        });
        this.GUI.addColor(controls, 'emissive').onChange(function(e) {
          cubeMaterial.emissive = new THREE.Color(e);
        });
      }

      if (materialName === 'MeshPhoneMaterial') {
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, specular: 0xeeeeee });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, 0);
        this.scene.add(cube);

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
          this.color = '#0000ff';
          this.specular = '#eeeeee';
        })();
        this.GUI = new dat.GUI();
        this.GUI.addColor(controls, 'color').onChange(function(e) {
          cubeMaterial.color = new THREE.Color(e);
        });
        this.GUI.addColor(controls, 'specular').onChange(function(e) {
          cubeMaterial.specular = new THREE.Color(e);
        });
      }

      if (materialName === 'LineBasicMaterial') {
        var subdivisions = 6;
        var recursion = 1;

        var points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7);
        var spline = new THREE.CatmullRomCurve3(points);

        var samples = spline.getPoints(points.length * subdivisions);
        var geometrySpline = new THREE.BufferGeometry().setFromPoints(samples);

        var line = new THREE.Line(
          geometrySpline,
          new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1, linecap: 'round', linejoin: 'round' })
        );
        line.computeLineDistances();

        this.scene.add(line);
      }

      if (materialName === 'LineDashMaterial') {
        var subdivisions = 6;
        var recursion = 1;

        var points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7);
        var spline = new THREE.CatmullRomCurve3(points);

        var samples = spline.getPoints(points.length * subdivisions);
        var geometrySpline = new THREE.BufferGeometry().setFromPoints(samples);

        var line = new THREE.Line(
          geometrySpline,
          new THREE.LineDashedMaterial({ color: 0xff0000, dashSize: 1, gapSize: 0.5 })
        );
        line.computeLineDistances();

        this.scene.add(line);
      }

      this.GUI && document.getElementById('gui').appendChild(this.GUI.domElement);
    },
  },
};
</script>
<style lang="less" scoped>
#material {
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