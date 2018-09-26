import React from 'react';
import './App.css';

class App extends React.Component{
    render(){
        return(
			<div className="watch" style={{width:this.screenSize.width, height:this.screenSize.height}} >
				<TextArea inputChar={this.state.inputChar}/>
				<Keyboard3 original_scale={this.props.original_scale} displaySize = {this.screenSize} onKeyCharReceived ={this.onKeyCharReceived}/>

            </div>
        )
    }
}