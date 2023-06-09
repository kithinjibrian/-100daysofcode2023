class Store {
    constructor() {
        this.store = [];
    }

    async save(data) {
        if(data!==undefined) {
            this.store.push(data);
        } else {
            throw new Error("Data was not supplied");
        }
    }

    async delete(index) {
        if(index!==undefined) {
            if(index > this.store.length - 1) {
                throw new Error("Index is out of bound");
            } else {
                this.store.splice(index,1);
            }
        } else {
            throw new Error("Missing index!")
        }
        
    }

    async find(index) {
        if(index!==undefined) {
            if(index > this.store.length - 1) {
                throw new Error("Index is out of bound");
            } else {
               return this.store[index] 
            }
        } else {
            return this.store;
        }
    }

    async findOne(data) {
        if(data!==undefined) {
            return this.store.findIndex(a=>a==data)
        } else {
            throw new Error("Argument was not provided")
        }
    }
}

export default new Store()