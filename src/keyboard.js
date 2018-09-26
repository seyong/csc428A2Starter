import React from 'react';
import ReactDOM from 'react-dom';
import Keymaps from './keys.js';

// Normal Keyboard
// Keyboard component renders a keyboard layout
class Keyboard extends React.Component {

	// Constructor
	constructor(props){
		super(props);

		//set React State variables
		this.state ={
			font_size: 0,
        	origin_scale: this.props.origin_scale,
			swiped: false,
			imgStyle : {
				left:0, top:0,
				width: this.props.width,
				height: this.props.height
			},
			overlayStyle : {
				opacity: 0,
				color: "white"
			},
			overlayText : ""
		};

		if(this.props.onKeyClick !== undefined){
			this.onKeyClick = this.props.onKeyClick;
		}
		if(this.props.onFingerTouch !== undefined){
			this.onFingerTouch = this.props.onFingerTouch;
		}
		this.in_starting_position = true;
        this.original_position =  {x:0,y:0};
		this.original_dimensions = {width:0, height:0};
		this.displaySize = this.props.displaySize;

		this.keyboardImg = null;
		this.config = {
			resetTimeout: 1000,
			animTime: 0.1,
			useRealKeyboard: true,
			maxKeyErrorDistance: 2,
			minSwipeX: 40,
			minSwipeY: 1
		}
		// register EventListener
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);

		this._onTouchStart = this._onTouchStart.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onTouchEnd = this._onTouchEnd.bind(this);
		this._swipe = {};
		this.startX = 0;
		this.startY = 0;
	}


	// Touch EventHandler
	_onTouchStart(e) {
		const touch = e.touches[0];
		this.startX = touch.clientX;
		this.startY = touch.clientY;
		this._swipe = { x: touch.clientX, Y:touch.clientY };
		this.setState({ swiped: false });
	}

	_onTouchMove(e) {
		if (e.changedTouches && e.changedTouches.length) {
			const touch = e.nativeEvent.changedTouches[0];
			this._swipe.swiping = true;
		}
	}

	_onTouchEnd(e) {
		const touch = e.nativeEvent.changedTouches[0];
		var dx = touch.clientX - this.startX;
		var dy = touch.clientY - this.startY;
		if (this._swipe.swiping){
			if(Math.abs(dx) > this.config.minSwipeX){
				if(dx > 0){
					this.onSwipe("right");
				}else if(dx < 0){
					this.onSwipe("left");
				}
			}
			else if(Math.abs(dy) > this.config.minSwipeY){
				if(dy > 0){
					this.onSwipe("down");
				}else if(dy < 0){
					this.onSwipe("up");
				}
			}
			this.props.onSwiped && this.props.onSwiped();
			this.setState({swiped:true});
		}else{
			//this.onFingerTouch(e);
			this.onKeyClick(e);
		}
		this._swipe = {};
		/*
		const absX = Math.abs(touch.clientX - this._swipe.x);
		if (this._swipe.swiping && absX > this.minDistance ) {
			this.props.onSwiped && this.props.onSwiped();
			this.setState({ swiped: true });
		}
		this._swipe = {};*/
	}

	onSwipe = (direction) => {
		if(direction === "left"){
			var key = "delete";
			this.props.onKeyCharReceived(key);
		}else if(direction === "up"){
			//change keyboard image
		}
		// "down", "right" haven't assigned
	}

	onLoad({target:img}){
		console.log("[onLoad] image naturalSize: "+img.naturalWidth+":"+img.naturalHeight);
		this.original_dimensions = {
			width:img.naturalWidth, 
			height:img.naturalHeight
		};
		this.config.originalScale = this.displaySize.width/this.original_dimensions.width;
		this.setState({
			origin_scale:this.displaySize.width/this.original_dimensions.width
		});
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
			this.props.onKeyCharReceived(key);
			// flash
			this.flashKey(key);
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	}

	onPointerDown = (e) => {
		// use e.nativeEvent.offsetX,Y for accuracy
		var x = e.nativeEvent.offsetX / (this.position.width/this.original_dimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.original_dimensions.height);
		this.onKeyClick({x:x,y:y});
	}

	componentDidUpdate = () => {
		this.offsetTop = ReactDOM.findDOMNode(this).offsetTop;
		this.offsetLeft = ReactDOM.findDOMNode(this).offsetLeft;
	}

	render(){
		const size = this.getWindowDimension();
		const style = {
			width: size.width,
			height: size.height
		};
		const overlayStyle = {
			width: size.width,
			height: size.height,
			opacity: this.state.overlayStyle.opacity,
			color: this.state.overlayStyle.color,
			fontSize:(size.height/1.2)+"px"
		};
		//console.log(overlayStyle);
		const fontHeight = {
			fontSize : size.height/1.2
		}
		console.log("[Rendering...] ");
		return(
			<div className="container" style = {style} tabIndex="0"
					onKeyDown={this.onKeyDown}
					onPointerDown = {this.onPointerDown}
					onTouchStart={this._onTouchStart}
					onTouchMove={this._onTouchMove}
					onTouchEnd={this._onTouchEnd}>
				<img id="keyboardtype" className="KB" alt="kb"
					src="/images/ZoomBoard3b.png" onLoad={this.onLoad}
					style={this.state.imgStyle}/>
				<div className="overlay" 
					style={overlayStyle}
					dangerouslySetInnerHTML={{
						__html: this.state.overlayText
					}}></div>
			</div>
		)
	}

	reset = (animated) => {
		this.setViewPort({
			x:0 , y:0, 
			width: this.original_dimensions.width, 
			height:this.original_dimensions.height
			},animated === true);
		this.clearResetTimeout();
		this.in_starting_position = true;
	}

	setViewPort = (viewport,animated) =>{
		console.log("Entering setViewPort()");
		var windowDim = this.getWindowDimension();
		var scale_x = windowDim.width/viewport.width;
		var scale_y = windowDim.height/viewport.height;
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

	onKeyClick = (pt) => {
		//this.clearResetTimeout();
		var key = this.getKeyChar(pt);
		if(key != null){
			console.log("[Key Presseed] "+key);
			this.props.onKeyCharReceived(key);
			this.flashKey(key);
		}
		//this.resetTimeoutFunc();
		//Assuming mouse
		return false;
	}

	getWindowDimension = () => {
		return {
			width: this.original_dimensions.width * this.config.originalScale,
			height: this.original_dimensions.height * this.config.originalScale
		};
	}

	getKeyChar = (pt) => {
		//console.log("Key Event");
		//var keys = this.env.keymaps.keys;
		//console.log("Key Event: " + keys.length);
		//console.log("Poitn Event => "+ pt.x + "/" + pt.y);
		var minDistance = false, minDistanceKey = null;
		var maxKeyErrorDistSquared = Math.pow(this.config.maxKeyErrorDistance,2);
		var keys = Keymaps.keys;
		//console.log(Keymaps.keys.keys);
		for(var i=0, len = keys.length; i<len; i++){
			var keychar = keys[i];
			console.log("[keychar]: "+keychar);
			if(keychar.x <= pt.x && keychar.y <= pt.y && keychar.x + keychar.width >= pt.x && keychar.y + keychar.height >= pt.y)
			{
				return keychar.key;
			}else{ // approximate
				var keyCharCenterX = keychar.x + keychar.width/2;
				var keyCharCenterY = keychar.y + keychar.height/2;
				var dx = pt.x - keyCharCenterX;
				var dy = pt.y - keyCharCenterY;
				var dSquared = Math.pow(dx,2) + Math.pow(dy,2);
				if((minDistanceKey === null || dSquared < minDistance) &&
					 dSquared < maxKeyErrorDistSquared * Math.pow(Math.min(keychar.width, keychar.height), 2))
				{
					minDistance = dSquared;
					minDistanceKey = keychar.key;
				}
			}
		}
		return minDistanceKey;
	}

	setPosition = (position,animated) => {
		console.log("Entering setPosition() ..."+position.width);
		if(animated === false){
			//img.css -webkit-transition none
			//img.css -webkit-transition all 0.001s ease-out
		}
		this.setState({
			imgStyle:{
				left:position.x,
				top:position.y,
				width:position.width,
				height:position.height
			}
		})
		this.position = position;
	}

	flashKey = (key) => {
		if(key === "delete") {
			//this.flash("&#9224;");
			this.flash("&#x232B");
		} else if(key === "enter") {
			this.flash("&#9252;");
		} else if(key === " ") {
			this.flash("&#9251;");
		} else {
			this.flash(key);
		}
	}
	flash = (text, duration, color) => {
		duration = duration || 250;
		color = color || "white";
		//window.clearTimeout(this.flashTimeout);
		this.setState({
			overlayStyle:{
				opacity: 0.95,
				color: color
			},
			overlayText: text
		});
		setTimeout(
			function() {
				this.setState({
				overlayStyle:{
					opacity: 0}})
			}
			.bind(this),
			duration
		);
	}
}

export default Keyboard;
