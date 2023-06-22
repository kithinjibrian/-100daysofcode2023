import Pubsub from "../../pubsub/pubsub.mjs"
import Listen from "../listen.mjs";

class Dim {
    constructor() {
        this.index = 0
        this.dim = [[]]
    }

    push(dim) {
        if (this.dim[this.index] === undefined) {
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
        this._listen = Listen.get()
        this.dim = new Dim();
    }

    set(opts) {
        const def = {
            isActive:false,
            blendMode:'normal',
            eventOn:"drawbrush",
            eventDone:"brushdrawn"
        }
        Object.assign(def,opts)
        this.isBrushSelected = def.isActive;
        this.blendMode = def.blendMode;
        this.eventOn = def.eventOn;
        this.eventDone = def.eventDone;
    }

    reset() {
        this.dim = new Dim()
    }

    listen() {
        const self = this;
        this._listen.listen({
            mousedown:(a) => {
                self.isMouseDown = true
                self.dim.push(a)
            },
            mouseup:()=>{
                self.isMouseDown = false;
                self.dim.next()
                self.pubsub.publish(this.eventDone,{
                    dim:self.dim.getDim(),
                    opts:{
                        blendMode:this.blendMode
                    }
                })
            },
            mousemove:(e) => {
                if(!self.isMouseDown || !self.isBrushSelected) return;
                self.dim.push(e)
                self.pubsub.publish(this.eventOn,{
                    dim:self.dim.getDim(),
                    opts:{
                        blendMode:this.blendMode
                    }
                })
            }
        })

        return this;
    }
}