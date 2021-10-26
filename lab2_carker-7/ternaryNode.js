class TernaryNode{
  constructor() {
    this.parent = null;
    this.leftNode = null;
    this.rightNode = null;
    this.middleNode = null;
    this.Q = [];
  }
  setParent(par) {
    this.parent = par;
  }
  setLeftNode(left) {
    this.leftNode = left;
  }
  setRightNode(right) {
    this.rightNode = right;
  }
  setMiddleNode(middle) {
    this.middleNode = middle;
  }
  setQ(q) {
    this.Q = q;
  }
}
