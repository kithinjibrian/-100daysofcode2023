import Pubsub from "../pubsub/pubsub.mjs";

class Event {
    constructor() {
        this.pubsub = Pubsub.get();
    }
    listen () {
        document.addEventListener("keydown",(event)=>{
            this.pubsub.publish("keydown",event);
        },false);

        document.addEventListener("keyup",(event)=>{
            this.pubsub.publish("keyup",event)
        },false);
        
    }
}

export default Event;