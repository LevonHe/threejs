<template>
  <div id="physic">
    <div id="container"></div>
  </div>
</template>
<script>
import * as _ from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Physijs from 'physijs';
Physijs.scripts.worker = './physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';
const scale = chroma.scale(['green', 'white', 'red', 'blue']);

export default {
  name: 'physic',
  data() {
    return {
      container: null,
      renderer: null,
      scene: null,
      camera: null,
      orbitControls: null,
      ground_material: null,
    };
  },
  mounted() {
    // this.physijsInit();
    // this.render();
    // this.test();
    // this.loadGame();

    // 限制
    this.initConstraints();
    this.loadConstraints();
    this.render();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.render = () => {};
    this.container = null;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.orbitControls = null;
    this.ground_material = null;
  },
  methods: {
    physijsInit() {
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
      this.scene = new Physijs.Scene();
      this.scene.setGravity(new THREE.Vector3(0, -50, 0));

      // camera
      this.camera = new THREE.PerspectiveCamera(35, this.container.clientWidth / this.container.clientHeight, 1, 1000);
      this.camera.position.set(50, 30, 50);
      this.camera.lookAt(new THREE.Vector3(10, 0, 10));

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

      // light
      const light = new THREE.SpotLight({ color: 0xffffff });
      light.position.set(20, 100, 50);
      this.scene.add(light);

      window.addEventListener('resize', this.onWindowResize, false);
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
    render() {
      this.orbitControls && this.orbitControls.update();
      this.renderer && this.renderer.render(this.scene, this.camera);
      this.scene && this.scene.simulate(undefined, 2);
      requestAnimationFrame(this.render);
    },
    test() {
      const geo = new THREE.BoxGeometry(10, 10, 10);
      const stone = new Physijs.BoxMesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xff0000 }));
      this.scene.add(stone);
    },
    loadGame() {
      this.createGround();

      const points = this.getPoints();
      const stones = [];

      points.forEach((point) => {
        const stoneGeom = new THREE.BoxGeometry(0.6, 6, 2);
        const stone = new Physijs.BoxMesh(
          stoneGeom,
          Physijs.createMaterial(
            new THREE.MeshPhongMaterial({
              // color: scale(Math.random()).hex(),
              // transparent: true,
              // opacity: 0.8,
              map: new THREE.TextureLoader().load('/statics/darker_wood.jpg'),
            })
          )
        );
        stone.position.copy(point);
        stone.lookAt(this.scene.position);
        stone.__dirtyRotation = true;
        stone.position.y = 3.5;
        this.scene.add(stone);
        stones.push(stone);
      });
      // 推到第一个
      stones[0].rotation.x = 0.2;
      stones[0].__dirtyRotation = true;
    },
    createGround() {
      const groundMat = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load('/statics/wood-2.jpg'),
        }),
        0.9, // 摩擦系数
        0.3 // 弹性系数
      );

      const ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), groundMat, 0);

      const borderLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), groundMat, 0);
      borderLeft.position.set(-31, 2, 0);
      const borderRight = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), groundMat, 0);
      borderRight.position.set(31, 2, 0);
      const borderBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), groundMat, 0);
      borderBottom.position.set(0, 2, 30);
      const borderTop = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), groundMat, 0);
      borderTop.position.set(0, 2, -30);

      ground.add(borderLeft);
      ground.add(borderRight);
      ground.add(borderBottom);
      ground.add(borderTop);

      this.scene.add(ground);
    },
    getPoints() {
      var points = [];
      var r = 27;
      var cX = 0;
      var cY = 0;

      var circleOffset = 0;
      for (var i = 0; i < 1000; i += 6 + circleOffset) {
        circleOffset = 4.5 * (i / 360);

        var x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
        var z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
        var y = 0;

        points.push(new THREE.Vector3(x, y, z));
      }

      return points;
    },
    initConstraints() {
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
      this.scene = new Physijs.Scene({
        reportSize: 10,
        fixedTimeStep: 1 / 60,
      });
      this.scene.setGravity(new THREE.Vector3(0, 50, 50));

      // camera
      this.camera = new THREE.PerspectiveCamera(35, this.container.clientWidth / this.container.clientHeight, 1, 1000);
      this.camera.position.set(85, 65, 65);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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

      // light
      const light = new THREE.SpotLight(0xffffff);
      light.position.set(20, 50, 50);
      light.castShadow = true;
      light.shadowMapDebug = true;
      light.shadow.camera.near = 10;
      light.shadow.camera.far = 100;
      this.scene.add(light);

      window.addEventListener('resize', this.onWindowResize, false);
    },
    loadConstraints() {
      this.loadGround();
      // this.createLeftFlipper(true);
      // this.createRightFlipper();
      this.createSliderBottom();
      // this.createConeTwist();
    },
    loadGround() {
      const ground_mat = Physijs.createMaterial(
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load('/statics/floor-wood.jpg'),
        }),
        0.9,
        0.7
      );
      this.ground_material = ground_mat;

      const ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 65), ground_mat, 0);
      ground.receiceShadow = true;

      const borderLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 65), ground_mat, 0);
      borderLeft.position.set(-31, 2, 0);
      borderLeft.receiceShadow = true;
      const borderRight = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 65), ground_mat, 0);
      borderRight.position.set(31, 2, 0);
      borderRight.receiceShadow = true;
      const borderBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 6, 2), ground_mat, 0);
      borderBottom.position.set(0, 1.5, 32);
      borderBottom.receiceShadow = true;
      const borderTop = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 6, 2), ground_mat, 0);
      borderTop.position.set(0, 2, -32);
      borderTop.receiceShadow = true;

      ground.add(borderLeft);
      ground.add(borderRight);
      ground.add(borderBottom);
      ground.add(borderTop);
      ground.receiceShadow = true;

      ground.__dirtyRotation = true;

      this.scene.add(ground);
    },
    createLeftFlipper(flag) {
      const flipperLeft = new Physijs.BoxMesh(
        new THREE.BoxGeometry(12, 2, 2),
        Physijs.createMaterial(new THREE.MeshPhongMaterial({ opacity: 0.6, transparent: true })),
        0.3
      );
      flipperLeft.position.set(-6, 2, 0);
      // flipperLeft.castShadow = true;
      this.scene.add(flipperLeft);

      const flipperLeftPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), this.ground_material, 0);

      flipperLeftPivot.position.set(-15, 1, 0);
      flipperLeftPivot.rotation.y = 1.4;
      // flipperLeftPivot.castShadow = true;

      this.scene.add(flipperLeftPivot);

      const constraint = new Physijs.HingeConstraint(
        flipperLeft,
        flipperLeftPivot,
        flipperLeftPivot.position,
        new THREE.Vector3(0, 1, 0)
      );
      this.scene.addConstraint(constraint, flag);

      constraint.setLimits(
        -Math.PI, // 最小运动弧度
        Math.PI, // 最大运动弧度
        20, // 被击中后的最大运动幅度
        0 // 弹性效果 (0表示无反弹)
      );

      return constraint;
    },
    createRightFlipper(flag) {
      const flipperright = new Physijs.BoxMesh(
        new THREE.BoxGeometry(12, 2, 2),
        Physijs.createMaterial(new THREE.MeshPhongMaterial({ opacity: 0.6, transparent: true })),
        0.3
      );
      flipperright.position.set(8, 2, 0);
      // flipperright.castShadow = true;
      this.scene.add(flipperright);

      const flipperLeftPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), this.ground_material, 0);

      flipperLeftPivot.position.set(15, 2, 0);
      flipperLeftPivot.rotation.y = 1.4;
      // flipperLeftPivot.castShadow = true;

      this.scene.add(flipperLeftPivot);

      const constraint = new Physijs.HingeConstraint(
        flipperright,
        flipperLeftPivot,
        flipperLeftPivot.position,
        new THREE.Vector3(0, 1, 0)
      );

      this.scene.addConstraint(constraint, flag);

      constraint.setLimits(
        -2.2, // minimum angle of motion, in radians, from the point object 1 starts (going back)
        -0.6, // maximum angle of motion, in radians, from the point object 1 starts (going forward)
        0.1, // applied as a factor to constraint error, how big the kantelpunt is moved when a constraint is hit
        0 // controls bounce at limit (0.0 == no bounce)
      );

      return constraint;
    },
    createSliderBottom(flag) {
      const sliderCube = new THREE.BoxGeometry(12, 2, 2);

      const sliderMesh = new Physijs.BoxMesh(
        sliderCube,
        Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0x44ff44, opacity: 0.6, transparent: true }), 0, 0),
        0.01
      );
      sliderMesh.position.set(6, 1.5, 20);
      // sliderMesh.castShadow = true;

      this.scene.add(sliderMesh);
      const constraint = new Physijs.SliderConstraint(
        sliderMesh,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0)
      );

      this.scene.addConstraint(constraint, flag);
      constraint.setLimits(-10, 10, 0, 0);
      constraint.setRestitution(0.1, 0.1);

      return constraint;
    },
    createConeTwist(flag) {
      const baseMesh = new THREE.SphereGeometry(1);
      const armMesh = new THREE.BoxGeometry(2, 12, 3);

      const objectOne = new Physijs.BoxMesh(
        baseMesh,
        Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0x4444ff, transparent: true, opacity: 0.7 }), 0, 0),
        0
      );
      objectOne.position.set(20, 15.5, 0);
      // objectOne.castShadow = true;
      this.scene.add(objectOne);

      const objectTwo = new Physijs.SphereMesh(
        armMesh,
        Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0x4444ff, transparent: true, opacity: 0.7 }), 0, 0),
        10
      );
      objectTwo.position.set(20, 7.5, 0);
      // objectTwo.castShadow = true;
      this.scene.add(objectTwo);

      const constraint = new Physijs.ConeTwistConstraint(objectOne, objectTwo, objectOne.position);

      this.scene.addConstraint(constraint, flag);

      constraint.setLimit(0.5 * Math.PI, 0.5 * Math.PI, 0.5 * Math.PI);
      constraint.setMaxMotorImpulse(1);
      constraint.setMotorTarget(new THREE.Vector3(0, 0, 0));

      return constraint;
    },
  },
};
</script>
<style lang="less" scoped>
#physic {
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
