import React from 'react'

// FileName: textarea.js
// Description:
//  This js file implments div where your input character is being displayed .
class TextArea extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: ""
        }
    }

    // This will be called, everytime this props' value has changed. 
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
