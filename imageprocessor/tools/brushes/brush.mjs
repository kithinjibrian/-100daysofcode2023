import Pubsub from "../../pubsub/pubsub.mjs"

class Dim{
    constructor() {
        this.index = 0
        this.dim = [[]]
    }

    push(dim) {
        if(this.dim[this.index] === undefined) {
            this.dim[this.index] = [dim]
        } else {
            this.dim[this.index].push(dim)
        }
    }

    next() {
        this.index += 1;
    }

    getDim() {
        return [...this.dim];
    }
}

export default class Brush {
    constructor() {
        this.pubsub = Pubsub.get();
        this.isMouseDown = false;
        this.isBrushSelected = false;
        this.dim = new Dim();
    }

    setBrushSelection(selected) {
        this.isBrushSelected = selected;
    }

    listen() {
        const self = this;
        self.pubsub.subscribe("brushselected", (e) => {
            self.pubsub.subscribe("mousedown", (e1) => {
                self.isMouseDown = true;
                self.dim.push({
                    x: e1.offsetX,
                    y: e1.offsetY
                })
            })
            self.pubsub.subscribe("mouseup", (e1) => {
                self.isMouseDown = false;
                self.dim.next();
                self.pubsub.publish("brushdrawn", self.dim.getDim());
            })
            self.pubsub.subscribe("mousemove", (e1) => {
                if(!self.isMouseDown || !self.isBrushSelected) return;
                self.dim.push({
                    x: e1.offsetX,
                    y: e1.offsetY
                })
                self.pubsub.publish("drawbrush", self.dim.getDim())
            })
        })
        return this;
    }
}