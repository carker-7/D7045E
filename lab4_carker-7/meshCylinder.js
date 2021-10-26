

/*sharable resource for renderable objects*/
class MeshCylinder {

  constructor(gl, triDepth, height, width, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.triDepth = triDepth;
    this.height = height;
    this.width = width;

    this.topCircle = [];
    this.bottomCircle = [];
    this.triangles = [];

    this.topSurface = [];
    this.bottomSurface = [];

    this.normals = [];
    this.vertices = [];

    this.topMiddlePoint = vec4(0.0, this.height, 0.0, 1.0);
    this.bottomMiddlePoint = vec4(0.0, -this.height, 0.0, 1.0);

    this.phi = 2.0*Math.PI/this.triDepth;

    this.createCylinder();

    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);

    this.nBuffer = this.gl.createBuffer();
    this.vertexBuffer = this.gl.createBuffer();
  }

  createCylinder() {
    this.topCircle.push(this.topMiddlePoint);
    this.bottomCircle.push(this.bottomMiddlePoint);
    
    //create the top and bottom circles
    for (var i=0; i<this.triDepth+1; i++) {
      var angle = i * this.phi;
      this.topCircle.push(vec4(this.width*Math.cos(angle), this.height, this.width*Math.sin(angle), 1.0));
      this.bottomCircle.push(vec4(this.width*Math.cos(angle), -this.height, this.width*Math.sin(angle), 1.0));
    }

    //create the triangles
    for (var i=0; i<this.topCircle.length-1; i++) {
      this.vertices.push(this.bottomCircle[i+1], this.bottomCircle[i], this.topCircle[i]);

      var t1 = subtract(this.bottomCircle[i], this.bottomCircle[i+1]);
      var t2 = subtract(this.topCircle[i], this.bottomCircle[i]);
      var normal = cross(t1, t2);
      var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));

      this.normals.push(normal);
      this.normals.push(normal);
      this.normals.push(normal);
    }

    for (var i=0; i<this.topCircle.length-1; i++) {
      this.vertices.push(this.bottomCircle[i+1], this.topCircle[i], this.topCircle[i+1]);

      var t1 = subtract(this.topCircle[i], this.bottomCircle[i+1]);
      var t2 = subtract(this.topCircle[i+1], this.topCircle[i]);
      var normal = cross(t1, t2);
      var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));

      this.normals.push(normal);
      this.normals.push(normal);
      this.normals.push(normal);
    }

    //create top and bottom surfaces based on the circles and middle points
    for (var i=0; i<this.topCircle.length-1; i++) {
      this.vertices.push(this.topCircle[i], this.topMiddlePoint, this.topCircle[i+1]);

      var t1 = subtract(this.topMiddlePoint, this.topCircle[i]);
      var t2 = subtract(this.topCircle[i+1], this.topMiddlePoint);
      var normal = cross(t1, t2);
      var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));

      this.normals.push(normal)
      this.normals.push(normal)
      this.normals.push(normal)
    }

    //create top and bottom surfaces based on the circles and middle points
    for (var i=0; i<this.topCircle.length-1; i++) {
      this.vertices.push(this.bottomCircle[i], this.bottomMiddlePoint, this.bottomCircle[i+1]);
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
