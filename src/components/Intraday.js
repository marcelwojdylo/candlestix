import React, { Component } from 'react';
import alphaVantageService from '../services/alpha-vantage-service.js';
import dataConverter from '../helpers/data-converter.js'
import IntradayQuery from './IntradayQuery.js';
import IntradayView from './IntradayView.js';

export class Intraday extends Component {

    state = {
        symbol: "MSFT",
        interval: "1min",
        outputsize: "full",
        data: []
    }

    componentDidMount = () => {
        const {symbol, interval, outputsize} = this.state;
        this.fetchDataFromApi(symbol, interval, outputsize)
    }

    fetchDataFromApi = (symbol, interval, outputsize) => {
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            this.setState({
                data: dataConverter.convertDataForCharting(response),
            })
        })
    }

    handleChange = (event) => {  
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {symbol, interval, outputsize} = this.state;
        this.fetchDataFromApi(symbol, interval, outputsize)
    }

    render() {
        const {
            symbol,
            interval,
            outputsize,
            data
        } = this.state;
        return (
            <div className="intraday">
                <IntradayQuery 
                    symbol={symbol} 
                    interval={interval} 
                    outputsize={outputsize} 
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                />
                <IntradayView data={data}/>
            </div>
        )
    }
}

export default Intraday
