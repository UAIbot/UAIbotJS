import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

let sim = new UAIbot.Simulation();

sim.setAnimationLoop(() => {

    sim.render();
});