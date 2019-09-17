export default function intradayPriceChart (p) {

    let canvasWidth = 0;
    let canvasHeight = 0;
    let chartData;
    let chartMetaData;
    let chartDimensions;
    let robotoThin;
    let style;
    let displayMode;

    let styleDark = {
        backgroundColor: [10],
        chartBackgroundColor: [0],
        labelTextColor: [96, 141, 214],
        indicatorColor: [59, 86, 130],
        indicatorStrokeWeight: 0.5,
        green: [52, 224, 170],
        red: [201, 60, 0],
        candlestickStrokeWeight: 0.8
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        indicatorColor: [154, 192, 217],
        indicatorStrokeWeight: 0.5,
        candlestickStrokeColor: [60],
        candlestickStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
    }    


    function setChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.05,
            width: canvasWidth*0.95,
            height: canvasHeight*0.9,
        }
    }

    function drawChart() {
        drawChartBackground();
        drawPriceLabels();
        drawTimeLabels();
        drawCandlesticks();
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

    function drawPriceLabels() {
        for (let threshold of chartMetaData.priceThresholds) {
            const priceLabelAnchor = {
                x: chartDimensions.marginLeft+chartDimensions.width+5,
                y: canvasHeight-chartDimensions.marginBottom-threshold["percentageOfSpread"]*chartDimensions.height
            }
            const priceLabelIndicator = {
                xLeft: chartDimensions.marginLeft,
                xRight: chartDimensions.marginLeft+chartDimensions.width,
                y: canvasHeight-chartDimensions.marginBottom-threshold["percentageOfSpread"]*chartDimensions.height
            }
            p.noStroke();
            p.fill(...style.labelTextColor);
            p.textAlign(p.LEFT);
            p.text(threshold.value, priceLabelAnchor.x, priceLabelAnchor.y);

            p.stroke(...style.indicatorColor);
            p.strokeWeight(style.indicatorStrokeWeight)
            p.line(priceLabelIndicator.xLeft, priceLabelIndicator.y, priceLabelIndicator.xRight, priceLabelIndicator.y)
        }
    }

    function drawTimeLabels () {
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
                p.noStroke();
                p.fill(...style.labelTextColor)
                p.textAlign(p.CENTER);
                p.text(timestamp.slice(11,16), labelAnchor.x, labelAnchor.y)
            }
        }
    }

    function drawCandlesticks () {
        for (let i = 0; i<chartData.length; i++) {
            if (displayMode === "light") {
                p.stroke(...style.candlestickStrokeColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i);
            //high-low line
            const high = {
                x: columnSpan.middle,
                y: canvasHeight-chartDimensions.marginBottom-chartData[i]["high"]["percentageOfSpread"]*chartDimensions.height
            };
            const low = {
                x: columnSpan.middle,
                y: canvasHeight-chartDimensions.marginBottom-chartData[i]["low"]["percentageOfSpread"]*chartDimensions.height
            }
            p.line(high.x, high.y, low.x, low.y)
            
            //open-close box
            const boxWidth = columnSpan.width * 0.6;
            const boxHeight = chartData[i]["open"]["percentageOfSpread"]*chartDimensions.height - chartData[i]["close"]["percentageOfSpread"]*chartDimensions.height;
            const boxAnchor = {x: columnSpan.middle-boxWidth/2, y: canvasHeight-chartDimensions.marginBottom-chartData[i]["open"]["percentageOfSpread"]*chartDimensions.height}
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
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
        const {height, width, data, mode} = props;
        canvasWidth = width;
        canvasHeight = height;
        chartData = data.data;
        chartMetaData = data.metadata;
        chartDimensions = setChartDimensions();
        displayMode = mode;
        style = displayMode === "light" ? styleLight : styleDark;
        p.redraw()
    };

    p.preload = function () {
        robotoThin = p.loadFont('/fonts/Roboto-Medium.ttf')
    }
    
    p.setup = function () {
        p.noLoop();
        p.textFont(robotoThin, 10);
    };
    
    p.draw = function () {
        if (canvasWidth !== 0) {
            p.createCanvas(canvasWidth, canvasHeight);
            p.background(style.backgroundColor);
        }
        if (chartData) {
            drawChart();
        }
    };    
};