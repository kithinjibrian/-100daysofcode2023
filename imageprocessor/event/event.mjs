import Pubsub from "../pubsub/pubsub.mjs"

export default class Event {
    constructor(canvas) {
        this.canvas = canvas;
        this.pubsub = Pubsub.get();
    }

    listen() {
        this.canvas.addEventListener("mouseup", (e) => {
            this.pubsub.publish("mouseup", e);
        }, false)
        this.canvas.addEventListener("mousedown", (e) => {
            this.pubsub.publish("mousedown", e);
        }, false)
        this.canvas.addEventListener("mousemove", (e) => {
            this.pubsub.publish("mousemove", e);
        }, false);
        return this;
    }
}