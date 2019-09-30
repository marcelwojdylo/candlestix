# Candlestix
Candlestix enables the user to see NASDAQ intraday data for a chosen ticker and interval.

[Heroku deploy](https://candlestix.herokuapp.com/)
## Description
Candlestix is a single-page React app which uses axios to fetch data from [Alpha Vantage API](https://www.alphavantage.co/) according to the ticker and interval selected by the user. It contains a tool for charting said data, which was written from scratch using p5.js. It allows zooming and panning through the use of arrow keys on the user's keyboard. 

The chart aims to present a clean and minimal view of the data, in contrast to the more robust but less legible alternatives available elsewhere. This is achieved through restricting the amount of information available and through maximizing the size of the chart itself, keeping the interface to a bare minimum. 
### User profile
Candlestix is designed for everyday use by day traders, allowing them to review and analyze NASDAQ data, as well as save bitmaps of the charts to their drive for later reference/sharing.
### Data displayed
- Box-plotted price
- VWAP (Volume Weighted Average Price) plot
- Volume data
## Technology stack
- ReactJS
- axios
- p5.js
### Dependencies
- axios
- p5
- react
- react-dom
- react-p5-wrapper
- react-scripts
## Components
### Candlestix
The controlling component of the application. Passes data from the ControlPane component to the AlphaVantageService component, then passes the resulting API response to the DataConverter component, and finally passes the formatted data to the IntradayChart component for visualisation. This component also handles the display of status messages to the user.
### ControlPane
Displays a simple form which allows the user to control the content of API requests. The chosen ticker and interval are passed on to the Intraday component.
### AlphaVantageService
Makes axios requests to the Alpha Vantage API returning the response in the form of `Object.entries()` arrays.
### DataConverter
Handles conversion of data received from the AlphaVantage API into an easy to chart format for use by the IntradayChart component. The converted data assumes the form of an Object with the following structure:
```
{
    intradayData:  (1938) [
        {
            close:  109.3262,
            high:  109.3262,
            low:  108.625,
            open:  108.625,
            timestamp: {
                date:  "2019-09-23",
                day:  "23",
                hour:  "09",
                minute:  "31",
                month:  "09",
                year:  "2019"
            },
            volume:  611537
        }, 
        {...}, 
        ...
    ],
    vwapData:  (1938) [109.0925,  109.6576, …]
    datapointsPerDate:  389,
    firstIndexWithLatestDate:  1551
}
```
### IntradayChart
Receives data from the DataConverter component and charts the data using basic p5.js It is enveloped in a `react-p5-wrapper` to allow the passing of data through props. Allows user interaction in the form of zoom/pan with arrow keys. Draws time/price/volume labels appropriate for the current view, recalculating the chart domain dynamically according to what is visible under current zoom/pan conditions.