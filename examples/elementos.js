import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_epson_t6();
let box = new UAIbot.Box(0.5, 0.5, 0.5, "red");
let can = new UAIbot.Cylinder(0.25, 0.5, "blue");
let ball = new UAIbot.Ball(0.25, "yellow");

let box_position = Utils.trn(math.matrix([[-0.5], [-0.5], [0.25]]));
box.setHTM(box_position)
sim.add(box)

let can_position = Utils.trn(math.matrix([[-0.5], [0.5], [0.25]]));
can.setHTM(can_position)
sim.add(can)

let ball_position = Utils.trn(math.matrix([[0.5], [-0.5], [0.25]]));
ball.setHTM(ball_position)
sim.add(ball)

let bot_position = Utils.trn(math.matrix([[0.5], [0.75], [0]]));
bot.setHTM(bot_position)
sim.add(bot)

let i = 0;
sim.setAnimationLoop(() => {
    sim.fitWindow();

    let can_rotation = math.multiply(can_position,Utils.rotx(i/100));
    can.setHTM(can_rotation)

    let box_rotation = math.multiply(box_position,Utils.rotz(i/100));
    box.setHTM(box_rotation)

    let ball_rotation = math.multiply(ball_position,Utils.trn(math.matrix([[0], [0], [0.25*math.cos(i/20)]])));
    ball.setHTM(ball_rotation)

    let q = math.matrix([[math.cos(i/50)],
                         [math.sin(i/100)],
                         [0.05*math.cos(i/75) - 0.08]]);
    bot.config(q);
    
    i++;
    sim.render();
});