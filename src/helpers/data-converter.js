class DataConverter {

    convertForCharting (intradayData, vwapData=null, sma50Data=null, sma200Data=null) {

        intradayData = this.truncateToTodaysData(intradayData);
        intradayData = this.parseIntraday(intradayData);
        intradayData = intradayData.reverse();
        
        if (vwapData !== null) {
            vwapData = this.truncateToTodaysData(vwapData);
            vwapData = this.parseVWAP(vwapData);
            vwapData = vwapData.reverse();
        }
        
        if (sma50Data !== null) {
            sma50Data = this.truncateToTodaysData(sma50Data);
            sma50Data = this.parseSMA(sma50Data);
            sma50Data = sma50Data.reverse();
        }
        
        if (sma200Data !== null) {
            sma200Data = this.truncateToTodaysData(sma200Data);
            sma200Data = this.parseSMA(sma200Data);
            sma200Data = sma200Data.reverse();
        }
        
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