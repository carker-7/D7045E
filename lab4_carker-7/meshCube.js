
/*based on page 165 and onwards in the course book*/

/*sharable resource for renderable objects*/
class MeshCube {

  constructor(gl, shaderProgram, sideLength) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.startVertices = [vec4( -sideLength, -sideLength,  sideLength, 1.0 ),
            vec4( -sideLength,  sideLength,  sideLength, 1.0 ),
            vec4( sideLength,  sideLength,  sideLength, 1.0 ),
            vec4( sideLength, -sideLength,  sideLength, 1.0 ),
            vec4( -sideLength, -sideLength, -sideLength, 1.0 ),
            vec4( -sideLength,  sideLength, -sideLength, 1.0 ),
            vec4( sideLength,  sideLength, -sideLength, 1.0 ),
            vec4( sideLength, -sideLength, -sideLength, 1.0 )];
    this.normals = [];
    this.vertices = [];

    this.createCube();

    /*vertex array object handle, this.vertexArray gets the value of a WebGLVertexArrayObject
    representing a vertex array object (VAO) which points to vertex array data*/
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);

    this.nBuffer = this.gl.createBuffer();

    /*vertex buffer handle*/
    this.vertexBuffer = this.gl.createBuffer();
  }

  quad(a, b, c, d) {
    var t1 = subtract(this.startVertices[b], this.startVertices[a]);
    var t2 = subtract(this.startVertices[c], this.startVertices[a]);
    var normal = cross(t1, t2);
    var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));

    this.vertices.push(this.startVertices[a]);
    this.normals.push(normal);
    this.vertices.push(this.startVertices[b]);
    this.normals.push(normal);
    this.vertices.push(this.startVertices[c]);
    this.normals.push(normal);
    this.vertices.push(this.startVertices[a]);
    this.normals.push(normal);
    this.vertices.push(this.startVertices[c]);
    this.normals.push(normal);
    this.vertices.push(this.startVertices[d]);
    this.normals.push(normal);

}

 createCube() {
   this.quad( 1, 0, 3, 2 );
   this.quad( 2, 3, 7, 6 );
   this.quad( 3, 0, 4, 7 );
   this.quad( 6, 5, 1, 2 );
   this.quad( 4, 5, 6, 7 );
   this.quad( 5, 4, 0, 1 );
}

  bufferAttribSetup() {
    var vPosition = this.gl.getAttribLocation(this.shaderProgram, "vPosition");
    var vNormal = this.gl.getAttribLocation(this.shaderProgram, "vNormal" );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(vPosition, 4, this.gl.FLOAT, false, 0, 0 );
    this.gl.enableVertexAttribArray(vPosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.nBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.normals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(vNormal, 4, this.gl.FLOAT, false, 0, 0 );
    this.gl.enableVertexAttribArray(vNormal);
  }

  drawArrays() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);
  }

  getVertexArray() {
    return this.vertexArray;
  }

  getVertices() {
    return this.vertices;
  }

  getIndices() {
    return this.indices;
  }
}
