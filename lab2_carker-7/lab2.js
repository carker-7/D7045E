//global variables
var canvas;
var gl;
var fColorLocation;
var rootNode = [];
var vertices = [];
var convexH = [];
var soup = [];
var triangles = [];
var verticesToRender = [];
var convexHullToRender = [];
var fanToRender = [];
var trianglesToRender = [];
var triangleSoupToRender =  [];
var verticesInsideOfConvexH = [];
var mouseClick = new Vertex(-1000,-1000);
var triangleToColor = null;

//initializing vertices
var ver1 = new Vertex(-20, -20);
var ver2 = new Vertex(60, 40);
var ver3 = new Vertex(30, -60);
var ver4 = new Vertex(-20, 20);
var ver5 = new Vertex(-50, -40);
var ver6 = new Vertex(-60, 20);
var ver7 = new Vertex(-10, 70);
var ver8 = new Vertex(40, 10);
var ver9 = new Vertex(-10, -40);
var ver10 = new Vertex(70, 10);

function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {alert("WebGL isn't available");}

  //set the current vertices to the "output" array
  vertices = [ver1, ver2, ver3, ver4, ver5, ver6, ver7, ver8, ver9, ver10];

  //webgl configurations
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor(0.8, 1, 1, 1.0 );

  //load shaders
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram(program);
  fColorLocation = gl.getUniformLocation(program, "fColor");

  //calculate the vertex hull
  convexH = convexHull(vertices);

  //transform convex hull of vertices to convex hull of vectors
  //convexHullToRender = verticesToVec(convexH);

  //calculate vertices inside of convex hull
  verticesInsideOfConvexH = verticesCalc(vertices, convexH);

  //calculate the search tree, the root is returned
  rootNode = build(convexH, 1, convexH.length-2);

  for (i = 0; i < verticesInsideOfConvexH.length; i++) {
    splitTriangle(rootNode, verticesInsideOfConvexH[i]);
  }

  //create the soup by traversing down the search tree (triangles are pushed to the array caLLed soup)
  createTriangleSoup(rootNode);

  //transform vertices to vectors
  verticesToRender = verticesToVec(vertices);

  //transform vertices to vectors
  triangleSoupToRender = trianglesToVec(soup);

  //load data into the gpu
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  //check for triangle to color if the mouseclick is inside of the canvas
  if(mouseClickInside()) {
    colorTriangle(rootNode);
  }

  render(gl, verticesToRender, triangleSoupToRender, triangleToColor);

  //klicking the buttons results in different set of vertices
  document.getElementById("fixed1").onclick = function() {
    vertices1();
    gl.clearColor(0.8, 1, 1, 1.0 );
    triangleToColor = null;
    requestAnimFrame(init);
    };
  document.getElementById("fixed2").onclick = function() {
    vertices2();
    gl.clearColor(0.8, 1, 1, 1.0 );
    triangleToColor = null;
    requestAnimFrame(init);
    };
  document.getElementById("fixed3").onclick = function() {
    vertices3();
    gl.clearColor(0.8, 1, 1, 1.0 );
    triangleToColor = null;
    requestAnimFrame(init);
    };
  document.getElementById("random").onclick = function() {
    vertices4();
    gl.clearColor(0.8, 1, 1, 1.0 );
    triangleToColor = null;
    requestAnimFrame(init);
    };
};

function render(gl, ver, triSoup, triToColor) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform4f(fColorLocation,0.0, 0.0, 1.0, 1.0);
  for (i = 0; i < triSoup.length; i++) {
    //color the lines dark blue
    //gl.uniform4f(fColorLocation,Math.random(), Math.random(), Math.random(), 1.0);
    gl.uniform4f(fColorLocation,0.0, 0.0, 1.0, 1.0);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triSoup[i]), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_LOOP, 0, flatten(triSoup[i]).length/2);

    //color each triangle blue
    gl.uniform4f(fColorLocation,0.5, 1, 1, 1.0 );
    //gl.uniform4f(fColorLocation,Math.random(), Math.random(), Math.random(), 1.0);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triSoup[i]), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, flatten(triSoup[i]).length/2);
  }

  //color the vertices red
  gl.uniform4f(fColorLocation, 1, 0, 0, 1);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(ver), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, ver.length);

  if (triToColor != null) {
    //color the clicked triangle green
    gl.uniform4f(fColorLocation, 0.5, 0.9, 0.5, 1.0 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triToColor), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, flatten(triToColor).length/2);
    //fill in the outlines of the green triangle
    gl.uniform4f(fColorLocation,0.0, 0.0, 1.0, 1.0);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triToColor), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_LOOP, 0, flatten(triToColor).length/2);
  }
  clearVariables();
}

//calculate the convex hull for a set of vertices
function convexHull(vertices) {
  var upperL = [];
  var lowerL = [];
  var temp = new Vertex(1,1);

  //shuffle the array
  vertices = shuffle(vertices);

  //sort by x
  vertices.sort(function(a, b) {
    return a.x == b.x ? a.y - b.y : a.x - b.x;
  });

  //push two first elements to upper L
  upperL.push(vertices[vertices.length-1], vertices[vertices.length-2]);

  //calculate upper L
  for (var i = vertices.length-3; i >= 0; i--) {
    upperL.push(vertices[i]);
    while (upperL.length > 2 && temp.right(upperL[upperL.length-3], upperL[upperL.length-2], upperL[upperL.length-1]) ||
          upperL.length > 2 && temp.on(upperL[upperL.length-3], upperL[upperL.length-2], upperL[upperL.length-1])) {
      upperL.splice(upperL.length-2, 1);
    }
  }

  //push two last elements to lower L
  lowerL.push(vertices[0], vertices[1]);

  //calculate lower L
  for (var i = 2; i <= vertices.length-1; i++) {
    lowerL.push(vertices[i]);
    while (lowerL.length > 2 && temp.right(lowerL[lowerL.length-3], lowerL[lowerL.length-2], lowerL[lowerL.length-1]) ||
          lowerL.length > 2 && temp.on(lowerL[lowerL.length-3], lowerL[lowerL.length-2], lowerL[lowerL.length-1])) {
      lowerL.splice(lowerL.length-2, 1);
    }
  }

  lowerL.shift();
  lowerL.pop();

  //return the finished convex hull
  return lowerL.concat(upperL);
}

//create the initial search tree (fan) and return the root node
function build(c, s, e) {
    if(s == e) {
    var tri = new Triangle(c[0], c[s], c[e+1]);
    var leaf = new Leaf();
    leaf.setTriangle(tri);
    tri.setLeaf(leaf);
    return leaf;
  } else {
    var m = Math.floor((s+e)/2+1);
    var rightD = build(c, s, m-1);
    var leftD = build(c, m, e);
    var biNode = new BinaryNode();
    var line = [c[0], c[m]];
    biNode.setL(line);
    biNode.setLeftNode(leftD);
    biNode.setRightNode(rightD);
    leftD.setParent(biNode);
    rightD.setParent(biNode);
    return biNode;
  }
}

//go down the search tree and push the triangles to the soup variable
function createTriangleSoup(node) {
  if (node instanceof Leaf) {
    soup.push(node.triangle);
  } else if (node instanceof BinaryNode){
    createTriangleSoup(node.rightNode);
    createTriangleSoup(node.leftNode);
  } else if (node instanceof TernaryNode) {
    createTriangleSoup(node.rightNode);
    createTriangleSoup(node.leftNode);
    createTriangleSoup(node.middleNode);
  }
}

//split triangles when adding points to the soup
function splitTriangle(node, point) {
  var check = new Vertex(1,1);
  if (node instanceof Leaf) {
    var rightLeaf = new Leaf();
    var leftLeaf = new Leaf();

    if(check.on(node.triangle.v[0], node.triangle.v[1], point)) {
      var biNode = new BinaryNode();
      console.log("on line v0-v1")

      var rightTriangle = new Triangle(point, node.triangle.v[1], node.triangle.v[2])
      var leftTriangle = new Triangle(point, node.triangle.v[2], node.triangle.v[0]);

      rightTriangle.setLeaf(rightLeaf);
      leftTriangle.setLeaf(leftLeaf);

      rightLeaf.setTriangle(rightTriangle);
      leftLeaf.setTriangle(leftTriangle);

      var line = [point, node.triangle.v[2]];
      biNode.setL(line);
      biNode.setLeftNode(leftLeaf);
      biNode.setRightNode(rightLeaf);
      biNode.setParent(node.parent);

      rightLeaf.setParent(biNode);
      leftLeaf.setParent(biNode);

      if (node == node.parent.leftNode) {
        node.parent.setLeftNode(biNode);
      } else if (node == node.parent.rightNode){
        node.parent.setRightNode(biNode);
      } else if (node == node.parent.middleNode)  {
        node.parent.setMiddleNode(biNode);
      }
      return;

    } else if (check.on(node.triangle.v[1], node.triangle.v[2], point)) {
      var biNode = new BinaryNode();
      console.log("on line v1-v2")

      var rightTriangle = new Triangle(point, node.triangle.v[2], node.triangle.v[0]);
      var leftTriangle = new Triangle(point, node.triangle.v[0], node.triangle.v[1]);

      rightTriangle.setLeaf(rightLeaf);
      leftTriangle.setLeaf(leftLeaf);

      rightLeaf.setTriangle(rightTriangle);
      leftLeaf.setTriangle(leftTriangle);

      var line = [point, node.triangle.v[0]];
      biNode.setL(line);
      biNode.setLeftNode(leftLeaf);
      biNode.setRightNode(rightLeaf);
      biNode.setParent(node.parent);

      rightLeaf.setParent(biNode);
      leftLeaf.setParent(biNode);

      if (node == node.parent.leftNode) {
        node.parent.setLeftNode(biNode);
      } else if (node == node.parent.rightNode){
        node.parent.setRightNode(biNode);
      } else if (node == node.parent.middleNode) {
        node.parent.setMiddleNode(biNode);
      }
      return;

    } else if (check.on(node.triangle.v[2], node.triangle.v[0], point)) {
      var biNode = new BinaryNode();
      console.log("on line v2-v0")

      var leftTriangle = new Triangle(point, node.triangle.v[1], node.triangle.v[2]);
      var rightTriangle = new Triangle(point, node.triangle.v[0], node.triangle.v[1]);

      rightTriangle.setLeaf(rightLeaf);
      leftTriangle.setLeaf(leftLeaf);

      rightLeaf.setTriangle(rightTriangle);
      leftLeaf.setTriangle(leftTriangle);

      var line = [point, node.triangle.v[1]];
      biNode.setL(line);
      biNode.setLeftNode(leftLeaf);
      biNode.setRightNode(rightLeaf);
      biNode.setParent(node.parent);

      rightLeaf.setParent(biNode);
      leftLeaf.setParent(biNode);

      if (node == node.parent.leftNode) {
        node.parent.setLeftNode(biNode);
      } else if (node == node.parent.rightNode){
        node.parent.setRightNode(biNode);
      } else if (node == node.parent.middleNode) {
        node.parent.setMiddleNode(biNode);
      }
      return;

    } else {
      var terNode = new TernaryNode();
      var middleLeaf = new Leaf();

      var middleTriangle = new Triangle(point, node.triangle.v[0], node.triangle.v[1]);
      var rightTriangle = new Triangle(point, node.triangle.v[1], node.triangle.v[2]);
      var leftTriangle = new Triangle(point, node.triangle.v[2], node.triangle.v[0]);

      rightTriangle.setLeaf(rightLeaf);
      leftTriangle.setLeaf(leftLeaf);
      middleTriangle.setLeaf(middleLeaf);

      rightLeaf.setTriangle(rightTriangle);
      leftLeaf.setTriangle(leftTriangle);
      middleLeaf.setTriangle(middleTriangle);

      var points = [point, node.triangle.v[0], node.triangle.v[1], node.triangle.v[2]];
      terNode.setQ(points);
      terNode.setRightNode(rightLeaf);
      terNode.setLeftNode(leftLeaf);
      terNode.setMiddleNode(middleLeaf);
      terNode.setParent(node.parent);

      rightLeaf.setParent(terNode);
      leftLeaf.setParent(terNode);
      middleLeaf.setParent(terNode);

      if (node == node.parent.leftNode) {
        node.parent.setLeftNode(terNode);
      } else if (node == node.parent.rightNode){
        node.parent.setRightNode(terNode);
      } else if (node == node.parent.middleNode) {
        node.parent.setMiddleNode(terNode);
      }
      return;

    }
  } else if (node instanceof BinaryNode) {
    //on the line L0-l1
    if (check.on(node.L[0], node.L[1], point)) {
      splitTriangle(node.leftNode, point);
      splitTriangle(node.rightNode, point);
      return;

      //to the left of L0-L1
    } else if (check.left(node.L[0], node.L[1], point)) {
      splitTriangle(node.leftNode, point);
      return;

      //to the right of L0-L1
    } else if (check.right(node.L[0], node.L[1], point)){
      splitTriangle(node.rightNode, point);
      return;
    }
  } else if (node instanceof TernaryNode) {

      //in the middle area
    if (check.right(node.Q[0], node.Q[2], point) && check.left(node.Q[0], node.Q[1], point)) {
      splitTriangle(node.middleNode, point);
      return;

      //in the right area
    } else if(check.left(node.Q[0], node.Q[2], point) && check.right(node.Q[0], node.Q[3], point)) {
      splitTriangle(node.rightNode, point);
      return;

      //in the left area
    } else if (check.left(node.Q[0], node.Q[3], point) && check.right(node.Q[0], node.Q[1], point)) {
      splitTriangle(node.leftNode, point);
      return;

      //on the line Q0-Q3
    } else if (check.on(node.Q[0], node.Q[3], point)) {
      splitTriangle(node.rightNode, point);
      splitTriangle(node.leftNode, point);
      return;

      //on the line Q0-Q1
    } else if (check.on(node.Q[0], node.Q[1], point)) {
      splitTriangle(node.leftNode, point);
      splitTriangle(node.middleNode, point);
      return;

      //on the line Q0-Q2
    } else if (check.on(node.Q[0], node.Q[2], point)) {
      splitTriangle(node.middleNode, point);
      splitTriangle(node.rightNode, point);
      return;
    }
  }
}

function colorTriangle(node) {

  //check for match
  if (node instanceof Leaf) {
    if (mouseClick.left(node.triangle.v[0], node.triangle.v[1], mouseClick) &&
    mouseClick.left(node.triangle.v[1], node.triangle.v[2], mouseClick) &&
    mouseClick.left(node.triangle.v[2], node.triangle.v[0], mouseClick)) {
      gl.clearColor(0.8, 1, 1, 1.0 );
      triangleToColor = [vec2(node.triangle.v[0].x/100,node.triangle.v[0].y/100),
                        vec2(node.triangle.v[1].x/100,node.triangle.v[1].y/100),
                        vec2(node.triangle.v[2].x/100,node.triangle.v[2].y/100)];
      return;
    } else {
      //no triangle match, set the background color of the canvas to red
      gl.clearColor(1, 0.8, 0.8, 1.0 );
      triangleToColor = null;
    }

    //continue the search
  } else if (node instanceof TernaryNode) {
    if (mouseClick.right(node.Q[0], node.Q[2], mouseClick) && mouseClick.left(node.Q[0], node.Q[1], mouseClick)) {
      colorTriangle(node.middleNode);
    } else if(mouseClick.left(node.Q[0], node.Q[2], mouseClick) && mouseClick.right(node.Q[0], node.Q[3], mouseClick)) {
      colorTriangle(node.rightNode);
    } else if (mouseClick.left(node.Q[0], node.Q[3], mouseClick) && mouseClick.right(node.Q[0], node.Q[1], mouseClick)) {
      colorTriangle(node.leftNode);
    }
  } else if (node instanceof BinaryNode){
    if(mouseClick.left(node.L[0], node.L[1], mouseClick)) {
      colorTriangle(node.leftNode);
    } else if (mouseClick.right(node.L[0], node.L[1], mouseClick)){
      colorTriangle(node.rightNode);
    }
  }
}

/*______________________________________________________________________________
                          HELPER FUNCTIONS*/

//shuffle the elements of an array
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    //calculate a random index
    var j = Math.floor(Math.random() * (i + 1.0));
    //swap place of two elements
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//convert the array of vertices to an array of vec2
function verticesToVec(v) {
  var temp = [];
  for (i=0; i<= v.length-1; i++) {
    temp.push(vec2(v[i].x/100, v[i].y/100));
  }
  return temp;
}

//convert the vertices of triangles to vec2
function trianglesToVec(c) {
  var temp = [];
  for (i=0; i<= c.length-1; i++) {
    temp.push([vec2(c[i].v[0].x/100, c[i].v[0].y/100),
              vec2(c[i].v[1].x/100, c[i].v[1].y/100),
              vec2(c[i].v[2].x/100, c[i].v[2].y/100)])
  }
  return temp;
}

//calculate the vertices not part of the convex hull
function verticesCalc(v, c) {
  var temp = [];
  var flag = true;
  for(i = 0; i<= v.length; i++) {
    for(j = 0; j <= c.length; j++) {
      if (v[i] == c[j]) {
        flag = false;
      }
    }
    if (flag) {
      temp.push(v[i]);
    }
    flag = true;
  }
  return temp;
}

//check if the mouseclick is inside of the webgl canvas
function mouseClickInside() {
  if (mouseClick.x > 100  || mouseClick.x < -100 || mouseClick.y > 100 || mouseClick.y < -100) {
    return false;
  } else {
    return true;
  }
}

//clear the variables for the next trianglesoup to be calculated
function clearVariables() {
  rootNode = [];
  vertices = [];
  convexH = [];
  soup = [];
  triangles = [];
  verticesToRender = [];
  convexHullToRender = [];
  fanToRender = [];
  trianglesToRender = [];
  triangleSoupToRender =  [];
  verticesInsideOfConvexH = [];
  triangleToColor = null;
}

//get mouse position on canvas, returned in html coordinates
function getMousePosition(event, canvas) {
  var rect = canvas.getBoundingClientRect();
  var posX =  event.clientX - rect.left;
  var posY = event.clientY - rect.top;
  posX = posX  * canvas.width  / canvas.clientWidth;
  posY = posY * canvas.height / canvas.clientHeight;
  return [posX, posY];
}

//event listener for the mouse click
window.addEventListener("click", ev => {
  const pos = getMousePosition(ev, gl.canvas);
  // convert to webgl coordinates
  var x = (pos[0] / gl.canvas.width  *  2 - 1) * 100;
  var y = (pos[1] / gl.canvas.height * -2 + 1) * 100;
  mouseClick.setCoordinates(x,y);
  requestAnimFrame(init);
});

window.onload = init;
