

/*takes a vertex shader or fragment shader source and compiles it into a GL shaderHandle
(should be retrievable by some getter method or const public variable)*/
class Shader {
  constructor(gl, shaderType, source) {
    /*create the shader*/
    this.shader = gl.createShader(shaderType);
    /*upload the shader source*/
    gl.shaderSource(this.shader, document.getElementById(source).text);
    /*compile the shader*/
    gl.compileShader(this.shader)
  }

  getShader() {
    return this.shader;
  }
}
