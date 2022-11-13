import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

let links= [[ 1.570, -1.570,  0.000,  0.000,  0.000,  0.000], // "theta" rotation in z
            [ 0.335,  0.000,  0.000, -0.405,  0.000, -0.080], // "d" translation in z
            [-1.570,  0.000,  1.570, -1.570,  1.570,  3.140], // "alfa" rotation in x
            [ 0.075,  0.365,  0.090,  0.000,  0.000,  0.000], // "a" translation in x
            [ 0.000,  0.000,  0.000,  0.000,  0.000,  0.000,  2.000]];// kind of link

let sim = new UAIbot.Simulation();
//let bot = new UAIbot.Robot(links);
let bot = new UAIbot.Robot().create_kuka_kr5();
let frames = new UAIbot.Frame(0.1);
sim.add(bot);
sim.add(frames);

let q0 = math.matrix([[0],
                      [0],
                      [-math.pi/4],
                      [0],
                      [0],
                      [0]]);

bot.config(q0);

//Cria Tdes
 
let translation = math.matrix([[Math.random()*0.4 + 0.1],
                               [Math.random()*0.4 + 0.1],
                               [Math.random()*0.4 + 0.1]]);

let Tdes = math.multiply(Utils.trn(translation),Utils.rotx(-math.pi/(Math.random()*6)));

frames.setHTM(Tdes);

//Constantes

let k = 7;
let dt = 0.01;

//loop principal
let i = 0;
sim.setAnimationLoop(() => {
sim.fitWindow();
    if(i > 1){


      


        let p_de = math.matrix([[Tdes._data[0][3]],
                                [Tdes._data[1][3]],
                                [Tdes._data[2][3]]]);

        let x_de = math.matrix([[Tdes._data[0][0]],
                                [Tdes._data[1][0]],
                                [Tdes._data[2][0]]]);

        let y_de = math.matrix([[Tdes._data[0][1]],
                                [Tdes._data[1][1]],
                                [Tdes._data[2][1]]]);

        let z_de = math.matrix([[Tdes._data[0][2]],
                                [Tdes._data[1][2]],
                                [Tdes._data[2][2]]]);

        let t_eff = bot.fkm();
        let jgeo = bot._jac_geo();


        let p_ef = math.matrix([[t_eff._data[0][3]],
                                [t_eff._data[1][3]],
                                [t_eff._data[2][3]]]);

        let x_ef = math.matrix([[t_eff._data[0][0]],
                                [t_eff._data[1][0]],
                                [t_eff._data[2][0]]]);

        let y_ef = math.matrix([[t_eff._data[0][1]],
                                [t_eff._data[1][1]],
                                [t_eff._data[2][1]]]);

        let z_ef = math.matrix([[t_eff._data[0][2]],
                                [t_eff._data[1][2]],
                                [t_eff._data[2][2]]]);

        let jp = math.matrix([[ jgeo._data[0][0], jgeo._data[0][1], jgeo._data[0][2], jgeo._data[0][3], jgeo._data[0][4], jgeo._data[0][5]],
                              [ jgeo._data[1][0], jgeo._data[1][1], jgeo._data[1][2], jgeo._data[1][3], jgeo._data[1][4], jgeo._data[1][5]],
                              [ jgeo._data[2][0], jgeo._data[2][1], jgeo._data[2][2], jgeo._data[2][3], jgeo._data[2][4], jgeo._data[2][5]]]);

        let jw = math.matrix([[ jgeo._data[3][0], jgeo._data[3][1], jgeo._data[3][2], jgeo._data[3][3], jgeo._data[3][4], jgeo._data[3][5]],
                              [ jgeo._data[4][0], jgeo._data[4][1], jgeo._data[4][2], jgeo._data[4][3], jgeo._data[4][4], jgeo._data[4][5]],
                              [ jgeo._data[5][0], jgeo._data[5][1], jgeo._data[5][2], jgeo._data[5][3], jgeo._data[5][4], jgeo._data[5][5]]]);    
    
        let rpos = math.subtract(p_ef, p_de); 

        let rwx = math.subtract(1, math.multiply(math.transpose(x_de), x_ef));

        let rwy = math.subtract(1, math.multiply(math.transpose(y_de), y_ef));

        let rwz = math.subtract(1, math.multiply(math.transpose(z_de), z_ef));

        let r = math.matrix([[rpos._data[0][0]],
                             [rpos._data[1][0]],
                             [rpos._data[2][0]],
                             [rwx._data[0][0]],
                             [rwy._data[0][0]],
                             [rwz._data[0][0]]]);
        
        let jrp = jp;

        let jwx = math.multiply(math.transpose(x_de), math.multiply(Utils.s(x_ef), jw));
        let jwy = math.multiply(math.transpose(y_de), math.multiply(Utils.s(y_ef), jw));
        let jwz = math.multiply(math.transpose(z_de), math.multiply(Utils.s(z_ef), jw));

        let jr = math.matrix([jrp._data[0],
                              jrp._data[1],
                              jrp._data[2],
                              jwx._data[0],
                              jwy._data[0],
                              jwz._data[0]]);

        //Calcula a acao de controle
        let u = math.multiply(Utils.dp_inv(jr), math.multiply(-k, r));

        let qprox =  math.add(bot.q, math.multiply(u, dt));
            
        bot.config(qprox);

        console.log(u._data[0][0]);

        if(Math.abs(rpos._data[0][0]) < 0.001){
            translation = math.matrix([[Math.random()*0.4 + 0.1],
                                       [Math.random()*0.4 + 0.1],
                                       [Math.random()*0.4 + 0.1]]);

            Tdes = math.multiply(Utils.trn(translation),Utils.rotx(-math.pi/(Math.random()*6)));

            frames.setHTM(Tdes); 
        }
    }

  i++;
  sim.render();
});