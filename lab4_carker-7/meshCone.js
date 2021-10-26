
/*based on page 165 and onwards in the course book*/

/*sharable resource for renderable objects*/
class MeshCone {

  constructor(gl, triDepth, height, width, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.triDepth = triDepth;
    this.height = height;
    this.width = width;

    this.bottomCircle = [];
    this.triangles = [];
    this.bottomSurface = [];

    this.normals = [];
    this.vertices= [];

    this.topPoint = vec4(0.0, this.height, 0.0, 1.0);
    this.bottomMiddlePoint = vec4(0.0, -this.height, 0.0, 1.0);

    this.phi = 2.0*Math.PI/this.triDepth;

    this.createCone();

    /*vertex array object handle, this.vertexArray gets the value of a WebGLVertexArrayObject
    representing a vertex array object (VAO) which points to vertex array data*/
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);

    this.nBuffer = this.gl.createBuffer();
    this.vertexBuffer = this.gl.createBuffer();
  }

  createCone() {
    this.bottomCircle.push(this.bottomMiddlePoint);
    this.triangles.push(this.topPoint);

    //create the bottom circle
    for (var i=0; i<this.triDepth+1; i++) {
      var angle = i*this.phi;
      this.bottomCircle.push(vec4(this.width*Math.cos(angle), -this.height, this.width*Math.sin(angle), 1.0 ));
    }

    //create the triangles
    for (var i=0; i<this.bottomCircle.length-1; i++) {
      this.vertices.push(this.bottomCircle[i], this.topPoint, this.bottomCircle[i+1]);

      var t1 = subtract(this.topPoint, this.bottomCircle[i]);
      var t2 = subtract(this.bottomCircle[i+1], this.topPoint);
      var normal = cross(t1, t2);
      var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));

      this.normals.push(normal)
      this.normals.push(normal)
      this.normals.push(normal)
    }

    for (var i=0; i<this.bottomCircle.length-1; i++) {
      this.vertices.push(this.bottomCircle[i], this.bottomCircle[i+1], this.bottomMiddlePoint);
    }
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

}
