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
        chartData: [],
        drawVWAP: false,
        draw50SMA: false,
        draw200SMA: false,
        dataReady: false,
        initialRequestSent: false,
        apiCallStatus: "idle",
        apiTimeout: 60,
        apiCallsFailed: 0,
    }

    // componentDidMount = () => {
    //     const {symbol, interval, outputsize} = this.state;
    //     this.fetchDataFromApi(symbol, interval, outputsize)
    // }

    

    fetchDataFromApi = (symbol, interval, outputsize) => {
        const {
            drawVWAP,
            draw50SMA,
            draw200SMA
        } = this.state;
        let intradayData, vwapData, sma50Data, sma200Data, convertedData;
        this.setState({
            apiCallStatus: "fetching intraday prices",
            initialRequestSent: true,
        })
        clearTimeout(this.apiTimeoutTicker)
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            intradayData = response;
            if (drawVWAP) {
                this.setState({
                    apiCallStatus: "fetching VWAP"
                })
                return alphaVantageService.getVWAP(symbol, interval);
            }
        })
        .then(response => {
            if (drawVWAP) {
                vwapData = response;
            } else {
                vwapData = null;
            }
            if (draw50SMA) {
                this.setState({
                    apiCallStatus: "fetching 50SMA"
                })
                return alphaVantageService.getSMA(symbol, interval, "50");
            }
        })
        .then(response => {
            if (draw50SMA) {
                sma50Data = response;
            } else {
                sma50Data = null
            }
            if (draw200SMA) {
                this.setState({
                    apiCallStatus: "fetching 200SMA"
                })
                return alphaVantageService.getSMA(symbol, interval, "200")
            }
        })
        .then(response => {
            if (draw200SMA) {
                sma200Data = response;
            } else {
                sma200Data = null;
            }
            convertedData = dataConverter.convertForCharting(
                intradayData,
                vwapData, 
                sma50Data, 
                sma200Data
            );
            console.log("Intraday.fetchDataFromApi data after conversion for charting", convertedData);
            this.setState({
                chartData: convertedData,
                apiCallStatus: "idle",
                dataReady: true,
            })
        })
        .catch(error => {
            console.log(error);
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
                            apiCallStatus: `API call limit reached (1/min). Retrying in ${this.state.apiTimeout}s`
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
            dataReady: false,
        })
    }

    

    render() {
        const {
            symbol,
            interval,
            outputsize,
            chartData,
            dataReady,
            drawVWAP,
            draw50SMA,
            draw200SMA,
            initialRequestSent,
            apiCallStatus,
            apiTimeout
        } = this.state;
        const {
            displayMode,
            toggleDisplayMode
        } = this.props;
        // console.log("Intraday.render: state.chartData", chartData)

        const viewPanelContent = () => {
            if (initialRequestSent) {
                return dataReady 
                    ? <IntradayView
                        chartData={chartData} 
                        displayMode={displayMode}
                        drawVWAP={drawVWAP}
                        draw50SMA={draw50SMA}
                        draw200SMA={draw200SMA}
                    />
                    : <><h3>Fetching data from AlphaVantage API, please hold.</h3><p><b>Status: </b>{apiCallStatus}</p></>
            } else {
                return (
                    <article className="instructionsCard">
                        <h3>No data to show.</h3>
                        <p>
                            Use the control bar above to select the data you would like to see visualised. Welcome to <b>Candlestix</b>. 
                        </p>
                    </article>
                )
            }
        }

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
                {viewPanelContent()}   
                {/* <div className="footer">
                    <button onClick={toggleDisplayMode}>toggle display mode</button>
                </div> */}
            </div>
        )
    }
}

export default Intraday
