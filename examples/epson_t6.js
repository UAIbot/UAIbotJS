import * as UAIbot from "../UAIbotJS/UAIbot.js";

let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_epson_t6();

sim.add(bot);


let i = 0;
sim.setAnimationLoop(() => {
  bot.config([math.cos(i*(math.pi/180)), math.cos(i*(math.pi/180)), 0.05*math.cos(i*(math.pi/180)) - 0.02]);
  i++;
  sim.render();
});
