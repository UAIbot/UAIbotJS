import * as UAIbot from "./UAIbot.js";

let sim = new UAIbot.Simulation();
let links = [[ 1.570, -1.570,  0.000], // "theta" rotation in z
             [ 0.335,  0.000,  0.000], // "d" translation in z
             [-1.570,  0.000,  1.570], // "alfa" rotation in x
             [ 0.000,  0.365,  0.400], // "a" translation in x
             [ 0.000,  0.000,  0.000, 0]];// kind of link

let bot = new UAIbot.Robot(links);
sim.add(bot);

//Declarações
let k = 5;
let pdes = math.matrix([[0],
                        [0.5],
                        [0.5]]); 

let q0 = math.matrix([[4],
                      [2],
                      [-1]]);
let dt = 0.01;

bot.config([ 0, 2, -2]);//aceitar vetor coluna

//loop principal
let i = 0;
sim.setAnimationLoop(() => {
  //sim.fitWindow();
  if(i > 1){
    let CD = bot.fkm();//adicionar configuração generica

    let pef = math.matrix([[CD[0][3]],
                           [CD[1][3]],
                           [CD[2][3]]]);
    
    let Jgeo = bot._jac_geo();

    let Jr = math.matrix([[Jgeo[0][0], Jgeo[0][1], Jgeo[0][2]],
                          [Jgeo[1][0], Jgeo[1][1], Jgeo[1][2]],
                          [Jgeo[2][0], Jgeo[2][1], Jgeo[2][2]]]);

    let r = math.subtract(pef, pdes); //procurar overload de operador

    let invJr = math.inv(Jr);

    let u = math.multiply(invJr, math.multiply(-k, r));

    let qprox =  math.add(bot.q, math.multiply(u, dt)); //criar atributo qatual 

    bot.config([qprox._data[0][0], qprox._data[1][0], qprox._data[2][0]]);
  }

  i++;
  sim.render();
});
