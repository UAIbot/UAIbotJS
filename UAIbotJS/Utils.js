import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@11.6.0/+esm'

/**
 * Returns a 3x3 matrix that implements the cross product for a 3D vector
 * as a matricial product, that is, a matrix S(v) such that for any other
 * 3D column  vector w, S(v)w = cross(v,w).
 * @param {object} v 3x1 math.js matrix representing a 3D vector.
 * @returns {object} 4x4 math.js matrix that implements the cross product with v.
 */
function s(v){

    return math.matrix([[             0, -v._data[2][0],  v._data[1][0]],
                        [ v._data[2][0],              0, -v._data[0][0]],
                        [-v._data[1][0],  v._data[0][0],              0]]); 

}

/**
 * Returns a Homogeneous transformation matrix that represents the rotation of an angle around an axis.
 * @param {object} axis 3x1 math.js matrix representing the axis of rotation as a 3D vector.
 * @param {number} angle The angle of rotation, in radians.
 * @returns {object} 4x4 math.js matrix.
 */
function rot(axis, angle){

    let norm_axis = math.multiply(1/(math.norm([axis._data[0][0], axis._data[1][0], axis._data[2][0]])), axis);

    let ux = norm_axis._data[0][0];
    let uy = norm_axis._data[1][0];
    let uz = norm_axis._data[2][0];

    let a11 = math.cos(angle) + (ux^2)*(1 - math.cos(angle));
    let a12 = ux*uy*(1 - math.cos(angle)) - uz*math.sin(angle);
    let a13 = ux*uz*(1 - math.cos(angle)) + uy*math.sin(angle);
    let a21 = uy*ux*(1 - math.cos(angle)) + uz*math.sin(angle);
    let a22 = math.cos(angle) + (uy^2)*(1 - math.cos(angle));
    let a23 = uy*uz*(1 - math.cos(angle)) - ux*math.sin(angle);
    let a31 = uz*ux*(1 - math.cos(angle)) - uy*math.sin(angle);
    let a32 = uz*uy*(1 - math.cos(angle)) + ux*math.sin(angle);
    let a33 = math.cos(angle) + (uz^2)*(1 - math.cos(angle));

    return math.matrix([[ a11, a12, a13, 0],
                        [ a21, a22, a23, 0],
                        [ a31, a32, a33, 0],
                        [   0,   0,   0, 1]]);
    
}

/**
 * Returns a Homogeneous transformation matrix that represents the displacement of a vector.
 * @param {object} vector 3x1 math.js matrix representing the displacement vector.
 * @return {object} 4x4 math.js matrix.
 */
function trn(vector){


    return math.matrix([[ 1, 0, 0, vector._data[0][0]],
                        [ 0, 1, 0, vector._data[1][0]],
                        [ 0, 0, 1, vector._data[2][0]],
                        [ 0, 0, 0,                  1]]);
}

/**
 * Returns a Homogeneous transformation matrix that represents the rotation around an angle in the 'x' axis.
 * @param {number} angle The angle of rotation, in radians.
 * @return {object} 4x4 math.js matrix.
 */
function rotx(angle){

    let a22 = math.cos(angle);
    let a23 = -math.sin(angle);
    let a32 = math.sin(angle);
    let a33 = math.cos(angle);

    return math.matrix([[   1,   0,   0, 0],
                        [   0, a22, a23, 0],
                        [   0, a32, a33, 0],
                        [   0,   0,   0, 1]]);
}

/**
 * Returns a Homogeneous transformation matrix that represents the rotation around an angle in the 'y' axis.
 * @param {number} angle The angle of rotation, in radians.
 * @return {object} 4x4 math.js matrix.
 */
function roty(angle){

    let a11 = math.cos(angle);
    let a13 = math.sin(angle);
    let a31 = -math.sin(angle);
    let a33 = math.cos(angle);

    return math.matrix([[ a11,   0, a13, 0],
                        [   0,   1,   0, 0],
                        [ a31,   0, a33, 0],
                        [   0,   0,   0, 1]]);
}

/**
 * Returns a Homogeneous transformation matrix that represents the rotation around an angle in the 'z' axis.
 * @param {number} angle The angle of rotation, in radians.
 * @return {object} 4x4 math.js matrix.
 */
function rotz(angle){

    let a11 = math.cos(angle);
    let a12 = -math.sin(angle);
    let a21 = math.sin(angle);
    let a22 = math.cos(angle);

    return math.matrix([[ a11, a12,   0, 0],
                        [ a21, a22,   0, 0],
                        [   0,   0,   1, 0],
                        [   0,   0,   0, 1]]);

}

/**
 * Returns the damped pseudoinverse of the matrix 'mat'.
 * @param {object} mat NxM math.js matrix.
 * @param {number} eps The damping factor.
 * @returns {object} MxN math.js matrix.
 */
function dp_inv(mat, eps = 0.001){

    let nxm = math.size(mat);
    let n = nxm._data[0];
    let matTmat = math.multiply(math.transpose(mat), mat);
    let epsident = math.multiply(eps, math.identity(n));
    let temp = math.add(matTmat, epsident);
    let inv = math.inv(temp);

    return math.multiply( inv, math.transpose(mat));
}

export { s, rot, trn, rotx, roty, rotz, dp_inv};