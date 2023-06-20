import layer from "../layer/layer.mjs";

class Caretaker {
    constructor() {
        if (!Caretaker.instance) {
            Caretaker.instance = this;
        }
        this.mementos = [];
        this.index = -1;
        return Caretaker.instance;
    }

    get() {
        return this;
    }

    getMementos() {
        return this.mementos;
    }

    saveMemento(originator) {
        if(this.index != -1) {
           this.mementos.splice(this.index + 1,this.mementos.length);
        }
        this.index = -1;
        this.mementos.push(originator.createMemento());  
    }

    restoreMemento(index) {
        this.index = index;
        const memento = this.mementos[index];
        const originator = layer.get();
        originator.restoreFromMemento(memento);
        return originator;
    }
}

export default new Caretaker();