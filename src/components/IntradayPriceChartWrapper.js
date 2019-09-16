import React, { Component } from 'react';
import ReactDOM from "react-dom";
import P5Wrapper from 'react-p5-wrapper';
import IntradayPriceChart from '../charts/IntradayPriceChart.js';

const measureElement = element => {
    const DOMNode = ReactDOM.findDOMNode(element);
    return {
      width: DOMNode.offsetWidth,
      height: DOMNode.offsetHeight,
    };
  }

export class IntradayPriceChartWrapper extends Component {

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
        return (
            <div className="intradayPriceChartWrapper" ref={r => this.wrapperDiv = r}>
                {
                    width !== 0 ? <P5Wrapper sketch={IntradayPriceChart} width={width} height={height} data={this.props.data}/> : <h3>Resize pending</h3>
                }
            </div>
        )
    }
}

export default IntradayPriceChartWrapper;
