

class FloorMaterial extends Material {

  constructor(gl, firstColor, secondColor, shader, lightSource) {
    super(shader.program);
    this.gl = gl;
    this.firstColor = firstColor;
    this.secondColor = secondColor;
    this.fColorLocation = null;
    this.shader = shader;
    this.lightSource = lightSource;

    this.materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
    this.materialDiffuse = firstColor;
    this.materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    this.materialShininess = 10.0;

    this.ambientProduct = mult(lightSource.lightAmbient, this.materialAmbient);
    this.diffuseProduct = mult(lightSource.lightDiffuse, this.materialDiffuse);
    this.specularProduct = mult(lightSource.lightSpecular, this.materialSpecular);

  }

  applyMaterial(transform) {

    //send the transform
    var tMatrix = this.gl.getUniformLocation(this.shader.program, "tMatrix");
    this.gl.uniformMatrix4fv(tMatrix, false, flatten(transform));

    this.gl.uniform4fv(this.gl.getUniformLocation(this.shader.getProgram(), "ambientProduct"),flatten(this.ambientProduct));
    this.gl.uniform4fv(this.gl.getUniformLocation(this.shader.getProgram(), "diffuseProduct"),flatten(this.diffuseProduct));
    this.gl.uniform4fv(this.gl.getUniformLocation(this.shader.getProgram(), "specularProduct"),flatten(this.specularProduct));
    this.gl.uniform1f(this.gl.getUniformLocation(this.shader.getProgram(), "shininess"),this.materialShininess );
    this.gl.uniform1f(this.gl.getUniformLocation(this.shader.getProgram(), "floorFlag"), 1.0 );
  }
}
