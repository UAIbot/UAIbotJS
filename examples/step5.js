import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

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

let i = 78;
sim.setAnimationLoop(() => {
    sim.fitWindow();

    if(i < 157){
        let q = math.matrix([[math.cos(i/50)],
                             [math.cos(i/50)],
                             [-0.04*math.cos(i/25) - 0.05]]);
        bot.config(q);
    }

    if(i == 157){
        bot.catch(box);
    }

    if(i >= 157 && i < 392){
        let q = math.matrix([[math.cos(i/50)],
                             [math.cos(i/50)],
                             [-0.04*math.cos(i/25) - 0.05]]);
        bot.config(q);
    }

    if(i == 314){
        bot.release(box);
    }

    i++;
    sim.render();
});