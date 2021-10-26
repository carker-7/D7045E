



class GraphicsNode {
  /*holds a mesh resource, material and an instance specific transform*/
  constructor(gl, mesh, material, transform) {
    this.gl = gl;
    this.mesh = mesh;
    this.material = material;
    this.transform = transform;
  }

  draw() {
    /*bind the mesh's vertex array object*/
    //this.gl.bindVertexArray(this.mesh.getVertexArray());

    /*call the apply material method of the material*/
    this.material.applyMaterial(this.transform);

    /*execute a draw call*/
    this.gl.drawElements(this.gl.TRIANGLES, this.mesh.getIndices().length, this.gl.UNSIGNED_BYTE, 0);
  }

  //if you move a node around the transform needs to be updated
  updateTransform(transform) {
    this.transform = transform;
  }

}
