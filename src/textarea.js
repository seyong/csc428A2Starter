import React from 'react'
class TextArea extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: ""
        }
    }

    componentWillReceiveProps= (nextProps) => {
        var c = nextProps.inputChar;
        var displayText = this.state.text;

        if(nextProps.inputChar === "delete") {
            displayText = displayText.substring(0,displayText.length-1);
            this.setState({text: displayText})
        } else {
            displayText = displayText.concat(c);
            this.setState({text: displayText})
        }
    }

    render(){
        
        return(
            <div className="typed" style = {this.props.style}>
                {this.state.text}
            </div>
        )
    }
} 

export default TextArea;