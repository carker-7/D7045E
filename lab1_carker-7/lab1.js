
var canvas;
var gl;
var vertices = [];
var depth = 1;
//var theta = 0.0;
//var thetaLoc;

function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {alert("WebGL isn't available");}

  //initial triangle to start the recursion
  temp = [vec2(-0.5, -0.3), vec2(0.0, 0.566), vec2(0.5, -0.3)];
  koch(temp[0], temp[1], temp[2], depth, 1);
  koch(temp[1], temp[2], temp[0], depth, 1);
  koch(temp[2], temp[0], temp[1], depth, 1);

  //webgl configurations
  gl.viewport( 0, 0, canvas.width, canvas.height );
  //canvas color is set to yellow
  gl.clearColor( 1, 1, 0.8, 1.0 );

  //load shaders
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram(program);

  //load data into the gpu
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  //
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  //thetaLoc = gl.getUniformLocation(program, "theta");

  render(gl, vertices);

  document.getElementById("button1").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button2").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button3").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button4").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button5").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button6").onclick = function() {
        depth = event.srcElement.value;
    };
  document.getElementById("button7").onclick = function() {
        depth = event.srcElement.value;
    };

};

function render(gl, v) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  //theta += 0.01;
  //gl.uniform1f( thetaLoc, theta );
  gl.drawArrays(gl.LINE_LOOP, 0, flatten(v).length/2);

  //empty the array before next iteration
  vertices = [];

  //tell the browser to perform animation with the init function
  requestAnimFrame(init);
}

function koch(p0, p1, b, depth, sidelength) {
  //end of recursion
  if (depth == 1){
    vertices.push(p0,p1);
  } else {
    //calculate the points
    var bp0 = mix(b,p0,1);
    var bp1 = mix(b,p1,1);
    var m = mix(bp0,bp1,0.5);
    var q0 = mix(p0,p1,1/3);
    var q1 = mix(p0,p1,2/3);

    //calculate distance between points a and m
    var amdistance = (Math.sqrt(3)/2)*(sidelength/3);

    //calculate the a point
    var p0p1 = subtract(p0,p1);
    var perpAng = vec2(p0p1[1],-p0p1[0]);
    var norm = normalize(perpAng);
    var a = scale(amdistance, norm);
    a = add(m,a);

    //calculate base points for the sides p0-b and p1-b
    var b1 = mix(p0,b,1/3);
    var b2 = mix(p1,b,1/3);

    //continue the recursion with the new points
    koch(p0, q0, b1, depth-1, sidelength/3);
    koch(q0, a, q1, depth-1, sidelength/3);
    koch(a, q1, q0, depth-1, sidelength/3);
    koch(q1, p1, b2, depth-1, sidelength/3);

  }
}

window.onload = init;
