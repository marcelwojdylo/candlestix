import React, { Component } from 'react';
import ReactDOM from "react-dom";
import P5Wrapper from 'react-p5-wrapper';
import IntradayChart from '../charts/IntradayChart.js';

const measureElement = element => {
    const DOMNode = ReactDOM.findDOMNode(element);
    return {
      width: DOMNode.offsetWidth,
      height: DOMNode.offsetHeight,
    };
  }

export class IntradayChartWrapper extends Component {

    state = {
        width: 0,
        height: 0
    }

    wrapperDiv = React.createRef();

    componentDidMount () {
        const newWidth = measureElement(this.wrapperDiv).width;
        const newHeight = measureElement(this.wrapperDiv).height;
        this.setState({
            width: newWidth,
            height: newHeight,
        })
    }

    render() {
        const {
            width,
            height
        } = this.state;
        const {
            intradayData,
            vwap,
            sma50,
            displayMode
        } = this.props;
        // console.log("ICW render", this.props.intradayData)
        return (
            <div className="intradayChartWrapper" ref={r => this.wrapperDiv = r}>
                {
                    width !== 0 && intradayData && vwap ? <P5Wrapper 
                            sketch={IntradayChart} 
                            width={width} 
                            height={height} 
                            intradayData={intradayData} 
                            vwap={vwap} 
                            sma50={sma50}
                            cols={{
                                firstVisible:0, 
                                lastVisible: intradayData.data.length,
                            }} 
                            mode={displayMode}/>
                        : <h3>Resize pending</h3>
                }
            </div>
        )
    }
}

export default IntradayChartWrapper;
