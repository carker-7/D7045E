


class Node {

  constructor() {
    if (new.target === Node) {
      throw new Error("abstract class, cannot create instance");
    }
  }

  update() {
  }

  draw() {
  }

}
