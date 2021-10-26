

/*takes multiple shader resources and links them into a GL shader program handle*/
class ShaderProgram {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl;
    this.program = gl.createProgram();
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.linkProgram(this.program);
  }

  /*a method that activates the GL shader program (via glUseProgram)*/
  activateShader() {
    this.gl.useProgram(this.program);
  }

  getProgram() {
    return this.program;
  }
}
