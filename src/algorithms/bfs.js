
class Node {
    constructor(prev, i, j) {
        this.prev = prev;
        this.i = i;
        this.j = j;
    }
}

class Pair {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}


export const BFS = (iLength, jLength, starti, startj, endi, endj, walls) => {

    

    const searched = [];

    let newgrid = createGrid(iLength,jLength);
    // Setup walls
    for (let i = 1; i < walls.length; i++) {
        newgrid[walls[i][0]][walls[i][1]] = new Node(null,walls[i][0], walls[i][1]);
    }
    
    let startCoords = new Pair(starti,startj);

    let endCoords = new Pair(endi,endj);
    
    let nodesToProcess = [];
    
    nodesToProcess.push(startCoords);
    
    newgrid[startCoords.i][startCoords.j] = new Node(null, startCoords.i, startCoords.j);
    // newgrid[endi - 1][endj] = new Node(null, startCoords.i, startCoords.j);
    // newgrid[endi - 1][endj - 1] = new Node(null, startCoords.i, startCoords.j);

    let currentCoords = new Pair();
    while (!(currentCoords.i === endCoords.i && currentCoords.j === endCoords.j) && nodesToProcess.length !== 0) {
    
        
        currentCoords = nodesToProcess.shift();
        searched.push(currentCoords);
        
        let neighbours = [];
        neighbours = getNeighbours(currentCoords, newgrid);
        
        neighbours.forEach(x => nodesToProcess.push(x));
        

    }
    let path = [];
    if (currentCoords.i === endCoords.i && currentCoords.j === endCoords.j) {
        
        let endNode = newgrid[currentCoords.i][currentCoords.j];
        while (endNode != null) {
            path.push(endNode);
            endNode = endNode.prev;
        }
    }
    
    // console.log(path);
    return [path, searched];
 }
 
export const getNeighbours = (currentNodeCord, newgrid) => {

    let neighbours = [];
    let i = currentNodeCord.i;
    let j = currentNodeCord.j;

    // top
    let top = new Pair(i-1, j);
    if (isValid(newgrid, top.i, top.j)) {
        neighbours.push(top);
        newgrid[top.i][top.j] = new Node(newgrid[i][j],top.i, top.j);
    }
    // right
    let right = new Pair(i, j+1);
    if (isValid(newgrid, right.i, right.j)) {
        neighbours.push(right);
        newgrid[right.i][right.j] = new Node(newgrid[i][j], right.i, right.j);
    }
    // bottom
    let bottom = new Pair(i+1, j);
    if (isValid(newgrid, bottom.i, bottom.j)) {
        neighbours.push(bottom);
        newgrid[bottom.i][bottom.j] = new Node(newgrid[i][j], bottom.i, bottom.j);
    }
    // left
    let left = new Pair(i, j - 1);
    if (isValid(newgrid, left.i, left.j)) {
        neighbours.push(left);
        newgrid[left.i][left.j] = new Node(newgrid[i][j], left.i, left.j);
        
    }
    return neighbours;
}

export const isValid = (newgrid, x, y) => {

    if (x < 0 || x >= newgrid.length ) return false;
    if (y < 0 || y >= newgrid[0].length ) return false;
    if (newgrid[x][y] != null) return false;
    return true;
}

export const createGrid = (iLength, jLength) => {
    const grid = [];
    for (let row = 0; row < iLength; row++) {
        const currentRow = [];
        for (let col = 0; col < jLength; col++) {
            currentRow.push(null);
        }
        grid.push(currentRow);
    }
    return grid;
}