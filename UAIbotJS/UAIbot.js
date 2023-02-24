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

import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@11.6.0/+esm'

/**
 * Represents a new simulation environment.
 * @class
 */
class Simulation {
  /**
   * Creates a new simulation environment.
   * @constructor
   */
  constructor() {
    Object3D.DefaultUp = new Vector3(0, 0, 1); 
    this.canvas = document.querySelector("#scene"); 
    this.scene = new Scene(); 
    this.scene.background = new Color("#DCDCDC"); 
    this.camera = new PerspectiveCamera(
      35,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    ); 
    this.camera.position.set(4, 4, 3); 
    this.ambientLight = new HemisphereLight("white", "darkslategrey", 3); 
    this.controls = new OrbitControls(this.camera, this.canvas); 
    this.controls.target.set(0, 0, 0); 
    let canvas = this.canvas;
    this.renderer = new WebGLRenderer({ canvas, antialias: true }); 
    this.renderer.physicallyCorrectLights = true; 
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight); 
    this.renderer.setPixelRatio(window.devicePixelRatio); 
    this.sceneElements = [];
    this.axesHelper = new AxesHelper(0.5); 
    this.axesHelper.renderOrder = 1;
    this.gridHelper = new GridHelper(3, 6);
    this.gridHelper.rotation.x = 3.14 / 2;
    this.scene.add(this.ambientLight);
    this.scene.add(this.axesHelper);
    this.scene.add(this.gridHelper);
  }

  /**
   * Renders each frame.
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Creates the animation loop.
   * @param {undefined} loop_code code to be excecuted every loop.
   */
  setAnimationLoop(loop_code) {
    this.renderer.setAnimationLoop(loop_code);
  }

  /**
   * Makes scene fit browser window.
   */
  fitWindow() {
    this.renderer.setSize(window.innerWidth-4, window.innerHeight-4);
    this.camera.aspect = (window.innerWidth - 4) / (window.innerHeight - 4);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Adds object to the scene.
   * @param {object} object_sim Object to be added.
   */
  add(object_sim) {
    this.scene.add(object_sim.shape);
  }
}

/**
 * Represents any object that can be added to the scene.
 * @class
 */
class Objsim {
  /**
   * Creates a class that represents any object that can be added to the scene.
   * @constructor
   */
  constructor() {
    this.catched = false;
  }

  /**
   * Sets the homogeneous transformation matrix that represents the position of the object as the position of the object.
   * @param {object} m 4x4 math.js homogeneous transformation matrix that represents the position of the object.
   */
  setHTM(m){
    let matrix = m._data;
    this.shape.matrix.set(      
      matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3],
      matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3],
      matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3],
      matrix[3][0], matrix[3][1], matrix[3][2], matrix[3][3]);
  }
}

/**
 * Class representing a cuboid
 * @extends Objsim
 */
class Box extends Objsim{
  /**
   * Creates a cuboid.
   * @constructor
   * @param {number} _width width of the cuboid in meters.
   * @param {number} _height height of the cuboid in meters.
   * @param {number} _depth depth of the cuboid in meters.
   * @param {*} _color color of the cuboid in RGB/Hexadecimal/etc...
   */
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

/**
 * Class representing a sphere.
 * @extends Objsim
 */
class Ball extends Objsim{
  /**
   * Creates a sphere.
   * @constructor
   * @param {number} _radius radius of the sphere in meters.
   * @param {*} _color color of the sphere in RGB/Hexadecimal/etc...
   */
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

/**
 * Class representing a cylinder.
 * @extends Objsim
 */
class Cylinder extends Objsim{
  /**
   * Creates a cylinder.
   * @constructor
   * @param {number} _radius radius of the cylinder in meters.
   * @param {number} _height height of the cylinder in meters.
   * @param {*} _color color of the cylinder in RGB/Hexadecimal/etc...
   */
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

/**
 * Class representing a cartesian reference frame.
 * @class
 */
class Frame extends Objsim{
  /**
   * Creates a cartesian reference frame.
   * @constructor
   * @param {number} size lenght of the components of the frame in meters.
   */
  constructor(size = 1){
      super();
      this.size = size;
      const axesHelper = new AxesHelper(this.size);
      axesHelper.matrixAutoUpdate = false;
      const group = new Group();
      group.matrixAutoUpdate = false;
      group.add(axesHelper);
      this.shape = group;
  }
}

/**
 * Class representing a generic open chain robotic manipulator.
 */
class Robot extends Objsim {
  /**
   * Creates a generic open chain robotic manipulator.
   * @constructor
   * @param {object} _linkInfo 5xN matrix representing the DH parameters that describe the robot.
   */
  constructor(_linkInfo){
      super();
      const base = new Group();
      base.name = "base";
      function createLinks(linkInfo, size){
          let links = [];
              for(let i = 0; i < linkInfo[0].length + 1; i++){
                  const link = new Group();
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
        this.q = math.matrix([[0],
                              [0],
                              [-math.pi/4],
                              [0],
                              [0],
                              [0]]);
      }
  }
  
  /**
   * Sets robot configuration.
   * @param {object} c math.js column matrix representing the robot configuration.
   */
  config(c){
    this.q = c;
    let q = this.q._data;
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

  /**
   * Makes robot catch a scene object.
   * @param {object} object Scene object to be catched.
   */
  catch(object){
    if(!object.catched){
      object.catched = true;
      let last_link = this.linkInfo[4].length - 1
      let mw = this.shape.getObjectByName("link" + last_link.toString()).getObjectByProperty("type", "AxesHelper").matrixWorld;
      let link6HTM = [[mw.elements[0], mw.elements[4],  mw.elements[8], mw.elements[12]],
                      [mw.elements[1], mw.elements[5],  mw.elements[9], mw.elements[13]],
                      [mw.elements[2], mw.elements[6], mw.elements[10], mw.elements[14]],
                      [mw.elements[3], mw.elements[7], mw.elements[11], mw.elements[15]]];
  
      let m4 = object.shape.matrix;
      let objectHTM = [[m4.elements[0], m4.elements[4],  m4.elements[8], m4.elements[12]],
                       [m4.elements[1], m4.elements[5],  m4.elements[9], m4.elements[13]],
                       [m4.elements[2], m4.elements[6], m4.elements[10], m4.elements[14]],
                       [m4.elements[3], m4.elements[7], m4.elements[11], m4.elements[15]]];
  
      let qt = [[link6HTM[0][0], link6HTM[1][0], link6HTM[2][0]],
                [link6HTM[0][1], link6HTM[1][1], link6HTM[2][1]],
                [link6HTM[0][2], link6HTM[1][2], link6HTM[2][2]]];
  
      let p = [[link6HTM[0][3]],
               [link6HTM[1][3]],
               [link6HTM[2][3]]];
  
      let mqtp = math.multiply(-1, qt, p);
      
      let HTMinv = [[qt[0][0], qt[0][1], qt[0][2], mqtp[0][0]],
                    [qt[1][0], qt[1][1], qt[1][2], mqtp[1][0]],
                    [qt[2][0], qt[2][1], qt[2][2], mqtp[2][0]],
                    [       0,        0,        0,          1]];
  
      let newHTM = math.matrix(math.multiply(HTMinv, objectHTM));
      object.setHTM(newHTM);
      this.shape.getObjectByName("link" + last_link.toString()).add(object.shape);
    }
  }

  /**
   * Makes robot release a scene object.
   * @param {object} object Scene object to be released.
   */
  release(object){
    if(object.catched){
      object.catched = false;
      let m4 = object.shape.matrixWorld;
      let objectHTM = [[m4.elements[0], m4.elements[4],  m4.elements[8], m4.elements[12]],
                       [m4.elements[1], m4.elements[5],  m4.elements[9], m4.elements[13]],
                       [m4.elements[2], m4.elements[6], m4.elements[10], m4.elements[14]],
                       [m4.elements[3], m4.elements[7], m4.elements[11], m4.elements[15]]];
      object.setHTM(math.matrix(objectHTM));
      this.shape.getObjectByName("base").add(object.shape);
    }
  }

  /**
   * Calculates the forward kinematics of the robot.
   * @param {number} n DH referential for which the forward kinematics will be calculated.
   * @param {object} q Configuration of the robot for the calculation of the forward kinematics.
   * @returns 4x4 math.js homogeneous transformation matrix representing the forward kinematics. 
   */
  fkm(n = this.linkInfo[0].length, q = this.q){
    let old_q = this.q;

    this.config(q);

    let n_mw = this.shape.getObjectByName("link" + n.toString()).matrixWorld;
    let n_HTM = math.matrix([[n_mw.elements[0], n_mw.elements[4],  n_mw.elements[8], n_mw.elements[12]],
                             [n_mw.elements[1], n_mw.elements[5],  n_mw.elements[9], n_mw.elements[13]],
                             [n_mw.elements[2], n_mw.elements[6], n_mw.elements[10], n_mw.elements[14]],
                             [n_mw.elements[3], n_mw.elements[7], n_mw.elements[11], n_mw.elements[15]]]);

    this.config(old_q);

    return n_HTM;
  }

  /**
   * Calculates the geometric jacobian.
   * @param {number} axis DH referential for which the geometric jacobian will be calculated.
   * @returns 6xN math.js matrix representing the geometric jacobian.
   */
  _jac_geo(axis = this.linkInfo[0].length){
    let n = axis;
    let test = 0;
    let jac_geo = math.zeros(6, n)._data;

    for(let i = 1; i < (n+1); i++){
      let j_1 = i - 1;
      let j_1_HTM = this.fkm(j_1)
      
      let n_HTM = this.fkm(n)

      let p_n = math.matrix([[n_HTM._data[0][3]],
                             [n_HTM._data[1][3]],
                             [n_HTM._data[2][3]]]);

      let zj_1 = math.matrix([[j_1_HTM._data[0][2]],
                              [j_1_HTM._data[1][2]],
                              [j_1_HTM._data[2][2]]]);

      let pj_1 = math.matrix([[j_1_HTM._data[0][3]],
                              [j_1_HTM._data[1][3]],
                              [j_1_HTM._data[2][3]]]);

      if(this.linkInfo[4][j_1] == 0){
        //position
        let p_n_pj_1 = math.subtract(p_n, pj_1);
        let pos = math.cross(zj_1, p_n_pj_1);
        jac_geo[0][i -1] = pos._data[0][0];
        jac_geo[1][i -1] = pos._data[0][1];
        jac_geo[2][i -1] = pos._data[0][2];

        //rotation
        jac_geo[3][i -1] = zj_1._data[0][0];
        jac_geo[4][i -1] = zj_1._data[1][0];
        jac_geo[5][i -1] = zj_1._data[2][0];

      }else{
        //position
        jac_geo[0][i -1] = zj_1._data[0][0];
        jac_geo[1][i -1] = zj_1._data[1][0];
        jac_geo[2][i -1] = zj_1._data[2][0];

        //rotation
        jac_geo[3][i -1] = 0;
        jac_geo[4][i -1] = 0;
        jac_geo[5][i -1] = 0;
      }
      test = jac_geo;
    }
    return math.matrix(jac_geo);
  }

  /**
   * Creates a KUKA KR5.
   * @returns Robot object configured as a KUKA KR5.
   */
  create_kuka_kr5(){
      let linkInfo6DOF = [[ 1.570, -1.570,  0.000,  0.000,  0.000,  0.000], // "theta" rotation in z
                          [ 0.335,  0.000,  0.000, -0.405,  0.000, -0.080], // "d" translation in z
                          [-1.570,  0.000,  1.570, -1.570,  1.570,  3.140], // "alfa" rotation in x
                          [ 0.075,  0.365,  0.090,  0.000,  0.000,  0.000], // "a" translation in x
                          [ 0.000,  0.000,  0.000,  0.000,  0.000,  0.000,  2.000]];// kind of link
      let sDOF = new Robot(linkInfo6DOF);
      const objLoader = new OBJLoader();
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Base.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          sDOF.shape.getObjectByName("base").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("base").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("base").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis1.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0, 0, 0.203);
          root.rotation.y = 3.14/2;
          sDOF.shape.getObjectByName("link1").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link1").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link0").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis2.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = -3.14/2;
          root.rotation.z = 3.14;
          root.rotation.y = -3.14/13;
          root.position.set(0, 0, 0.1);
          sDOF.shape.getObjectByName("link2").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link2").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link1").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis3.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.rotation.z = -3.14/2;
          root.position.set(0, 0, 0);
          sDOF.shape.getObjectByName("link3").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link3").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link2").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis4.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.z = -3.14/2;
          root.rotation.x = 3.14/2;
          root.position.set(0.0, 0.0, -0.218);
          sDOF.shape.getObjectByName("link4").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link4").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link3").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis5.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0.0, 0.0, 0.0);
          sDOF.shape.getObjectByName("link5").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link5").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link4").add(root);
      });
      objLoader.load('UAIbotJS/3d_models/kuka_kr5/Axis6.obj', (root) => {
          root.scale.set(0.001,0.001,0.001);
          root.rotation.x = 3.14/2;
          root.position.set(0.00, 0.0, -0.012);
          sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link6").add(root);
      });
      return sDOF
  }

 /**
   * Creates an Epson T6.
   * @returns Robot object configured as an Epson T6.
   */
  create_epson_t6(){
    let link_info_t6 = [[    0,       0, 0], //"theta" rotation in z
                        [  0.2,       0, 0],  // "d" translation in z
                        [    0,    3.14, 0],  // "alfa" rotation in x
                        [1.3/4, 1.1 / 4, 0],  // "a" translation in x
                        [    0,       0, 1, 2]] //joint type
    
    let t6 = new Robot(link_info_t6);
    const objLoader = new OBJLoader();

    objLoader.load('UAIbotJS/3d_models/epson_t6/Base.obj', (root) => {
      root.scale.set(0.001,0.001,0.001);
      root.translateX(-0.062);
      root.rotation.x = 3.14/2;
      t6.shape.getObjectByName("base").getObjectByProperty("type", "AxesHelper").visible = false;
      t6.shape.getObjectByName("base").getObjectByProperty("type", "Mesh").visible = false;
      t6.shape.getObjectByName("base").add(root);
    });

    objLoader.load('UAIbotJS/3d_models/epson_t6/T6Axis1.obj', (root) => {
      root.scale.set(0.001,0.001,0.001);
      root.translateZ(0.2);
      root.rotation.x = 3.14/2;
      t6.shape.getObjectByName("link1").getObjectByProperty("type", "AxesHelper").visible = false;
      t6.shape.getObjectByName("link1").getObjectByProperty("type", "Mesh").visible = false;
      t6.shape.getObjectByName("link0").add(root);
    });

    objLoader.load('UAIbotJS/3d_models/epson_t6/T6Cable.obj', (root) => {
      root.scale.set(0.001,0.001,0.001);
      root.translateZ(0.44);
      root.rotation.x = 3.14/2;
      root.rotation.y = -3.14/2;
      t6.shape.getObjectByName("link1").getObjectByProperty("type", "AxesHelper").visible = false;
      t6.shape.getObjectByName("link1").getObjectByProperty("type", "Mesh").visible = false;
      t6.shape.getObjectByName("link0").add(root);
    });

    objLoader.load('UAIbotJS/3d_models/epson_t6/T6Axis2.obj', (root) => {
      root.scale.set(0.001,0.001,0.001);
      root.rotation.x = 3.14/2;
      root.translateX(0.275);
      root.translateY(0.075);
      t6.shape.getObjectByName("link2").getObjectByProperty("type", "AxesHelper").visible = false;
      t6.shape.getObjectByName("link2").getObjectByProperty("type", "Mesh").visible = false;
      t6.shape.getObjectByName("link1").add(root);
    });

    objLoader.load('UAIbotJS/3d_models/epson_t6/T6Axis3.obj', (root) => {
      root.scale.set(0.001,0.001,0.001);
      root.rotation.x = 3.14/2;
      t6.shape.getObjectByName("link3").getObjectByProperty("type", "AxesHelper").visible = false;
      t6.shape.getObjectByName("link3").getObjectByProperty("type", "Mesh").visible = false;
      t6.shape.getObjectByName("link2").add(root);
    });
    return t6;
  }
}

export { Simulation, Box, Ball, Cylinder, Robot, Frame};
