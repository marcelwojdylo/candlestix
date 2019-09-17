import axios from 'axios';


class AlphaVantageService {
    
    constructor() {
        this.api = axios.create({
            baseURL: `https://www.alphavantage.co/query`
        })
    }

    apiKey = 'RYWUIH6FGCEUHWV6';
    
    getIntraday = async (symbol, interval, outputsize = 'full') => {
        const data = await this.api.get(
            `?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&datatype=json&apikey=${this.apiKey}`
        )
        .then(response => response.data[`Time Series (${interval})`])
        .catch(error => console.log(error))
        return Object.entries(data)
    }

    getVWAP = async (symbol, interval) => {
        const data = await this.api.get(
            `?function=VWAP&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`
        )
        .then(response => response.data['Technical Analysis: VWAP'])
        .catch(error => console.log(error))
        return Object.entries(data);
    }
}

const alphaVantageService = new AlphaVantageService();
export default alphaVantageService;