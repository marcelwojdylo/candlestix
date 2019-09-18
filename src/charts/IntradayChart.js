export default function intradayPriceChart (p) {

    let canvasWidth = 0;
    let canvasHeight = 0;
    let intradayData;
    let vwapData;
    let sma50Data;
    let metadata;
    let priceChartDimensions;
    let volumeChartDimensions;
    let robotoThin;
    let style;
    let displayMode;
    let columnsVisible;

    let styleDark = {
        backgroundColor: [0, 2, 10],
        chartBackgroundColor: [0, 2, 22],
        labelTextColor: [96, 141, 214],
        verticalIndicatorColor: [59, 86, 130, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [171, 207, 237],
        horizontalindicatorStrokeWeight: 0.5,
        green: [52, 224, 170],
        red: [201, 60, 0],
        candlestickStrokeWeight: 1.4,
        volumeBarStrokeWeight: 1.4,
        vwapStrokeColor: [240, 7, 92],
        vwapStrokeWeight: 2,
        sma50StrokeColor: [235, 168, 52],
        sma50StrokeWeight: 2,
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        verticalIndicatorColor: [154, 192, 217, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [130, 170, 200],
        horizontalindicatorStrokeWeight: 0.8,
        candlestickStrokeColor: [60],
        candlestickStrokeWeight: 1,
        volumeBarStrokeColor: [60],
        volumeBarStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
        vwapStrokeColor: [255, 204, 0],
        vwapStrokeWeight: 1.7,
        sma50StrokeColor: [0, 63, 181],
        sma50StrokeWeight: 1.5,
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
    
    function drawPriceChart(intradayToDraw, vwapToDraw, sma50ToDraw) {
        drawPriceChartBackground();
        drawVWAPPlot(vwapToDraw);
        draw9SMAPlot(sma50ToDraw);
        drawTimeLabels(intradayToDraw);
        drawPriceLabels(intradayToDraw);
        drawCandlesticks(intradayToDraw);
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
    
    function drawVWAPPlot (vwapToDraw) {
        const {length} = vwapToDraw;
        for (let i = 0; i < length-1; i++) {
            const thisColumnSpan = getColumnSpan(i, length);
            const nextColumnSpan = getColumnSpan(i+1, length);
            p.stroke(...style.vwapStrokeColor);
            p.strokeWeight(style.vwapStrokeWeight);
            p.line(
                thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-vwapToDraw[i].percentageOfSpread*priceChartDimensions.height,
                nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-vwapToDraw[i+1].percentageOfSpread*priceChartDimensions.height
            )
        }
    }
    function draw9SMAPlot (sma50ToDraw) {
        const {length} = sma50ToDraw;
        for (let i = 0; i < length-1; i++) {
            const thisColumnSpan = getColumnSpan(i, length);
            const nextColumnSpan = getColumnSpan(i+1, length);
            p.stroke(...style.sma50StrokeColor);
            p.strokeWeight(style.sma50StrokeWeight);
            p.line(
                thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-sma50ToDraw[i].percentageOfSpread*priceChartDimensions.height,
                nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-sma50ToDraw[i+1].percentageOfSpread*priceChartDimensions.height
            )
        }
    }
        
    function drawTimeLabels (intradayToDraw) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            const timestamp = intradayToDraw[i]["timestamp"];
            const step = 15;
            if (parseInt(timestamp.slice(14,16)) % step === 0) {
                const columnSpan = getColumnSpan(i, intradayToDraw.length);
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
    
    function drawPriceLabels() {
        for (let threshold of metadata.priceThresholds) {
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
    
    function drawCandlesticks (intradayToDraw) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            if (displayMode === "light") {
                p.stroke(...style.candlestickStrokeColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (intradayToDraw[i]["close"]["value"]>intradayToDraw[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (intradayToDraw[i]["close"]["value"]>intradayToDraw[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i, intradayToDraw.length);
            //high-low line
            const high = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-intradayToDraw[i]["high"]["percentageOfSpread"]*priceChartDimensions.height
            };
            const low = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-intradayToDraw[i]["low"]["percentageOfSpread"]*priceChartDimensions.height
            }
            p.line(high.x, high.y, low.x, low.y)
            
            //open-close box
            const boxWidth = columnSpan.width * 0.6;
            const boxHeight = intradayToDraw[i]["open"]["percentageOfSpread"]*priceChartDimensions.height - intradayToDraw[i]["close"]["percentageOfSpread"]*priceChartDimensions.height;
            const boxAnchor = {x: columnSpan.middle-boxWidth/2, y: priceChartDimensions.marginTop+priceChartDimensions.height-intradayToDraw[i]["open"]["percentageOfSpread"]*priceChartDimensions.height}
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }
    function drawVolumeChart (intradayToDraw) {
        drawVolumeChartBackground();
        drawVolumeChartTimeIndicators(intradayToDraw);
        drawVolumeBars(intradayToDraw);
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

    function drawVolumeChartTimeIndicators (intradayToDraw) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            const timestamp = intradayToDraw[i]["timestamp"];
            if (parseInt(timestamp.slice(14,16)) % 5 === 0) {
                const columnSpan = getColumnSpan(i, intradayToDraw.length);
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




    function drawVolumeBars (intradayToDraw) {
        for (let i = 0; i < intradayToDraw.length; i++) {
            
            if (displayMode === "light") {
                p.stroke(...style.volumeBarStrokeColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (intradayToDraw[i]["close"]["value"]>intradayToDraw[i]["open"]["value"]) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (intradayToDraw[i]["close"]["value"]>intradayToDraw[i]["open"]["value"]) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }

            const columnSpan = getColumnSpan(i, intradayToDraw.length);
            const volumeBarWidth = columnSpan.width * 0.6;
            const volumeBarHeight = intradayToDraw[i].volume.percentageOfSpread*volumeChartDimensions.height;
            const volumeBarAnchor = {
                x: columnSpan.middle-volumeBarWidth/2,
                y: volumeChartDimensions.marginTop+volumeChartDimensions.height-volumeBarHeight
            }

            p.rect(volumeBarAnchor.x, volumeBarAnchor.y, volumeBarWidth, volumeBarHeight)
        }
    }

    function getColumnSpan(index, length) {
        const x1 = priceChartDimensions.marginLeft+(priceChartDimensions.width/length)*index;
        const x2 = priceChartDimensions.marginLeft+(priceChartDimensions.width/length)*(index+1);
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
        const {height, width, mode, chartData, cols} = props;
        if (width && height) {
            canvasWidth = width;
            canvasHeight = height;
            priceChartDimensions = setPriceChartDimensions();
            volumeChartDimensions = setVolumeChartDimensions();
        }
        if (cols) {
            columnsVisible = cols;
        }

        if (chartData.data) {
            intradayData = chartData.data.intradayData;
            vwapData = chartData.data.vwapData;
            sma50Data = chartData.data.sma50Data;
            metadata = chartData.metadata;
        }

        if (mode) {
            displayMode = mode;
            style = displayMode === "light" ? styleLight : styleDark;
        }
        shouldUpdate = true;
        p.redraw()
    };
    
    p.preload = function () {
        robotoThin = p.loadFont('/fonts/Roboto-Medium.ttf')
    }
    
    p.setup = function () {
        // p.noLoop();
        p.textFont(robotoThin, 10);
    };
    
    
    let keyPressTimeout;
    let shouldUpdate;
    p.draw = function () {
        if (p.keyIsPressed) {
            // clearTimeout(keyPressTimeout);
            // keyPressTimeout = setTimeout(keyPressed, 100)
            keyPressed();
        }
        if (shouldUpdate) {
            if (canvasWidth !== 0) {
                p.createCanvas(canvasWidth, canvasHeight);
                p.background(style.backgroundColor);
            }
            if (intradayData && vwapData && sma50Data) {
                const {firstVisible, lastVisible} = columnsVisible;
                // console.log("p.draw: colsVisible", firstVisible,lastVisible)
                const intradayToDraw = trimData(firstVisible,lastVisible,intradayData);
                // console.log("p.draw: intradayToDraw", intradayToDraw)
                const vwapToDraw = trimData(firstVisible,lastVisible,vwapData);
                // console.log("p.draw: vwapToDraw", vwapToDraw);
                const sma50ToDraw = trimData(firstVisible,lastVisible,sma50Data);
                drawPriceChart(intradayToDraw, vwapToDraw, sma50ToDraw);
                drawVolumeChart(intradayToDraw);
            }
            shouldUpdate = false;
        }
    };    
    
    function keyPressed () {
        
        if (p.keyCode === p.UP_ARROW) {
            if (columnsVisible.firstVisible!==0) {
                columnsVisible.firstVisible--;
            } else if (columnsVisible.lastVisible!==intradayData.length) {
                columnsVisible.lastVisible++;
            }
            // console.log("keyPressed: UP_ARROW pressed, colsVisible:", columnsVisible.firstVisible, columnsVisible.lastVisible)
        } else if (p.keyCode === p.DOWN_ARROW && columnsVisible.firstVisible!==columnsVisible.lastVisible) {
            columnsVisible.firstVisible++;
            // console.log("keyPressed: DOWN_ARROW pressed, colsVisible:", columnsVisible.firstVisible, columnsVisible.lastVisible)
        } else if (p.keyCode === p.LEFT_ARROW && columnsVisible.firstVisible!==0) {
            columnsVisible.firstVisible--;
            columnsVisible.lastVisible--
        } else if (p.keyCode === p.RIGHT_ARROW && columnsVisible.lastVisible!==intradayData.length) {
            columnsVisible.firstVisible++;
            columnsVisible.lastVisible++;
        }
        shouldUpdate = true;
        p.redraw();
    }

    function trimData (firstVisible, lastVisible, data) {
        return data.slice(firstVisible, lastVisible+1);
    }
};