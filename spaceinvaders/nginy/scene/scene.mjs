import Quadtree from "../data/qtree.mjs";
import Pubsub from "../utils/pubsub/pubsub.mjs";
import Collision from "./collision.mjs";

export default class Scene {
    constructor() {
        this.entities = [];
        this.collision = new Collision();
        this.quadtree = new Quadtree({ x: 0, y: 0, height: 400, width: 400 }, 4)
        this.pubsub = Pubsub.get()
        this.alive = true
    }

    add(obj) {
        this.entities.push(obj);
    }

    addMany(array) {
        array.map(i => {
            this.entities.push(i)
        })
    }

    update() {
        if (this.alive) {
            this.quadtree.clear()
            this.entities.map(i => {
                i.update();
                this.quadtree.insert(i)
            })
            this.handleCollisions()
        }
    }

    getObjectByName(name) {
        return this.entities.filter(o => o.name == name)
    }

    removeObjectByName(name) {
        const o = this.entities.findIndex(o => o.name == name)
        this.entities.splice(o, 1);
    }

    removeObjectById(id) {
        const o = this.entities.findIndex(o => o.id == id)
        this.entities.splice(o, 1);
    }

    handleCollisions() {
        for (let i = 0; i < this.entities.length; ++i) {
            const collidedObjects = this.quadtree.query(this.entities[i]);
            for (let j = 0; j < collidedObjects.length; j++) {
                const collidedObject = collidedObjects[j];
                if (this.entities !== undefined && collidedObject !== undefined && collidedObject["id"] !== this.entities[i]['id']) {
                    const bool = this.collision.checkCollision(this.entities[i], collidedObject);
                    if (bool) {
                        this.pubsub.publish("collision", this.entities[i], collidedObject)
                    }
                }
            }
        }
    }

    destory() {
        this.entities = [];
        this.alive = false;
    }
}