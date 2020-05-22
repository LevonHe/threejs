<template>
  <div id="my-audio">
    <div id="container"></div>
  </div>
</template>
<script>
import * as _ from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'myAudio',
  data() {
    return {
      container: null,
      scene: null,
      renderer: null,
      camera: null,
      firstControls: null,
    };
  },
  mounted() {
    this.init();
    this.animate();
    this.loadObject();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.container = null;
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.firstControls = null;
  },
  methods: {
    init() {
      this.container = document.getElementById('container');

      this.renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启反锯齿
      });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x000000, 0.0035);

      this.camera = new THREE.PerspectiveCamera(50, this.container.clientWidth / this.container.clientHeight, 1, 10000);
      this.camera.position.set(0, 0, 50);
      this.camera.lookAt(this.scene.position);

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0.5, 1).normalize();
      this.scene.add(light);

      this.firstControls = new OrbitControls(this.camera, this.renderer.domElement);

      window.addEventListener('resize', this.onWindowResize, false);
    },
    animate() {
      this.firstControls && this.firstControls.update();
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
      {
        leading: false,
        trailing: true,
      }
    ),
    loadObject() {
      const cube = new THREE.BoxGeometry(40, 40, 40);

      const material_1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('/statics/animals/cow.png'),
      });
      const material_2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('/statics/animals/dog.jpg'),
      });
      const material_3 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('/statics/animals/cat.jpg'),
      });

      const mesh1 = new THREE.Mesh(cube, material_1);
      mesh1.position.set(-100, 0, 0);
      this.scene.add(mesh1);
      const mesh2 = new THREE.Mesh(cube, material_2);
      mesh2.position.set(0, 0, 0);
      this.scene.add(mesh2);
      const mesh3 = new THREE.Mesh(cube, material_3);
      mesh3.position.set(100, 0, 0);
      this.scene.add(mesh3);

      const listener1 = new THREE.AudioListener();
      this.camera.add(listener1);
      const listener2 = new THREE.AudioListener();
      this.camera.add(listener2);
      const listener3 = new THREE.AudioListener();
      this.camera.add(listener3);

      const sound1 = new THREE.PositionalAudio(listener1);
      new THREE.AudioLoader().load('/statics/audios/cow.ogg', (AudioBuffer) => {
        sound1.setBuffer(AudioBuffer);
        sound1.setRefDistance(100);
        sound1.setLoop(true);
        sound1.setRolloffFactor(2);
        sound1.play();
        mesh1.add(sound1);
      });

      const sound2 = new THREE.PositionalAudio(listener2);
      new THREE.AudioLoader().load('/statics/audios/dog.ogg', (AudioBuffer) => {
        sound2.setBuffer(AudioBuffer);
        sound2.setRefDistance(100);
        sound2.setLoop(true);
        sound2.setRolloffFactor(2);
        sound2.play();
        mesh2.add(sound2);
      });

      const sound3 = new THREE.PositionalAudio(listener3);
      new THREE.AudioLoader().load('/statics/audios/cat.ogg', (AudioBuffer) => {
        sound3.setBuffer(AudioBuffer);
        sound3.setRefDistance(100);
        sound3.setLoop(true);
        sound3.setRolloffFactor(2);
        sound3.play();
        mesh3.add(sound3);
      });

      const helper = new THREE.GridHelper(500, 10, 0x444444, 0x444444);
      helper.position.y = 0.1;
      this.scene.add(helper);
    },
  },
};
</script>
<style lang="less" scoped>
#my-audio {
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