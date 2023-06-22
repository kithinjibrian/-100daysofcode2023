import Pubsub from "../pubsub/pubsub.mjs"

class Listen{
    constructor() {
        if (!Listen.instance) {
            Listen.instance = this;
        }
        this.pubsub = Pubsub.get();
        return Listen.instance;
    }

    get() {
        return this;
    }

    listen({mouseup,mousedown,mousemove}) {
        this.pubsub.unsubcribe("mousemove")
        this.pubsub.unsubcribe("mousedown")
        this.pubsub.unsubcribe("mouseup")
        this.pubsub.subscribe("mousedown",(e)=>{
            mousedown({
                x:e.offsetX,
                y:e.offsetY
            })
        })
        this.pubsub.subscribe("mouseup",(e)=>{
            mouseup({
                x:e.offsetX,
                y:e.offsetY
            })
        })
        this.pubsub.subscribe("mousemove",(e)=>{
            mousemove({
                x:e.offsetX,
                y:e.offsetY
            })
        })
    }
}

export default new Listen();