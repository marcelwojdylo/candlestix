export default function intradayPriceChart (p) {

    let canvasWidth = 0;
    let canvasHeight = 0;
    let intradayData;
    let vwapData;
    let sma50Data;
    let sma200Data;
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
        vwapStrokeColor: [255, 204, 0],
        vwapStrokeWeight: 1.2,
        sma50StrokeColor: [137, 178, 240],
        sma50StrokeWeight: 1.2,
        sma200StrokeColor: [0, 83, 201],
        sma200StrokeWeight: 1.2
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        verticalIndicatorColor: [154, 192, 217, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [130, 170, 200],
        horizontalindicatorStrokeWeight: 0.5,
        candlestickStrokeColor: [60],
        candlestickStrokeWeight: 1,
        volumeBarStrokeColor: [60],
        volumeBarStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
        vwapStrokeColor: [255, 204, 0],
        vwapStrokeWeight: 1.5,
        sma50StrokeColor: [137, 178, 240],
        sma50StrokeWeight: 1.3,
        sma200StrokeColor: [0, 83, 201],
        sma200StrokeWeight: 1.3
    }    
    
    
    function setPriceChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: 0,
            width: canvasWidth*0.95,
            height: canvasHeight*0.7,
        }
    }
    
    function setVolumeChartDimensions () {
        return {
            marginLeft: canvasWidth*0.01,
            marginTop: priceChartDimensions.marginTop+priceChartDimensions.height+canvasHeight*0.05,
            width: canvasWidth*0.95,
            height: canvasHeight*0.3,
        }
    }
    
    function drawPriceChart(intradayToDraw, vwapToDraw, sma50ToDraw, sma200ToDraw, priceDomain) {
        drawPriceChartBackground();
        draw50SMAPlot(sma50ToDraw, priceDomain);
        draw200SMAPlot(sma200ToDraw, priceDomain);
        drawVWAPPlot(vwapToDraw, priceDomain);
        drawTimeLabels(intradayToDraw);
        drawPriceThresholds(priceDomain);
        drawCandlesticks(intradayToDraw, priceDomain);
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
    
    function drawVWAPPlot (vwapToDraw, priceDomain) {
        const {length} = vwapToDraw;
        for (let i = 0; i < length-1; i++) {
            const percentageOfSpread = (vwapToDraw[i]-priceDomain.min)/(priceDomain.max-priceDomain.min)
            if (percentageOfSpread < 1 && percentageOfSpread > 0) {
                const thisColumnSpan = getColumnSpan(i, length);
                const nextColumnSpan = getColumnSpan(i+1, length);
                const thisPOS = (vwapToDraw[i]-priceDomain.min)/(priceDomain.max-priceDomain.min)
                const nextPOS = (vwapToDraw[i+1]-priceDomain.min)/(priceDomain.max-priceDomain.min)
                p.stroke(...style.vwapStrokeColor);
                p.strokeWeight(style.vwapStrokeWeight);
                p.line(
                    thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-thisPOS*priceChartDimensions.height,
                    nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-nextPOS*priceChartDimensions.height
                )
            }
        }
    }
    function draw50SMAPlot (sma50ToDraw, priceDomain) {
        const {length} = sma50ToDraw;
        for (let i = 0; i < length-1; i++) {
            const thisPOS = (sma50ToDraw[i]-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const nextPOS = (sma50ToDraw[i+1]-priceDomain.min)/(priceDomain.max-priceDomain.min)
            if (
                thisPOS > 0 && thisPOS < 1 &&
                nextPOS > 0 && nextPOS < 1 
            ) {
                const thisColumnSpan = getColumnSpan(i, length);
                const nextColumnSpan = getColumnSpan(i+1, length);
                p.stroke(...style.sma50StrokeColor);
                p.strokeWeight(style.sma50StrokeWeight);
                p.line(
                    thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-thisPOS*priceChartDimensions.height,
                    nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-nextPOS*priceChartDimensions.height
                )
            }
        }
    }
    function draw200SMAPlot (sma200ToDraw, priceDomain) {
        const {length} = sma200ToDraw;
        for (let i = 0; i < length-1; i++) {
            const thisPOS = (sma200ToDraw[i]-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const nextPOS = (sma200ToDraw[i+1]-priceDomain.min)/(priceDomain.max-priceDomain.min)
            if (
                thisPOS > 0 && thisPOS < 1 &&
                nextPOS > 0 && nextPOS < 1 
            ) {
                const thisColumnSpan = getColumnSpan(i, length);
                const nextColumnSpan = getColumnSpan(i+1, length);
                p.stroke(...style.sma200StrokeColor);
                p.strokeWeight(style.sma200StrokeWeight);
                p.line(
                    thisColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-thisPOS*priceChartDimensions.height,
                    nextColumnSpan.middle, priceChartDimensions.marginTop+priceChartDimensions.height-nextPOS*priceChartDimensions.height
                )
            }
        }
    }
    
    function drawTimeLabels (intradayToDraw) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            const timestamp = intradayToDraw[i].timestamp;
            const minutes = parseInt(timestamp.slice(14,16));
            const step = 15;
            if (minutes % step === 0 || minutes === 0) {
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
    
    function drawPriceThresholds(priceDomain) {
        const priceThresholds =  getPriceThresholds(priceDomain);
        for (let threshold of priceThresholds) {
            const percentageOfSpread = (threshold-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const priceLabelAnchor = {
                x: priceChartDimensions.marginLeft+priceChartDimensions.width+5,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-percentageOfSpread*priceChartDimensions.height
            }
            const priceLabelIndicator = {
                xLeft: priceChartDimensions.marginLeft,
                xRight: priceChartDimensions.marginLeft+priceChartDimensions.width,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-percentageOfSpread*priceChartDimensions.height
            }
            p.noStroke();
            p.fill(...style.labelTextColor);
            p.textAlign(p.LEFT);
            p.text("$"+threshold.toString(), priceLabelAnchor.x, priceLabelAnchor.y);

            p.stroke(...style.horizontalIndicatorColor);
            p.strokeWeight(style.horizontalindicatorStrokeWeight)
            p.line(priceLabelIndicator.xLeft, priceLabelIndicator.y, priceLabelIndicator.xRight, priceLabelIndicator.y)
        }
    }

    function getPriceThresholds (priceDomain) {
        let lowestRoundPrice = Math.ceil(priceDomain.min);
        let highestRoundPrice = Math.floor(priceDomain.max);
        let thresholds = [];
        let step = highestRoundPrice-lowestRoundPrice<3 ? 0.5 : 1
        for (let i = lowestRoundPrice; i<=highestRoundPrice; i+=step) {
            thresholds.push(i)
        }
        return thresholds;
    }
    
    function drawCandlesticks (intradayToDraw, priceDomain) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            if (displayMode === "light") {
                p.stroke(...style.candlestickStrokeColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (intradayToDraw[i].close>intradayToDraw[i].open) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.candlestickStrokeWeight)
                if (intradayToDraw[i].close>intradayToDraw[i].open) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }
            
            const columnSpan = getColumnSpan(i, intradayToDraw.length);
            //high-low line
            const highPOS = (intradayToDraw[i].high-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const lowPOS = (intradayToDraw[i].low-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const high = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-highPOS*priceChartDimensions.height
            };
            const low = {
                x: columnSpan.middle,
                y: priceChartDimensions.marginTop+priceChartDimensions.height-lowPOS*priceChartDimensions.height
            }
            p.line(high.x, high.y, low.x, low.y)
            
            //open-close box
            const openPOS = (intradayToDraw[i].open-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const closePOS = (intradayToDraw[i].close-priceDomain.min)/(priceDomain.max-priceDomain.min)
            const boxWidth = columnSpan.width * 0.6;
            const boxHeight = openPOS*priceChartDimensions.height - closePOS*priceChartDimensions.height;
            const boxAnchor = {x: columnSpan.middle-boxWidth/2, y: priceChartDimensions.marginTop+priceChartDimensions.height-openPOS*priceChartDimensions.height}
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }
    function drawVolumeChart (intradayToDraw, volumeDomain) {
        drawVolumeChartBackground();
        drawVolumeThresholds(volumeDomain);
        drawVolumeChartTimeIndicators(intradayToDraw);
        drawVolumeBars(intradayToDraw, volumeDomain);
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

    function drawVolumeThresholds(volumeDomain) {
        const volumeThresholds =  getVolumeThresholds(volumeDomain);
        for (let threshold of volumeThresholds) {
            const percentageOfSpread = (threshold-volumeDomain.min)/(volumeDomain.max-volumeDomain.min)
            const volumeLabelAnchor = {
                x: volumeChartDimensions.marginLeft+volumeChartDimensions.width+5,
                y: volumeChartDimensions.marginTop+volumeChartDimensions.height-percentageOfSpread*volumeChartDimensions.height
            }
            const thousands = threshold/1000;
            const volumeLabelText = thousands.toString()+"k";
            const volumeIndicator = {
                xLeft: volumeChartDimensions.marginLeft,
                xRight: volumeChartDimensions.marginLeft+priceChartDimensions.width,
                y: volumeChartDimensions.marginTop+volumeChartDimensions.height-percentageOfSpread*volumeChartDimensions.height
            }
            p.noStroke();
            p.fill(...style.labelTextColor);
            p.textAlign(p.LEFT);
            p.text(volumeLabelText, volumeLabelAnchor.x, volumeLabelAnchor.y);

            p.stroke(...style.horizontalIndicatorColor);
            p.strokeWeight(style.horizontalindicatorStrokeWeight)
            p.line(volumeIndicator.xLeft, volumeIndicator.y, volumeIndicator.xRight, volumeIndicator.y)
        }
    }

    function getVolumeThresholds (volumeDomain) {
        const spread = volumeDomain.max-volumeDomain.min;
        let step;
        if (spread > 800000) {
            step = 200000
        } else if (spread > 150000) {
            step = 50000
        } else if (spread > 50000) {
            step = 25000
        } else {
            step = 10000
        }
        let lowestRoundPrice = Math.floor((volumeDomain.min+step)/step)*step;
        let highestRoundPrice = Math.floor((volumeDomain.max-step)/step)*step;
        let thresholds = [];
        for (let i = lowestRoundPrice; i<=highestRoundPrice; i+=step) {
            thresholds.push(i)
        }
        return thresholds;
    }

    function drawVolumeBars (intradayToDraw, volumeDomain) {
        for (let i = 0; i < intradayToDraw.length; i++) {
            if (displayMode === "light") {
                p.stroke(...style.volumeBarStrokeColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (intradayToDraw[i].close>intradayToDraw[i].open) {
                    p.fill(...style.green)
                } else {
                    p.fill(...style.red)
                }
            } else {
                p.fill(...style.chartBackgroundColor)
                p.strokeWeight(style.volumeBarStrokeWeight)
                if (intradayToDraw[i].close>intradayToDraw[i].open) {
                    p.stroke(...style.green)
                } else {
                    p.stroke(...style.red)
                }
            }
            
            const percentageOfSpread = (intradayToDraw[i].volume-volumeDomain.min)/(volumeDomain.max-volumeDomain.min)
            const columnSpan = getColumnSpan(i, intradayToDraw.length);
            const volumeBarWidth = columnSpan.width * 0.6;
            const volumeBarHeight = percentageOfSpread*volumeChartDimensions.height;
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

        if (chartData) {
            intradayData = chartData.intradayData;
            vwapData = chartData.vwapData;
            sma50Data = chartData.sma50Data;
            sma200Data = chartData.sma200Data;
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
    
    
    let shouldUpdate;
    p.draw = function () {
        if (p.keyIsPressed) {
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
                const priceDomain = getPriceDomain(intradayToDraw);
                const volumeDomain = getVolumeDomain(intradayToDraw);
                // console.log("IntradayChart draw volumeDomain", volumeDomain)
                // console.log("p.draw: intradayToDraw", intradayToDraw)
                const vwapToDraw = trimData(firstVisible,lastVisible,vwapData);
                // console.log("p.draw: vwapToDraw", vwapToDraw);
                const sma50ToDraw = trimData(firstVisible,lastVisible,sma50Data);
                const sma200ToDraw = trimData(firstVisible, lastVisible, sma200Data)
                drawPriceChart(intradayToDraw, vwapToDraw, sma50ToDraw, sma200ToDraw, priceDomain);
                drawVolumeChart(intradayToDraw, volumeDomain);
            }
            shouldUpdate = false;
        }
    };    

    function getPriceDomain (intradayToDraw) {
        let allValues = [];
        for (let element of intradayToDraw) {
            allValues.push(
                element.open,
                element.close,
                element.high,
                element.low,
            )
        }
        return {min: Math.min(...allValues), max: Math.max(...allValues)}
    }

    function getVolumeDomain (intradayToDraw) {
        let volumes = [];
        for (let element of intradayToDraw) {
            volumes.push(
                element.volume,
            )
        }
        return {min: Math.min(...volumes), max: Math.max(...volumes)}
    }
    
    function keyPressed () {
        
        if (p.keyCode === p.DOWN_ARROW) {
            if (columnsVisible.firstVisible!==0) {
                columnsVisible.firstVisible--;
            }
            if (columnsVisible.lastVisible!==intradayData.length) {
                columnsVisible.lastVisible++;
            }
            // console.log("keyPressed: UP_ARROW pressed, colsVisible:", columnsVisible.firstVisible, columnsVisible.lastVisible)
        } else if (p.keyCode === p.UP_ARROW && columnsVisible.lastVisible-columnsVisible.firstVisible > 4) {
            columnsVisible.firstVisible++;
            columnsVisible.lastVisible--;
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