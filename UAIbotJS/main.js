import * as UAIbot from "./UAIbot.js";

let sim = new UAIbot.Simulation();
let caixa = new UAIbot.Box(1, 1, 1, "green");

sim.add(caixa);

sim.setAnimationLoop(() => {
  caixa.rotate();
  sim.render();
});
