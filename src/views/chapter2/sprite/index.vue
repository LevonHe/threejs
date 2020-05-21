<template>
  <div id="sprite">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import * as _ from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default {
  name: 'sprite',
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      controls: null,
      materials: [],
    };
  },
  mounted() {
    this.init();
    this.animate();
    // this.loadSprites();
    // this.loadParticles();
    // this.createParticles(1, false, 1, true, true, 0xffffff);
    this.loadSpritesExample();
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
      this.render();
      // this.renderer && this.renderer.render(this.scene, this.camera);
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
    loadSprites() {
      const mat = new THREE.SpriteMaterial({ color: 0xff0000 });
      for (let i = -10; i < 0; i += 1) {
        for (let j = -10; j < 0; j += 1) {
          const sprite = new THREE.Sprite(mat);
          sprite.position.set(i * 10, j * 10, 0);
          this.scene.add(sprite);
        }
      }
    },
    loadParticles() {
      const geo = new THREE.Geometry();
      const mat = new THREE.PointsMaterial({ size: 4, vertexColors: true, color: 0xffffff });
      for (let i = 0; i < 10; i += 1) {
        for (let j = 0; j < 10; j += 1) {
          // 为云中每个粒子创建一个顶点
          const particle = new THREE.Vector3(i * 10, j * 10, 0);
          geo.vertices.push(particle);
          geo.colors.push(new THREE.Color(Math.random() * 0x00ffff));
        }
      }
      const cloud = new THREE.Points(geo, mat);
      this.scene.add(cloud);
    },
    createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
      const geo = new THREE.Geometry();
      const mat = new THREE.PointsMaterial({ size, transparent, opacity, vertexColors, sizeAttenuation, color });
      const range = 500;
      for (let i = 0; i < 15000; i += 1) {
        const particle = new THREE.Vector3(
          Math.random() * range - range / 2,
          Math.random() * range - range / 2,
          Math.random() * range - range / 2
        );
        geo.vertices.push(particle);
        const color = new THREE.Color(0x00ff00);
        color.setHSL(
          Math.random() * color.getHSL(color).h,
          Math.random() * color.getHSL(color).s,
          Math.random() * color.getHSL(color).l
        );
        geo.colors.push(color);
      }
      const cloud = new THREE.Points(geo, mat);
      this.scene.add(cloud);
    },
    loadSpritesExample() {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];

      const textureLoader = new THREE.TextureLoader();
      const sprite1 = textureLoader.load('/statics/snowflake1.png');
      const sprite2 = textureLoader.load('/statics/snowflake2.png');
      const sprite3 = textureLoader.load('/statics/snowflake3.png');
      const sprite4 = textureLoader.load('/statics/snowflake4.png');
      const sprite5 = textureLoader.load('/statics/snowflake5.png');

      for (let i = 0; i < 10000; i += 1) {
        vertices.push(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const parameters = [
        [[255, 0, 0], sprite2, 20],
        [[0, 255, 0], sprite3, 15],
        [[0, 0, 255], sprite1, 10],
        [[255, 255, 0], sprite5, 8],
        [[0, 255, 255], sprite4, 5],
      ];
      this.materials = [];

      for (let i = 0; i < parameters.length; i += 1) {
        const color = parameters[i][0];
        const sprite = parameters[i][1];
        const size = parameters[i][2];

        this.materials[i] = new THREE.PointsMaterial({
          size,
          map: sprite,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
        });
        this.materials[i].color.setRGB(color[0], color[1], color[2]);

        const particles = new THREE.Points(geometry, this.materials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;
        this.scene.add(particles);
      }
    },
    render() {
      if (this.scene) {
        const time = Date.now() * 0.00005;
        for (let i = 0; i < this.scene.children.length; i += 1) {
          const obj = this.scene.children[i];
          if (obj instanceof THREE.Points) {
            obj.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
          }
        }
      }
      this.renderer && this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>
<style lang="less" scoped>
#sprite {
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
