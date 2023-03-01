import * as UAIbot from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@v1.0.1/UAIbotJS/UAIbot.js";
import * as Utils from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@main/UAIbotJS/Utils.js";
import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@11.6.0/+esm'

let sim = new UAIbot.Simulation();

let box = new UAIbot.Box(0.5, 
                         0.5, 
                         0.5, 
                         "red");

let mth = math.matrix([[0.5],
                       [0.5],
                       [0.25]]);

let pos = Utils.trn(mth);
box.setHTM(pos)
sim.add(box)


sim.setAnimationLoop(() => {

    sim.render();
});