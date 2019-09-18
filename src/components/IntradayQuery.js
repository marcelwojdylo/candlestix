import React, { Component } from 'react'

export class IntradayQuery extends Component {
    render() {
        const {symbol, interval, handleChange, handleSubmit} = this.props;
        return (
            <div className="intradayQuery">
                <p>Use arrow buttons to zoom (up/down) and pan (left/right). Set ticker and interval --></p>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input name="symbol" value={symbol} onChange={handleChange}></input>
                        <select name="interval" value={interval} onChange={handleChange}>
                            <option value="1min">1 minute</option>
                            <option value="5min">5 minutes</option>
                            <option value="15min">15 minutes</option>
                            <option value="30min">30 minutes</option>
                            <option value="60min">60 minutes</option>
                        </select>
                        {/* <select name="outputsize" value={outputsize} onChange={handleChange}>
                            <option value="compact">compact</option>
                            <option value="full">full</option>
                        </select> */}
                        <button type="submit" onClick={handleSubmit}>view</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default IntradayQuery
