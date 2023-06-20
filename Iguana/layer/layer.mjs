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

    setVisibility(index) {
        const a = this.layers[index]['visible'];
        this.layers[index]['visible'] = !a
    }

    removeLayerByType(type) {
        this.layers = [];
    }

    createMemento() {
        var a = this.layers.slice().map(i => ({
            ...i,
            fn: i.fn.bind(i)
        }))
        return new Memento(a)
    }

    restoreFromMemento(memento) {
        this.layers = memento.state.slice().map(i => ({
            ...i,
            fn: i.fn.bind(i)
        }));
    }

    add(type, ...args) {
        switch (type) {
            case "grayscale":
                this.layers.unshift({
                    type: 'grayscale',
                    visible: true,
                    action: "applyGrayscale",
                    fn: this.grayscale
                })
                break;
            case "brightness":
                this.layers.unshift({
                    type: "brightness",
                    visible: true,
                    action: "applyBrightness",
                    fn: this.brightness(args[0])
                });
                break;
            case "inverse":
                this.layers.unshift({
                    type: 'inverse',
                    visible: true,
                    action: "applyInverse",
                    fn: this.inverse
                });
                break;
            case "image":
                this.layers.unshift({
                    type: 'image',
                    visible: true,
                    opts: args[0],
                    action: "addImage",
                    fn: this.image(args[1])
                });
                break;
            case 'selection':
                const index = this.layers.findIndex(({ type }) => type == 'selection');
                if (index != -1) {
                    this.layers.splice(index, 1);
                }
                this.layers.unshift({
                    type: 'selection',
                    visible: true,
                    dim: { ...args[0] },
                    action: "boxSelection",
                    fn: () => console.log('orca')
                });
                break;
            case 'brush':
                const index1 = this.layers.findIndex(({ type }) => type == 'brush');
                if (index1 != -1) {
                    this.layers.splice(index1, 1);
                }
                this.layers.unshift({
                    type: 'brush',
                    visible: true,
                    dim: [...args[0]],
                    action: "brushDraw",
                    fn: () => console.log('orca')
                });
                break;
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
}

export default new Layers();