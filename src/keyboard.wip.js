import React from 'react';
import ReactDOM from 'react-dom';
import Keymaps from './keys.js'
import Keyboard from './keyboard.normal.js'

// Keyboard2,
//
class KeyboardZoom extends Keyboard {

	// Constructor, normal constructor in java
	constructor(props){
		super(props);
		this.config.zoomFactor = 2.2;
		this.config.originalScale = 0.12;
		this.config.maxZoom = 1.0;
		this.config.resetOnMaxZoom =  true,
		this.config.centerBias = 0.05
		/*
		this.config = {
			resetTimeout: 1000,
			animTime: 0.1,
			useRealKeyboard: true,
			maxKeyErrorDistance: 2,
			minSwipeX: 40,
			minSwipeY: 1
		}*/
		console.log(this.config);
	}

	onPointerDown = (e) => {
		//console.log("[PointerDown]clientXY: "+e.clientX + ":"+e.clientY + " - pageXY: "+e.pageX+
		//":" +e.pageY + "- screenXY: "+e.screenX+":"+e.screenY + "- offsetXY: "+e.nativeEvent.offsetX);
		console.log("[PointerDown] xy - "+e.nativeEvent.x + "/"+e.nativeEvent.y);
		//console.log("this.position.value: "+this.viewport.x +":"+this.viewport.y);
		//console.log("currentZoomLevel: "+(this.position.width)+":"+this.original_dimensions.width);
		// use e.nativeEvent.offsetX,Y for accuracy
		//var x = e.nativeEvent.offsetX / (this.position.width/this.original_dimensions.width);
		//var y = e.nativeEvent.offsetY / (this.position.height/this.original_dimensions.height);
		//this.getKeyChar({x:x,y:y});
		this.onKeyClick(e);
		//e.preventDefault();
		//e.stopPropagation();
	}

	onSwipe(direction){
		if(direction == "left"){
			var key = "delete";
			this.props.callback(key);
		}
		else if(direction == "right"){
		}
		else if(direction == "up"){
			var imgSrc = document.getElementById("keyboardtype").src;
			console.log("imgSrc: " + imgSrc);
			if( imgSrc.split("/")[imgSrc.split("/").length - 1] == "ZoomBoard3b.png"){
				document.getElementById("keyboardtype").src = "/images/symbols3b.png";
			}
			else{
				document.getElementById("keyboardtype").src =  "/images/ZoomBoard3b.png";
			}
		}
		else if(direction == "down"){
		}
	}

	componentDidUpdate = () => {
		console.log("========componentDidUpdate=======");
		/*
		window.setTimeout(() => {
			console.log("timeout");
		},500);*/
		this.offsetTop = ReactDOM.findDOMNode(this).offsetTop;
		this.offsetLeft = ReactDOM.findDOMNode(this).offsetLeft;
	}

	render(){
		const size = this.getWindowDimension();
		const style = {
			width: size.width,
			height: size.height,
		};
		const overlayStyle = {
			width: size.width,
			height: size.height,
			opacity: this.state.overlayStyle.opacity,
			color: this.state.overlayStyle.color,
			fontSize: (size.height/1.2)+"px"
		};
		const font_height = {
			fontSize : size.height / 1.2
		};
		console.log("[render] " +size.width);
		return(
			<div className="container" style={style} onKeyDown={this.onKeyDown} tabIndex="0"
					onPointerDown = {this.onPointerDown}
					onTouchStart={this._onTouchStart}
					onTouchMove={this._onTouchMove}
					onTouchEnd={this._onTouchEnd}>
				<img id="keyboardtype" className="KB" alt="kb"
					src="/images/ZoomBoard3b.png"  onLoad={this.onLoad}
							style={this.state.imgStyle}/>
				<div className="overlay" style={overlayStyle} dangerouslySetInnerHTML={{__html: this.state.overlayText}}>
				</div>
			</div>
		)
	}


	onKeyClick = (e) => {
		//e.preventDefault();
		//e.stopPropagation();
		// console.log("[2Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);

		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.config.zoomFactor;
		var centerBias = this.config.centerBias;
		var maxZoom = this.config.maxZoom;
		console.log("in WIP - " +this.config.zoomFactor + ":" + this.config.centerBias);

		this.clearResetTimeout();
		//Assuming mouse
		if(this.config.gisTouchEnabled){
			console.log("true");
		}else{
			console.log("viewport in wip: "+this.viewport.width + ":"+this.viewport.height);
			var x = e.nativeEvent.offsetX / currentZoomX + this.viewport.x;
			var y = e.nativeEvent.offsetY / currentZoomY + this.viewport.y;
			 console.log("WIP[Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
			 console.log("WIP[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
			 console.log("WIP[Click before doZoom] xy => "+x + "/"+y);
			this.doZoom(x,y,scaleFactor,currentZoomVal,maxZoom,centerBias);
			this.resetTimeoutFunc();
		}
		return false;
	}


	onFingerTouch = (e) => {
		//e.preventDefault();
		//e.stopPropagation();
		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.config.zoomFactor;
		var centerBias = this.config.centerBias;
		var maxZoom = this.config.maxZoom;

		this.clearResetTimeout();

		const touch = e.nativeEvent.changedTouches[0];//e.nativeEvent.changedTouches[0];
		// console.log("touch start x: " + touch.clientX + "; y: " + touch.clientY);
		this.clearResetTimeout();
		//Assuming mouse
		if(this.config.isTouchEnabled){

		}else{
			//pageX includes scroll offset Value
			// console.log("[offset] - "+this.offsetLeft + "/" + this.offsetTop);
			var x =  (touch.pageX - this.offsetLeft) / currentZoomX + this.viewport.x;
			var y =  (touch.pageY - this.offsetTop) / currentZoomY + this.viewport.y;
			//console.log("[Click before doZoom] touchXY => "+touch.clientX + "/"+touch.clientY);
			// console.log("[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
			// console.log("[Click before doZoom] xy => "+x + "/"+y);
			this.doZoom(x,y,scaleFactor,currentZoomVal,maxZoom,centerBias);
			this.resetTimeoutFunc();
		}
		return false;
	}

	resetTimeoutFunc =  () => {
		this.clearResetTimeout();
		var resetTimeout = this.config.resetTimeout;
		this.resetTimeout = window.setTimeout(this.reset,resetTimeout);
	}

	doZoom = (x,y,scaleFactor,currentZoomVal,maxZoom,centerBias) => {
		//var zoomtouch_event = jQuery.Event("zb_zoom")
		//zoomtouch_event.x = x;, zoomtouch_event.y = y;
		//this.element.trigger(zoomtouch_event);

		// console.log("[Debug] scaleFactor/ CurrnetZoomVal / maxZoom -> " + scaleFactor + "/ "+currentZoomVal +"/ "+maxZoom);
		if(scaleFactor * currentZoomVal > maxZoom){
			//console.log("Exceeded maxZoom ");
			var key = this.getKeyChar({x:x,y:y});

			if(key !== null){
				//this.element.trigger(zoomkey_event);
				//this.flashkey(zoomkey_event.key);
				console.log("[doZoom] Key is not null");
				this.props.onKeyCharReceived(key);
				this.flashKey(key);
			}
			this.reset();
			return;
		}else{
			this.in_starting_position = false;
			var newViewportWidth = this.viewport.width / scaleFactor ;
			var newViewportHeight = this.viewport.height / scaleFactor;

			var centeredX = x - newViewportWidth/2;
			var centeredY = y - newViewportHeight/2;

			var biasedViewportX = x - (newViewportWidth * (x - this.viewport.x))/
										this.viewport.width;
			var biasedViewportY = y- (newViewportHeight * (y - this.viewport.y))/
										this.viewport.height;
			console.log("doZoom in wip: "+this.viewport.width + ":"+this.viewport.height);
			console.log("doZoom in wip: "+this.viewport.x + ":"+this.viewport.y);
			console.log("doZoom in wip: "+scaleFactor);
			console.log("doZoom in wip: "+newViewportWidth+ ":"+newViewportHeight);
			console.log("doZoom in wip: "+centeredX + ":" + centeredY);
			this.setViewPort({
				width: newViewportWidth,
				height: newViewportHeight,
				x: biasedViewportX * (1-centerBias) + centeredX * centerBias,
				y: biasedViewportY * (1-centerBias) + centeredY * centerBias,
			});
		}
	}

	getKeyChar(point) {
		console.log("point.x: " + point.x + "; point.y: " + point.y);
		var min_distance = false, min_distance_key = null;
		var max_key_error_distance_squared = Math.pow(this.config.max_key_error_distance, 2);
		console.log("max_key_error_distance_squared: " + max_key_error_distance_squared);
		var keys = Keymaps.keys;
		for(var i = 0, len = keys.length; i<len; i++) {
			var key = keys[i];
			if(key.x <= point.x && key.y <= point.y && key.x+key.width >= point.x && key.y + key.height >= point.y) {
				return key.key;
			} else {
				var key_center_x = key.x + key.width/2;
				var key_center_y = key.y + key.height/2;
				var dx = point.x - key_center_x;
				var dy = point.y - key_center_y;
				var dsquared = Math.pow(dx, 2) + Math.pow(dy, 2);
				if((min_distance_key === null || dsquared < min_distance) && dsquared < max_key_error_distance_squared * Math.pow(Math.min(key.width, key.height), 2)) {
					min_distance = dsquared;
					min_distance_key = key.key;
				}
			}
		}
		return min_distance_key;
	}

	getXZoom = () =>{
		return this.position.width / this.original_dimensions.width;
	}
	getYZoom = () =>{
		return this.position.height / this.original_dimensions.height;
	}
	getZoom = () => {
		return Math.max(this.getXZoom(), this.getYZoom());
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
}

export default KeyboardZoom;
