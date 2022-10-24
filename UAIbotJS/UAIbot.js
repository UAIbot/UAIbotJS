import {
  Object3D,
  Vector3,
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  MeshStandardMaterial,
  AxesHelper,
  GridHelper,
  Matrix4,
  SphereBufferGeometry,
  CylinderBufferGeometry,
  Group,
} from "https://unpkg.com/three@0.126.1/build/three.module.js";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

import { OBJLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js";

class Simulation {
  constructor() {
    Object3D.DefaultUp = new Vector3(0, 0, 1); //Pointing Z axis up
    this.canvas = document.querySelector("#scene"); // Selecting canvas
    this.scene = new Scene(); //Instantiate the Scene
    this.scene.background = new Color("#DCDCDC"); //Set background color
    this.camera = new PerspectiveCamera(
      35,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    ); //Instantiate a camera
    this.camera.position.set(4, 4, 3); //Put camera in its place
    this.ambientLight = new HemisphereLight("white", "darkslategrey", 3); //Instantiate Ambient light
    this.controls = new OrbitControls(this.camera, this.canvas); //Instantiate orbit controls
    this.controls.target.set(0, 0, 0); //Point camera at the origin
    let canvas = this.canvas;
    this.renderer = new WebGLRenderer({ canvas, antialias: true }); //Instantiate renderer
    this.renderer.physicallyCorrectLights = true; //Enable physically Correct Lights
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight); //Set render size
    this.renderer.setPixelRatio(window.devicePixelRatio); //Set pixel ratio
    this.sceneElements = [];
    this.axesHelper = new AxesHelper(0.5); //Create axis helper
    this.axesHelper.renderOrder = 1;
    this.gridHelper = new GridHelper(3, 6); //Create grid helper
    this.gridHelper.rotation.x = 3.14 / 2;
    this.scene.add(this.ambientLight);
    this.scene.add(this.axesHelper);
    this.scene.add(this.gridHelper);
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setAnimationLoop(loop_code) {
    this.renderer.setAnimationLoop(loop_code);
  }

  fitWindow() {
    //Function that makes scene fit browser window
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  add(object_sim) {
    this.scene.add(object_sim.shape);
  }
}

class Objsim {
  constructor(_frames) {
    this.frames = _frames;
    this.currentFrame = 0;
    this.shape = "I HAVE NO SHAPE YET";
  }

  nextFrame() {
    if (this.currentFrame < this.frames.length) {
      this.shape.matrix.set(
        this.frames[this.currentFrame][0],
        this.frames[this.currentFrame][1],
        this.frames[this.currentFrame][2],
        this.frames[this.currentFrame][3],
        this.frames[this.currentFrame][4],
        this.frames[this.currentFrame][5],
        this.frames[this.currentFrame][6],
        this.frames[this.currentFrame][7],
        this.frames[this.currentFrame][8],
        this.frames[this.currentFrame][9],
        this.frames[this.currentFrame][10],
        this.frames[this.currentFrame][11],
        this.frames[this.currentFrame][12],
        this.frames[this.currentFrame][13],
        this.frames[this.currentFrame][14],
        this.frames[this.currentFrame][15]
      );
      this.currentFrame = this.currentFrame + 1;
    }
  }
}

class Box {
  constructor(_width, _height, _depth, _color) {
    this.width = _width;
    this.height = _height;
    this.depth = _depth;
    this.color = _color;
    this.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    this.material = new MeshStandardMaterial({ color: this.color });
    this.cube = new Mesh(this.geometry, this.material);
    this.shape = this.cube;
  }

  rotate() {
    this.shape.rotation.x += 0.01;
  }
}

export { Simulation, Box };
