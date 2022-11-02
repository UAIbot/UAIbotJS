import * as UAIbot from "./UAIbot.js";

let sim = new UAIbot.Simulation();
let caixa = new UAIbot.Box(1, 1, 1, "green");

sim.add(caixa);


let i = 0;

sim.setAnimationLoop(() => {

  let r = [[math.cos(i*(math.pi/360)), -math.sin(i*(math.pi/360)), 0, 0],
           [math.sin(i*(math.pi/360)),  math.cos(i*(math.pi/360)), 0, 0],
           [0, 0, 1, 0],
           [0, 0, 0, 1]];
  
  let p = [[ 1, 0, 0, i*0.001],
           [ 0, 1, 0, 0],
           [ 0, 0, 1, 0],
           [ 0, 0, 0, 1]];

  let m = math.multiply(p, r)

  caixa.setHTM(m);

  sim.render();

  i = i + 1;
});
