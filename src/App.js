import React, {Component} from 'react';
import './App.css';
import Intraday from './components/Intraday.js'

class App extends Component{

  state = {
    displayMode: "light",
  }

  toggleDisplayMode = () => {
    this.setState({
      displayMode: this.state.displayMode==="light"?"dark":"light"
    })
  }
  
  render () {
    const {displayMode} = this.state;
    return (
      <>
        {
          displayMode === "light"?
            document.body.style = 'background: white':
            document.body.style = 'background: black'
        }
        <Intraday toggleDisplayMode={this.toggleDisplayMode} displayMode={displayMode}/>
      </>
    );
  }
}

export default App;
