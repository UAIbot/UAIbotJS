import * as UAIbot from "../UAIbotJS/UAIbot.js";

let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_kuka_kr5();
let caixa = new UAIbot.Cylinder(0.3, 0.3, "blue");

let p = math.matrix([[ 1, 0, 0, 0.5],
                     [ 0, 1, 0, 0.5],
                     [ 0, 0, 1, 0],
                     [ 0, 0, 0, 1]]);

caixa.setHTM(p);

sim.add(caixa);
sim.add(bot);

let i = 0;
let j = 0;
sim.setAnimationLoop(() => {
  sim.fitWindow();
  if (i< 100){
   // bot.config([0, i/100, -math.pi/3, 0, i/100, 0])
    bot.config(math.matrix([[0], [i/100], [-math.pi/3], [0], [i/100], [0]]));
  } else if (i == 100){
    bot.catch(caixa);
  }else if (i < 200){
    bot.catch(caixa);
    //bot.config([0, 1 - ((i-100)/100), -math.pi/3, 0, 1 - ((i-100)/100), 0]);
    bot.config(math.matrix([[0], [1 - ((i-100)/100)], [-math.pi/3], [0], [1 - ((i-100)/100)], [0]]));
  }else if (i< 300){
   // bot.config([0, (i-200)/100, -math.pi/3, 0, (i-200)/100, 0])
    bot.config(math.matrix([[0], [(i-200)/100], [-math.pi/3], [0], [(i-200)/100], [0]]));
  } else if (i == 300){
    bot.release(caixa);
  }else if (i < 400){
    //bot.config([0, 1 - ((i-300)/100), -math.pi/3, 0, 1 - ((i-300)/100), 0]);
    bot.config(math.matrix([[0], [1 - ((i-300)/100)], [-math.pi/3], [0], [1 - ((i-300)/100)], [0]]));
  }
  if(i == 400){
    i = 0;
  }
  i++;
  sim.render();
});
