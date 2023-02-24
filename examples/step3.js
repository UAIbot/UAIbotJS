import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";
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

let i = 0;
sim.setAnimationLoop(() => {
    let step = Utils.rotz(i/100);
    let rot = math.multiply(pos,step);
    box.setHTM(rot)

    i++;
    sim.render();
});