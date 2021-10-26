class BinaryNode {
  constructor() {
    this.parent = null;
    this.leftNode = null;
    this.rightNode = null;
    this.L = [];
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
  setL(l) {
    this.L = l;
  }
}
