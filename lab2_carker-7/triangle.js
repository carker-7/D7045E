class Triangle {
  constructor(a, b, c) {
    this.v = [a, b, c];
    this.leaf = null;
  }
  setLeaf(l) {
    this.leaf = l;
  }
}
