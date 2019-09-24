class DataConverter {

    convertForCharting (intradayData, vwapData) {

        // intradayData = this.truncateToTodaysData(intradayData);
        intradayData = this.parseIntraday(intradayData);
        intradayData = intradayData.reverse();
        
        // vwapData = this.truncateToTodaysData(vwapData);
        vwapData = this.parseVWAP(vwapData);
        vwapData = vwapData.reverse();
        
        const firstIndexWithLatestDate = this.getFirstIndexWithLatestDate(intradayData);

        const datapointsPerDate = this.getDatapointsPerDate(intradayData);
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
            datapointsPerDate: datapointsPerDate,
        }
    }

    getDatapointsPerDate = (data) => {
        let datapointsPerDate = 0;
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            if (element.timestamp.date === data[0].timestamp.date) {
                datapointsPerDate++;
            } else {
                break;
            }
        }
        return datapointsPerDate;
    }

    getFirstIndexWithLatestDate = (data) => {
        let firstIndexWithLatestDate = -1;
        const latestDate = data[data.length-1].timestamp.date;
        for (let i = 0; firstIndexWithLatestDate === -1; i++) {
            if (data[i].timestamp.date === latestDate) {
                firstIndexWithLatestDate = i;
            }
        }
        return firstIndexWithLatestDate;
    }

    parseIntraday = (data) => {
        let parsedData = []
        for (let i = 0; i<data.length; i++) {
            const timestamp = data[i][0]
            const date = timestamp.slice(0,10)
            const year = timestamp.slice(0,4);
            const month = timestamp.slice(5,7);
            const day = timestamp.slice(8,10);
            const hour = timestamp.slice(11,13);
            const minute = timestamp.slice(14,16);
            parsedData.push(
                {
                    open: parseFloat(data[i][1]["1. open"]),
                    close: parseFloat(data[i][1]["4. close"]),
                    high: parseFloat(data[i][1]["2. high"]),
                    low: parseFloat(data[i][1]["3. low"]),
                    volume: parseFloat(data[i][1]["5. volume"]),
                    timestamp: {
                        date: date,
                        year: year,
                        month: month,
                        day: day,
                        hour: hour,
                        minute: minute
                    }
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