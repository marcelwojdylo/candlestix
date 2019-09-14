class DataConverter {

    getCandlestickData = (dataFromApi) => {
        let candlestickData = [];
        for (let element of dataFromApi) {
            candlestickData.push(
                [
                    parseFloat(element[1]["1. open"]),
                    parseFloat(element[1]["4. close"]),
                    parseFloat(element[1]["2. high"]),
                    parseFloat(element[1]["3. low"]),
                    parseFloat(element[1]["5. volume"]),
                    element[0]
                ]
            )
        }
        return candlestickData;
    }

    getCandlestickDataAsPercentagesOfSpread = (candlestickData) => {
        const domain = this.getDomain(candlestickData);
        let percentageData = candlestickData;
        for (let element of percentageData) {
            element[0] = this.getPercentageOfSpread(element[0], domain);
            element[1] = this.getPercentageOfSpread(element[1], domain);
            element[2] = this.getPercentageOfSpread(element[2], domain);
            element[3] = this.getPercentageOfSpread(element[3], domain);
        }
        return percentageData;
    }

    getDomain = (candlestickData) => {
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

    getSpread = (domain) => {
        return domain.max - domain.min
    }

    getPercentageOfSpread = (point, domain) => {
        let spread = this.getSpread(domain);
        return (point - domain.min)/spread
    }



}

const dataConverter = new DataConverter();
export default dataConverter;