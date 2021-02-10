import React from "react";
import { BFS } from "../algorithms/bfs.js";

import "./pathfinder.css";

const GRID_WIDTH = 30;
const GRID_LENGTH = 50;

const START_I = 5;
const START_J = 5;
const END_I = 15;
const END_J = 39;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [],
            walls: [],
        
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        const grid = createGrid();
        this.setState({grid});

        const elem = document.getElementsByClassName("node");
        for (let i = 0; i < elem.length; i++) {
            elem[i].style.backgroundColor = "white";
        }
    }
    

    setStartAndBegin() {
        const elem = document.getElementsByClassName("node");
        elem[coordMap(START_I,START_J)].style.backgroundColor = "green";
        elem[coordMap(END_I,END_J)].style.backgroundColor = "red";
    }

    addWalls() {
        const wallCordsI = [];
        const wallCordsJ = [];
        const walls = [];
        const elem = document.getElementsByClassName("node");
        let j = 20;
        for (let i = 0; i < 25; i++) {
            elem[coordMap(i, j)].style.backgroundColor = "black";
            wallCordsI.push(i);
            wallCordsJ.push(j);
        }
        walls.push(wallCordsI);
        walls.push(wallCordsJ);
        //this.state.walls = walls;
        this.setState({walls});
    }

    async bfs() {
        
        const elems = document.getElementsByClassName("node");
        const walls = this.state.walls;
        const result = BFS(GRID_WIDTH, GRID_LENGTH, START_I, START_J, END_I, END_J, walls);
        const path = result[0];
        const searched = result[1];
        for (let i = 1; i < searched.length - 1; i++) {
            let index = coordMap(searched[i].i, searched[i].j, GRID_LENGTH);
            elems[index].style.backgroundColor = "blue";
            await delay(10);
        }
        await delay(1);
        for (let i = 1; i < path.length - 1; i++) {
            let index = coordMap(path[i].i, path[i].j, GRID_LENGTH);
            elems[index].style.backgroundColor = "yellow";
        }
        
    }

    render() {
        const {grid} = this.state;
        return (
            <>
                <div className="grid">
                        {grid.map((row, rowid) => (
                            <div key={rowid} className="row">
                                {row.map((node, nodeid) => (
                                    <div key={nodeid} className="node"></div>
                                ))}
                            </div>
                        ))}
                </div>
                <button onClick={() => this.setStartAndBegin()}>Set start and begin</button>
                <button onClick={() => this.addWalls()}>Add walls</button>
                <button onClick={() => this.bfs()}>bfs</button>
                <button onClick={() => this.refresh()}>Refresh</button>
            </>
            
        )
        
    }

}

function createGrid() {
    const grid = [];
    for (let row = 0; row < GRID_WIDTH; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_LENGTH; col++) {
            currentRow.push(<div></div>);
        }
        grid.push(currentRow);
    }
    return grid;
}

function coordMap(i , j) {
    return i * GRID_LENGTH + j;
}

function delay(n) {  
    n = n || 2000;
    return new Promise(done => {
      setTimeout(() => {
        done();
      }, n);
    });
  }