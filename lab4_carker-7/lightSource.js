

class LightSource extends Node {

  constructor(gl, shader, color, lightPosition) {
    super();
    this.lightPosition = lightPosition;
    this.lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    this.lightDiffuse = color;
    this.lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    this.gl = gl;
    this.shader = shader;
    this.gl.uniform4fv(this.gl.getUniformLocation(this.shader.getProgram(), "lightPosition"),flatten(this.lightPosition));
  }

  activate() {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.shader.getProgram(), "lightPosition"),flatten(this.lightPosition));
  }
}
