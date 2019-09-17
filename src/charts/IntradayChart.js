export default function intradayPriceChart (p) {

    let canvasWidth = 0;
    let canvasHeight = 0;
    let intradayData;
    let displayedData;
    let displayedVwap;
    let vwapData;
    let priceChartDimensions;
    let volumeChartDimensions;
    let robotoThin;
    let style;
    let displayMode;
    let columnsVisible;

    let styleDark = {
        backgroundColor: [10],
        chartBackgroundColor: [0, 2, 17],
        labelTextColor: [96, 141, 214],
        verticalIndicatorColor: [59, 86, 130, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [171, 207, 237],
        horizontalindicatorStrokeWeight: 0.5,
        green: [52, 224, 170],
        red: [201, 60, 0],
        candlestickStrokeWeight: 1.4,
        volumeBarStrokeWeight: 1.4,
        vwapStrokeColor: [10,60,110],
        vwapStrokeWeight: 15,
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        verticalIndicatorColor: [154, 192, 217, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [154, 192, 217, 90],
        horizontalindicatorStrokeWeight: 0.8,
        candlestickStrokeColor: [60],
        candlestickStrokeWeight: 1,
        volumeBarStrokeColor: [60],
        volumeBarStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
        vwapStrokeColor: [255, 204, 0],
        vwapStrokeWeight: 14,
    }    


    function setPriceChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.05,
            width: canvasWidth*0.95,
            height: canvasHeight*0.6,
        }
    }

    function setVolumeChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: priceChartDimensions.marginTop+priceChartDimensions.height+canvasHeight*0.05,
            marginBottom: canvasHeight*0.05,
            width: canvasWidth*0.95,
            height: canvasHeight*0.3,
        }
    }

    function drawPriceChart() {
        drawPriceChartBackground();
        drawVWAPPlot();
        drawTimeLabels();
        drawPriceLabels();
        drawCandlesticks();
    }

    function drawVWAPPlot () {
        for (let i = 0; i < displayedVwap.length-1; i++) {
            const thisColumnSpan = getColumnSpan(i);
            const nextColumnSpan = getColumnSpan(i+1);
            p.stroke(...style.vwapStrokeColor);
            p.strokeWeight(style.vwapStrokeWeight);
            p.line(
                thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-displayedVwap[i].percentageOfSpread*priceChartDimensions.height,
                nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-displayedVwap[i+1].percentageOfSpread*priceChartDimensions.height
                )
        }
    }

    function drawPriceChartMasks () {
        const leftMask = {
            x: 0,
            y: priceChartDimensions.marginTop,
            width: priceChartDimensions.marginLeft,
            height: priceChartDimensions.height
        }
        const rightMask = {
            x: priceChartDimensions.marginLeft+priceChartDimensions.width,
            y: priceChartDimensions.marginTop,
            width: canvasWidth-priceChartDimensions.marginLeft-priceChartDimensions.width,
            height: priceChartDimensions.height
        }
        p.noStroke();
        p.fill(...style.backgroundColor);
        p.rect(leftMask.x,leftMask.y,leftMask.width,leftMask.height)
        p.rect(rightMask.x,rightMask.y,rightMask.width,rightMask.height)
    }

    
    
    function drawVolumeChart () {
        drawVolumeChartBackground();
        drawVolumeChartTimeIndicators();
        drawVolumeBars();
    }
    
    function drawVolumeChartMasks () {
        const leftMask = {
            x: 0,
            y: volumeChartDimensions.marginTop,
            width: volumeChartDimensions.marginLeft,
            height: volumeChartDimensions.height
        }
        const rightMask = {
            x: volumeChartDimensions.marginLeft+volumeChartDimensions.width,
            y: volumeChartDimensions.marginTop,
            width: canvasWidth-volumeChartDimensions.marginLeft-volumeChartDimensions.width,
            height: volumeChartDimensions.height
        }
        p.noStroke();
        p.fill(...style.backgroundColor);
        p.rect(leftMask.x,leftMask.y,leftMask.width,leftMask.height)
        p.rect(rightMask.x,rightMask.y,rightMask.width,rightMask.height)
    }

    function drawPriceChartBackground () {
        p.noStroke();
        p.fill(...style.chartBackgroundColor)
        p.rect(
            priceChartDimensions.marginLeft,
            priceChartDimensions.marginTop,
            priceChartDimensions.width,
            priceChartDimensions.height
            )
    }

    function drawVolumeChartBackground () {
        p.noStroke();
        p.fill(...style.chartBackgroundColor)
        p.rect(
            volumeChartDimensions.marginLeft,
            volumeChartDimensions.marginTop,
            volumeChartDimensions.width,
            volumeChartDimensions.height
            )
    }

    function drawPriceLabels() {
        for (let threshold of displayedData.metadata.priceThresholds) {
            const priceLabelAnchor = {
                x: priceChartDimensions.marginLeft+priceChartDimensions.width+5,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-threshold["percentageOfSpread"]*priceChartDimensions.height
            }
            const priceLabelIndicator = {
                xLeft: priceChartDimensions.marginLeft,
                xRight: priceChartDimensions.marginLeft+priceChartDimensions.width,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-threshold["percentageOfSpread"]*priceChartDimensions.height
            }
            p.noStroke();
            p.fill(...style.labelTextColor);
            p.textAlign(p.LEFT);
            p.text(threshold.value, priceLabelAnchor.x, priceLabelAnchor.y);

            p.stroke(...style.horizontalIndicatorColor);
            p.strokeWeight(style.horizontalindicatorStrokeWeight)
            p.line(priceLabelIndicator.xLeft, priceLabelIndicator.y, priceLabelIndicator.xRight, priceLabelIndicator.y)
        }
    }

    function drawTimeLabels () {
        for (let i = 0; i<displayedData.data.length; i++) {
            const timestamp = displayedData.data[i]["timestamp"];
            if (parseInt(timestamp.slice(14,16)) % 5 === 0) {
                const columnSpan = getColumnSpan(i);
                const labelAnchor = {x: columnSpan.middle, y: priceChartDimensions.marginTop+priceChartDimensions.height+20}
                const timeIndicator = {
                    x: columnSpan.middle,
                    topY: priceChartDimensions.marginTop,
                    bottomY: priceChartDimensions.marginTop+priceChartDimensions.height
                }
                p.stroke(...style.verticalIndicatorColor);
                p.strokeWeight(style.verticalindicatorStrokeWeight)
                p.line(timeIndicator.x,timeIndicator.topY,timeIndicator.x,timeIndicator.bottomY)
                p.noStroke();
                p.fill(...style.labelTextColor)
                p.textAlign(p.CENTER);
                p.text(timestamp.slice(11,16), labelAnchor.x, labelAnchor.y)
            }
        }
    }

    function drawVolumeChartTimeIndicators () {
        for (let i = 0; i<displayedData.data.length; i++) {
            const timestamp = displayedData.data[i]["timestamp"];
            if (parseInt(timestamp.slice(14,16)) % 5 === 0) {
                const columnSpan = getColumnSpan(i);
                const labelAnchor = {x: columnSpan.middle, y: volumeChartDimensions.marginTop+volumeChartDimensions.height+20}
                const timeIndicator = {
                    x: columnSpan.middle,
                    topY: volumeChartDimensions.marginTop,
                    bottomY: volumeChartDimensions.marginTop+volumeChartDimensions.height
                }
                p.stroke(...style.verticalIndicatorColor);
                p.strokeWeight(style.verticalindicatorStrokeWeight)
                p.line(timeIndicator.x,timeIndicator.topY,timeIndicator.x,timeIndicator.bottomY)
            }
        }
    }

    function drawCandlesticks () {
        for (let i = 0; i<displayedData.data.length; i++) {
            if (displayMode === "light") {
                p.stroke(...style.candlestickStrokeColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (displayedData.data[i]["close"]["value"]>displayedData.data[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (displayedData.data[i]["close"]["value"]>displayedData.data[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i);
            //high-low line
            const high = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-displayedData.data[i]["high"]["percentageOfSpread"]*priceChartDimensions.height
            };
            const low = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-displayedData.data[i]["low"]["percentageOfSpread"]*priceChartDimensions.height
            }
            p.line(high.x, high.y, low.x, low.y)
            
            //open-close box
            const boxWidth = columnSpan.width * 0.6;
            const boxHeight = displayedData.data[i]["open"]["percentageOfSpread"]*priceChartDimensions.height - displayedData.data[i]["close"]["percentageOfSpread"]*priceChartDimensions.height;
            const boxAnchor = {x: columnSpan.middle-boxWidth/2, y: priceChartDimensions.marginTop+priceChartDimensions.height-displayedData.data[i]["open"]["percentageOfSpread"]*priceChartDimensions.height}
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }

    function drawVolumeBars () {
        for (let i = 0; i < displayedData.data.length; i++) {
            
            if (displayMode === "light") {
                p.stroke(...style.volumeBarStrokeColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (displayedData.data[i]["close"]["value"]>displayedData.data[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (displayedData.data[i]["close"]["value"]>displayedData.data[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i);
            const volumeBarWidth = columnSpan.width * 0.6;
            const volumeBarHeight = displayedData.data[i].volume.percentageOfSpread*volumeChartDimensions.height;
            const volumeBarAnchor = {
                x: columnSpan.middle-volumeBarWidth/2,
                y: volumeChartDimensions.marginTop+volumeChartDimensions.height-volumeBarHeight
            }

            p.rect(volumeBarAnchor.x, volumeBarAnchor.y, volumeBarWidth, volumeBarHeight)
        }
    }

    function getColumnSpan(index) {
        const x1 = priceChartDimensions.marginLeft+(priceChartDimensions.width/displayedData.data.length)*index;
        const x2 = priceChartDimensions.marginLeft+(priceChartDimensions.width/displayedData.data.length)*(index+1);
        const middle = (x1+x2)/2;
        const width = x2 - x1;
        return {
            x1: x1,
            x2: x2,
            middle: middle,
            width: width
        }
    }

    function trimData () {
        displayedData.data = intradayData.data.slice(columnsVisible.firstVisible, columnsVisible.lastVisible+1);
        displayedVwap = vwapData.slice(columnsVisible.firstVisible, columnsVisible.lastVisible+1);
    }

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        const {height, width, mode, vwap, cols} = props;
        if (width && height) {
            canvasWidth = width;
            canvasHeight = height;
            priceChartDimensions = setPriceChartDimensions();
            volumeChartDimensions = setVolumeChartDimensions();
        }
        if (cols) {
            columnsVisible = cols;
        }
        // console.log(columnsVisible);
        if (props.intradayData) {
            intradayData = props.intradayData;
            displayedData = props.intradayData;
        }
        if (vwap) {
            vwapData = vwap;
            displayedVwap = vwap;
        }
        if (mode) {
            displayMode = mode;
            style = displayMode === "light" ? styleLight : styleDark;
        }
        p.redraw()
    };
    
    p.preload = function () {
        robotoThin = p.loadFont('/fonts/Roboto-Medium.ttf')
    }
    
    p.setup = function () {
        p.noLoop();
        p.textFont(robotoThin, 10);
    };
    
    let keyPressTimer;
    p.draw = function () {
        if (canvasWidth !== 0) {
            p.createCanvas(canvasWidth, canvasHeight);
            p.background(style.backgroundColor);
        }
        if (intradayData && vwapData) {
            trimData();
            drawPriceChart();
            drawVolumeChart();
        }
        if (p.keyIsPressed) {
            clearTimeout(keyPressTimer);
            keyPressTimer = setTimeout(keyPressed, 500)
        }
    };    

    function keyPressed () {

        if (p.keyCode === p.UP_ARROW && columnsVisible.firstVisible!==0) {
            columnsVisible.firstVisible--;
            console.log("keyPressed: UP_ARROW pressed, colsVisible.first:", columnsVisible.firstVisible)
        } else if (p.keyCode === p.DOWN_ARROW && columnsVisible.firstVisible!==columnsVisible.lastVisible) {
            columnsVisible.firstVisible++;
            console.log("keyPressed: DOWN_ARROW pressed, colsVisible.first:", columnsVisible.firstVisible)
        }
    }
};