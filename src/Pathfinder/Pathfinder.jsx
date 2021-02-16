import React from "react";
import { BFS } from "../algorithms/bfs.js";

import "./pathfinder.css";

const GRID_WIDTH = 30;
const GRID_LENGTH = 45;

export default class Pathfinder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
            walls: new Map(),
            running: false,
            terminate: true,
            setup: false,
            wallselection: false,
            beginselection: false,
            endselection: false,
            startnode: [],
            endnode: [],
        
        };
    }

    componentDidMount() {
        this.refresh();
        this.setState({startnode: [0,0], endnode: [29,44]});
    }

    refresh() {
        
        this.setState({terminate: true, running: false, walls: [[]], setup: false});

        const elem = document.getElementsByClassName("node");
        for (let i = 0; i < elem.length; i++) {
            elem[i].classList.remove("slow-color");
            elem[i].style.backgroundColor = "white";
            elem[i].style.border = "0.1vw solid lightblue";
        }
    }

    async bfs() {
        if(this.state.startnode.length !== 0 && this.state.endnode.length !== 0) {
            this.setState({setup: true});
        }
        await delay(1);
        if(this.state.running === false && this.state.setup === true) {
            this.setState({running:true});
            this.setState({terminate:false});
            await delay(1);
            const elems = document.getElementsByClassName("node");
            const walls = Array.from(this.state.walls.values());
            const result = BFS(GRID_WIDTH, GRID_LENGTH, this.state.startnode[0], this.state.startnode[1], this.state.endnode[0], this.state.endnode[1], walls);
            const path = result[0];
            const searched = result[1];
            for (let i = 1; i < searched.length - 1; i++) {
                if(this.state.terminate === true) {
                    return;
                }
                let index = coordMap(searched[i].i, searched[i].j, GRID_LENGTH);
                elems[index].classList.add("slow-color");
                await delay(5);
            }
            
            
            await delay(1);
            for (let i = 1; i < path.length - 1; i++) {
                if(this.state.terminate === true) {
                    return;
                }
                let index = coordMap(path[i].i, path[i].j, GRID_LENGTH);
                elems[index].classList.remove("slow-color");
                elems[index].style.backgroundColor = "yellow";
                await delay(10);
            }
        }
        
        
    }

    async clickSwitchColor(id) {
        if (this.state.running === false) {
            let elem = document.getElementById(id);
            var tempSet = new Map(this.state.walls);

            //If we are selecting walls
            if(this.state.wallselection === true) {
                // disable wall
                if (elem.style.backgroundColor === "black"){
                    elem.style.backgroundColor = "white";
                    tempSet.delete(id);
                    
                }
                // enable wall
                else if (elem.style.backgroundColor === "white") {
                    elem.style.backgroundColor = "black";
                    const tuple = idToCoords(id);
                    tempSet.set(id,[tuple[0],tuple[1]]);
                    
                }
                this.setState({walls: tempSet});
                await delay(1);
                console.log(this.state.walls);
            }

            //If we are selecting the start node
            if(this.state.beginselection === true) {
                const start = this.state.startnode;
                console.log(start);
                if (start.length !== 0) {
                    let currentStart = document.getElementById(coordMap(start[0],start[1]));
                    currentStart.style.backgroundColor = "white";
                    elem.style.backgroundColor = "green";
                    let newStart = idToCoords(id);
                    this.setState({startnode: newStart});
                }
            }

            //If we are selecting the end node
            if(this.state.endselection === true) {
                const end = this.state.endnode;
                
                if (end.length !== 0) {
                    let currentEnd = document.getElementById(coordMap(end[0],end[1]));
                    currentEnd.style.backgroundColor = "white";
                    elem.style.backgroundColor = "red";
                    let newEnd = idToCoords(id);
                    this.setState({endnode: newEnd});
                }
            }
        }
        
        
        
    }

    wallSelectionTrigger(btnid){
        document.getElementById("startbtn").style.backgroundColor = "blueviolet";
        document.getElementById("endbtn").style.backgroundColor = "blueviolet";
        this.setState({beginselection: false, endselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.wallselection === false) {
            this.setState({wallselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({wallselection: false});
            elem.style.backgroundColor = "blueviolet";
        }
    }

    startSelectionTrigger(btnid){
        document.getElementById("wallbtn").style.backgroundColor = "blueviolet";
        document.getElementById("endbtn").style.backgroundColor = "blueviolet";
        this.setState({wallselection: false, endselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.beginselection === false) {
            this.setState({beginselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({beginselection: false});
            elem.style.backgroundColor = "blueviolet";
        }
    }

    endSelectionTrigger(btnid){
        document.getElementById("startbtn").style.backgroundColor = "blueviolet";
        document.getElementById("wallbtn").style.backgroundColor = "blueviolet";
        this.setState({beginselection: false, wallselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.endselection === false) {
            this.setState({endselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({endselection: false});
            elem.style.backgroundColor = "blueviolet";
        }
    }

    render() {
        const grid = [];
        let numberOfNodes = GRID_LENGTH*GRID_WIDTH;
        for (let i = 0; i < numberOfNodes; i++) {
            grid.push(<div onClick={() => this.clickSwitchColor(i)} className="node" key={i} id={i}></div>);
        }
        return (
            <>
            <div class="row">
                <div class="col s3">
                    <div className="container">

                        <div className="button-grid">
                            <button id="startbtn"class="waves-effect waves-light btn" style={{backgroundColor: "blueviolet"}} onClick={() => this.startSelectionTrigger("startbtn")}>start</button>
                            <button id="endbtn"class="waves-effect waves-light btn" style={{backgroundColor: "blueviolet"}} onClick={() => this.endSelectionTrigger("endbtn")}>end</button>
                            <button id="wallbtn" class="waves-effect waves-light btn" style={{backgroundColor: "blueviolet"}} onClick={() => this.wallSelectionTrigger("wallbtn")}>Walls</button>
                            <button id="bfsbtn" class="waves-effect waves-light btn" style={{backgroundColor: "blueviolet"}} onClick={() => this.bfs()}>bfs</button>
                            <button id="refreshbtn" class="waves-effect waves-light btn" style={{backgroundColor: "blueviolet"}} onClick={() => this.refresh()}>Refresh</button>
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

function idToCoords(id) {
    let i = Math.floor(id/GRID_LENGTH);
    let j = id % GRID_LENGTH;
    return [i,j];
}

function delay(n) {  
    n = n || 2000;
    return new Promise(done => {
      setTimeout(() => {
        done();
      }, n);
    });
  }