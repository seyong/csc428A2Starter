import React from 'react';
import KeySet from './keys.js'

// Keyboard component renders a keyboard layout
//	with img
class Keyboard extends React.Component {

	constructor(props){
		super(props);
		this.state ={
		 original_position: {x:0,y:0,width:0,height:0},
		 original_dimensions: {width:0, height:0},
		 font_size: 0,
		 in_starting_position: true
		};
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.keyboardImg = null;
		this.env = {
			keymaps: [KeySet.keys,KeySet.keys_sym],
			keyboardNames: ["ZB","#"],
			zoomFactor: 2.2,
			originalScale: 0.12,
			maxZoom: 1.0,
			resetOnMaxZoom: true,
			resetTimeout: 1000,
			centerBias: 0.05,
			animTime: 0.1,
			minSwipeX: 40,
			minSwipeY: 30,
			maxKeyErrorDistance: 2,
			useRealKeyboard: true
		}

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
	}

	onLoad({target:img}){
		this.setState({original_dimensions:
						{width: img.naturalWidth,
						height: img.naturalHeight}
						})
	}

	onKeyDown = (e) => {
		console.log("Key pressed: " + e.key + "/" +e.keyCode);
	}

	onMouseDown = (e) =>{
		console.log("clientXY: "+e.clientX + ":"+e.clientY + " - pageXY: "+e.pageX+
		":" +e.pageY + "- screenXY: "+e.screenX+":"+e.screenY);
		e.preventDefault();
		e.stopPropagation();
	}

	onPointerDown = (e) => {
	}

	componentWillMount = () => {}
	componentDidMount = () => {}
	componentWillUpdate = () => {}
	componentDidUpdate = () => {
		console.log("componentDidUpdate");
		window.setTimeout(() => {
			console.log("timeout");
		},500);
	}

	render(){
		const size = this.getWindowDimension();
		const style = {
			width: size.width,
			height: size.height,
		}
		const font_height = {
			fontSize : size.height / 1.2
		};
		console.log("[render] " +size.width);


		return(
			// Why tabIndex='0' is required? for keyDownEvent?
			<div className="container" style={style} onKeyDown={this.onKeyDown} tabIndex="0"
					onMouseDown = {this.onMouseDown} onPointerDown = {this.onPointerDown}>
				<img src="/images/keyboard.png" className="KB" alt="kb" onLoad={this.onLoad}
							style={style}/>
			</div>
		)
	}

	getWindowDimension = () => {
		return {
			width: this.state.original_dimensions.width * this.props.original_scale,
			height: this.state.original_dimensions.height * this.props.original_scale
		};
	}

	reset = (animated) => {
		this.setViewPort({x:0 , y:0, width: this.original_dimensions.width, height:this.original_dimensions.height},
			animated === true);
		this.clearResetTimeout();
		this.setState({in_starting_position: true});
	}

	setViewPort = (viewport,animated) =>{
		var windowDim = this.getWindowDimension();
		var scale_x = windowDim.width/viewport.width;
		var scale_y = windowDim.height/viewport.height;
		var width = scale_x * this.state.original_dimensions.width;
		var height = scale_y * this.state.original_dimensions.height;
		var x = -1 * viewport.x * scale_x;
		var y = -1 * viewport.y * scale_y;

		this.setPosition({x:x,y:y,width:width,height:height},animated);
	}

	setPosition = (position,animated) => {
		if(animated === false){
			//img.css -webkit-transition none
			//img.css -webkit-transition all 0.001s ease-out
		}
	}

	clearResetTimeout = () => {
		if(this.resetTimeout !== undefined){
			window.clearTimeout(this.resetTimeout);
		}
		this.resetTimeout = undefined;
	}

	onKeyClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.env.zoomFactor;
		var centerBias = this.env.centerBias;
		var maxZom = this.env.maxZoom;

		//do zoom

		this.clearResetTimeout();
		//Assuming mouse
		return false;
	}

	getXZoom = () =>{
		return this.position.width / this.original_dimensions.width;
	}
	getYZoom = () =>{
		return this.position.height / this.original_dimensions.height;
	}
	getZoom = () => {
		return Math.max(this.getXZoom, this.getYZoom);
	}
}

export default Keyboard;