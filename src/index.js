import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TextArea from './textarea.js'
import Keyboard from './keyboard.js'

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
	}

	render(){
		const styles = {
			width: this.screenSize.width,
			height: this.screenSize.height
		}
		return(
			<div className="watch" style={styles}>
				<TextArea />
				<Keyboard original_scale={this.props.original_scale} displaySize = {this.screenSize}/>
			</div>
		);
	}
}

//============
ReactDOM.render(
	//AppleWatch 42mm, display size 312px * 390px
	<Watch size = {42} original_scale={0.15} devicePPI={112}/>,
	document.getElementById("root")
);
