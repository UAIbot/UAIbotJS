import * as UAIbot from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@main/UAIbotJS/UAIbot.js";
import * as Utils from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@main/UAIbotJS/Utils.js";
import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@11.6.0/+esm'

let sim = new UAIbot.Simulation();

sim.setAnimationLoop(() => {

    sim.render();
});