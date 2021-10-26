

/*sharable resource for renderable objects*/
class MeshFloor {

  constructor(gl, shaderProgram) {
    this.gl = gl;
    this.vertices = [];
    this.normals =  [];
    this.index = 0;
    this.shaderProgram = shaderProgram;

    for (var i = 10; i > -11; i--) { //x-coordinates
      for (var j = 10; j > -11; j--) { //z-coordinates

        this.vertices.push(
        vec4(i, 0, j-1, 1), //c
        vec4(i-1, 0, j, 1), //b
        vec4(i, 0, j, 1), //a
        vec4(i, 0, j-1, 1),//c
        vec4(i-1, 0, j-1, 1), //d
        vec4(i-1, 0, j, 1)); //b

        var t1 = subtract(vec4(i, 0, j, 1), vec4(i-1, 0, j, 1)); //a-b
        var t2 = subtract(vec4(i, 0, j-1, 1), vec4(i, 0, j, 1)); //c-a
        var normal = cross(t1, t2);
        var normal = normalize(vec4(normal[0], normal[1], normal[2], 0.0));
        this.normals.push(normal)
        this.normals.push(normal)
        this.normals.push(normal)
        this.normals.push(normal)
        this.normals.push(normal)
        this.normals.push(normal)

        this.index += 6;
      }
    }

    /*vertex array object handle, this.vertexArray gets the value of a WebGLVertexArrayObject
    representing a vertex array object (VAO) which points to vertex array data*/
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);

    this.vertexBuffer = this.gl.createBuffer();
    this.nBuffer = this.gl.createBuffer();
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
    var toggleColor = true;
    for(var i = 0; i < this.index; i+=3) {
      if (toggleColor) {
        this.gl.uniform4fv(this.gl.getUniformLocation(this.shaderProgram, "diffuseProduct"),flatten(vec4(0,1, 1, 1.0)));
      } else {
        this.gl.uniform4fv(this.gl.getUniformLocation(this.shaderProgram, "diffuseProduct"),flatten(vec4(0.3, 1, 1, 1.0)));
      }
      this.gl.drawArrays(this.gl.TRIANGLES, i, 3);
      toggleColor = !toggleColor;
    }
  }

  getVertexArray() {
    return this.vertexArray;
  }

  getVertices() {
    return this.vertices;
  }

}
