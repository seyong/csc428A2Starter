import React from 'react'
class TextArea extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="typed" style = {this.props.style}>
            </div>
        )
    }
} 

export default TextArea;