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
        //internal canvas
        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d");
        //before canvas box draw
        this.$canvas = null
        //box dim
        this.dim = {
            x:0,
            y:0,
            x2:0,
            y2:0
        }
        return Box.instance;
    }

    get() {
        return this;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this._canvas.width = canvas.width;
        this._canvas.height = canvas.height;
        return this;
    }

    setBoxSelection(bool) {
        this.isBoxSelected = bool
    }

    listen() {
        const self = this;
        self.pubsub.subscribe("boxselected", (e) => {
            self.pubsub.subscribe("mousedown", (e1) => {
                if(self.hasDrawn) {
                    self.hasDrawn = false;
                }
                self.isMouseDown = true;
                self.dim.x = e1.offsetX;
                self.dim.y = e1.offsetY;
                self.$canvas = self.canvasBeforeDraw(this.canvas);
            });
            self.pubsub.subscribe("mouseup", (e1) => {
                if(self.isMouseDown) {
                    self.isMouseDown = false
                    self.hasDrawn = true;
                    self.pubsub.publish("finished",self.hasDrawn)
                }
            })
            self.pubsub.subscribe("mousemove", (e2) => {
                if (self.isMouseDown && self.isBoxSelected) {
                    self.dim.x2 = e2.offsetX;
                    self.dim.y2 = e2.offsetY;
                    self.pubsub.publish("drawingbox",self.dim)
                } else {
                    return;
                }
            })
        });
        return this;
    }

    canvasBeforeDraw(cnvs) {
        //copy the canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = cnvs.width;
        canvas.height = cnvs.height;
        ctx.drawImage(cnvs,0,0);
        return canvas;
    }

    draw() {
        this._ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        this._ctx.strokeStyle = 'red';
        this._ctx.lineWidth = 2;
        this._ctx.strokeRect(this.dim.x, this.dim.y, this.dim.x2 - this.dim.x, this.dim.y2 - this.dim.y);
        return this._canvas;
    }
}

export default new Box()