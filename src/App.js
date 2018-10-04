import React from 'react';
import Watch from './Watch';

class App extends React.Component{
    render(){
        return (
            <div>
                <Route exact path="/" component={Watch}/>
                <Route path="/normal" component={Watch}/>
            </div>
        )
    }
}

export default App;