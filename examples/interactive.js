import * as UAIbot from "../UAIbotJS/UAIbot.js";
import * as Utils from "../UAIbotJS/Utils.js";

function set_pose(Tdes){
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
}

function arrived(T, bot){
    let Td = T._data;
    let Tp = math.matrix([Td[0][3],
                          Td[1][3],
                          Td[2][3]]);
    let Tz = math.matrix([Td[0][2],
                          Td[1][2],
                          Td[2][2]]);

    let Rd = bot.fkm()._data;
    let Rp = math.matrix([Rd[0][3],
                          Rd[1][3],
                          Rd[2][3]]);
    let Rz = math.matrix([Rd[0][2],
                          Rd[1][2],
                          Rd[2][2]]); 

    let diff = (math.norm(Tp) - math.norm(Rp)) + 2*(math.norm(Tz) - math.norm(Rz));

    return diff;
}
//--------------    DOM management    -------------------
let start = document.getElementById("Start");
let object_selector = document.getElementById("object");
let object = object_selector.value
let place_selector = document.getElementById("place");
let place = place_selector.value
let state = false;

start.addEventListener("click", function() {
    state = true;
    step = 0;
})

place_selector.addEventListener("change", function() {
    place = String(place_selector.value);
})

object_selector.addEventListener("change", function() {
    object = String(object_selector.value);
})
//-------------------------------------------------------
let sim = new UAIbot.Simulation();
let bot = new UAIbot.Robot().create_kuka_kr5();
let box = new UAIbot.Box(0.5, 0.6, 0.5, "maroon");
box.setHTM(Utils.trn(math.matrix([[0.5], [0.5], [0.25]])));

let cilinder_pos = math.multiply(Utils.trn(math.matrix([[-0.5], [0.5], [0.125]])), Utils.rotx(math.pi/2))
let cylinder = new UAIbot.Cylinder(0.12, 0.25, "red");
cylinder.setHTM(cilinder_pos);

let ball = new UAIbot.Ball(0.125, "blue");
let ball_pos = Utils.trn(math.matrix([[0.5], [-0.5], [0.125]]));
ball.setHTM(ball_pos);
sim.add(bot);
sim.add(box);
sim.add(cylinder);
sim.add(ball);

//Cria Tdes

let Tdes_ball_floor = math.multiply(math.multiply(ball_pos, Utils.trn(math.matrix([[0], [0], [0.125]]))),Utils.rotx(math.pi));
let Tdes_ball_air = math.multiply(Tdes_ball_floor, Utils.trn(math.matrix([[0], [-0.5], [-0.5]])), Utils.rotx(math.pi/2));
let Tdes_ball_box = math.multiply(Utils.trn(math.matrix([[0.5], [0.3], [0.5+2*0.125]])),Utils.rotx(math.pi));
let Tdes_cylinder_floor = math.multiply(cilinder_pos, Utils.trn(math.matrix([[0], [0.125], [0]])), Utils.rotx(math.pi/2));
let Tdes_cylinder_air = math.multiply(Tdes_cylinder_floor, Utils.trn(math.matrix([[0], [0], [-0.55]])), Utils.rotx(math.pi/1.5));
let Tdes_cylinder_box = math.multiply(Utils.trn(math.matrix([[0.3], [0.5], [0.5 + 0.12]])), Utils.rotx(-math.pi/2));
let T_fim = math.multiply(Utils.trn(math.matrix([[0.25], [0.25], [0.7]])),Utils.rotx(math.pi));
let ball_place = Tdes_ball_floor;
let cylinder_place = Tdes_cylinder_floor;
//Constantes

let k = 10;
let dt = 0.01;

//loop principal

let Tdes0 = ball_place;
let Tdes1 = Tdes_ball_air;
let Tdes2 = Tdes_ball_box;
let catch_ob = ball;
let i = 0;
let step = 5;
sim.setAnimationLoop(() => {

    if(i > 1){
        if (object == "blue_ball"){
            if(place == "brown_box"){
                Tdes0 = ball_place;
                Tdes1 = Tdes_ball_air;
                Tdes2 = Tdes_ball_box;
                catch_ob = ball;
            }else{
                Tdes0 = ball_place;
                Tdes1 = Tdes_ball_air;
                Tdes2 = Tdes_ball_floor;
                catch_ob = ball;
            }
        }
        if (object == "red_cylinder"){
            if(place == "brown_box"){
                Tdes0 = cylinder_place;
                Tdes1 = Tdes_cylinder_air;
                Tdes2 = Tdes_cylinder_box;
                catch_ob = cylinder;
            }else{
                Tdes0 = cylinder_place;
                Tdes1 = Tdes_cylinder_air;
                Tdes2 = Tdes_cylinder_floor;
                catch_ob = cylinder;
            }
        }
        if (step == 0){
            if(math.abs(arrived(Tdes0, bot)) >= 0.000001){
                set_pose(Tdes0);
            } else{
                bot.catch(catch_ob);
                step = 1;
            }
        }
        if(step == 1){
            if(math.abs(arrived(Tdes1, bot)) >= 0.0001){
                set_pose(Tdes1);
            } else{
                step = 2;
            }
        }
        if(step == 2){
            if(math.abs((arrived(Tdes2, bot))) >= 0.000001){
                set_pose(Tdes2);
            } else{
                if(object == "blue_ball"){
                    ball_place = Tdes2;
                }else{
                    cylinder_place =  Tdes2;
                }
                  
                bot.release(catch_ob);
                step = 3;
            }
        }
        if(step == 3){
            if(math.abs(arrived(T_fim, bot)) >= 0.0001){
                set_pose(T_fim);
            } else{
                step = 4;
            }
        }

        
        
    }

  i++;
  sim.render();
});

