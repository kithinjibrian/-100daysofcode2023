import Base from "./base.mjs";

class Circle extends Base {
    constructor(opts) {
        super(opts);
        //default options
        const def = {
            color:"red",
            radius:10,
        };
        //override default options
        Object.assign(def,opts);
        //stroke color
        this.color = def.color;
        //radius
        this.radius = def.radius;
        //type of body
        this.type = "circle";
    }
}

export default Circle;