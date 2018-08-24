class Point {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

const PointFactory = (x, y) => new Point({ x, y });

export {
  Point,
};

export default PointFactory;
