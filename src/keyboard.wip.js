import React from 'react';
import {keys,keys_sym} from './keys.js'

// Keyboard2, 
//	 
class Keyboard2 extends React.Component {

	// Constructor, normal constructor in java
	constructor(props){
		super(props);
		// this is the state variables, which is very special in React.
		// In react, once the state variables has changed by calling setState(),
		// render() function is followed. 
		// this.props is the property passing by their parent DOM in this case,
		// Watch class

		// Please have a look doZoom, setViewport, and setPosition functions
		this.state ={
		
		 original_position: {x:0,y:0,width:0,height:0}, //ignore 
		 original_dimensions: {width:0, height:0}, //ignore
		 font_size: 0, // haven't use
		 // When user touch or click, imgStyle value has changes so that 
		 // 	the class re-render their html componenets
		 imgStyle :{ 
			 left:0,top:0,
			 width: this.props.width,
			 height: this.props.height
		 },
		 overlayStyle : {
			 opacity: 0,
			 color: "white"
		 },
		 overlayText : ""
		};

		this.in_starting_position =  true;
		this.original_position = {x:0,y:0};
		this.original_dimensions = {width:0,height:0};
		this.displaySize = this.props.displaySize;

		// this configuration is from original zoomboard code
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

		// register Event
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
	}

	// When the image is loaded, we recalculate the img size to fit into our
	// 	fixed width and height
	onLoad({target:img}){
		console.log("image naturalSize: "+img.naturalWidth+":"+img.naturalHeight);
		this.original_dimensions = {width : img.naturalWidth, height:img.naturalHeight};
		console.log("[onLoad]  - "+this.original_dimensions.width+":"+this.original_dimensions.height);
		this.env.originalScale = this.displaySize.width/this.original_dimensions.width;
		this.setState({original_scale: 
							this.displaySize.width/this.original_dimensions.width});
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
			this.flashKey(key);
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	}

	// mouse click event is handled here.
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

	componentDidUpdate = () => {
		console.log("========componentDidUpdate=======");
		/*
		window.setTimeout(() => {
			console.log("timeout");
		},500);*/
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
					onMouseDown={this.onMouseDown} onPointerDown={this.onPointerDown}>
				<img src="/images/ZoomBoard3.png" className="KB" alt="kb" onLoad={this.onLoad}
							style={this.state.imgStyle}/>
				<div className="overlay" style={overlayStyle} dangerouslySetInnerHTML={{__html: this.state.overlayText}}>
				</div>
			</div>
		)
	}

	getWindowDimension = () => {
		return {
			width: this.original_dimensions.width * this.env.originalScale,
			height: this.original_dimensions.height * this.env.originalScale
		};
	}

	reset = (animated) => {
		console.log("[Reset] reser called.. originDim - "+this.original_dimensions.width+":"+this.original_dimensions.height);
		this.setViewPort({x:0 , y:0, width: this.original_dimensions.width, height:this.original_dimensions.height},
			animated === true);
		this.clearResetTimeout();
		this.in_starting_position = true;
	}

	setViewPort = (viewport,animated) =>{
		var windowDim = this.getWindowDimension();
		var scale_x = windowDim.width/viewport.width;
		var scale_y = windowDim.height/viewport.height;
		console.log("windowDim - "+windowDim.width +":"+windowDim.height);
		console.log("[setViewport] called.. originDim - "+viewport.width+":"+viewport.height);
		console.log("Scale XY - "+scale_x +":"+scale_y);
		var width = scale_x * this.original_dimensions.width;
		var height = scale_y * this.original_dimensions.height;
		var x = -1 * viewport.x * scale_x;
		var y = -1 * viewport.y * scale_y;

		this.setPosition({x:x,y:y,width:width,height:height},animated);
		this.viewport = viewport;
	}

	setPosition = (position,animated) => {
		if(animated === false){
			//img.css -webkit-transition none
			//img.css -webkit-transition all 0.001s ease-out
		}
		console.log("Left/Top/Width/Height: "+position.x+"/"+position.y+"/"+position.width+"/"+position.height);
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

	clearResetTimeout = () => {
		if(this.resetTimeout !== undefined){
			window.clearTimeout(this.resetTimeout);
		}
		this.resetTimeout = undefined;
	}

	onKeyClick = (e) => {
		//e.preventDefault();
		//e.stopPropagation();
		console.log("[2Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);

		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.env.zoomFactor;
		var centerBias = this.env.centerBias;
		var maxZoom = this.env.maxZoom;

		this.clearResetTimeout();
		//Assuming mouse
		if(this.env.isTouchEnabled){

		}else{
			var x = e.nativeEvent.offsetX / currentZoomX + this.viewport.x;
			var y = e.nativeEvent.offsetY / currentZoomY + this.viewport.y;
			console.log("[Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
			console.log("[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
			console.log("[Click before doZoom] xy => "+x + "/"+y);
			this.doZoom(x,y,scaleFactor,currentZoomVal,maxZoom,centerBias);
			this.resetTimeoutFunc();
		}
		return false;
	}

	resetTimeoutFunc =  () => {
		this.clearResetTimeout();
		var resetTimeout = this.env.resetTimeout;
		this.resetTimeout = window.setTimeout(this.reset,resetTimeout);
	}

	doZoom = (x,y,scaleFactor,currentZoomVal,maxZoom,centerBias) => {
		//var zoomtouch_event = jQuery.Event("zb_zoom")
		//zoomtouch_event.x = x;, zoomtouch_event.y = y;
		//this.element.trigger(zoomtouch_event);

		console.log("[Debug] scaleFactor/ CurrnetZoomVal / maxZoom -> " + scaleFactor + "/ "+currentZoomVal +"/ "+maxZoom);
		if(scaleFactor * currentZoomVal > maxZoom){
			console.log("Exceeded maxZoom ");
			//var key = this.getKeyChar({x:x,y:y});
			
			//if(key !== null){
				//var zoomkey_event = jQuery.Event("zb_key");
				//zoomkey_event.key = key.key;
				//zoomkey_event.entry_type = "press";
				//this.element.trigger(zoomkey_event);
				//this.flashkey(zoomkey_event.key);	
			//	console.log("[doZoom] Key is not null");
			//}
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
			this.setViewPort({
				width: newViewportWidth,
				height: newViewportHeight,
				x: biasedViewportX * (1-centerBias) + centeredX * centerBias,
				y: biasedViewportY * (1-centerBias) + centeredY * centerBias,
			});
		}
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
		/*
		this.flashTimeout = window.setTimeout(
			this.setState({
				overlayStyle:{
					opacity: 0
			}}),duration);*/
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

export default Keyboard2;