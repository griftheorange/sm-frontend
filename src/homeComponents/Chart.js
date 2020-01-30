import React from 'react';

import { connect } from 'react-redux'
import {Bar, Line, Bubble} from 'react-chartjs-2'
import * as d3 from 'd3'

const linear = d3.scaleLinear()
    .domain([0, 5])
    .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])

const translator = 60

function formatDate(date){
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+date.getDate()
}

function formatBinDate(date){
    return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
}

function Chart(props) {
    return (
        <div className="chart-holder">
            {genChartByType(props)}
        </div>
    );
}

function genChartByType(props){
    switch(props.type){
        case "bubble":
            return genBubble(props)
            break;
        case "line":
            return genLine(props)
            break;
        case "hist":
            return genHist(props)
            break;
        default:
            return null
    }
}

function mapDispatchToProps(dispatch){
    return {
        toggleLineScale: () => {
            dispatch({
                type: "TOGGLE_LINE_SCALE"
            })
        },
        toggleBubbleScale: () => {
            dispatch({
                type: "TOGGLE_BUBBLE_SCALE"
            })
        }
    }
}

function mapStateToProps(state){
    return {...state}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);




function genLine(props){
    let lineArr = reduceFetchToLine(props.features, props)
    return (
        <>
        <div className="chart-sizer">
            <Line
                data={{
                    datasets: [lineArr]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: props.scaleLineToLog ? "Relative Force(10^magnitude)": "Magnitude"
                            }
                        }],
                        xAxes: [{
                            type: 'linear',
                            display: true,
                            ticks: {
                                callback: function(value, index, values){
                                    return formatDate(new Date(value))
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Date"
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function(t, d){
                                return d.datasets[0].data[t[0].index].location
                            },
                            label: function(t, d){
                                return props.scaleLineToLog ? `Magnitude Scaled: ${d.datasets[0].data[t.index].y}` : `Magnitude: ${d.datasets[0].data[t.index].y}`
                            },
                            afterLabel: function(t, d){
                                return `Date: ${formatDate(new Date(Number(d.datasets[0].data[t.index].x)))}`
                            }
                        }
                    }
                }}>

            </Line>
        </div>
        <div className="chart-details content-box">
            <div className="overflow-handler">
                <h3>SE Magnitudes vs Time</h3>
                <br></br>
                <p>Plots earthquake magnitudes vs when they were recorded.</p>
                <br></br>
                <p>Defaults to linear scaling of magnitudes(a mag8 will be twice as high as a mag4).</p>
                <br></br>
                <p> For logarithmic scaling more according to quake strength, toggle below!</p>
                <br></br>
                <button onClick={props.toggleLineScale}>{props.scaleLineToLog ? "Scale to Magnitude" : "Scale to Force"}</button>
            </div>
        </div>
        </>
    )
}

function reduceFetchToLine(features, props){
    let data = []
    features.forEach((quake) => {
        data.push({
            x: quake.properties.time,
            y: props.scaleLineToLog ? Math.pow(2, quake.properties.mag) : quake.properties.mag,
            location: quake.properties.place
        })
    })
    return {
        label: "Earthquakes",
        data: data,
        pointBackgroundColor: getLineColor,
        pointHoverBackgroundColor: getLineColor,
        pointBorderColor: "rgb(0,0,0,0)",
        pointRadius: "2"
    }
}

function getLineColor(context){
    return linear(context.dataset.data[context.dataIndex].y)
}

function genHist(props){
    let barArr = reduceFetchToBar(props.features)
    return (
        <>
        <div className="chart-sizer">
            <Bar
                data={{
                    labels: barArr[0],
                    datasets: [barArr[1]]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
                >

            </Bar>
        </div>
        <div className="chart-details content-box">
            <div className="overflow-handler">
                <h3>SE Frequency vs Time</h3>
                <br></br>
                <p>Plots frequency of seismic event in half-day bins, starting from oldest quake to one week following.</p>
                <br></br>
                <p>Due to the way the bins are made, the final bin may be somewhat lower than the true value. It is usually in the process of being filled.</p>
                <br></br>
                <p>Frequency may correspond interestingly to the other charts, see if you notice anything exciting!</p>
            </div>
        </div>
        </>
    )
}

function reduceFetchToBar(features){
    const binsPerDay = 2
    let sortedFeats = [...features]
    sortedFeats.sort((a, b) => {
        return a.properties.time - b.properties.time
    })
    let data = []
    let labels = []
    if(sortedFeats[0]){
        let min = sortedFeats[0].properties.time
        for(let i = 0; i < 7*binsPerDay; i++){
            data.push([])
        }
        for(let i = 0; i < 7*binsPerDay; i++){
            labels.push(getDateRange(min, i, binsPerDay))
        }
        features.forEach((feature, i) => {
            let day = Math.floor((feature.properties.time-min)/(86400000/binsPerDay))
            data[day].push(feature)
        })
    }
    data = data.map((datum) => {
        return datum.length
    })
    const linearBar = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range(["rgb(100,200,0,0.5)", "	rgb(200,0,0,0.4)"])
    return  ([
        labels,
        {
            label: "Seismic Events",
            backgroundColor: (context) => {
                return getBarColor(context, linearBar)
            },
            hoverBackgroundColor: "rgb(200,200,200, 0.5)",
            data: data
        }])
}

function getBarColor(context, linearBar){
    return linearBar(context.dataset.data[context.dataIndex])
}

function getDateRange(min, index, binsPerDay){
    let interval = 86400000/binsPerDay
    let startBin = new Date(min + index*interval)
    let endBin = new Date(min + (index+1)*interval)
    return `${formatBinDate(startBin)} - ${formatBinDate(endBin)}`
}

function genBubble(props){
    let bubbleArr = reduceFetchToBubble(props.features, props)
    return (
        <>
        <div className="chart-sizer">
            <Bubble
            className="bubbleChart"
            data={{
                datasets: bubbleArr
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            reverse: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Origin Depth(km)'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            callback: function(value, index, values){
                                return formatDate(new Date(value))
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Date"
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function(t, d){
                            return `${d.datasets[t[0].datasetIndex].data[t[0].index].location}`
                        },
                        label: function(t, d){
                            return props.scaleBubbleToLin ? `Magnitude: ${d.datasets[t.datasetIndex].data[t.index].r/2.5}, Date: ${formatDate(new Date(d.datasets[t.datasetIndex].data[t.index].x))}` : `Magnitude: ${Math.log10(Math.PI*Math.pow(d.datasets[t.datasetIndex].data[t.index].r*translator, 2))}, Date: ${formatDate(new Date(d.datasets[t.datasetIndex].data[t.index].x))}`
                        },
                        afterLabel: function(t, d){
                            return `Depth: ${d.datasets[t.datasetIndex].data[t.index].y}km`
                        }
                    }
                }
            }}/>
        </div>
        <div className="chart-details content-box">
            <div className="overflow-handler">
                <h3>SE Mag, Depth vs Time</h3>
                <br></br>
                <p>Occurrences with depth of origin(km) on the y, time on the x, and magnitude to bubble size.</p>
                <br></br>
                <p>Defaults to scaling circle area to relative force(mag8 will have 10x the area of a mag4).</p>
                <br></br>
                <p>Scaling circle radius linearly with magnitude may make it easier to spot total event occurrences. Toggle below!</p>
                <br></br>
                <button onClick={props.toggleBubbleScale}>{props.scaleBubbleToLin ? "Scale to Force" : "Scale to Magnitude"}</button>
                <br></br>
            </div>
        </div>
        </>
    )
}

function digestMagnitudeBins(data, features){
    let digested = [[],[],[],[],[],[],[],[],[]]
    data.forEach((quake, i) => {
        let floor = Math.floor(features[i].properties.mag)-1 < 0 ? 0 : Math.floor(features[i].properties.mag)-1
        digested[floor].push(quake)
    })

    digested = digested.map((category, i) => {
        return {
            label: i == 0 ? "Magnitudes 0-2" : `Magnitudes ${i+1}-${i+2}`,
            backgroundColor: linear(i),
            hoverBackgroundColor: linear(i),
            borderColor: 'rgb(0, 0, 0, 0.1)',
            data: category
        }
    })
    return digested
}

function reduceFetchToBubble(features, props){
    let data = []
    features.forEach((quake) => {
        data.push({
            x: quake.properties.time,
            y: quake.geometry.coordinates[2],
            r: props.scaleBubbleToLin ? quake.properties.mag*2.5 : Math.sqrt(Math.pow(10, quake.properties.mag)/Math.PI)/translator,
            location: quake.properties.place
        })
    })
    let splitData = digestMagnitudeBins(data, features)
    return splitData
}