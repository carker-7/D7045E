



class GeometryNode extends Node {
  /*holds a mesh resource, material and an instance specific transform*/
  constructor(gl, mesh, material, transform) {
    super();
    this.gl = gl;
    this.mesh = mesh;
    this.material = material;
    this.transform = transform;
  }

  draw() {
    this.mesh.bufferAttribSetup();

    this.material.applyMaterial(this.transform);

    this.mesh.drawArrays();
  }

  //if you move a node around the transform needs to be updated
  update(transform) {
    this.transform = mult(this.transform, transform);
  }

  getTransform() {
    return this.transform;
  }
}
