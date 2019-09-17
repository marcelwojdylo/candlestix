class DataConverter {

    convertVWAPForCharting = (vwapFromApi) => {
        const latestDate = vwapFromApi[0][0].slice(0,10);
        // console.log("vwap latestate", latestDate);
        let vwap = [];
        for (let i = 0; vwapFromApi[i][0].slice(0,10) === latestDate; i++) {
            vwap.push(parseFloat(vwapFromApi[i][1].VWAP))
        }
        // console.log("today's vwap", vwap)
        vwap = vwap.reverse();
        const domain = {min: Math.min(...vwap), max: Math.max(...vwap)};
        for (let i = 0; i<vwap.length; i++) {
            vwap[i] = {
                "value": vwap[i],
                "percentageOfSpread": this.getPercentageOfSpread(vwap[i], domain)
            }
        }
        // console.log("vwap conversion result", vwap);
        return vwap;
    }



    convertDataForCharting = (dataFromApi) => {
        const latestDate = dataFromApi[0][0].slice(0,10);
        let data = [];
        for (let i = 0; dataFromApi[i][0].slice(0,10) === latestDate; i++) {
            data.push(
                [
                    parseFloat(dataFromApi[i][1]["1. open"]),
                    parseFloat(dataFromApi[i][1]["4. close"]),
                    parseFloat(dataFromApi[i][1]["2. high"]),
                    parseFloat(dataFromApi[i][1]["3. low"]),
                    parseFloat(dataFromApi[i][1]["5. volume"]),
                    dataFromApi[i][0]
                ]
            )
        }
        data = data.reverse();
        const priceDomain = this.getPriceDomain(data);
        const volumeDomain = this.getVolumeDomain(data);

        for (let i = 0; i<data.length; i++) {
            data[i] = {
                "open": {
                    "value": data[i][0],
                    "percentageOfSpread": this.getPercentageOfSpread(data[i][0], priceDomain)
                },
                "close": {
                    "value": data[i][1],
                    "percentageOfSpread": this.getPercentageOfSpread(data[i][1], priceDomain)
                },
                "high": {
                    "value": data[i][2],
                    "percentageOfSpread": this.getPercentageOfSpread(data[i][2], priceDomain)
                },
                "low": {
                    "value": data[i][3],
                    "percentageOfSpread": this.getPercentageOfSpread(data[i][3], priceDomain)
                },
                "volume": {
                    "value": data[i][4],
                    "percentageOfSpread": this.getPercentageOfSpread(data[i][4], volumeDomain)
                },
                "timestamp": data[i][5]
            }
        }
        const chartData = {
            "metadata": {
                "priceDomain": priceDomain,
                "volumeDomain": volumeDomain,
                "priceThresholds": this.getPriceThresholds(priceDomain),
                "dataLength": data.length
                // "volumeThresholds": this.getVolumeThresholds(volumeDomain)
            },
            "data": data
        }
        // console.log("DataConverter.convertDataForCharting data", chartData)
        return chartData;
    }

    getVolumeDomain = (data) => {
        let volumes = [];
        for (let element of data) {
            volumes.push(element[4])
        }
        return {min: Math.min(...volumes), max: Math.max(...volumes)}
    }

    getPriceDomain = (candlestickData) => {
        let allValues = [];
        for (let element of candlestickData) {
            allValues.push(
                element[0],
                element[1],
                element[2],
                element[3]
            )
        }
        return {min: Math.min(...allValues), max: Math.max(...allValues)}
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