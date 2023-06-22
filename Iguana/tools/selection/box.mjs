import Pubsub from "../../pubsub/pubsub.mjs"
import Listen from "../listen.mjs";

class Box {
    constructor() {
        if (!Box.instance) {
            Box.instance = this;
        }
        this.pubsub = Pubsub.get();
        this.isMouseDown = false;
        this.isBoxSelected = false;
        this._listen = Listen.get()
        //box dim
        this.dim = {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0
        }
        return Box.instance;
    }

    get() {
        return this;
    }

    setBoxSelection(bool) {
        this.isBoxSelected = bool
    }

    listen() {
        const self = this;
        console.log(self)
        this._listen.listen({
            mousedown: (e) => {
                self.isMouseDown = true;
                self.dim = e
            },
            mouseup: () => {
                self.isMouseDown = false;
                self.pubsub.publish("drawn", self.dim);
            },
            mousemove: (e) => {
                if(!self.isMouseDown || !self.isBoxSelected) return;
                self.dim.x2 = e.x;
                self.dim.y2 = e.y;
                self.pubsub.publish("drawbox",self.dim)
            },
        })
    }
}

export default new Box()