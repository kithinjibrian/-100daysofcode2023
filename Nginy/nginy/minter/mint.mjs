import Circle from "../mesh/circle.mjs"
import Rectangle from "../mesh/rectangle.mjs"

class Mint {
    create(type, opts) {
        switch (type) {
            case "circle":
                return new Circle(opts);
            case "rectangle":
                return new Rectangle(opts)
        }
    }
}

export default Mint;