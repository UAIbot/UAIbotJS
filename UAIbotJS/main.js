import * as UAIbot from "./UAIbot.js";

let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_kuka_kr5();
let caixa = new UAIbot.Box(0.3, 0.3,0.3, "blue");

let p = [[ 1, 0, 0, 0.5],
         [ 0, 1, 0, 0.5],
         [ 0, 0, 1, 0],
         [ 0, 0, 0, 1]];

caixa.setHTM(p);

sim.add(caixa);
sim.add(bot);

let i = 0;
let j = 0;
sim.setAnimationLoop(() => {

  if (i< 100){
    bot.config([0, i/100, -math.pi/3, 0, i/100, 0])
  } else if (i < 200){
    bot.catch(caixa);
  }else if (i < 300){
    bot.config([0, 1 - ((i-200)/100), -math.pi/3, 0, 1 - ((i-200)/1000), 0]);
    bot.catch(caixa);
  }
  
  let r = [[math.cos(i*(math.pi/360)), -math.sin(i*(math.pi/360)), 0, 0],
  [math.sin(i*(math.pi/360)),  math.cos(i*(math.pi/360)), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]];
 // bot.setHTM(r);
  i++;
  sim.render();
});
