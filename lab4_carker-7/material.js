

/*abstract class*/

class Material {
  /*holds a pointer to a shaderprogram object*/
  constructor(shaderProgram) {
    this.shaderProgram = shaderProgram;

    if (new.target === Material) {
      throw new Error("abstract class, cannot create instance");
    }
  }

  /*abstract method that gets overridden by subclasses*/
  applyMaterial() {
    throw new Error("not yet implemented");
  }

}
