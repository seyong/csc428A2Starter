import React from 'react';
import Keymaps from './keys.js'

const withZoom = (WrappedComponent) =>{
    return class extends React.Component{

        constructor(props){
            super(props);
            this.original_position =  {x:0,y:0};
		    this.original_dimensions = {width:0, height:0};
            this.displaySize = this.props.displaySize;
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
            // console.log("[2Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
    
            var currentZoomX = this.getZoomX();
            var currentZoomY = this.getZoomY();
            var currentZoomVal = this.getZoom();
    
            var scaleFactor = this.env.zoomFactor;
            var centerBias = this.env.centerBias;
            var maxZoom = this.env.maxZoom;
    
            this.clearResetTimeout();
            //Assuming mouse
            if(this.env.isTouchEnabled){
                console.log("true");
            }else{
                var x = e.nativeEvent.offsetX / currentZoomX + this.viewport.x;
                var y = e.nativeEvent.offsetY / currentZoomY + this.viewport.y;
                // console.log("[Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
                // console.log("[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
                // console.log("[Click before doZoom] xy => "+x + "/"+y);
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
    
            var scaleFactor = this.env.zoomFactor;
            var centerBias = this.env.centerBias;
            var maxZoom = this.env.maxZoom;
    
            this.clearResetTimeout();
    
            const touch = e.nativeEvent.changedTouches[0];//e.nativeEvent.changedTouches[0];
            // console.log("touch start x: " + touch.clientX + "; y: " + touch.clientY);
            this.clearResetTimeout();
            //Assuming mouse
            if(this.env.isTouchEnabled){
    
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
            var resetTimeout = this.env.resetTimeout;
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
                    this.props.callback(key);
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
                this.setViewPort({
                    width: newViewportWidth,
                    height: newViewportHeight,
                    x: biasedViewportX * (1-centerBias) + centeredX * centerBias,
                    y: biasedViewportY * (1-centerBias) + centeredY * centerBias,
                });
            }
        }

        getZoomX = () => {
            return this.position.width / this.original_dimensions.width;
        }

        getZoomY = () => {
            return this.position.height / this.original_dimensions.height;
        }

        getZoom = () => {
            return Math.max(this.getZoomX(), this.getZoomY());
        }
        render(){
            return (
                <WrappedComponent 
                    {...this.props} 
                    {...this.state} 
                    onKeyClick={this.onKeyClick.bind(this)}
                    onFingerTouch ={this.onFingerTouch.bind(this)}
                />
            )
        }
    } // end return Class
}

export default withZoom;