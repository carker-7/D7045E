

/*takes a vertex shader or fragment shader source and compiles it into a GL shaderHandle
(should be retrievable by some getter method or const public variable)*/
class Shader {
  constructor(gl, shaderType, source) {
    /*create the shader*/
    this.shader = gl.createShader(shaderType);
    this.gl = gl;
    /*upload the shader source*/
    gl.shaderSource(this.shader, document.getElementById(source).text);
    /*compile the shader*/
    gl.compileShader(this.shader)
    if ( !gl.getShaderParameter(this.shader, gl.COMPILE_STATUS) ) {
        var msg = "Shader failed to compile.  The error log is:"
      + "<pre>" + gl.getShaderInfoLog( this.shader ) + "</pre>";
        console.log( msg );
    }
  }

  getShader() {
    return this.shader;
  }

}
