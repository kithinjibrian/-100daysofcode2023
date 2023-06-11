export default class Vector {
  constructor({ x, y }) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static fromAngle(angle) {
    var angleRad = angle * (Math.PI / 180);
    var x = Math.cos(angleRad);
    var y = Math.sin(angleRad);
    return new Vector({ x, y })
  }

  add(v) {
    return new Vector({ x: this.x + v.x, y: this.y + v.y });
  }

  subtract(v) {
    return new Vector({ x: this.x - v.x, y: this.y - v.y });
  }

  multiply(scalar) {
    return new Vector({ x: this.x * scalar, y: this.y * scalar });
  }

  divide(scalar) {
    return new Vector({ x: this.x / scalar, y: this.y / scalar });
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const mag = this.magnitude();
    return new Vector({ x: this.x / mag, y: this.y / mag });
  }

  normal() {
    return new Vector({ x: this.y, y: -this.x });
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  equals(v) {
    return this.x === v.x && this.y === v.y;
  }
}
