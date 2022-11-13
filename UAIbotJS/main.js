import * as UAIbot from "./UAIbot.js";
import * as Utils from "./Utils.js";
let sim = new UAIbot.Simulation();

//loop principal
let i = 0;
sim.setAnimationLoop(() => {

  if(i == 1){
    let v = math.matrix([[2],
                         [2],
                         [2]]);
    let s = Utils.trn(v);

    console.log(s);
  }

  i++;
  sim.render();
});
