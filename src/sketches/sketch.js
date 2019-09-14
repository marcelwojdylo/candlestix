import dataConverter from '../helpers/data-converter.js'



export default function sketch (p) {
  
    let canvasWidth;
    let canvasHeight;
    let percentageData;
    let chartDimensions = setChartDimesions();
    
    function setChartDimesions () {
        return {
            marginLeft: canvasWidth*0.05,
            marginRight: canvasWidth*0.05,
            marginTop: canvasHeight*0.05,
            marginBottom: canvasHeight*0.35,
            width: canvasWidth*0.9,
            height: canvasHeight*0.6,
        }
    }

    function drawChartBackground () {
        p.noStroke();
        p.fill(0)
        p.rect(
            chartDimensions.marginLeft,
            chartDimensions.marginTop,
            chartDimensions.width,
            chartDimensions.height
            )
    }
    
    function drawCandlesticks () {
        p.stroke(255, 204, 0);
        p.strokeWeight(1);
        for (let i=0; i<percentageData.length; i++) {
            
            //positioning
            const horizontalSpan = [
                chartDimensions.marginLeft+(chartDimensions.width/percentageData.length)*i,
                chartDimensions.marginLeft+(chartDimensions.width/percentageData.length)*(i+1)
            ]
            const middleOfOwnSpan = (horizontalSpan[0]+horizontalSpan[1])/2
            const widthOfHorizontalSpan = horizontalSpan[1] - horizontalSpan[0]

            //high-low line
            const high = {
                x: middleOfOwnSpan,
                y: canvasHeight-chartDimensions.marginBottom-percentageData[i][2]*chartDimensions.height
            };
            const low = {
                x: middleOfOwnSpan,
                y: canvasHeight-chartDimensions.marginBottom-percentageData[i][3]*chartDimensions.height
            }
            
            //open-close box
            const boxWidth = widthOfHorizontalSpan * 0.8;
            const boxHeight = percentageData[i][0]*chartDimensions.height - percentageData[i][1]*chartDimensions.height;
            const boxAnchor = {x: middleOfOwnSpan-boxWidth/2, y: canvasHeight-chartDimensions.marginBottom-percentageData[i][0]*chartDimensions.height}
            if (percentageData[i][0]>percentageData[i][1]) {
                p.stroke(52, 224, 170)
            } else {
                p.stroke(201, 60, 0)
            }
            p.line(high.x, high.y, low.x, low.y)
            p.rect(boxAnchor.x, boxAnchor.y, boxWidth, boxHeight)
        }
    }

    
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        const {height, width, data} = props;
        canvasWidth = width;
        canvasHeight = height;
        percentageData = dataConverter.getCandlestickDataAsPercentagesOfSpread(data);
        chartDimensions = setChartDimesions();
        p.redraw()
    };
    
    p.setup = function () {
        p.createCanvas(canvasWidth, canvasHeight);
        // p.noLoop();
        p.background(255, 204, 0)
    };
    
    p.draw = function () {
        drawChartBackground();
        drawCandlesticks();
        // if (p.keyIsPressed) {
        //     keyPressed();
        // }
    };
    
    
    function keyPressed () {
        if (p.keyCode === p.LEFT_ARROW) {
            chartDimensions.width++
        } else if (p.keyCode === p.RIGHT_ARROW) {
            chartDimensions.width--
        }
    }
    
};