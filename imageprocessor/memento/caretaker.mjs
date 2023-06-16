import layer from "../layer/layer.mjs";

export default class Caretaker {
    constructor() {
        this.mementos = [];
    }

    saveMemento(originator) {
        this.mementos.push(originator.createMemento());
    }

    restoreMemento(index) {
        const memento = this.mementos[index];
        const originator = layer.get();
        originator.restoreFromMemento(memento);
        return originator;
    }
}