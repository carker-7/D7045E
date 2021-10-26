//set of vertices
function vertices1() {
  ver1 = new Vertex(-20, -20);
  ver2 = new Vertex(60, 40);
  ver3 = new Vertex(30, -60);
  ver4 = new Vertex(-20, 20);
  ver5 = new Vertex(-50, -40);
  ver6 = new Vertex(-60, 20);
  ver7 = new Vertex(-10, 70);
  ver8 = new Vertex(40, 10);
  ver9 = new Vertex(-10, -40);
  ver10 = new Vertex(70, 10);
}

//set of vertices
function vertices2() {
  ver1.setCoordinates(40, -30);
  ver2.setCoordinates(60, 30);
  ver3.setCoordinates(-70, -30);
  ver4.setCoordinates(10, -10);
  ver5.setCoordinates(10, -40);
  ver6.setCoordinates(-10, 10);
  ver7.setCoordinates(-30, 50);
  ver8.setCoordinates(-70, 10);
  ver9.setCoordinates(-70, 30);
  ver10.setCoordinates(-20, -70);
}

//set of vertices
function vertices3() {
  ver1.setCoordinates(-40,-30);
  ver2.setCoordinates(60,40);
  ver3.setCoordinates(30, 30);
  ver4.setCoordinates(-30, 50);
  ver5.setCoordinates(-50, 80);
  ver6.setCoordinates(-40, 40);
  ver7.setCoordinates(-10, 70);
  ver8.setCoordinates(70, -10);
  ver9.setCoordinates(70, -30);
  ver10.setCoordinates(-20, 0);
}

//random vertices
function vertices4() {
  var temp = [];
  var xList = [0,10,20,30,40,50,60,70,-10,-20,-30,-40,-50,-60,-70];
  var yList = [0,10,20,30,40,50,60,70,-10,-20,-30,-40,-50,-60,-70];
  var max = xList.length;
  for(i = 0; i <10; i++) {
    var xIndex = Math.floor(Math.random() * max)
    var yIndex = Math.floor(Math.random() * max)
    temp[i] = new Vertex(xList[xIndex], yList[yIndex]);
    //avoid duplicete vertices
    xList.splice(xIndex, 1);
    yList.splice(yIndex, 1);
    max = xList.length;
  }
  ver1 = temp[0];
  ver2 = temp[1];
  ver3 = temp[2];
  ver4 = temp[3];
  ver5 = temp[4];
  ver6 = temp[5];
  ver7 = temp[6];
  ver8 = temp[7];
  ver9 = temp[8];
  ver10 = temp[9];
}
