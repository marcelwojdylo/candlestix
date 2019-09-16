import React, { useState } from 'react'
import IntradayPriceChartWrapper from './IntradayPriceChartWrapper.js';
import IntradayVolumeChartWrapper from './IntradayVolumeChartWrapper.js';



function IntradayView (props) {

    const [priceKey, setPriceKey] = useState(1);
    const [volumeKey, setVolumeKey] = useState(3);
    const refreshPriceChart = () => setPriceKey(priceKey+1);
    const refreshVolumeChart = () => setVolumeKey(volumeKey+1);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(whenResizeDone, 500);
    });
    
    function whenResizeDone () {
        refreshPriceChart();
        refreshVolumeChart();
    }

    return (
        <div className="intradayView">
            <IntradayPriceChartWrapper key={priceKey} data={props.data}/>
            <IntradayVolumeChartWrapper key={volumeKey} data={props.data}/>
        </div>
    )
}

export default IntradayView
