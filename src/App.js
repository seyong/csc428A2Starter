import React from 'react';
import { Route } from 'react-router-dom';
import Watch from './watch.js';

class App extends React.Component{
    render(){
        return (
            <div>
                <Route exact path="/" render = {(props) => <Watch {...props} originalScale={0.15} type={'normal'}/>} />
                <Route exact path="/:type/:scaleVal" component={Watch}/> 
            </div>
        )
    }
}

export default App;