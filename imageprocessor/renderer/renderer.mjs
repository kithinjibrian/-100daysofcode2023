import Layers from "../layer/layer.mjs";

export default class Renderer{
    constructor(opts) {
        const def = {
            canvasWidth: "400",
            canvasHeight: "400"
        };

        Object.assign(def, opts);

        this.canvas = canvas;
        this.canvas.width = def.canvasWidth;
        this.canvas.height = def.canvasHeight;

        this.ctx = this.canvas.getContext("2d");
        this.layers = Layers.get();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const a = this.layers.getLayers()
        a.map(i=>{
            switch(i.type) {
                case "image":
                    this.ctx.globalCompositeOperation = i.opts.blendMode;
                    this.ctx.drawImage(i.fn(),0,0)
                    break;
                case "selection":
                    this.ctx.globalCompositeOperation = i.opts.blendMode;
                    this.ctx.strokeStyle = "red";
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(0,0,50,50)
                    break;
                default:
                    var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    var data = imageData.data;
                    i.fn(data)
                    this.ctx.putImageData(imageData, 0, 0);
                    break;
            }
        })
    }
}

/* globalCompositeOperation :
  normal | multiply | screen | overlay | 
  darken | lighten | color-dodge | color-burn | hard-light | 
  soft-light | difference | exclusion | hue | saturation | 
  color | luminosity
*/