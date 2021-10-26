class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  area(a, b, c) {
    return (b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);
  }
  left(a, b, c) {
    return this.area(a, b, c) > 0.0;
  }
  right(a, b, c) {
    return this.area(a, b, c) < 0.0;
  }
  on(a, b, c) {
    return this.area(a, b, c) == 0.0;
  }
  setCoordinates(x,y) {
    this.x = x;
    this.y = y;
  }
}
