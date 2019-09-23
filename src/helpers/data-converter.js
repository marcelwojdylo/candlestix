class DataConverter {

    convertForCharting (intradayData, vwapData) {

        // intradayData = this.truncateToTodaysData(intradayData);
        intradayData = this.parseIntraday(intradayData);
        intradayData = intradayData.reverse();
        
        // vwapData = this.truncateToTodaysData(vwapData);
        vwapData = this.parseVWAP(vwapData);
        vwapData = vwapData.reverse();
        
        const firstIndexWithLatestDate = this.getFirstIndexWithLatestDate(intradayData);

        
        // console.log(
        //     "DataConverter.convertForCharting:",
        //     "intradayData",
        //     intradayData,
        //     "vwapData",
        //     vwapData,
        //     "firstIndexWithLatestDate",
        //     firstIndexWithLatestDate
        // )

        return {
            intradayData: intradayData,
            vwapData: vwapData,
            firstIndexWithLatestDate: firstIndexWithLatestDate,
        }
    }


    getFirstIndexWithLatestDate = (data) => {
        let firstIndexWithLatestDate = -1;
        const latestDate = data[data.length-1].timestamp.slice(0,10);
        for (let i = 0; firstIndexWithLatestDate === -1; i++) {
            if (data[i].timestamp.slice(0,10) === latestDate) {
                firstIndexWithLatestDate = i;
            }
        }
        return firstIndexWithLatestDate;
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
}

const dataConverter = new DataConverter();
export default dataConverter;