import React, { Component } from 'react';

class Navbar extends Component {

    
    render() {
        return (
            <div>
                <nav>
                    <div class="nav-wrapper">
                        <div style={{display: "grid", gridTemplateColumns: "20vw 80vw"}}>
                            <div >
                                <a href="https://projectaki.github.io/portfolio_akos_madarasz/#/Projects">
                                    <i class="fas fa-arrow-left" style={{paddingLeft: "1vw"}}></i>
                                </a>
                            </div>
                            <div>
                                <span style={{fontSize: "3vh", marginLeft: "25vw"}}>Pathfinder Visualiser</span>
                            </div>
                        </div>
                        
                    
                    </div>
                </nav>

                
    
            </div>
        );
    }
}

export default Navbar;