import Base from "./base.mjs";

class Rectangle extends Base {
    constructor(opts) {
        super(opts);
        //default options
        const def = {
            color: "red",
            width: 10,
            height: 10
        };
        //override default options
        Object.assign(def, opts);
        //stroke color
        this.color = def.color;
        //width
        this.width = def.width;
        //heigth
        this.height = def.height;
        //type of body
        this.type = "rectangle";
    }
}

export default Rectangle;