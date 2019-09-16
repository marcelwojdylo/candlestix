import React, { Component } from 'react';
import ReactDOM from "react-dom";
import P5Wrapper from 'react-p5-wrapper';
import IntradayVolumeChart from '../charts/IntradayVolumeChart.js';

const measureElement = element => {
    const DOMNode = ReactDOM.findDOMNode(element);
    return {
      width: DOMNode.offsetWidth,
      height: DOMNode.offsetHeight,
    };
  }

export class IntradayVolumeChartWrapper extends Component {

    state = {
        width: 0,
        height: 0
    }

    wrapperDiv = React.createRef();

    componentDidMount () {
        this.setState({
            width: measureElement(this.wrapperDiv).width,
            height: measureElement(this.wrapperDiv).height
        })
    }

    render() {
        const {
            width,
            height
        } = this.state;
        return (
            <div className="intradayVolumeChartWrapper" ref={r => this.wrapperDiv = r}>
                <P5Wrapper sketch={IntradayVolumeChart} width={width} height={height} data={this.props.data}/>                
            </div>
        )
    }
}

export default IntradayVolumeChartWrapper;
