

class InnerNode extends Node {

  constructor() {
    super();
    this.L = [];
  }

  add(node) {
    this.L.push(node);
  }

  draw() {
    for (var i = 0; i < this.L.length; i++) {
      this.L[i].draw();
    }
  }

  update(transform) {
    for (var i = 0; i < this.L.length; i++) {
      this.L[i].update(transform);
    }
  }

}
