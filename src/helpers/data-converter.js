class DataConverter {

    convertForCharting (intradayData, vwapData, sma50Data, sma200Data) {

        intradayData = this.truncateToTodaysData(intradayData);
        vwapData = this.truncateToTodaysData(vwapData);
        sma50Data = this.truncateToTodaysData(sma50Data);
        sma200Data = this.truncateToTodaysData(sma200Data);
        

        intradayData = this.parseIntraday(intradayData);
        vwapData = this.parseVWAP(vwapData);
        sma50Data = this.parseSMA(sma50Data);
        sma200Data = this.parseSMA(sma200Data);

        intradayData = intradayData.reverse();
        vwapData = vwapData.reverse();
        sma50Data = sma50Data.reverse();
        sma200Data = sma200Data.reverse();
        
        // console.log(
        //     "DataConverter.convertForCharting:",
        //     "intradayData",
        //     intradayData,
        //     "vwapData",
        //     vwapData,
        //     "sma50Data",
        //     sma50Data
        // )

        return {
            intradayData: intradayData,
            vwapData: vwapData,
            sma50Data: sma50Data,
            sma200Data: sma200Data,
        }
    }


    truncateToTodaysData = (data) => {
        const todaysData = [];
        const latestDate = data[0][0].slice(0,10);
        for (let i = 0; data[i][0].slice(0,10) === latestDate; i++) {
            todaysData.push(data[i])
        }
        return todaysData;
    }

    parseIntraday = (data) => {
        let parsedData = []
        for (let i = 0; i<data.length; i++) {
            parsedData.push(
                {
                    open: parseFloat(data[i][1]["1. open"]),
                    close: parseFloat(data[i][1]["4. close"]),
                    high: parseFloat(data[i][1]["2. high"]),
                    low: parseFloat(data[i][1]["3. low"]),
                    volume: parseFloat(data[i][1]["5. volume"]),
                    timestamp: data[i][0]
                }
            )
        }
        return parsedData;
    }

    parseVWAP = (data) => {
        let parsedData = [];
        for (let i = 0; i<data.length; i++) {
            parsedData.push(parseFloat(data[i][1].VWAP))
        }
        return parsedData;
    }

    parseSMA = (data) => {
        let parsedData = [];
        for (let i = 0; i<data.length; i++) {
            parsedData.push(parseFloat(data[i][1].SMA))
        }
        return parsedData;
    }
}

const dataConverter = new DataConverter();
export default dataConverter;