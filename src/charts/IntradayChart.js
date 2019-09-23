export default function intradayPriceChart (p) {
    
    let canvasWidth = 0;
    let canvasHeight = 0;
    let intradayData;
    let vwapData;
    let priceChartDimensions;
    let volumeChartDimensions;
    let robotoThin;
    let style;
    let displayMode;
    let columnsVisible;
    let shouldUpdate;
    
    
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
    
    
    p.draw = function () {
        if (p.keyIsPressed) {
            keyPressed();
        }
        if (shouldUpdate) {
            if (canvasWidth !== 0) {
                p.createCanvas(canvasWidth, canvasHeight);
                p.background(style.backgroundColor);
            }

            //TODO: Uncouple drawing prices from drawing curves
            const {firstVisible, lastVisible} = columnsVisible;
            // console.log("p.draw: colsVisible", firstVisible,lastVisible)
            const intradayToDraw = trimData(firstVisible,lastVisible,intradayData);
            const priceDomain = getPriceDomain(intradayToDraw);
            const volumeDomain = getVolumeDomain(intradayToDraw);
            // console.log("IntradayChart draw volumeDomain", volumeDomain)
            // console.log("p.draw: intradayToDraw", intradayToDraw)
            const vwapToDraw = trimData(firstVisible,lastVisible,vwapData);
            // console.log("p.draw: vwapToDraw", vwapToDraw);
            drawPriceChart(intradayToDraw, vwapToDraw, priceDomain);
            drawVolumeChart(intradayToDraw, volumeDomain);
            shouldUpdate = false;
        }
    };    

    let styleDark = {
        backgroundColor: [0, 2, 10],
        chartBackgroundColor: [0, 2, 22],
        labelTextColor: [96, 141, 214],
        verticalIndicatorColor: [59, 86, 130, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [171, 207, 237, 90],
        horizontalindicatorStrokeWeight: 0.5,
        green: [52, 224, 170],
        red: [201, 60, 0],
        candlestickStrokeWeight: 1.4,
        volumeBarStrokeWeight: 1.4,
        vwapStrokeColor: [255, 204, 0],
        vwapStrokeWeight: 1.2,
        priceLabelsFontSize: 11,
        timeLabelsFontSize: 11,
        curveLabelsFontSize: 10,
    }
    let styleLight = {
        backgroundColor: [240],
        chartBackgroundColor: [255],
        labelTextColor: [71, 135, 204],
        verticalIndicatorColor: [154, 192, 217, 70],
        verticalindicatorStrokeWeight: 0.5,
        horizontalIndicatorColor: [130, 170, 200, 80],
        horizontalindicatorStrokeWeight: 0.5,
        candlestickStrokeColor: [60],
        candlestickStrokeWeight: 1,
        volumeBarStrokeColor: [60],
        volumeBarStrokeWeight: 1,
        green: [255],
        red: [209, 19, 57],
        vwapStrokeColor: [237, 130, 0],
        vwapStrokeWeight: 1.5,
        priceLabelsFontSize: 11,
        timeLabelsFontSize: 11,
        curveLabelsFontSize: 10,
    }    
    
    
    function setPriceChartDimensions () {
        return {
            marginLeft: 0,
            marginTop: 0,
            width: canvasWidth*0.99-35,
            height: canvasHeight*0.67,
        }
    }
    
    function setVolumeChartDimensions () {
        return {
            marginLeft: 0,
            marginTop: priceChartDimensions.marginTop+priceChartDimensions.height+canvasHeight*0.05,
            width: canvasWidth*0.99-35,
            height: canvasHeight*0.20,
        }
    }
    
    function drawPriceChart(intradayToDraw, vwapToDraw, priceDomain) {
        drawPriceChartBackground();
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
        for (let i = 0; i < length; i++) {
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
    
    function drawTimeLabels (intradayToDraw) {
        for (let i = 0; i<intradayToDraw.length; i++) {
            const timestamp = intradayToDraw[i].timestamp;
            const minutes = parseInt(timestamp.slice(14,16));
            const moreThanOneDayVisible = columnsVisible.lastVisible-columnsVisible.firstVisible > 390 ? true : false;
            const isFullHour = minutes === 0 ? true : false;
            const isFullQuarter = minutes === 0 || minutes % 15 === 0 ? true : false;
            if (moreThanOneDayVisible) {
                if (isFullHour) {
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
                    p.textFont(robotoThin, style.timeLabelsFontSize);
                    p.text(timestamp.slice(11,16), labelAnchor.x, labelAnchor.y)
                }
            } else {
                if (isFullQuarter) {
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
                    p.textFont(robotoThin, style.timeLabelsFontSize);
                    p.text(timestamp.slice(11,16), labelAnchor.x, labelAnchor.y)

                }
            }

            if (minutes % 15 === 0 || minutes === 0) {
            }
        }
    }
    
    function drawPriceThresholds(priceDomain) {
        const priceThresholds =  getPriceThresholds(priceDomain);
        for (let threshold of priceThresholds) {
            const percentageOfSpread = (threshold-priceDomain.min)/(priceDomain.max-priceDomain.min)
            if (percentageOfSpread > 0) {
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
                p.textFont(robotoThin, style.priceLabelsFontSize);
                p.text("$"+threshold.toString(), priceLabelAnchor.x, priceLabelAnchor.y);
                
                p.stroke(...style.horizontalIndicatorColor);
                p.strokeWeight(style.horizontalindicatorStrokeWeight)
                p.line(priceLabelIndicator.xLeft, priceLabelIndicator.y, priceLabelIndicator.xRight, priceLabelIndicator.y)
            }
        }
    }

    function getPriceThresholds (priceDomain) {
        let lowestRoundPrice = Math.floor(priceDomain.min);
        let highestRoundPrice = Math.ceil(priceDomain.max);
        let thresholds = [];
        let spread = highestRoundPrice-lowestRoundPrice;
        let step;
        if (spread < 3) {
            step = 0.25
        } else if (spread < 5) {
            step = 0.5;
        } else if (spread < 30) {
            step = 1;
        } else if (spread < 40) {
            step = 2
        } else {
            step = 5;
        }
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
            p.textFont(robotoThin, style.priceLabelsFontSize);
            p.text(volumeLabelText, volumeLabelAnchor.x, volumeLabelAnchor.y);
            
            p.stroke(...style.horizontalIndicatorColor);
            p.strokeWeight(style.horizontalindicatorStrokeWeight)
            p.line(volumeIndicator.xLeft, volumeIndicator.y, volumeIndicator.xRight, volumeIndicator.y)
        }
    }

    function getVolumeThresholds (volumeDomain) {
        const spread = volumeDomain.max-volumeDomain.min;
        let step;
        if (spread > 1000000) {
            step = 500000
        } else if (spread > 300000) {
            step = 100000
        } else if (spread > 150000) {
            step = 50000
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
        const numberOfColumns = columnsVisible.lastVisible-columnsVisible.firstVisible;
        const step = parseInt(Math.ceil(numberOfColumns/100));

        if (p.keyCode === p.DOWN_ARROW) {
            if (columnsVisible.firstVisible > step) {
                columnsVisible.firstVisible-=step;
            } else {
                columnsVisible.firstVisible = 0;
            }
            if (intradayData.length - columnsVisible.lastVisible > step) {
                columnsVisible.lastVisible+=step;
            } else {
                columnsVisible.lastVisible = intradayData.length;
            }
            // console.log("keyPressed: UP_ARROW pressed, colsVisible:", columnsVisible.firstVisible, columnsVisible.lastVisible)
        } else if (p.keyCode === p.UP_ARROW && columnsVisible.lastVisible-columnsVisible.firstVisible > 4) {
            columnsVisible.firstVisible+=step;
            columnsVisible.lastVisible-=step;
            // console.log("keyPressed: DOWN_ARROW pressed, colsVisible:", columnsVisible.firstVisible, columnsVisible.lastVisible)
        } else if (p.keyCode === p.LEFT_ARROW && columnsVisible.firstVisible>0) {
            columnsVisible.firstVisible--;
            columnsVisible.lastVisible--
        } else if (p.keyCode === p.RIGHT_ARROW && columnsVisible.lastVisible<intradayData.length) {
            columnsVisible.firstVisible++;
            columnsVisible.lastVisible++;
        }
        shouldUpdate = true;
        p.redraw();
    }

    function trimData (firstVisible, lastVisible, data) {
        return data === null ? null : data.slice(firstVisible, lastVisible+1);
    }
};