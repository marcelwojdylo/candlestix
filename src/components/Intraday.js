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
    }

    componentDidMount = () => {
        const {symbol, interval, outputsize} = this.state;
        this.fetchDataFromApi(symbol, interval, outputsize)
    }

    fetchDataFromApi = (symbol, interval, outputsize) => {
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            const intradayData = dataConverter.convertDataForCharting(response);
            // console.log("converted data", intradayData)
            this.setState({
                intradayData: intradayData,
            })
        })
        alphaVantageService.getVWAP(symbol, interval)
        .then(response => {
            const vwap = dataConverter.convertVWAPForCharting(response);
            // console.log("converted vwap", vwap)
            this.setState({
                vwap: vwap,
            })
        })
        alphaVantageService.getSMA(symbol, interval)
        .then(response => {
            const sma50 = dataConverter.convertSMAForCharting(response);
            console.log("converted sma", sma50);
            this.setState({
                sma50: sma50,
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

    toggleDisplayMode = (event) => {
        event.preventDefault();
        this.setState({displayMode:this.state.displayMode==="light"?"dark":"light"})
    }

    render() {
        const {
            symbol,
            interval,
            outputsize,
            intradayData,
            vwap,
            sma50,
        } = this.state;
        const {
            displayMode,
            toggleDisplayMode
        } = this.props;
        // console.log("Intraday.js state.intradayData", intradayData)
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
                    intradayData && vwap && displayMode && <IntradayView intradayData={intradayData} vwap={vwap} sma50={sma50} displayMode={displayMode}/>
                }   
            </div>
        )
    }
}

export default Intraday
