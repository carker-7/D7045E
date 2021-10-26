
/*a stationary camera that gives a perspective view of all GraphicNodes*/
class Camera extends Node {

  constructor(gl, shaderProgram) {
    super();
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.radius = 10;
    this.theta = 0.0;
    this.fieldOfView = 45;
    this.aspect = (gl.canvas.width/gl.canvas.height);
    this.near = 0.1;
    this.far = 1000;
    this.eye = vec3(this.radius * Math.sin(this.theta) * Math.cos(Math.PI),
                this.radius * Math.sin(this.theta) * Math.sin(Math.PI),
                this.radius * Math.cos(this.theta));
    this.at = vec3(0.0, 0.0, 0.0);
    this.up = vec3(0.0, 1.0, 0.0);

    /*view: points the camera from the center of projection (eye) toward a desired "at" point
    with a specified "up" direction for the camera*/
    this.vMatrix = lookAt(this.eye, this.at, this.up);

    /*selects a lens for a perspective view and how much of the world the camera should image*/
    this.pMatrix = perspective(this.fieldOfView, this.aspect, this.near, this.far);

    this.nMatrix = [
        vec3(this.vMatrix[0][0], this.vMatrix[0][1], this.vMatrix[0][2]),
        vec3(this.vMatrix[1][0], this.vMatrix[1][1], this.vMatrix[1][2]),
        vec3(this.vMatrix[2][0], this.vMatrix[2][1], this.vMatrix[2][2])
    ];

    this.tMatrix = mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
    /*console.log(this.tMatrix[0][3])
    console.log(this.tMatrix[1][3])
    console.log(this.tMatrix[2][3])*/

    this.vMatrixInv = inverse4(this.vMatrix);
    //this.vMatrixInv = vec4(this.vMatrix[0][3], this.vMatrix[1][3], this.vMatrix[2][3], 1);
    //console.log(this.vMatrixInv)
  }

  //activate the camera view by sending the view matrix and projection matrix to the program
  update() {
    var pMatrix = this.gl.getUniformLocation(this.shaderProgram, "pMatrix");
    var vMatrix = this.gl.getUniformLocation(this.shaderProgram, "vMatrix");
    var nMatrix = this.gl.getUniformLocation(this.shaderProgram, "nMatrix");
    var vMatrixInv = this.gl.getUniformLocation(this.shaderProgram, "vMatrixInv");

    this.gl.uniformMatrix4fv(pMatrix, false, flatten(this.pMatrix));
    this.gl.uniformMatrix4fv(vMatrix, false, flatten(this.vMatrix));
    this.gl.uniformMatrix3fv(nMatrix, false, flatten(this.nMatrix));
    this.gl.uniformMatrix4fv(vMatrixInv, false, flatten(this.vMatrixInv));
    //this.gl.uniform3fv(vMatrixInv, flatten(this.vMatrixInv));


    //this.gl.uniform4fv(vMatrixInv, flatten(this.vMatrixInv));
    //var vMatrixInverse = inverse4(this.vMatrix);
    /*this.gl.uniformMatrix4fv(vMatrixInv3, false, flatten(vMatrixInverse[3]));*/
  }

  getVMatrix(){
    return this.vMatrix;
  }

  getPMatrix() {
    return this.pMatrix;
  }

  setAtX(value) {
    this.at[0] = this.at[0] + value;
    this.vMatrix = mult(lookAt(this.eye, this.at, this.up), this.tMatrix);
    this.vMatrixInv = inverse4(this.vMatrix);
    //this.vMatrixInv = vec4(this.vMatrix[0][3], this.vMatrix[1][3], this.vMatrix[2][3]);
  }

  setAtY(value) {
    this.at[1] = this.at[1] + value;
    this.vMatrix = mult(lookAt(this.eye, this.at, this.up), this.tMatrix);
    this.vMatrixInv = inverse4(this.vMatrix);
    //this.vMatrixInv = vec4(this.vMatrix[0][3], this.vMatrix[1][3], this.vMatrix[2][3]);
  }

  tMatrixUpdate(tMatrix) {
    this.tMatrix = mult(this.tMatrix, tMatrix)
    this.vMatrix = mult(lookAt(this.eye, this.at, this.up), this.tMatrix);
    this.vMatrixInv = inverse4(this.vMatrix);
    //this.vMatrixInv = vec4(this.vMatrix[0][3], this.vMatrix[1][3], this.vMatrix[2][3]);
  }
}
