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
            height,
        } = this.state;
        const {
            chartData,
            displayMode,
            drawVWAP,
            draw50SMA,
            draw200SMA
        } = this.props;
        // console.log("chart wrapper render", this.props.drawVWAP)
        return (
            <div className="intradayChartWrapper" ref={r => this.wrapperDiv = r}>
                {
                    width !== 0 && chartData? <P5Wrapper 
                            sketch={IntradayChart} 
                            width={width} 
                            height={height}
                            chartData={chartData}
                            drawVWAP={drawVWAP}
                            draw50SMA={draw50SMA}
                            draw200SMA={draw200SMA}
                            cols={{
                                firstVisible:0, 
                                lastVisible: chartData.intradayData.length,
                            }} 
                            mode={displayMode}/>
                        : <h3>Resize pending</h3>
                }
            </div>
        )
    }
}

export default IntradayChartWrapper;
