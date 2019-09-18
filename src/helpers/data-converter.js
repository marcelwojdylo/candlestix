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

    getPriceDomain = (parsedData) => {
        let allValues = [];
        for (let element of parsedData) {
            allValues.push(
                element[0],
                element[1],
                element[2],
                element[3]
            )
        }
        return {min: Math.min(...allValues), max: Math.max(...allValues)}
    }

    getVolumeDomain = (data) => {
        let volumes = [];
        for (let element of data) {
            volumes.push(element[4])
        }
        return {min: Math.min(...volumes), max: Math.max(...volumes)}
    }

    computeIntraday = (intradayData, priceDomain, volumeDomain) => {
        for (let i = 0; i<intradayData.length; i++) {
            intradayData[i] = {
                "open": {
                    "value": intradayData[i][0],
                    "percentageOfSpread": this.getPercentageOfSpread(intradayData[i][0], priceDomain)
                },
                "close": {
                    "value": intradayData[i][1],
                    "percentageOfSpread": this.getPercentageOfSpread(intradayData[i][1], priceDomain)
                },
                "high": {
                    "value": intradayData[i][2],
                    "percentageOfSpread": this.getPercentageOfSpread(intradayData[i][2], priceDomain)
                },
                "low": {
                    "value": intradayData[i][3],
                    "percentageOfSpread": this.getPercentageOfSpread(intradayData[i][3], priceDomain)
                },
                "volume": {
                    "value": intradayData[i][4],
                    "percentageOfSpread": this.getPercentageOfSpread(intradayData[i][4], volumeDomain)
                },
                "timestamp": intradayData[i][5]
            }
        }
        return intradayData;
    }

    computeVWAP = (vwapData, priceDomain) => {
        for (let i = 0; i<vwapData.length; i++) {
            vwapData[i] = {
                "value": vwapData[i],
                "percentageOfSpread": this.getPercentageOfSpread(vwapData[i], priceDomain)
            }
        }
        // console.log("vwap conversion result", vwap);
        return vwapData;
    }

    computeSMA = (smaData, priceDomain) => {
        for (let i = 0; i<smaData.length; i++) {
            smaData[i] = {
                "value": smaData[i],
                "percentageOfSpread": this.getPercentageOfSpread(smaData[i], priceDomain)
            }
        }
        // console.log("dataConverter smaData conversion result", smaData);
        return smaData;    
    }


    getPercentageOfSpread = (point, domain) => {
        let spread = this.getSpread(domain);
        return (point - domain.min)/spread
    }

    getSpread = (domain) => {
        return domain.max - domain.min
    }

    getPriceThresholds = (domain) => {
        const spread = this.getSpread(domain);
        let thresholds = [];
        let numberOfThresholds = 10;
        let step = spread/(numberOfThresholds-1);
        for (let i = 0; i<=numberOfThresholds;i++) {
            const value = domain.min+step*i;
            const percentageOfSpread = this.getPercentageOfSpread(value, domain);
            thresholds.push({
                "value": value,
                "percentageOfSpread": percentageOfSpread
            })
        }
        return thresholds;
    }

    getVolumeThresholds = (domain) => {
        let spread = this.getSpread(domain);
        let numberOfThresholds = 5;
        let step = spread/(numberOfThresholds-1);
        let thresholds = [];
        for (let i = 0; i<=numberOfThresholds; i++) {
            thresholds.push(domain.min+step*i)
        }
        return thresholds;
    }
}

const dataConverter = new DataConverter();
export default dataConverter;