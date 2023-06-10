export default class Renderer {
    constructor(canvas,opts) {
        const def = {
            canvasWidth:"400",
            canvasHeight:"400"
        };

        Object.assign(def,opts);

        this.canvas = canvas;
        this.canvas.width = def.canvasWidth;
        this.canvas.height = def.canvasHeight;

        this.ctx = this.canvas.getContext("2d");
    }

    circle(o) {
        this.ctx.save();
        this.ctx.translate(o.pos.x,o.pos.y);
        this.ctx.beginPath();
        this.ctx.fillStyle=o.color;
        this.ctx.arc(0,0,o.radius,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    rectangle(o) {
        this.ctx.save();
        this.ctx.translate(o.pos.x,o.pos.y);
        this.ctx.beginPath();
        this.ctx.fillStyle=o.color;
        this.ctx.rect(0,0,o.width,o.height);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    render(scene) {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        scene.entities.map(i=>{
            switch(i.type) {
                case "circle":
                    this.circle(i);
                    break;
                case "rectangle":
                    this.rectangle(i);
                    break;
            }
        })
    }
}