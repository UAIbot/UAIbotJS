import * as utils from "./UAIbot.js";
import * as simulation from "./simulation.js";

let sim = new simulation.Simulation();
renderer.setAnimationLoop(() => {
  fitWindow();

  for (let i = 0; i < sceneElements.length; i++) {
    sceneElements[i].nextFrame();
  }

  renderer.render(scene, camera);
});
