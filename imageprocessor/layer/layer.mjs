import Memento from "../memento/memento.mjs";

function clamp(value) {
    return Math.max(0, Math.min(Math.floor(value), 255))
}

class Layers {
    constructor() {
        if (!Layers.instance) {
            Layers.instance = this;
        }
        this.layers = [];
        return Layers.instance;
    }

    get() {
        return this;
    }

    getLayers() {
        return this.layers
    }

    createMemento() {
        var a = this.layers.slice().map(i=>({
            ...i,
            fn: i.fn.bind(i)
        }))
        return new Memento(a)
    }

    restoreFromMemento(memento) {
        this.layers = memento.state.slice().map(i=>({
            ...i,
            fn:i.fn.bind(i)
        }));
    }

    add(type,...args) {
        switch(type) {
            case "grayscale":
                this.layers.push({
                    type:'grayscale',
                    fn:this.grayscale
                })
                break;
            case "brightness":
                this.layers.push({
                    type:"brightness",
                    fn:this.brightness(args[0])
                });
                break;
            case "inverse":
                this.layers.push({
                    type:'inverse',
                    fn:this.inverse
                });
                break;
            case "image":
                this.layers.push({
                    type:'image',
                    opts:args[0],
                    fn:this.image(args[1])
                });
                break;
            case 'selection':
                const index = this.layers.findIndex(({type})=>type=='selection');
                if(index != -1) {
                    this.layers[index] = {
                        type:'selection',
                        opts:args[0],
                        fn:this.selection(args[1],args[2])
                    }
                } else {
                    this.layers.push({
                        type:'selection',
                        opts:args[0],
                        fn:this.selection(args[1],args[2])
                    })
                }
        }
    }

    grayscale(data) {
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
    }

    brightness(value) {
        return (data) => {
            for (var i = 0; i < data.length; i += 4) {
                data[i] = clamp(data[i] + value);
                data[i + 1] = clamp(data[i + 1] + value);
                data[i + 2] = clamp(data[i + 2] + value);
            }
        }
    }

    inverse(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];         // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
            // data[i + 3] = data[i + 3];    // alpha (transparency)
          }
    }

    image(image) {
        return () => {
           return image
        }
    }

    selection(canvas,ccanvas) {
        return () => {
            return {canvas,ccanvas}
        }
    }
}

export default new Layers();