export default class MinPQ {
    constructor() {
        this._heap = [];
        this._N = 0;
    }

    isEmpty() {
        return this._N === 0;
    }

    insert(value) {
        // if not array cast to array
        value = Array.isArray(value) ? value : [value];
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
        
        while (index > 1 && this._larger(Math.floor(index/2), index)) {
            this._swap(index, Math.floor(index/2));
            index = Math.floor(index/2);
        }
    }

    _sink(index) {
        while(2*index <= this._N) {
            let indexchild = 2*index;
            if(indexchild < this._N && this._larger(indexchild, indexchild + 1)) indexchild++;
            if(!this._larger(index, indexchild)) break;
            this._swap(index, indexchild);
            index = indexchild; 
        }
    }

    _larger(i, j) {
        // compare based on the first key of the passed array
        return this._heap[i][0] > this._heap[j][0];
    }

    _swap(i, j) {
        
        const temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    }

}
