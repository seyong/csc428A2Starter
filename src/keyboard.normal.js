import React from 'react';
import ReactDOM from 'react-dom';
import Keymaps from './keys.js';

// Normal Keyboard
// Keyboard component renders a keyboard layout
class KeyboardNormal extends React.Component {

	// Constructor
	constructor(props){
		super(props);

		//set React State variables
		this.state ={
			font_size: 0,
        	originalScale: this.props.originalScale,
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
			keyboardImg : "/images/ZoomBoard3b.png",
			overlayText : "",
			originalDimensions : {width:0, height:0}
		};

		// Following variables are necessary for rendering, but since they are not
		// 	directly affect the rendering process, we are not going to set them as React States
		//	React State affects UI rendering directly, which means , everytime your react state has changed
		// 	by caling setState({}), render() function will be called.
		this.inStartingPosition = true;
		this.imgs = ["/images/ZoomBoard3b.png","/images/symbols3b.png"];
        this.originalPosition =  {x:0,y:0};
		this.originalDimensions = {width:0, height:0};
		this.displaySize = this.props.displaySize;
		this._swipe = {};
		this.startX = 0.0;
		this.startY = 0.0;

		// Keyboard configuration settings
		this.config = {
			resetTimeout: 1000,
			animTime: 0.1,
			useRealKeyboard: true,
			maxKeyErrorDistance: 2,
			minSwipeX: 40,
			minSwipeY: 1,
			originalScale: this.props.originalScale
		}

		// register EventListener
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);

		// Check if PointerEvent is supported.
		// PointerEvent is recommended for Chrome (> v55), Edge.
		// Mouse&TouchEvent are recommended for other browsers.
		console.log("Is PointerEvent supported? "+window.PointerEvent);
		console.log(this.startX);
		//this.props.onKeyCharReceived(window.PointerEvent);
		if(window.PointerEvent){
			this.onPointerUp = this.onPointerUp.bind(this);
			this.onTouchStart = this.onTouchStart.bind(this);
			this._onTouchMove = this._onTouchMove.bind(this);
			this._onTouchEnd = this._onTouchEnd.bind(this);
		}else{
			this.onTouchStart = this.onTouchStart.bind(this);
			this.onMouseDown = this.onMouseDown.bind(this);
			this._onTouchMove = this._onTouchMove.bind(this);
			this._onTouchEnd = this._onTouchEnd.bind(this);
		}
	}


	//====
	// Touch EventHandler
	//====
	onTouchStart(e) {
		const touch = e.nativeEvent.touches[0];
		this.startX = touch.clientX;
		this.startY = touch.clientY;
		this._swipe = { x: touch.clientX, Y:touch.clientY };
		this.setState({ swiped: false });
		e.stopPropagation();
	}

	_onTouchMove(e) {
		if (e.changedTouches && e.changedTouches.length) {
			const touch = e.nativeEvent.changedTouches[0];
			this._swipe.swiping = true;
		}
		e.stopPropagation();
		
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
			this.onKeyClick(e);
		}
		this._swipe = {};
		e.stopPropagation();
	}

	onSwipe = (direction) => {
		if(direction === "left"){
			var key = "delete";
			this.props.onKeyCharReceived(key);
		}else if(direction === "up"){
			//change keyboard image here
			var imgPath = (this.state.keyboardImg === this.imgs[0])? this.imgs[1] : this.imgs[0];
			this.setState({
				keyboardImg:imgPath 
			})

		}
		// "down", "right" haven't assigned
	}

	onLoad({target:img}){
		console.log("[onLoad] image naturalSize: "+img.naturalWidth+":"+img.naturalHeight);
		this.originalDimensions = {
			width:img.naturalWidth, 
			height:img.naturalHeight
		};

		// Change React state is asynchronous, 
		// 	to sync the change of the state and function call, pass the function as a parameter.
		this.setState({
			originalDimensions:{
				width:img.naturalWidth,
				height:img.naturalHeight
			}
		},this.reset);

		//
		if(this.displaySize !== undefined){
			this.config.originalScale = this.displaySize.width/this.originalDimensions.width;
			/*
			this.setState({
				originalScale:this.displaySize.width/this.original_dimensions.width
			});*/
		}
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

	onPointerUp(e){
		// use e.nativeEvent.offsetX,Y for accuracy
		//var x = e.nativeEvent.offsetX / (this.position.width/this.originalDimensions.width);
		//var y = e.nativeEvent.offsetY / (this.position.height/this.originalDimensions.height);
		var x = e.nativeEvent.offsetX / (this.position.width/this.state.originalDimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.state.originalDimensions.height);
		console.log("[onPointerDown] xy: "+ x + ":" + y);
		console.log("[onPointerDown] position: "+ this.position.x + ":" + this.position.y);
		this.onKeyClick({x:x,y:y});
		//e.preventDefault();
		e.stopPropagation();
		return false;
	}

	onMouseDown(e) {
		// use e.nativeEvent.offsetX,Y for accuracy
		//var x = e.nativeEvent.offsetX / (this.position.width/this.originalDimensions.width);
		//var y = e.nativeEvent.offsetY / (this.position.height/this.originalDimensions.height);
		console.log(window.PointerEvent);
		console.log(window.MouseEvent);
		var x = e.nativeEvent.offsetX / (this.position.width/this.state.originalDimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.state.originalDimensions.height);
		console.log("[onMouseDown] xy: "+ x + ":" + y);
		console.log("[onMouseDown] position: "+ this.position.x + ":" + this.position.y);
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
		const fontHeight = {
			fontSize : size.height/1.2
		}
		const imgStyle = {
			width:size.width,
			height:size.height,
			top: this.state.top,
			left: this.state.left
		}
		console.log("[Rendering...] ");
		if(window.PointerEvent){
			return(
				<div className="container" style = {style} tabIndex="-1"
						onKeyDown={this.onKeyDown}
						onTouchStart={this.onTouchStart}
						onTouchMove={this._onTouchMove}
						onTouchEnd={this._onTouchEnd}
						onPointerUp = {this.onPointerUp}>
					<img id="keyboardtype" className="KB" alt="kb"
						src={this.state.keyboardImg} onLoad={this.onLoad}
						style={imgStyle}/>
					<div className="overlay" 
						style={overlayStyle}
						dangerouslySetInnerHTML={{
							__html: this.state.overlayText
						}}></div>
				</div>
			)
		}else{
			return(
				<div className="container" style = {style} tabIndex="-1"
						onKeyDown={this.onKeyDown}
						onMouseDown = {this.onMouseDown}
						onTouchStart={this._onTouchStart}
						onTouchMove={this._onTouchMove}
						onTouchEnd={this._onTouchEnd}>
					<img id="keyboardtype" className="KB" alt="kb"
						src={this.state.keyboardImg} onLoad={this.onLoad}
						style={imgStyle}/>
					<div className="overlay" 
						style={overlayStyle}
						dangerouslySetInnerHTML={{
							__html: this.state.overlayText
						}}></div>
				</div>
			)
		}
		
	}

	reset = (animated) => {
		console.log("call reset...");
		this.setViewPort({
			x:0 , y:0, 
			//width: this.originalDimensions.width, 
			//height:this.originalDimensions.height
			width: this.state.originalDimensions.width, 
			height:this.state.originalDimensions.height
			},animated === true);
		this.clearResetTimeout();
		this.inStartingPosition = true;
	}

	setViewPort = (viewport,animated) =>{
		console.log("Entering setViewPort()");
		var windowDim = this.getWindowDimension();
		console.log("winDim: "+windowDim.width + ":"+windowDim.height);
		console.log("viewport: "+viewport.width + ":"+viewport.height);
		var scaleX = windowDim.width/viewport.width;
		var scaleY = windowDim.height/viewport.height;
		console.log("scale: "+scaleX + ":"+scaleY);
		//var width = scaleX * this.originalDimensions.width;
		//var height = scaleY * this.originalDimensions.height;
		var width = scaleX * this.state.originalDimensions.width;
		var height = scaleY * this.state.originalDimensions.height;
		var x = -1 * viewport.x * scaleX;
		var y = -1 * viewport.y * scaleY;
		console.log("xy: "+viewport.x + ":"+viewport.y);
		console.log("xy: "+scaleX + ":"+scaleY);
		console.log("xy: "+x + ":"+y);

		console.log(x+":"+y+":"+width+":"+height);
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
		var key = this.getKeyChar(pt);
		if(key != null){
			console.log("[Key Presseed] "+key);
			this.props.onKeyCharReceived(key);
			this.flashKey(key);
		}
		return false;
	}

	getWindowDimension = () => {
		console.log("Scale: "+this.config.originalScale)
		return {
			//width: this.originalDimensions.width * this.config.originalScale,
			//height: this.originalDimensions.height * this.config.originalScale
			width: this.state.originalDimensions.width * this.config.originalScale,
			height: this.state.originalDimensions.height * this.config.originalScale
		};
	}

	getKeyChar = (pt) => {
		//console.log("Key Event");
		//var keys = this.env.keymaps.keys;
		//console.log("Key Event: " + keys.length);
		//console.log("Poitn Event => "+ pt.x + "/" + pt.y);
		var minDistance = false, minDistanceKey = null;
		var maxKeyErrorDistSquared = Math.pow(this.config.maxKeyErrorDistance,2);
		var keys = (this.state.keyboardImg === this.imgs[0])? Keymaps.keys : Keymaps.keys_sym;
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
		this.flashTimeout = setTimeout(
			(() => {
				this.setState({
				overlayStyle:{
					opacity: 0}})
			})
			.bind(this),
			duration
		);
	}
}

export default KeyboardNormal;
