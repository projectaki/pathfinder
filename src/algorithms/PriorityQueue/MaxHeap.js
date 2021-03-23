export default class MaxPQ {
    constructor() {
        this._heap = [];
        this._N = 0;
    }

    insert(value) {
        this._heap[++this._N] = value;
        this._swim(this._N);
    }

    pop() {
        if(this._N === 0) {console.log("Queue is empty!"); return null;}
        let max = this._heap[1];
        this._swap(1, this._N--);
        this._sink(1);
        this._heap[this._N + 1] = null;
        return max;
    }

    peek() {
        return this._heap[1];
    }

    _swim(index) {
        
        while (index > 1 && this._smaller(Math.floor(index/2), index)) {
            this._swap(index, Math.floor(index/2));
            index = Math.floor(index/2);
        }
    }

    _sink(index) {
        while(2*index <= this._N) {
            let indexchild = 2*index;
            if(indexchild < this._N && this._smaller(indexchild, indexchild + 1)) indexchild++;
            if(!this._smaller(index, indexchild)) break;
            this._swap(index, indexchild);
            index = indexchild; 
        }
    }

    _smaller(i, j) {
        return this._heap[i] < this._heap[j];
    }

    _swap(i, j) {
        
        const temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    }

}
