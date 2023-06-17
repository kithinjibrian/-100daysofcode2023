class BoxSelect {
    constructor() {
        if (!BoxSelect.instance) {
            BoxSelect.instance = this;
        }
        this.x = null;
        this.y = null;
        this.x2 = null;
        this.y2 = null;
        this.canvas = null;
        this.ctx = null;
        this.ownCanvas = document.createElement("canvas");
        this.ownCtx = this.ownCanvas.getContext("2d")
        this.isMouseDown = false
        this.on = false
        this.ccanvas = 90
        return BoxSelect.instance;
    }

    get() {
        return this;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ownCanvas.width = canvas.width;
        this.ownCanvas.height = canvas.height;
        return this;
    }

    setOn(bool) {
        this.on = bool;
    }

    listen(cb) {
        const self = this;
        this.canvas.addEventListener("mousedown", this.mousedown(self), false)
        this.canvas.addEventListener("mouseup", this.mouseup(self), false)
        if(this.on) {
           this.canvas.addEventListener("mousemove", this.mousemove(self,cb), false) 
        }
    }

    mousedown(self) {
        return (e) => {
            self.isMouseDown = true;
            self.on = self.on ? false : self.on;
            self.x = e.offsetX
            self.y = e.offsetY
            const d = document.createElement("canvas")
            const dctx = d.getContext("2d")
            d.width = self.canvas.width;
            d.height = self.canvas.height;
            dctx.drawImage(self.canvas,0,0);
            self.ccanvas = d
        }

    }
    mouseup(self) {
        return e => {
            self.isMouseDown = false
        }

    }
    mousemove(self,cb) {
        return e => {
            if (!self.isMouseDown) return;
            self.x2 = e.offsetX;
            self.y2 = e.offsetY;
            self.ownCtx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.ownCtx.strokeStyle = 'red';
            self.ownCtx.lineWidth = 2;
            self.ownCtx.strokeRect(self.x, self.y, self.x2 - self.x, self.y2 - self.y);
            cb(self.ownCanvas,self.ccanvas)
        }

    }
}

export default new BoxSelect()