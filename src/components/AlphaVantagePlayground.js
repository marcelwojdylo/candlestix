import React, { Component } from 'react';
import alphaVantageService from '../services/alpha-vantage-service.js';
import dataConverter from '../helpers/data-converter.js'
import P5Wrapper from 'react-p5-wrapper';
import sketch from '../sketches/sketch.js';

class AlphaVantagePlayground extends Component {

    state = {
        symbol: "MSFT",
        interval: "1min",
        outputsize: "compact",
        dataFromApi: {},
        chartData: [],
        canvasWidth: 300,
        canvasHeight: 300,
        vwap: {}
    }

    getDataFromApi = (symbol, interval, outputsize) => {
        let size;
        if (outputsize === 'compact') {
            size = 100;
        } else {
            size = 390;
        }
        alphaVantageService.getIntraday(symbol, interval, outputsize)
        .then(response => {
            this.setState({
                dataFromApi: response.reverse().slice(0,size),
                chartData: dataConverter.convertDataForCharting(response)
            })
        })
        alphaVantageService.getVWAP(symbol, interval)
        .then(response => {
            console.log(response);
            // this.setState({
            //     vwap: response,
            // })
        })
    }

    componentDidMount = () => {
        const {symbol, interval, outputsize} = this.state;
        this.getDataFromApi(symbol, interval, outputsize)
    }

    handleChange = (event) => {  
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {symbol, interval, outputsize} = this.state;
        this.getDataFromApi(symbol, interval, outputsize)
    }

    render() {
        const {
            symbol, 
            interval, 
            outputsize, 
            dataFromApi, 
            chartData
        } = this.state;
        // console.log("render data", chartData);
        // console.log("render ts", timeSeries);
        return (
            <div>
                <h1>Alpha Vantage Playground</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name="symbol" value={symbol} onChange={this.handleChange}></input>
                    <select name="interval" value={interval} onChange={this.handleChange}>
                        <option value="1min">1 minute</option>
                        <option value="5min">5 minutes</option>
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="60min">60 minutes</option>
                    </select>
                    <select name="outputsize" value={outputsize} onChange={this.handleChange}>
                        <option value="compact">compact</option>
                        <option value="full">full</option>
                    </select>
                    <input type="submit"></input>
                </form>
                <P5Wrapper sketch={sketch} height="600" width="1400" data={chartData}/>
                <section>
                {
                    dataFromApi.length > 0
                    ? dataFromApi.map((unit, key) => {
                        const timestamp = unit[0]
                        const data = unit[1]
                        return (
                            <article key={key}>
                                <p>{timestamp}</p>
                                <p>Open: {data["1. open"]}</p>
                                <p>Close: {data["4. close"]}</p>
                                <p>High: {data["2. high"]}</p>
                                <p>Low: {data["3. low"]}</p>
                                <p>Volume: {data["5. volume"]}</p>
                                <p></p>
                            </article>
                        )
                    })
                    : <h2>No time series available.</h2>
                }
                </section>
            </div>
        )
    }
}

export default AlphaVantagePlayground
