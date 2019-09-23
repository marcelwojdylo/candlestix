import React, { Component } from 'react'


export class ControlPane extends Component {

    render() {
        const {symbol, interval, handleChange, handleSubmit} = this.props;
        return (
            <div className="controlPane">
                <p>Use arrow buttons to zoom (up/down) and pan (left/right). Set ticker and interval --></p>
                <form className="intradayQueryForm" onSubmit={handleSubmit}>
                    <input type="text" name="symbol" value={symbol} onChange={handleChange}></input>
                    <select name="interval" value={interval} onChange={handleChange}>
                        <option value="1min">1 minute</option>
                        <option value="5min">5 minutes</option>
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="60min">60 minutes</option>
                    </select>
                    <input type="checkbox" name="drawVWAP" defaultChecked></input>
                    VWAP
                    <input type="checkbox" name="draw50SMA"></input>
                    50SMA
                    <input type="checkbox" name="draw200SMA"></input>
                    200SMA
                    {/* <select name="outputsize" value={outputsize} onChange={handleChange}>
                        <option value="compact">compact</option>
                        <option value="full">full</option>
                    </select> */}
                    <button type="submit">view</button>
                </form>
            </div>
        )
    }
}

export default ControlPane
