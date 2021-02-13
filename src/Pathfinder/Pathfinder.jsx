import React from "react";
import { BFS } from "../algorithms/bfs.js";

import "./pathfinder.css";

const GRID_WIDTH = 30;
const GRID_LENGTH = 45;

const START_I = 5;
const START_J = 5;
const END_I = 15;
const END_J = 39;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
            walls: [],
            running: false,
            terminate: true,
            setup: false,
        
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        
        this.setState({terminate: true, running: false, walls: [[]], setup: false});

        const elem = document.getElementsByClassName("node");
        for (let i = 0; i < elem.length; i++) {
            elem[i].style.backgroundColor = "white";
        }
    }
    

    setStartAndBegin() {
        if(this.state.running === false) {
            this.setState({setup: true});
            const elem = document.getElementsByClassName("node");
            elem[coordMap(START_I,START_J)].style.backgroundColor = "green";
            elem[coordMap(END_I,END_J)].style.backgroundColor = "red";
        }
        
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
        if(this.state.running === false && this.state.setup === true) {
            this.setState({running:true});
            this.setState({terminate:false});
            await delay(1);
            const elems = document.getElementsByClassName("node");
            const walls = this.state.walls;
            const result = BFS(GRID_WIDTH, GRID_LENGTH, START_I, START_J, END_I, END_J, walls);
            const path = result[0];
            const searched = result[1];
            for (let i = 1; i < searched.length - 1; i++) {
                if(this.state.terminate === true) {
                    return;
                }
                let index = coordMap(searched[i].i, searched[i].j, GRID_LENGTH);
                elems[index].style.backgroundColor = "blue";
                await delay(10);
            }
            await delay(1);
            for (let i = 1; i < path.length - 1; i++) {
                if(this.state.terminate === true) {
                    return;
                }
                let index = coordMap(path[i].i, path[i].j, GRID_LENGTH);
                elems[index].style.backgroundColor = "yellow";
            }
        }
        
        
    }

    render() {
        const grid = [];
        let numberOfNodes = GRID_LENGTH*GRID_WIDTH;
        for (let i = 0; i < numberOfNodes; i++) {
            grid.push(<div className="node" key={i}></div>);
        }
        return (
            <>
            <div class="row">
                <div class="col s3">
                    <div className="container">

                        <div className="button-grid">
                            <button class="waves-effect waves-light btn" onClick={() => this.setStartAndBegin()}>
                                    setup
                                    
                                
                            </button>
                            <button class="waves-effect waves-light btn" onClick={() => this.addWalls()}>Walls</button>
                            <button class="waves-effect waves-light btn" onClick={() => this.bfs()}>bfs</button>
                            <button class="waves-effect waves-light btn" onClick={() => this.refresh()}>Refresh</button>
                        </div>
                    </div>
                    
                    
                </div>
                
                <div class="col s9">
                    
                        <div className="grid-container">
                                {grid}
                        </div>
                    
                </div>
            
            </div>

            
                
                
            </>
            
        )
        
    }

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