
/*based on page 165 and onwards in the course book*/

/*sharable resource for renderable objects*/
class MeshSphere {

  constructor(gl, triDepth, shaderProgram) {
    this.gl = gl;
    this.startVertices = [
      vec4(0.0, 0.0, -1.0, 1),
      vec4(0.0, 0.942809, 0.333333, 1),
      vec4(-0.816497, -0.471405, 0.333333, 1),
      vec4(0.816497, -0.471405, 0.333333, 1)
    ];
    this.triDepth = triDepth;
    this.vertices = [];
    this.normals = [];
    this.index = 0;
    this.shaderProgram = shaderProgram;

    this.tetrahedron(this.startVertices[0], this.startVertices[1], this.startVertices[2], this.startVertices[3], this.triDepth);

    /*vertex array object handle, this.vertexArray gets the value of a WebGLVertexArrayObject
    representing a vertex array object (VAO) which points to vertex array data*/
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);

    this.nBuffer = this.gl.createBuffer();
    this.vertexBuffer = this.gl.createBuffer();

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
    for( var i=0; i<this.index; i+=3) {
      this.gl.drawArrays(this.gl.TRIANGLES, i, 3);
    }
  }

  getVertexArray() {
    return this.vertexArray;
  }

  getVertices() {
    return this.vertices;
  }

  getIndex() {
    return this.index;
  }

  triangle(a, b, c) {
    this.vertices.push(a);
    this.vertices.push(b);
    this.vertices.push(c);

    //normalize all the points by dividing with sqrt(a[0]^2...0.0^2)
    var aLength = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));
    var bLength = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2) + Math.pow(b[2], 2));
    var cLength = Math.sqrt(Math.pow(c[0], 2) + Math.pow(c[1], 2) + Math.pow(c[2], 2));

    this.normals.push(normalize(a[0]/aLength), normalize(a[1]/aLength), normalize(a[2]/aLength), 0.0);
    this.normals.push(normalize(b[0]/bLength), normalize(b[1]/bLength), normalize(b[2]/bLength), 0.0);
    this.normals.push(normalize(c[0]/cLength), normalize(c[1]/cLength), normalize(c[2]/cLength), 0.0);
    this.index += 3;
  }

   divideTriangle(a, b, c, count) {
     if (count > 0) {
       var ab = mix(a, b, 0.5);
       var ac = mix(a, c, 0.5);
       var bc = mix(b, c, 0.5);

       ab = normalize(ab, true);
       ac = normalize(ac, true);
       bc = normalize(bc, true);

       this.divideTriangle(a, ab, ac, count-1);
       this.divideTriangle(ab, b, bc, count-1);
       this.divideTriangle(bc, c, ac, count-1);
       this.divideTriangle(ab, bc, ac, count-1);

     } else {
       this.triangle(a, b, c);
     }
   }

   tetrahedron(a, b, c, d, n) {
     this.divideTriangle(a, b, c, n);
     this.divideTriangle(d, c, b, n);
     this.divideTriangle(a, d, b, n);
     this.divideTriangle(a, c, d, n);
   }
}
