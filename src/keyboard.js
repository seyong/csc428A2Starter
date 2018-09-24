import React from 'react';
import {keys,keys_sym} from './keys.js'

// Normal Keyboard
// Keyboard component renders a keyboard layout
class Keyboard extends React.Component {

	// Constructor
	constructor(props){
		super(props);

		//set React State variables
		this.state ={
		 font_size: 0,
         in_starting_position: true,
         origin_scale: this.props.origin_scale
		};
        this.original_position =  {x:0,y:0};
		this.original_dimensions = {width:0, height:0};	
		this.displaySize = this.props.displaySize;

		this.keyboardImg = null;
		this.env = {
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

		// register EventListener
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
	}

	onLoad({target:img}){
		console.log("image naturalSize: "+img.naturalWidth+":"+img.naturalHeight);
		this.original_dimensions = {width:img.naturalWidth, height:img.naturalHeight};
		this.env.originalScale = this.displaySize.width/this.original_dimensions.width;
		this.setState({origin_scale:this.displaySize.width/this.original_dimensions.width});
		//this.setState({original_dimensions:
		//				{width: img.naturalWidth,
		//				height: img.naturalHeight}
		//				},this.reset());
		this.reset();
	}

	onKeyDown = (ev) => {
		console.log("Key pressed: " + ev.key + "/" +ev.keyCode);
		if(ev.keyCode === 37){
			console.log("[KeyPressed] Left arrow clicked");
		}else if(ev.keyCode === 38){
			console.log("[KeyPressed] Top arrow clicked");
		}else if(ev.keyCode === 39){
			console.log("[KeyPressed] Right arrow clicked");
		}else if(ev.keyCode === 40){
			console.log("[KeyPressed] Down arrow clicked");
		}else{
			var key = String.fromCharCode(ev.keyCode).toLocaleLowerCase();		
			if(ev.keyCode === 8){
				ev.returnValue = false;
				ev.cancleBubble = true;
				key = "delete";
			}else if(ev.keyCode === 13){
				key = "Enter";
			}
			// trigger 
			this.props.callback(key);
			// flash
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	}

	onMouseDown = (e) =>{
		console.log("[MouseDown]clientXY: "+e.clientX + ":"+e.clientY + " - pageXY: "+e.pageX+
		":" +e.pageY + "- screenXY: "+e.screenX+":"+e.screenY);

		//this.getKeyChar({x:e.offsetX, y:e.offsetY});
	}

	onPointerDown = (e) => {
		console.log("[PointerDown]clientXY: "+e.clientX + ":"+e.clientY + " - pageXY: "+e.pageX+
		":" +e.pageY + "- screenXY: "+e.screenX+":"+e.screenY + "- offsetXY: "+e.nativeEvent.offsetX);
		console.log("this.position.value: "+this.viewport.x +":"+this.viewport.y);
		console.log("currentZoomLevel: "+(this.position.width)+":"+this.original_dimensions.width);
		// use e.nativeEvent.offsetX,Y for accuracy
		var x = e.nativeEvent.offsetX / (this.position.width/this.original_dimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.original_dimensions.height);
		this.getKeyChar({x:x,y:y});
	}

	componentDidUpdate = () => {
		console.log("componentDidUpdate");
		window.setTimeout(() => {
			console.log("timeout");
		},500);
		this.reset();
	}

	render(){
		const font_height = {
			//fontSize : size.height / 1.2
		};
		const size = this.getWindowDimension();
		console.log("[render] "+size.height);
		const style = {
			width: size.width,
			height: size.height
		}

		return(
			// Why tabIndex='0' is required? for keyDownEvent?
			//<div className="container" style={this.props.style} onKeyDown={this.onKeyDown} tabIndex="0"
			<div className="container" onKeyDown={this.onKeyDown} tabIndex="0"
					onMouseDown = {this.onMouseDown} style={style} onPointerDown = {this.onPointerDown}>
				<img src="/images/ZoomBoard3.png" className="KB" alt="kb" onLoad={this.onLoad}
							style={style}/>
			</div>
		)
	}

	reset = (animated) => {
		this.setViewPort({x:0 , y:0, width: this.original_dimensions.width, height:this.original_dimensions.height},
			animated === true);
		this.clearResetTimeout();
		//this.setState({in_starting_position: true});
	}

	setViewPort = (viewport,animated) =>{
		console.log("Entering setViewPort()");
		var windowDim = this.getWindowDimension();
		var scale_x = windowDim.width/viewport.width;
		var scale_y = windowDim.height/viewport.height;
		console.log("windowDim - "+windowDim.width +":"+windowDim.height);
		console.log("Scale XY - "+scale_x +":"+scale_y);
		var width = scale_x * this.original_dimensions.width;
		var height = scale_y * this.original_dimensions.height;
		var x = -1 * viewport.x * scale_x;
		var y = -1 * viewport.y * scale_y;

		this.setPosition({x:x,y:y,width:width,height:height},animated);
		this.viewport = viewport;
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

	getWindowDimension = () => {
		return {
			width: this.displaySize.width,
			height: this.original_dimensions.height * this.env.originalScale
		};
	}

	getKeyChar = (pt) => {
		//console.log("Key Event");
		//var keys = this.env.keymaps.keys;
		//console.log("Key Event: " + keys.length);
		//console.log("Poitn Event => "+ pt.x + "/" + pt.y);
		var minDistance = false, minDistanceKey = null;
		var maxKeyErrorDistSquared = Math.pow(this.env.maxKeyErrorDistance,2);
		for(var i=0, len = keys.length; i<len; i++){
			var keychar = keys[i];
			if(keychar.x <= pt.x && keychar.y <= pt.y && keychar.x + keychar.width >= pt.x && keychar.y + keychar.height >= pt.y)
			{
				console.log("[" + keychar.key + "] pressed ");
			}else{
				
			}
			if(i===0){
				//console.log("Key Char info [" + keychar.key +"] => " + keychar.x + "/" + keychar.y + "/" + keychar.width + "/"+keychar.height);
			}
//			console.log("Key Char info [" + keychar.key +"] => " + keychar.x + "/" + keychar.y + "/" + keychar.width + "/"+keychar.height);
		}
	}

	setPosition = (position,animated) => {
		console.log("Entering setPosition() ..."+position.width);
		if(animated === false){
			//img.css -webkit-transition none
			//img.css -webkit-transition all 0.001s ease-out
		}
		this.position = position;
	}

}

export default Keyboard;