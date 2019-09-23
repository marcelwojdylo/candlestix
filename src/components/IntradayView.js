import React, { useState } from 'react'
import IntradayChartWrapper from './IntradayChartWrapper.js';



function IntradayView (props) {
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(whenResizeDone, 500);
    });

    function whenResizeDone () {
        refreshChart();
    }
    
    const refreshChart = () => setChartKey(chartKey+1);

    const [chartKey, setChartKey] = useState(5);

    const {
        chartData,
        displayMode,
    } = props;

    const className = displayMode === "light" ? "intradayView light" : "intradayView dark";

    return (
        <div className={className}>
            {/* {console.log("intradayView: props.intradayData", intradayData)} */}
            <IntradayChartWrapper 
                key={chartKey} 
                chartData={chartData}
                displayMode={displayMode}
            />
        </div>
    )
}

export default IntradayView
