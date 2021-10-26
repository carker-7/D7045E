
var canvas, gl;
var greenCube, pinkCylinder, pinkCylinder1, purpleCone, blueSphere, floor;
var meshCube, meshSphere, meshCylinder, meshCone, meshFloor;
var blueMaterial, greenMaterial, yellowMaterial, pinkMaterial, purpleMaterial, floorMaterial;
var normalTransform, cubeTransform, sphereTransform, cylinderTransform, cylinderTransform1, coneTransform, floorTransform;
var camera, shader, fragmentShader, vertexShader, lightSource, rootInnerNode, cubeInnerNode;
var blue = vec4(0,1, 1, 1.0);
var lightBlue = vec4(0.3, 1, 1, 1.0);
var green = vec4(0.0, 1.0, 0.0, 1.0);
var yellow = vec4(1, 1, 0.8, 1.0);
var pink = vec4(1, 0.4, 0.7, 1.0);
var purple = vec4(0.5, 0.3, 0.9, 1.0);
var white = vec4(1,1,1,1)


function init() {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");

  if (!gl) {alert("WebGL isn't available");}

  //webgl configurations
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor(0.8, 1, 1, 1.0 );

  gl.enable(gl.DEPTH_TEST);

  initShaders();

  camera = new Camera(gl, shader.getProgram());
  lightSource = new LightSource(gl, shader, white, vec4(0, 5, 1, 1.0));

  initTransforms();
  initMeshes();
  initMaterials();
  innitGeometryNodes();

  cubeInnerNode = new InnerNode();
  cubeInnerNode.add(blueSphere);
  cubeInnerNode.add(purpleCone);
  cubeInnerNode.add(greenCube);

  rootInnerNode = new InnerNode();
  rootInnerNode.add(cubeInnerNode);
  rootInnerNode.add(pinkCylinder);
  rootInnerNode.add(pinkCylinder1);
  rootInnerNode.add(floor);

  render();

  checkButtonClick();
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  shader.activate();
  camera.update();
  lightSource.activate();

  rootInnerNode.draw();
}

function initTransforms() {
  normalTransform = mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
  cubeTransform = mat4(1,0,0,0.5, 0,1,0,-1.38, 0,0,1,2, 0,0,0,1);
  cylinderTransform1 = mat4(1,0,0,3.5, 0,1,0,-1.35, 0,0,1,-2, 0,0,0,1);
  sphereTransform = mat4(1,0,0,0.5, 0,1,0,0.1, 0,0,1,2, 0,0,0,1);
  cylinderTransform = mat4(1,0,0,-2.5, 0,1,0,-1.35, 0,0,1,-2, 0,0,0,1);
  coneTransform = mat4(1,0,0,0.5, 0,1,0,1.65, 0,0,1,2, 0,0,0,1);
  floorTransform = mat4(1,0,0,0, 0,1,0,-2, 0,0,1,0, 0,0,0,1);
}

function initShaders() {
  fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "fragment-shader");
  vertexShader = new Shader(gl, gl.VERTEX_SHADER, "vertex-shader");
  shader = new ShaderProgram(gl, vertexShader.getShader(), fragmentShader.getShader());
  shader.activate();
}

function initMeshes() {
  meshCube = new MeshCube(gl, shader.getProgram(), 0.5);
  meshSphere = new MeshSphere(gl, 3, shader.getProgram());
  meshCylinder = new MeshCylinder(gl, 40, 0.6, 0.6, shader.getProgram());
  meshCone = new MeshCone(gl, 40, 0.6, 0.6, shader.getProgram());
  meshFloor = new MeshFloor(gl, shader.getProgram());
}

function initMaterials() {
  blueMaterial = new ADSMaterial(gl, blue, shader, lightSource);
  greenMaterial = new ADSMaterial(gl, green, shader, lightSource);
  yellowMaterial = new ADSMaterial(gl, yellow, shader, lightSource);
  pinkMaterial = new ADSMaterial(gl, pink, shader, lightSource);
  purpleMaterial = new ADSMaterial(gl, purple, shader, lightSource);
  floorMaterial = new FloorMaterial(gl, blue, lightBlue, shader, lightSource);
}

function innitGeometryNodes() {
  greenCube = new GeometryNode(gl, meshCube, greenMaterial, cubeTransform);
  blueSphere = new GeometryNode(gl, meshSphere, blueMaterial, sphereTransform);
  pinkCylinder = new GeometryNode(gl, meshCylinder, pinkMaterial, cylinderTransform);
  pinkCylinder1 = new GeometryNode(gl, meshCylinder, pinkMaterial, cylinderTransform1);
  purpleCone = new GeometryNode(gl, meshCone, purpleMaterial, coneTransform);
  floor = new GeometryNode(gl, meshFloor, floorMaterial, floorTransform);
}

function checkButtonClick() {
  document.getElementById("greenCube").onclick = function() {
    cubeInnerNode.update(mat4(Math.cos(-0.1),0,Math.sin(-0.1),0,0,1,0,0,-Math.sin(-0.1),0,Math.cos(-0.1),0,0,0,0,1));
    render();
  };

  document.getElementById("pinkCylinder").onclick = function() {
    pinkCylinder.update(mat4(Math.cos(-0.1),0,Math.sin(-0.1),0,0,1,0,0,-Math.sin(-0.1),0,Math.cos(-0.1),0,0,0,0,1));
    render();
  };

  document.getElementById("greenCube1").onclick = function() {
    cubeInnerNode.update(mat4(Math.cos(0.1),0,Math.sin(0.1),0,0,1,0,0,-Math.sin(0.1),0,Math.cos(0.1),0,0,0,0,1));
    render();
  };

  document.getElementById("pinkCylinder1").onclick = function() {
    pinkCylinder.update(mat4(Math.cos(0.1),0,Math.sin(0.1),0,0,1,0,0,-Math.sin(0.1),0,Math.cos(0.1),0,0,0,0,1));
    render();
  };
}

window.addEventListener('keydown', function(event) {
    //move forward, increase y
    if(event.keyCode == 87) { //W
      camera.tMatrixUpdate(mat4(1,0,0,0, 0,1,0,0, 0,0,1,0.2, 0,0,0,1))

    //move left, decrease x
    } else if(event.keyCode == 65) { //A
      camera.tMatrixUpdate(mat4(1,0,0,0.1, 0,1,0,0, 0,0,1,0, 0,0,0,1))

    //move backward, decrease y
    } else if(event.keyCode == 83) { //S
      camera.tMatrixUpdate(mat4(1,0,0,0, 0,1,0,0, 0,0,1,-0.2, 0,0,0,1))
      //camera.setAtX(0.1);

    //move right, increase x
    } else if(event.keyCode == 68) { //D
      camera.tMatrixUpdate(mat4(1,0,0,-0.1, 0,1,0,0, 0,0,1,0, 0,0,0,1))

    //look left
    } else if(event.keyCode == 81) { //Q
      camera.setAtX(-0.2)

    //look right
    } else if(event.keyCode == 69) { //E
      camera.setAtX(0.2)

    //look up
    } else if(event.keyCode == 82) { //R
      camera.setAtY(0.2)

    //look down
    } else if(event.keyCode == 70) { //F
      camera.setAtY(-0.2)
    }
    render();
});

window.onload = init;
