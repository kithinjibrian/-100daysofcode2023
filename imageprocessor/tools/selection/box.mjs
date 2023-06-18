import Pubsub from "../../pubsub/pubsub.mjs"

class Box {
    constructor() {
        if (!Box.instance) {
            Box.instance = this;
        }
        this.pubsub = Pubsub.get();
        this.isMouseDown = false;
        this.hasDrawn = false;
        this.isBoxSelected = false;
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

    setCanvas(canvas) {
        this.canvas = canvas;
        return this;
    }

    setBoxSelection(bool) {
        this.isBoxSelected = bool
    }

    listen() {
        const self = this;
        self.pubsub.subscribe("boxselected", (e) => {
            self.pubsub.subscribe("mousedown", (e1) => {
                if (!self.hasDrawn) {
                    self.isMouseDown = true;
                    self.dim.x = e1.offsetX;
                    self.dim.y = e1.offsetY;
                } else {
                    self.pubsub.publish("drawbox", {})
                }

            });
            self.pubsub.subscribe("mouseup", (e1) => {
                self.isMouseDown = false;
                self.hasDrawn = !self.hasDrawn;
                if(self.hasDrawn) {
                    self.pubsub.publish("drawn", self.dim);
                }
            })
            self.pubsub.subscribe("mousemove", (e2) => {
                if (self.isMouseDown && self.isBoxSelected) {
                    self.dim.x2 = e2.offsetX;
                    self.dim.y2 = e2.offsetY;
                    self.pubsub.publish("drawbox", self.dim)
                } else {
                    return;
                }
            })
        });
        return this;
    }
}

export default new Box()