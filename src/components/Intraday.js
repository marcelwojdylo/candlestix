import React, { Component } from 'react';
import alphaVantageService from '../services/alpha-vantage-service.js';
import dataConverter from '../helpers/data-converter.js'
import IntradayQuery from './IntradayQuery.js';
import IntradayView from './IntradayView.js';

export class Intraday extends Component {

    state = {
        symbol: "ROKU",
        interval: "1min",
        outputsize: "full",
        data: [],
        vwap: [],
        chartData: [],
    }

    componentDidMount = () => {
        const {symbol, interval, outputsize} = this.state;
        this.fetchDataFromApi(symbol, interval, outputsize)
    }

    

    fetchDataFromApi = (symbol, interval, outputsize) => {
        let intradayData, vwapData, sma50Data, sma200Data, convertedData;
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            intradayData = response;
            return alphaVantageService.getVWAP(symbol, interval);
        })
        .then(response => {
            vwapData = response;
            return alphaVantageService.getSMA(symbol, interval, "50");
        })
        .then(response => {
            sma50Data = response;
            return alphaVantageService.getSMA(symbol, interval, "200")
        })
        .then(response => {
            sma200Data = response;
            convertedData = dataConverter.convertForCharting(intradayData, vwapData, sma50Data, sma200Data);
            // console.log("Intraday.fetchDataFromApi data after conversion for charting", convertedData);
            this.setState({
                chartData: convertedData
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
            chartData
        } = this.state;
        const {
            displayMode,
            toggleDisplayMode
        } = this.props;
        // console.log("Intraday.render: state.chartData", chartData)
        return (
            <div className="intraday">
                <IntradayQuery 
                    symbol={symbol} 
                    interval={interval} 
                    outputsize={outputsize} 
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    toggleDisplayMode={toggleDisplayMode}
                />
                {
                    chartData.intradayData && displayMode && <IntradayView chartData={chartData} displayMode={displayMode}/>
                }   
            </div>
        )
    }
}

export default Intraday
