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
        dataReady: false,
        apiCallStatus: "idle",
        apiTimeout: 60,
        apiCallsFailed: 0,
    }

    componentDidMount = () => {
        const {symbol, interval, outputsize} = this.state;
        this.fetchDataFromApi(symbol, interval, outputsize)
    }

    

    fetchDataFromApi = (symbol, interval, outputsize) => {
        let intradayData, vwapData, sma50Data, sma200Data, convertedData;
        this.setState({
            apiCallStatus: "fetching intraday prices"
        })
        clearTimeout(this.apiTimeoutTicker)
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            intradayData = response;
            this.setState({
                apiCallStatus: "fetching VWAP"
            })
            return alphaVantageService.getVWAP(symbol, interval);
        })
        .then(response => {
            vwapData = response;
            this.setState({
                apiCallStatus: "fetching 50SMA"
            })
            return alphaVantageService.getSMA(symbol, interval, "50");
        })
        .then(response => {
            sma50Data = response;
            this.setState({
                apiCallStatus: "fetching 200SMA"
            })
            return alphaVantageService.getSMA(symbol, interval, "200")
        })
        .then(response => {
            sma200Data = response;
            convertedData = dataConverter.convertForCharting(intradayData, vwapData, sma50Data, sma200Data);
            // console.log("Intraday.fetchDataFromApi data after conversion for charting", convertedData);
            this.setState({
                chartData: convertedData,
                apiCallStatus: "idle",
                dataReady: true,
            })
        })
        .catch(error => {
            this.apiTimeoutTicker = setInterval(() => {
                if (this.state.apiCallsFailed < 3) {
                    if (this.state.apiTimeout === 0) {
                        this.fetchDataFromApi(symbol, interval, outputsize)
                        this.setState({
                            apiTimeout: 60,
                            apiCallsFailed: this.state.apiCallsFailed+1
                        })
                    } else {
                        this.setState({
                            apiTimeout: this.state.apiTimeout-1,
                            apiCallStatus: `API call limit reached (1/min). Retry in ${this.state.apiTimeout}s`
                        })
                    }
                } else {
                    this.setState({apiCallStatus: `API key is probably in use by more than one client. Please try again later.`})
                }
            }, 1000)
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
        this.setState({
            dataReady: false
        })
    }

    

    render() {
        const {
            symbol,
            interval,
            outputsize,
            chartData,
            dataReady,
            apiCallStatus,
            apiTimeout
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
                    dataReady 
                        ? <IntradayView chartData={chartData} displayMode={displayMode}/>
                        : <><h3>Fetching data from AlphaVantage API, please hold.</h3><p><b>Status: </b>{apiCallStatus}</p></>
                }   
                <div className="footer">
                    <button onClick={toggleDisplayMode}>toggle display mode</button>
                </div>
            </div>
        )
    }
}

export default Intraday
