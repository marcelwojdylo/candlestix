


export default function sketch (p) {
  
    let canvasWidth;
    let canvasHeight;
    let chartData;
    let chartMetaData;
    let priceChartDimensions = setPriceChartDimensions();
    let volumeChartDimensions = setVolumeChartDimensions();
    let robotoThin;

    let colors = {
        "candlestickOutline": ""
    }
    
    function setPriceChartDimensions () {
        return {
            marginLeft: canvasWidth*0.05,
            marginRight: canvasWidth*0.05,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.35,
            width: canvasWidth*0.9,
            height: canvasHeight*0.6,
        }
    }

    function setVolumeChartDimensions () {
        return {
            marginLeft: canvasWidth*0.05,
            marginRight: canvasWidth*0.05,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.1,
            width: canvasWidth*0.9,
            height: canvasHeight*0.2,
        }
    }

    function drawVolumeChartBackground () {
        p.noStroke();
        p.fill(0)
        p.rect(
            volumeChartDimensions.marginLeft,
            volumeChartDimensions.marginTop+priceChartDimensions.marginTop+priceChartDimensions.height,
            volumeChartDimensions.width,
            volumeChartDimensions.height
        )
    }

    
    
    
    function drawPriceChartBackground () {
        p.noStroke();
        p.fill(0)
        p.rect(
            priceChartDimensions.marginLeft,
            priceChartDimensions.marginTop,
            priceChartDimensions.width,
            priceChartDimensions.height
            )
        }


    function drawVolumeChart () {

        p.fill(0)
        p.strokeWeight(1.2)
        
        for (let i = 0; i < chartData.length; i++) {
            
            if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                p.stroke(52, 224, 170)
            } else {
                p.stroke(201, 60, 0)
            }

            //positioning
            const horizontalSpan = [
                priceChartDimensions.marginLeft+(priceChartDimensions.width/chartData.length)*i,
                priceChartDimensions.marginLeft+(priceChartDimensions.width/chartData.length)*(i+1)
            ]
            const middleOfOwnSpan = (horizontalSpan[0]+horizontalSpan[1])/2
            const widthOfHorizontalSpan = horizontalSpan[1] - horizontalSpan[0]

            const boxWidth = widthOfHorizontalSpan * 0.6;
            const boxHeight = chartData[i].volume.percentageOfSpread*volumeChartDimensions.height;
            const boxAnchor = {
                x: middleOfOwnSpan-boxWidth/2,
                y: volumeChartDimensions.height+volumeChartDimensions.marginTop+priceChartDimensions.marginTop+priceChartDimensions.height-boxHeight
            }

            
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }

    function drawPriceChart () {


        // price labels
        for (let threshold of chartMetaData.priceThresholds) {
            const priceLabelAnchor = {
                x: priceChartDimensions.marginLeft+priceChartDimensions.width+10,
                y: canvasHeight-priceChartDimensions.marginBottom-threshold["percentageOfSpread"]*priceChartDimensions.height
            }
            const priceLabelIndicator = {
                xLeft: priceChartDimensions.marginLeft,
                xRight: priceChartDimensions.marginLeft+priceChartDimensions.width,
                y: canvasHeight-priceChartDimensions.marginBottom-threshold["percentageOfSpread"]*priceChartDimensions.height
            }
            // console.log(priceLabelIndicator)
            p.noStroke();
            p.fill(96, 141, 214);
            p.text(threshold.value, priceLabelAnchor.x, priceLabelAnchor.y);
            p.stroke(59, 86, 130);
            p.strokeWeight(0.5)
            p.line(priceLabelIndicator.xLeft, priceLabelIndicator.y, priceLabelIndicator.xRight, priceLabelIndicator.y)
        }
        
        for (let i=0; i<chartData.length; i++) {
            
            //positioning
            const horizontalSpan = [
                priceChartDimensions.marginLeft+(priceChartDimensions.width/chartData.length)*i,
                priceChartDimensions.marginLeft+(priceChartDimensions.width/chartData.length)*(i+1)
            ]
            const middleOfOwnSpan = (horizontalSpan[0]+horizontalSpan[1])/2
            const widthOfHorizontalSpan = horizontalSpan[1] - horizontalSpan[0]
            
            //time labels
            
            const timestamp = chartData[i]["timestamp"];
            const labelAnchor = {x: middleOfOwnSpan, y: priceChartDimensions.marginTop+priceChartDimensions.height+20}
            const timeIndicator = {
                x: middleOfOwnSpan,
                topY: priceChartDimensions.marginTop,
                bottomY: priceChartDimensions.marginTop+priceChartDimensions.height
            }
            if (parseInt(timestamp.slice(14,16)) % 5 === 0) {
                p.stroke(59, 86, 130);
                p.strokeWeight(0.5)
                p.line(timeIndicator.x,timeIndicator.topY,timeIndicator.x,timeIndicator.bottomY)
                p.noStroke();
                p.fill(96, 141, 214)
                p.textAlign(p.CENTER);
                p.text(timestamp.slice(11,16), labelAnchor.x, labelAnchor.y)
            }
            
            //color
            p.fill(0)
            p.strokeWeight(1.2)
            if (chartData[i]["close"]["value"]>chartData[i]["open"]["value"]) {
                p.stroke(52, 224, 170)
            } else {
                p.stroke(201, 60, 0)
            }

            //high-low line
            const high = {
                x: middleOfOwnSpan,
                y: canvasHeight-priceChartDimensions.marginBottom-chartData[i]["high"]["percentageOfSpread"]*priceChartDimensions.height
            };
            const low = {
                x: middleOfOwnSpan,
                y: canvasHeight-priceChartDimensions.marginBottom-chartData[i]["low"]["percentageOfSpread"]*priceChartDimensions.height
            }
            p.line(high.x, high.y, low.x, low.y)
            
            //open-close box
            const boxWidth = widthOfHorizontalSpan * 0.6;
            const boxHeight = chartData[i]["open"]["percentageOfSpread"]*priceChartDimensions.height - chartData[i]["close"]["percentageOfSpread"]*priceChartDimensions.height;
            const boxAnchor = {x: middleOfOwnSpan-boxWidth/2, y: canvasHeight-priceChartDimensions.marginBottom-chartData[i]["open"]["percentageOfSpread"]*priceChartDimensions.height}
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }

    
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        const {height, width, data} = props;
        canvasWidth = width;
        canvasHeight = height;
        chartData = data.data;
        chartMetaData = data.metadata;
        // console.log("mCR chartData", chartData)
        // console.log("mCR chartMetaData", chartMetaData)
        priceChartDimensions = setPriceChartDimensions();
        volumeChartDimensions = setVolumeChartDimensions();
        p.redraw()
    };

    p.preload = function () {
        robotoThin = p.loadFont('/fonts/Roboto-Medium.ttf')
    }
    
    p.setup = function () {
        p.createCanvas(canvasWidth, canvasHeight);
        p.noLoop();
        p.textFont(robotoThin, 12);
    };
    
    p.draw = function () {
        p.background(10);
        p.push();
        if (chartData) {
            drawPriceChartBackground();
            drawVolumeChartBackground();
            drawPriceChart();
            drawVolumeChart();
        }
        p.pop();
        // if (p.keyIsPressed) {
        //     keyPressed();
        // }
    };
    
    
    function keyPressed () {
        if (p.keyCode === p.LEFT_ARROW) {
            priceChartDimensions.width++
        } else if (p.keyCode === p.RIGHT_ARROW) {
            priceChartDimensions.width--
        }
    }
    
};