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
    const canvas = document.querySelector("#scene"); // Selecting canvas
    const scene = new Scene(); //Instantiate the Scene
    scene.background = new Color("#DCDCDC"); //Set background color
    const camera = new PerspectiveCamera(
      35,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    ); //Instantiate a camera
    camera.position.set(4, 4, 3); //Put camera in its place
    const ambientLight = new HemisphereLight("white", "darkslategrey", 3); //Instantiate Ambient light
    const controls = new OrbitControls(camera, canvas); //Instantiate orbit controls
    controls.target.set(0, 0, 0); //Point camera at the origin
    const renderer = new WebGLRenderer({ canvas, antialias: true }); //Instantiate renderer
    renderer.physicallyCorrectLights = true; //Enable physically Correct Lights
    renderer.setSize(canvas.clientWidth, canvas.clientHeight); //Set render size
    renderer.setPixelRatio(window.devicePixelRatio); //Set pixel ratio
    function fitWindow() {
      //Function that makes scene fit browser window
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    let sceneElements = [];
    const axesHelper = new AxesHelper(0.5); //Create axis helper
    axesHelper.renderOrder = 1;
    const gridHelper = new GridHelper(3, 6); //Create grid helper
    gridHelper.rotation.x = 3.14 / 2;
    scene.add(ambientLight);
    scene.add(axesHelper);
    scene.add(gridHelper);
    //------------------------------------------------------------

    //--------------- ADDING ELEMENTS TO THIS SCENE ---------------
    //USER INPUT GOES HERE

    // add stuff to the scene
    for (let i = 0; i < sceneElements.length; i++) {
      scene.add(sceneElements[i].shape);
    }
    //------------------------------------------------------------
    renderer.render(scene, camera);
    //-------------------- THE ANIMATION LOOP -------------------
    /*     renderer.setAnimationLoop(() => {
      fitWindow()

      MAGIC HAPPENS HERE!!!
      for (let i = 0; i < sceneElements.length; i++) {
        sceneElements[i].nextFrame();
      }

      renderer.render(scene, camera);
    }); */
    //------------------------------------------------------------
  }
}

export { Simulation };
