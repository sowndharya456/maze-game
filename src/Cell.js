import React ,{ Component } from 'react';
import './Cell.css';


class Cell extends Component{
   render(){
     const {value} = this.props;
     let cellClass = "cell_container"+(value.hasFood=== true ? " display_mushroom":"")+
     (value.hasMario === true ? " display_mario" : "" ) ;
    return (

        <div className={cellClass}> 

        </div>
    )
   }
}


export default Cell;