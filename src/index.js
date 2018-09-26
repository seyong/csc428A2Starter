import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TextArea from './textarea.js'
import Keyboard from './keyboard.js'
import Keyboard2 from './keyboard.wip.js'

const styles = {
	size42:{
		width: 312 / window.devicePixelRatio,
		height: 390 / window.devicePixelRatio,
		keyboard:{
			width:312 / window.devicePixelRatio,
			height: (390 - (390-166.96875)) / window.devicePixelRatio
		}
	},
	size38:{
		width:272,
		height:340,
		keyboard:{
			width:312,
			height: 340 - (340 - 145.5625)
		}
	},
	dummy:{
		width:107,
		height:133
	}
}

const deviceIndependenceSize = (ppi,watchSize) => {
	if(watchSize === 42){
		// AppleWatch Series 3 + size 42mm has a resolution of 312x390 px, 302 ppi
		//	DeviceSize: {Width:33.3, Height: 38.6mm}
		//	ScreenSize: {Width: 26mm , Height: 33mm}
		var width = 26, height = 33;
		var deviceWidthInPixel = width/25.4*ppi;
		var deviceHeightInPixel = height/25.4*ppi;
		return {width: deviceWidthInPixel, height:deviceHeightInPixel};
	}else if(watchSize === 38){
		// AppleWatch Series 3 + size 38mm has a resolution of 272x340 px, 290 ppi
		// 	DeviceSize: {Width: 33.3mm, Height:42.5mm}
		//	ScreenSize: {Width: 24mm, Height: 30mm}
		var width = 24, height = 30;
		var deviceWidthInPixel = width/25.4*ppi;
		var deviceHeightInPixel = height/25.4*ppi;
		return {width: deviceWidthInPixel, height:deviceHeightInPixel};
	}else{
		return {width:0, height:0}
	}
}


// Watch component renders a smartwatch interface
class Watch extends React.Component {
	constructor(props){
		super(props);
		this.dpr = window.devicePixelRatio;
		this.screenSize = deviceIndependenceSize(this.props.devicePPI,this.props.size);
		this.state = {
			inputPhrase: ""
		};
		//add the target phrases here or load them from external files
		this.targetPhrase =  "target phrase one";
	}

	handleChange = (c) => {
		console.log("[Watch onHandleChange "+c);
		this.setState({inputChar : c});
		this.state.inputPhrase += c;
	};

	// //log data to files
	// //this sample code only logs the target phrase and the user's input phrases
	// //TODO: you need to log other measurements, such as the time when a user inputs each char, user id, etc.
	saveData = () => {
		let log_file = JSON.stringify({
			targetPhrase: this.targetPhrase,
			inputPhrase: this.state.inputPhrase
		})
		download(log_file, "results.txt", "text/plain");
  }

	//
	// //log data to files
	// //this sample code only logs the target phrase and the user's input phrases
	// //TODO: you need to log other measurements, such as the time when a user inputs each char, user id, etc.
	// saveData() {
	// 	let log_file = JSON.stringify({
	// 		targetPhrase: this.targetPhrase,
	// 		inputPhrase: this.state.inputPhrase
	// 	})
	// 	download(log_file, "results.txt", "text/plain");
	// }

	render(){
		const styles = {
			width: this.screenSize.width,
			height: this.screenSize.height
		}
		return(
			<div className="watch" style={styles} >
				<label>{this.targetPhrase}</label>
				<TextArea inputChar={this.state.inputChar}/>
				<Keyboard2 original_scale={this.props.original_scale} displaySize = {this.screenSize} callback={this.handleChange}/>
				<button onClick={this.saveData}>SAVE</button>
			</div>
		);
	}
}

function download(text, name, type) {
	 // console.log(JSON.parse(text));
	 var a = document.createElement("a");
	 var file = new Blob([text], {type: type});
	 a.href = URL.createObjectURL(file);
	 a.download = name;
	 a.click();
}


// function KeyPress(e) {
//       var evtobj = window.event? window.event : e
//       if (evtobj.keyCode == 83 && evtobj.ctrlKey) 	saveData();
// }
//
// document.onkeydown = KeyPress;

//============
ReactDOM.render(
	//AppleWatch 42mm, display size 312px * 390px
	<Watch id="myWatch" size = {42} original_scale={0.15} devicePPI={112}/>,
	document.getElementById("root")
);
