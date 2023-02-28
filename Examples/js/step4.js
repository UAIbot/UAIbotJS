import * as UAIbot from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@main/UAIbotJS/UAIbot.js";
import * as Utils from "https://cdn.jsdelivr.net/gh/UAIbot/UAIbotJS@main/UAIbotJS/Utils.js";
import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@11.6.0/+esm'

let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_epson_t6();

let box = new UAIbot.Box(0.1, 
                         0.1, 
                         0.1, 
                         "red");

let mth = math.matrix([[0.05],
                       [-0.525],
                       [0.05]]);

let pos = Utils.trn(mth);
box.setHTM(pos)

sim.add(box);
sim.add(bot);


sim.setAnimationLoop(() => {
    sim.fitWindow();

    sim.render();
});