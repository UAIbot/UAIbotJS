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
  setHTM(matrix){
    this.shape.matrix.set(      
      matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3],
      matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3],
      matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3],
      matrix[3][0], matrix[3][1], matrix[3][2], matrix[3][3]);
  }
}

class Box extends Objsim{
  constructor(_width, _height, _depth, _color) {
    super();
    this.width = _width;
    this.height = _height;
    this.depth = _depth;
    this.color = _color;
    this.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    this.material = new MeshStandardMaterial({ color: this.color });
    this.cube = new Mesh(this.geometry, this.material);
    this.shape = this.cube;
    this.shape.matrixAutoUpdate = false;
  }
}

class Ball extends Objsim{
  constructor(_radius, _color){
      super();
      this.radius = _radius;
      this.color = _color;
      const geometry = new SphereBufferGeometry( this.radius, 32, 16);
      const material = new MeshStandardMaterial( { color: this.color } );
      const sphere = new Mesh( geometry, material );
      sphere.matrixAutoUpdate = false;
      this.shape = sphere;
  }
}

class Cylinder extends Objsim{
  constructor(_radius, _height, _color){
      super();
      this.radius = _radius;
      this.height = _height;
      this.color = _color;
      const geometry = new CylinderBufferGeometry( this.radius, this.radius, this.height, 50);
      const material = new MeshStandardMaterial( {color: this.color} );
      const cylinder = new Mesh( geometry, material );
      cylinder.matrixAutoUpdate = false;
      this.shape = cylinder;
  }
}

class Frame extends Objsim{
  constructor(size = 1){
      super();
      this.size = size;
      const axesHelper = new AxesHelper(this.size);
      axesHelper.matrixAutoUpdate = false;
      this.shape = axesHelper;
  }
}

class Robot extends Objsim {
  constructor(_linkInfo){
      super();
      //creates a generic robot
      const base = new Group();
      base.name = "base";
      function createLinks(linkInfo, size){
          let links = [];
              for(let i = 0; i < linkInfo[0].length + 1; i++){
                  const link = new Group();
                  //link.matrixAutoUpdate = false;
                  const axesHelper = new AxesHelper( size);
                  axesHelper.matrixAutoUpdate = false;
                  link.add(axesHelper)
                  link.name = "link" + (i).toString();
                  if(i != 0){
                      link.rotateZ(linkInfo[0][i - 1]);
                      link.translateZ(linkInfo[1][i - 1]);
                      link.rotateX(linkInfo[2][i - 1]);
                      link.translateX(linkInfo[3][i - 1]);
                  }
                  if(linkInfo[4][i] == 0){
                      const geometry = new CylinderBufferGeometry( size/9, size/9, size/3, 20 );
                      const material = new MeshStandardMaterial( {color: "blue"} );
                      const cylinder = new Mesh( geometry, material );
                      cylinder.rotateX(1.57);
                      link.add(cylinder)
                  }else if(linkInfo[4][i] == 1){
                      const geometry = new BoxBufferGeometry( size/3.1, size/3.1, size/3.1);
                      const material = new MeshStandardMaterial( {color: "red"} );
                      const cube = new Mesh( geometry, material );
                      link.add(cube)
                  }else if(linkInfo[4][i] == 2){
                      const geometry = new SphereBufferGeometry( size/5.5, 32, 16);
                      const material = new MeshStandardMaterial( { color: "black" } );
                      const sphere = new Mesh( geometry, material );
                      link.add(sphere)
                  }
                  link.updateMatrix();
                  links.push(link);
              }
              for(let i = 0; i < linkInfo[0].length; i++){
                  links[i].add(links[i+1])
              }
          
              return links[0]
      };
      if(_linkInfo != undefined){
        this.linkInfo = _linkInfo;
        this.shape = base;
        base.add(createLinks(this.linkInfo, 0.2));
        this.shape.matrixAutoUpdate = false;
      }
  }
  
  //method that updates configuration
  config(q){
    if(q != undefined){
      let linkName = "";
      let j = 0;
      for(let i = 0; i < this.linkInfo[4].length; i++){
        linkName = "link" + (i).toString();
        if(this.linkInfo[4][i] == 0){
          this.shape.getObjectByName(linkName).rotation.z = q[i];

        }else if (this.linkInfo[4][i] == 1){
          this.shape.getObjectByName(linkName).position.z = q[i];					
        }
      }
    }
  }

  catch(object){
    let mw = this.shape.getObjectByName("link6").getObjectByProperty("type", "AxesHelper").matrixWorld;
    let p = [[ mw.elements[0], mw.elements[4], mw.elements[8], mw.elements[12]],
             [ mw.elements[1], mw.elements[5], mw.elements[9], mw.elements[13]],
             [ mw.elements[2], mw.elements[6], mw.elements[10], mw.elements[14]],
             [ mw.elements[3], mw.elements[7], mw.elements[11], mw.elements[15]]];
    object.setHTM(p);
    //this.shape.getObjectByName("link5").add(object.shape);
    console.log(this.shape.getObjectByName("link6").getObjectByProperty("type", "AxesHelper").matrixWorld);
  }

  create_kuka_kr5(){
      let linkInfo6DOF = [[ 1.570, -1.570,  0.000,  0.000,  0.000,  0.000], // "theta" rotation in z
                          [ 0.335,  0.000,  0.000, -0.405,  0.000, -0.080], // "d" translation in z
                          [-1.570,  0.000,  1.570, -1.570,  1.570,  3.140], // "alfa" rotation in x
                          [ 0.075,  0.365,  0.090,  0.000,  0.000,  0.000], // "a" translation in x
                          [ 0.000,  0.000,  0.000,  0.000,  0.000,  0.000,  2.000]];// kind of link
      let sDOF = new Robot(linkInfo6DOF);
      const objLoader = new OBJLoader();
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Base.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          sDOF.shape.getObjectByName("base").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("base").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("base").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis1.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0, 0, 0.203);
          root.rotation.y = 3.14/2;
          sDOF.shape.getObjectByName("link1").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link1").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link0").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis2.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = -3.14/2;
          root.rotation.z = 3.14;
          root.rotation.y = -3.14/13;
          root.position.set(0, 0, 0.1);
          sDOF.shape.getObjectByName("link2").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link2").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link1").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis3.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.rotation.z = -3.14/2;
          root.position.set(0, 0, 0);
          sDOF.shape.getObjectByName("link3").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link3").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link2").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis4.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.z = -3.14/2;
          root.rotation.x = 3.14/2;
          root.position.set(0.0, 0.0, -0.218);
          sDOF.shape.getObjectByName("link4").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link4").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link3").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis5.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0.0, 0.0, 0.0);
          sDOF.shape.getObjectByName("link5").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link5").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link4").add(root);
      });
      objLoader.load('https://raw.githubusercontent.com/SetpointCapybara/kukakr5/main/models/Axis6.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0.00, 0.0, -0.012);
          sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link6").add(root);
      });
      return sDOF
  }
}

export { Simulation, Box, Ball, Cylinder, Robot, Frame};
