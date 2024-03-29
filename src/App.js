import React, {Component} from 'react';
import './App.css';
import Candlestix from './components/Candlestix.js'

class App extends Component{

  state = {
    displayMode: "dark",
  }

  toggleDisplayMode = () => {
    this.setState({
      displayMode: this.state.displayMode==="light"?"dark":"light"
    })
  }
  
  render () {
    const {displayMode} = this.state;
    displayMode === "light"?
      document.body.style = 'background: rgb(199, 203, 209); color: black':
      document.body.style = 'background: black'
    return (
      <>
        <Candlestix toggleDisplayMode={this.toggleDisplayMode} displayMode={displayMode}/>
      </>
    );
  }
}

export default App;
