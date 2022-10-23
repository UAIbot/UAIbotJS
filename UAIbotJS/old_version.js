import { Object3D, Vector3, BoxBufferGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera,
    Scene, WebGLRenderer, AmbientLight, DirectionalLight, HemisphereLight, MeshStandardMaterial,
    AxesHelper, GridHelper, Matrix4, SphereBufferGeometry, CylinderBufferGeometry, Group,
  } from "https://unpkg.com/three@0.126.1/build/three.module.js";
  import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
  import {OBJLoader} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js';

  
  //--------------------SIMULATION ELEMENTS---------------------
  class Objsim{
      constructor(_frames){
          this.frames = _frames;
          this.currentFrame = 0;
          this.shape = "I HAVE NO SHAPE YET";
      }
      
      nextFrame(){
          if(this.currentFrame < this.frames.length){
              this.shape.matrix.set( this.frames[this.currentFrame][ 0],this.frames[this.currentFrame][ 1],this.frames[this.currentFrame][ 2],this.frames[this.currentFrame][ 3],
                                     this.frames[this.currentFrame][ 4],this.frames[this.currentFrame][ 5],this.frames[this.currentFrame][ 6],this.frames[this.currentFrame][ 7],
                                     this.frames[this.currentFrame][ 8],this.frames[this.currentFrame][ 9],this.frames[this.currentFrame][10],this.frames[this.currentFrame][11],
                                     this.frames[this.currentFrame][12],this.frames[this.currentFrame][13],this.frames[this.currentFrame][14],this.frames[this.currentFrame][15]);
              this.currentFrame = this.currentFrame + 1;
          }
      }
  }
  
  class Box extends Objsim{
      constructor(_name, _width, _height, _depth, _color, _frames){
          super(_frames);
          this.width = _width;
          this.height = _height;
          this.depth = _depth;
          this.color = _color;
          const geometry = new BoxBufferGeometry( this.width, this.height, this.depth);
          const material = new MeshStandardMaterial( {color: this.color} );
          const cube = new Mesh( geometry, material );
          cube.name = _name;
          cube.matrixAutoUpdate = false;
          this.shape = cube;
      }
  }
  
  class Ball extends Objsim{
      constructor(_name, _radius, _color, _frames){
          super(_frames);
          this.radius = _radius;
          this.color = _color;
          const geometry = new SphereBufferGeometry( this.radius, 32, 16);
          const material = new MeshStandardMaterial( { color: this.color } );
          const sphere = new Mesh( geometry, material );
          sphere.name = _name;
          sphere.matrixAutoUpdate = false;
          this.shape = sphere;
      }
  }
  
  class Cylinder extends Objsim{
      constructor(_name, _radius, _height, _color, _frames){
          super(_frames);
          this.radius = _radius;
          this.height = _height;
          this.color = _color;
          const geometry = new CylinderBufferGeometry( this.radius, this.radius, this.height, 10 );
          const material = new MeshStandardMaterial( {color: this.color} );
          const cylinder = new Mesh( geometry, material );
          cylinder.name = _name;
          cylinder.matrixAutoUpdate = false;
          this.shape = cylinder;
      }
  }
  
  class Robot extends Objsim{
      constructor(_linkInfo, _frames){
          super(_frames);
          //Function that creates a generic robot
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
          this.linkInfo = _linkInfo;
          this.shape = base;
          base.add(createLinks(this.linkInfo, 0.2));
          this.shape.matrixAutoUpdate = false;
      }
      
      //Function that updates frames
      nextFrame(){
      
          if(this.currentFrame < this.frames.length){
              //setting robot position
              this.shape.matrix.set( this.frames[this.currentFrame][ 0],this.frames[this.currentFrame][ 1],this.frames[this.currentFrame][ 2],this.frames[this.currentFrame][ 3],
                                     this.frames[this.currentFrame][ 4],this.frames[this.currentFrame][ 5],this.frames[this.currentFrame][ 6],this.frames[this.currentFrame][ 7],
                                     this.frames[this.currentFrame][ 8],this.frames[this.currentFrame][ 9],this.frames[this.currentFrame][10],this.frames[this.currentFrame][11],
                                     this.frames[this.currentFrame][12],this.frames[this.currentFrame][13],this.frames[this.currentFrame][14],this.frames[this.currentFrame][15]);
              //setting robot configuration
              if(this.frames[this.currentFrame][16] != undefined){
                  let linkName = "";
                  let j = 0;
                  for(let i = 0; i < this.linkInfo[4].length; i++){
                      linkName = "link" + (i).toString();
                      if(this.linkInfo[4][i] == 0){
                          this.shape.getObjectByName(linkName).rotation.z = this.frames[this.currentFrame][16][j];
                          j++;
                      }else if (this.linkInfo[4][i] == 1){
                          this.shape.getObjectByName(linkName).position.z = this.frames[this.currentFrame][16][j];
                          j++;						
                      }
                  }
              }
              //grabing stuff
              if(this.frames[this.currentFrame][17] != undefined){
                  let linkName = "link" + (this.linkInfo[4].length - 1).toString();
                  let newFrameX = this.shape.getObjectByName(linkName).matrixWorld.elements[12];
                  let newFrameY = this.shape.getObjectByName(linkName).matrixWorld.elements[13];
                  let newFrameZ = this.shape.getObjectByName(linkName).matrixWorld.elements[14];
                  let oldFrameX = scene.getObjectByName(this.frames[this.currentFrame][17][1]).matrixWorld.elements[12];
                  let oldFrameY = scene.getObjectByName(this.frames[this.currentFrame][17][1]).matrixWorld.elements[13];
                  let oldFrameZ = scene.getObjectByName(this.frames[this.currentFrame][17][1]).matrixWorld.elements[14];
                  if(this.frames[this.currentFrame][17][0] == 1){
                      this.shape.getObjectByName(linkName).add(scene.getObjectByName(this.frames[this.currentFrame][17][1]));
                      scene.getObjectByName(this.frames[this.currentFrame][17][1]).matrix.set(1, 0, 0, newFrameX - oldFrameX,
                                                                                              0, 1, 0, newFrameY - oldFrameY,
                                                                                              0, 0, 1, newFrameZ - oldFrameZ,
                                                                                              0, 0, 0, 1);
                  }else {
                      scene.add(scene.getObjectByName(this.frames[this.currentFrame][17][1]));
                      scene.getObjectByName(this.frames[this.currentFrame][17][1]).matrix.set(1, 0, 0, oldFrameX,
                                                                                              0, 1, 0, oldFrameY,
                                                                                              0, 0, 1, oldFrameZ,
                                                                                              0, 0, 0, 1);
                  }
              }
              this.currentFrame = this.currentFrame + 1;
          }		
      }
  }
  //Function that creates 6DOF
  function sDOF(robotFrames){
      let linkInfo6DOF = [[ 1.570, -1.570,  0.000,  0.000,  0.000,  0.000], // "theta" rotation in z
                          [ 0.335,  0.000,  0.000, -0.405,  0.000, -0.080], // "d" translation in z
                          [-1.570,  0.000,  1.570, -1.570,  1.570,  3.140], // "alfa" rotation in x
                          [ 0.075,  0.365,  0.090,  0.000,  0.000,  0.000], // "a" translation in x
                          [ 0.000,  0.000,  0.000,  0.000,  0.000,  2.000,  0.000]];// kind of link
      sDOF = new Robot(linkInfo6DOF, robotFrames);
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
          //sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "AxesHelper").visible = false;
          sDOF.shape.getObjectByName("link6").getObjectByProperty("type", "Mesh").visible = false;
          sDOF.shape.getObjectByName("link6").add(root);
      });
      return sDOF
  }

  //------------------------------------------------------------
  
  //--------------- BASIC ELEMENTS OF ANY SCENE ----------------
  Object3D.DefaultUp = new Vector3(0,0,1); //Pointing Z axis up
  const canvas = document.querySelector('#scene');// Selecting canvas
  const scene = new Scene();//Instantiate the Scene
  scene.background = new Color('#DCDCDC');//Set background color
  const camera = new PerspectiveCamera(35, canvas.clientWidth/canvas.clientHeight, 0.1, 100);//Instantiate a camera
  camera.position.set(4, 4, 3);//Put camera in its place
  const ambientLight = new HemisphereLight('white','darkslategrey', 3,);//Instantiate Ambient light
  const controls = new OrbitControls(camera, canvas);	//Instantiate orbit controls
  controls.target.set(0, 0, 0);//Point camera at the origin
  const renderer = new WebGLRenderer({canvas, antialias: true});//Instantiate renderer
  renderer.physicallyCorrectLights = true;//Enable physically Correct Lights
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);//Set render size
  renderer.setPixelRatio(window.devicePixelRatio);//Set pixel ratio
  function fitWindow() { //Function that makes scene fit browser window
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  }
  let sceneElements = [];
  const axesHelper = new AxesHelper( 0.5 ); //Create axis helper
  axesHelper.renderOrder = 1;
  const gridHelper = new GridHelper( 3, 6);//Create grid helper
  gridHelper.rotation.x = 3.14/2;
  scene.add(ambientLight);
  scene.add( axesHelper );
  scene.add( gridHelper );
  //------------------------------------------------------------
  
  //--------------- ADDING ELEMENTS TO THIS SCENE ---------------
  //USER INPUT GOES HERE

  // add stuff to the scene
  for(let i = 0; i < sceneElements.length; i++){
      scene.add(sceneElements[i].shape);
  }
  //------------------------------------------------------------
  
  
  //-------------------- THE ANIMATION LOOP -------------------
  renderer.setAnimationLoop(() => {
      //fitWindow()
      
      //MAGIC HAPPENS HERE!!!
      for(let i = 0; i < sceneElements.length; i++){
          sceneElements[i].nextFrame();
      }

      renderer.render(scene, camera);
  });
  //------------------------------------------------------------