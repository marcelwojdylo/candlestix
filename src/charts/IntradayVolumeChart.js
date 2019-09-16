export default function intradayVolumeChart (p) {

    let canvasWidth = 0;
    let canvasHeight = 0;
    let chartData;
    let chartMetaData;
    let chartDimensions;

    let styleDark = {
        backgroundColor: [10],
        chartBackgroundColor: [0],
        labelTextColor: [96, 141, 214],
        indicatorColor: [59, 86, 130],
        indicatorStrokeWeight: 0.5,
        green: [52, 224, 170],
        red: [201, 60, 0],
        volumeBarStrokeWeight: 0.8
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        indicatorColor: [154, 192, 217],
        indicatorStrokeWeight: 0.5,
        volumeBarStrokeColor: [60],
        volumeBarStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
    }    
    let mode = "light";
    let style = mode === "light" ? styleLight : styleDark;

    function setChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.05,
            width: canvasWidth*0.95,
            height: canvasHeight*0.9,
        }
    }

    function drawChart () {
        drawChartBackground();
        drawTimeIndicators();
        drawVolumeBars();
    }

    function drawChartBackground () {
        p.noStroke();
        p.fill(...style.chartBackgroundColor)
        p.rect(
            chartDimensions.marginLeft,
            chartDimensions.marginTop,
            chartDimensions.width,
            chartDimensions.height
            )
    }

    function drawVolumeBars () {
        for (let i = 0; i < chartData.length; i++) {
            
            if (mode === "light") {
                p.stroke(...style.volumeBarStrokeColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i);
            const volumeBarWidth = columnSpan.width * 0.6;
            const volumeBarHeight = chartData[i].volume.percentageOfSpread*chartDimensions.height;
            const volumeBarAnchor = {
                x: columnSpan.middle-volumeBarWidth/2,
                y: chartDimensions.marginTop+chartDimensions.height-volumeBarHeight
            }

            p.rect(volumeBarAnchor.x, volumeBarAnchor.y, volumeBarWidth, volumeBarHeight)
        }
    }

    function drawTimeIndicators () {
        for (let i = 0; i<chartData.length; i++) {
            const timestamp = chartData[i]["timestamp"];
            if (parseInt(timestamp.slice(14,16)) % 5 === 0) {
                const columnSpan = getColumnSpan(i);
                const labelAnchor = {x: columnSpan.middle, y: chartDimensions.marginTop+chartDimensions.height+20}
                const timeIndicator = {
                    x: columnSpan.middle,
                    topY: chartDimensions.marginTop,
                    bottomY: chartDimensions.marginTop+chartDimensions.height
                }
                p.stroke(...style.indicatorColor);
                p.strokeWeight(style.indicatorStrokeWeight)
                p.line(timeIndicator.x,timeIndicator.topY,timeIndicator.x,timeIndicator.bottomY)
            }
        }
    }

    function getColumnSpan(index) {
        const x1 = chartDimensions.marginLeft+(chartDimensions.width/chartData.length)*index;
        const x2 = chartDimensions.marginLeft+(chartDimensions.width/chartData.length)*(index+1);
        const middle = (x1+x2)/2;
        const width = x2 - x1;
        return {
            x1: x1,
            x2: x2,
            middle: middle,
            width: width
        }
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        const {height, width, data} = props;
        canvasWidth = width;
        canvasHeight = height;
        chartData = data.data;
        chartMetaData = data.metadata;
        chartDimensions = setChartDimensions();
        p.redraw()
    };

    p.preload = function () {
    }
    
    p.setup = function () {
        p.noLoop();
    };
    
    p.draw = function () {
        if (canvasWidth !== 0) {
            p.createCanvas(canvasWidth, canvasHeight);
        }
        p.background(style.backgroundColor);
        if (chartData) {
            drawChart();
        }
    };    
};