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
            trigger: false,
        
        };
    }

    componentDidMount() {
        this.refresh();
        
        
            window.addEventListener("mousedown", (event) => {
                event.preventDefault();
                this.setState({trigger: true}); 
            });
          
            window.addEventListener('mouseup', (event) => {
                this.setState({trigger: false});
            });
            const M = window.M;
            var elems = document.querySelectorAll('.modal');
            M.Modal.init(elems, []);

            this.openModal();
          
        
    }

    openModal() {
        const M = window.M;
        let elem = document.getElementById("modal1");
        var instance = M.Modal.getInstance(elem);
        instance.open();
    }

    refresh() {
        
        this.setState({terminate: true, running: false, walls: [[]], setup: false, startnode: [], endnode: []});

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

    dragSwitchColor(id) {
        if(this.state.trigger === true) {
            this.clickSwitchColor(id);
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
                
            }

            //If we are selecting the start node
            if(this.state.beginselection === true) {
                const start = this.state.startnode;
                
                if (start.length !== 0) {
                    let currentStart = document.getElementById(coordMap(start[0],start[1]));
                    currentStart.style.backgroundColor = "white";
                }
                elem.style.backgroundColor = "green";
                    let newStart = idToCoords(id);
                    this.setState({startnode: newStart});
            }

            //If we are selecting the end node
            if(this.state.endselection === true) {
                const end = this.state.endnode;
                
                if (end.length !== 0) {
                    let currentEnd = document.getElementById(coordMap(end[0],end[1]));
                    currentEnd.style.backgroundColor = "white";
                }
                elem.style.backgroundColor = "red";
                    let newEnd = idToCoords(id);
                    this.setState({endnode: newEnd});
            }
        }
        
        
        
    }

    wallSelectionTrigger(btnid){
        document.getElementById("startbtn").style.backgroundColor = "rgb(55,181,255)";
        document.getElementById("endbtn").style.backgroundColor = "rgb(55,181,255)";
        this.setState({beginselection: false, endselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.wallselection === false) {
            this.setState({wallselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({wallselection: false});
            elem.style.backgroundColor = "rgb(55,181,255)";
        }
    }

    startSelectionTrigger(btnid){
        document.getElementById("wallbtn").style.backgroundColor = "rgb(55,181,255)";
        document.getElementById("endbtn").style.backgroundColor = "rgb(55,181,255)";
        this.setState({wallselection: false, endselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.beginselection === false) {
            this.setState({beginselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({beginselection: false});
            elem.style.backgroundColor = "rgb(55,181,255)";
        }
    }

    endSelectionTrigger(btnid){
        document.getElementById("startbtn").style.backgroundColor = "rgb(55,181,255)";
        document.getElementById("wallbtn").style.backgroundColor = "rgb(55,181,255)";
        this.setState({beginselection: false, wallselection: false});
        let elem = document.getElementById(btnid);
        if(this.state.endselection === false) {
            this.setState({endselection: true});
            elem.style.backgroundColor = "orange";
        }
        else {
            this.setState({endselection: false});
            elem.style.backgroundColor = "rgb(55,181,255)";
        }
    }

    render() {
        const grid = [];
        let numberOfNodes = GRID_LENGTH*GRID_WIDTH;
        for (let i = 0; i < numberOfNodes; i++) {
            grid.push(<div onMouseEnter={() => this.dragSwitchColor(i)} onClick={() => this.clickSwitchColor(i)} className="node" key={i} id={i}></div>);
        }
        return (
            <>
            <div className="back-btn" style={{position: "absolute", padding: 0, margin: 0}}>
                <a href="https://projectaki.github.io/portfolio_akos_madarasz/#/Projects" style={{color: "black"}} >
                    <i class="fas fa-arrow-left fa-2x"></i>
                </a>
            </div>
                    <div style={{textAlign: "center"}}>
                        <button id="bfsbtn" className="actionbutton" style={{backgroundColor: "rgb(55,181,255)"}} onClick={() => this.bfs()}>SEARCH</button>
                        <button id="refreshbtn" className="actionbutton" style={{backgroundColor: "rgb(55,181,255)"}} onClick={() => this.refresh()}>REFRESH</button>
                    </div>
                    
                    <div className="grid-container rotate-on-small">
                                {grid}
                    </div>
                    

                        <div style={{textAlign: "center"}}>
                            
                            <button id="startbtn" className="actionbutton" style={{backgroundColor: "rgb(55,181,255)"}} onClick={() => this.startSelectionTrigger("startbtn")}>STARTNODE</button>
                            <button id="endbtn" className="actionbutton" style={{backgroundColor: "rgb(55,181,255)"}} onClick={() => this.endSelectionTrigger("endbtn")}>ENDNODE</button>
                            <button id="wallbtn" className="actionbutton" style={{backgroundColor: "rgb(55,181,255)"}} onClick={() => this.wallSelectionTrigger("wallbtn")}>ADD WALLS</button>
                            
                            
                            <button id="" className="actionbutton" style={{backgroundColor: "#CB2375"}} onClick={() => this.openModal()}>INFO</button>
                        </div>
                    
                    
                    
               
                
                
                    
                        
                    
                
                <div id="modal1" class="modal">
                    <div class="modal-content">
                    <h4 style={{fontFamily: "League Spartan", fontSize: "2vmin"}}>How to use</h4>
                    <p style={{fontFamily: "Alegreya sans", fontSize: "2vmin"}}>While one of the 3 types of objects are selected (STARTNODE, ENDNODE or WALLS) you can place them on the grid by clicking or dragging! Once the field is set up
                        click "SEARCH" to find the shortest path.
                    </p>
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

