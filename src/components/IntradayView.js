import React, { useState } from 'react'
import IntradayChartWrapper from './IntradayChartWrapper.js';



function IntradayView (props) {

    const [priceKey, setPriceKey] = useState(1);
    const [volumeKey, setVolumeKey] = useState(3);
    const [chartKey, setChartKey] = useState(5);
    const refreshPriceChart = () => setPriceKey(priceKey+1);
    const refreshVolumeChart = () => setVolumeKey(volumeKey+1);
    const refreshChart = () => setChartKey(chartKey+1);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(whenResizeDone, 500);
    });
    
    function whenResizeDone () {
        refreshPriceChart();
        refreshVolumeChart();
        refreshChart();
    }

    const {
        chartData,
        displayMode,
        drawVWAP,
        draw50SMA,
        draw200SMA,
    } = props;

    const className = displayMode === "light" ? "intradayView light" : "intradayView dark";

    return (
        <div className={className}>
            {/* {console.log("intradayView: props.intradayData", intradayData)} */}
            <IntradayChartWrapper 
                key={chartKey} 
                chartData={chartData}
                displayMode={displayMode}
                drawVWAP={drawVWAP}
                draw50SMA={draw50SMA}
                draw200SMA={draw200SMA}
            />
        </div>
    )
}

export default IntradayView
