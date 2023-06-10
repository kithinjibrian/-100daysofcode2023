export default class Quadtree {
    constructor(bounds, capacity = 4) {
      // The bounds of the quadtree node
      this.bounds = new Bounds(bounds.x,bounds.y,bounds.width,bounds.height);
  
      // The maximum number of objects a node can hold before splitting
      this.capacity = capacity;
  
      // The objects contained in this node
      this.objects = [];
  
      // The child nodes of this quadtree node
      this.children = [];
    }
  
    insert(object) {
      if (!this.bounds.intersects(object)) {
        // Rectangle does not intersect with the bounds of this node
        return false;
      }
  
      if (this.objects.length < this.capacity) {
        // Add the rectangle to this node if there is capacity
        this.objects.push(object);
        return true;
      }
  
      // Split the node if it hasn't been split already
      if (this.children.length === 0) {
        this.split();
      }
  
      // Try inserting the rectangle into the child nodes
      for (let child of this.children) {
        if (child.insert(object)) {
          return true;
        }
      }
  
      // Rectangle doesn't fit entirely within a child node (rare case)
      this.objects.push(entity);
      return true;
    }
  
    query(range, found = []) {
      if (!this.bounds.intersects(range)) {
        // No intersection with the query range
        return found;
      }
  
      for (let object of this.objects) {
        if (this.bounds.intersects(object)) {
          // Rectangle intersects with the query range
          found.push(object);
        }
      }
  
      // Recursively search the child nodes
      for (let child of this.children) {
        found = child.query(range, found);
      }
  
      return found;
    }
  
    split() {
      const { x, y, width, height } = this.bounds;
      const subWidth = width / 2;
      const subHeight = height / 2;
  
      // Create child nodes in top-left, top-right, bottom-left, and bottom-right quadrants
      this.children.push(new Quadtree(new Bounds(x, y, subWidth, subHeight), this.capacity));
      this.children.push(new Quadtree(new Bounds(x + subWidth, y, subWidth, subHeight), this.capacity));
      this.children.push(new Quadtree(new Bounds(x, y + subHeight, subWidth, subHeight), this.capacity));
      this.children.push(new Quadtree(new Bounds(x + subWidth, y + subHeight, subWidth, subHeight), this.capacity));
    }

    clear() {
        this.objects = [];
        this.children = [];
    }
  }
  
  // Define the Bounds class to represent rectangles
  class Bounds {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    intersects(object) {
      return (
        this.x + this.width >= object.pos.x &&
        this.x <= object.pos.x + object.width &&
        this.y + this.height >= object.pos.y &&
        this.y <= object.pos.y + object.height
      );
    }
  }