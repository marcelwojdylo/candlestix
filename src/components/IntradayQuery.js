import React, { Component } from 'react'

export class IntradayQuery extends Component {
    render() {
        const {symbol, interval, outputsize, handleChange, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="intradayQuery">
                <input name="symbol" value={symbol} onChange={handleChange}></input>
                <select name="interval" value={interval} onChange={handleChange}>
                    <option value="1min">1 minute</option>
                    <option value="5min">5 minutes</option>
                    <option value="15min">15 minutes</option>
                    <option value="30min">30 minutes</option>
                    <option value="60min">60 minutes</option>
                </select>
                <select name="outputsize" value={outputsize} onChange={handleChange}>
                    <option value="compact">compact</option>
                    <option value="full">full</option>
                </select>
                <input type="submit"></input>
            </form>
        )
    }
}

export default IntradayQuery
