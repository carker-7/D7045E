
/*a stationary camera that gives a perspective view of all GraphicNodes*/
class Camera {

  constructor(gl, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.radius = 10;
    this.theta = 0.0;
    this.fieldOfView = 45;
    this.aspect = (gl.canvas.width/gl.canvas.height);
    this.near = 1;
    this.far = 1000;
    this.eye = vec3(this.radius * Math.sin(this.theta) * Math.cos(Math.PI),
                this.radius * Math.sin(this.theta) * Math.sin(Math.PI),
                this.radius * Math.cos(this.theta));
    this.at = vec3(0.0, 0.0, 0.0);
    this.up = vec3(0.0, 1.0, 0.0);

    /*view: points the camera from the center of projection (eye) toward a desired "at" point
    with a specified "up" direction for the camera*/
    this.vMatrix = lookAt(this.eye, this.at , this.up);

    /*selects a lens for a perspective view and how much of the world the camera should image*/
    this.pMatrix = perspective(this.fieldOfView, this.aspect, this.near, this.far);
  }

  //activate the camera view by sending the view matrix and projection matrix to the program
  activate() {
    var pMatrix = this.gl.getUniformLocation(this.shaderProgram, "pMatrix");
    var vMatrix = this.gl.getUniformLocation(this.shaderProgram, "vMatrix");
    this.gl.uniformMatrix4fv(pMatrix, false, flatten(this.pMatrix));
    this.gl.uniformMatrix4fv(vMatrix, false, flatten(this.vMatrix));
  }

  getVMatrix(){
    return this.mvMatrix;
  }

  getPMatrix() {
    return this.pMatrix;
  }
}
