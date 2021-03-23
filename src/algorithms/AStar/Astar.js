import minPQ from "../PriorityQueue/MinHeap";

class Node {
    constructor(prev) {
        this.prev = prev;
        this.distance = 1;
        this.visited = false;
    }
}

export const Astar = (width, length, startnode, endnode, walls, weigths ) => {
    const result = _Astar(width, length, startnode, endnode, walls, weigths );
    const path = []; // shortest path nodes
    const [grid, endCoord, searched] = result;
    // traverse back with the prev links to get path
    if(result !== null) {
        let node = grid[endCoord[0]][endCoord[1]];
        while(node.prev !== null) {
            path.push(node.prev);
            node = grid[node.prev[0]][node.prev[1]];
        }
        path.pop();// get rid of start element
    }
    return [searched, path];
}

export const _Astar = (width, length, startnode, endnode, walls, weigths ) => {
    const searched = []; // searched nodes for visualisation
    const grid = createGrid(width, length); // create grid with empty nodes
    walls.shift();//first elem is undefined so just pop it off
    walls.forEach(elem => {grid[elem[0]][elem[1]] = null;}); // Set wall coordinates in grid to null
    const [endi, endj] = endnode;
    const minheap = new minPQ(); // Priority Queue as minheap

    // Add first node to priority queue
    grid[startnode[0]][startnode[1]].visited = true;
    minheap.insert([0, startnode]);

    // While the priority queue has elements keep searching
    while (!minheap.isEmpty()) {
        const currentNode = minheap.pop(); // get minimum distance
        
        const [i, j] = currentNode[1]; // current node coords
        searched.push(currentNode[1]); // add current node to the search nodes array
        if (i === endi && j === endj) return [grid, [i,j], searched]; // if the current node is the endnode, return
        const distanceSoFar = grid[i][j].distance; // the distance traveled so far is stored in the distance property
        const neighbours = getValidNeighboursCoords(i, j, grid); // get valid nieghbours of current node (Valid if => not null, in bounds, not visited)
        
        // for each valid neighbour update distance, set previous node, set visited => add to priority queue
        neighbours.forEach(neighbour => {
            const [k, l] = neighbour;
            const currentNeighbour = grid[k][l];
            currentNeighbour.distance += distanceSoFar;
            currentNeighbour.prev = [i,j];
            currentNeighbour.visited = true;
            const priority = currentNeighbour.distance + distance(neighbour, endnode);
            console.log("dist: ", distance(neighbour, endnode));
            minheap.insert([priority, neighbour]);
        });
    }
    // if the queue is empty then there was no path between start and end => return null
    return searched;
}

const getValidNeighboursCoords = (i, j, grid) => {
    const validNeighbourCoords = [];
    
    const neighbourCoords = [[i - 1, j],[i + 1, j],[i, j - 1],[i, j + 1]];
    neighbourCoords.forEach(coord => {
        if (isValid(coord, grid)) validNeighbourCoords.push(coord);
    });
    return validNeighbourCoords;
}

const isValid = (coord, grid) => {
    const [i,j] = coord;
    if (i < 0 || i >= grid.length ) return false;
    if (j < 0 || j >= grid[0].length ) return false;
    if (grid[i][j] === null) return false;
    if (grid[i][j].visited === true) return false;
    return true;
}

const distance = (start, end) => { 
    const [starti, startj] = start;
    const [endi, endj] = end;
    return (Math.abs(starti - endi) + Math.abs(startj - endj));
    //return Math.sqrt((starti-endi)**2 + (startj - endj)**2);
    //return 0;
}
// Helper method for creating grid and filling with Node class
const createGrid = (iLength, jLength) => {
    const grid = [];
    for (let row = 0; row < iLength; row++) {
        const currentRow = [];
        for (let col = 0; col < jLength; col++) {
            currentRow.push(new Node(null));
        }
        grid.push(currentRow);
    }
    return grid;
}