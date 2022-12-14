import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

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