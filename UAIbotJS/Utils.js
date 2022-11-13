function s(v){
    /*    
        Returns a 3x3 matrix that implements the cross product for a 3D vector  
        as a matricial product, that is, a matrix S(v) such that for any other 
        3D column  vector w, S(v)w = cross(v,w).
        
        Parameters
        ----------
        v : a 3D vector
            The vector for which the S matrix will be created.
        Returns
        -------
        S : 3x3 math.js matrix
            A matrix that implements the cross product with v.
    */

    return math.matrix([[             0, -v._data[2][0],  v._data[1][0]],
                        [ v._data[2][0],              0, -v._data[0][0]],
                        [-v._data[1][0],  v._data[0][0],              0]]); 

}

function rot(axis, angle){
    /*     
        Homogeneous transformation matrix that represents the rotation of an
        angle in an axis.
        
        Parameters
        ----------
        axis : a 3D vector
            The axis of rotation.
        
        angle: float
            The angle of rotation, in radians.
        Returns
        -------
        htm : 4x4 math.js matrix
            The homogeneous transformation matrix.
    */
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

function trn(vector){
    /*     
        Homogeneous transformation matrix that represents the displacement
        of a vector
        
        Parameters
        ----------
        vector : a 3D vector
            The displacement vector.
        
        Returns
        -------
        htm : 4x4 math.js matrix
            The homogeneous transformation matrix.
    */

    return math.matrix([[ 1, 0, 0, vector._data[0][0]],
                        [ 0, 1, 0, vector._data[1][0]],
                        [ 0, 0, 1, vector._data[2][0]],
                        [ 0, 0, 0,                  1]]);
}

function rotx(angle){
    /* 
        Homogeneous transformation matrix that represents the rotation of an
        angle in the 'x' axis.
        
        Parameters
        ----------
        angle: float
            The angle of rotation, in radians.
        Returns
        -------
        htm : 4x4 math.js matrix
            The homogeneous transformation matrix.
    */

    let a22 = math.cos(angle);
    let a23 = -math.sin(angle);
    let a32 = math.sin(angle);
    let a33 = math.cos(angle);

    return math.matrix([[   1,   0,   0, 0],
                        [   0, a22, a23, 0],
                        [   0, a32, a33, 0],
                        [   0,   0,   0, 1]]);
}

function roty(angle){
    /*   
        Homogeneous transformation matrix that represents the rotation of an
        angle in the 'y' axis.
        
        Parameters
        ----------
        angle: float
            The angle of rotation, in radians.
        Returns
        -------
        htm : 4x4 math.js matrix
            The homogeneous transformation matrix.
    */

    let a11 = math.cos(angle);
    let a13 = math.sin(angle);
    let a31 = -math.sin(angle);
    let a33 = math.cos(angle);

    return math.matrix([[ a11,   0, a13, 0],
                        [   0,   1,   0, 0],
                        [ a31,   0, a33, 0],
                        [   0,   0,   0, 1]]);
}

function rotz(angle){
    /*   
        Homogeneous transformation matrix that represents the rotation of an
        angle in the 'z' axis.
        
        Parameters
        ----------
        angle: float
            The angle of rotation, in radians.
        Returns
        -------
        htm : 4x4 math.js matrix
            The homogeneous transformation matrix.
    */

    let a11 = math.cos(angle);
    let a12 = -math.sin(angle);
    let a21 = math.sin(angle);
    let a22 = math.cos(angle);

    return math.matrix([[ a11, a12,   0, 0],
                        [ a21, a22,   0, 0],
                        [   0,   0,   1, 0],
                        [   0,   0,   0, 1]]);

}

function dp_inv(mat, eps = 0.001){
    /* 
        Compute the damped pseudoinverse of the matrix 'mat'.
        
        Parameters
        ----------
        mat: nxm math.js array
            The matrix to compute the damped pseudoinverse.
        
        eps: positive float
            The damping factor.
            (default: 0.001).
        Returns
        -------
        pinvA: mxn math.js array
            The damped pseudoinverse of 'mat'.
    */    

    let nxm = math.size(mat);
    let n = nxm._data[0];
    let matTmat = math.multiply(math.transpose(mat), mat);
    let epsident = math.multiply(eps, math.identity(n));
    let temp = math.add(matTmat, epsident);
    let inv = math.inv(temp);

    return math.multiply( inv, math.transpose(mat));
}

export { s, rot, trn, rotx, roty, rotz, dp_inv};