import React from 'react';

import { connect } from 'react-redux'
import {Bar, Line, Bubble} from 'react-chartjs-2'
import * as d3 from 'd3'

//sets D3 color scale for chart features
const linear = d3.scaleLinear()
    .domain([0, 5])
    .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])

//contanst value for adjusting bubble chart feature sizes, can be abstracted to state if adjustment desired
const translator = 60

//formats date objects for most labels.
function formatDate(date){
    return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+'/'+date.getFullYear()
}
//formats for bin date ranges
function formatBinDate(date){
    return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
}
//formats from bin sizes to slug for USGS API fetches. Assists in on-Click for Histogram bars
function formatSlugDate(date){
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())
}

function Chart(props) {
    return (
        <div className="chart-holder">
            {genChartByType(props)}
        </div>
    );
}

//chart functions found BELOW export
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
        },
        setDateRange: (start, end) => {
            dispatch({
                type: "SET_DATE_RANGE",
                start: start,
                end: end
            })
        }
    }
}

function mapStateToProps(state){
    return {...state}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);



//handles generation of line chart
function genLine(props){
    //passes in features to reduce function that returns a formatted object of prossessed data
    //contains dataset label, data array, and configuration functions for point-by-point attributes
    let lineObj = reduceFetchToLine(props.features, props)
    return (
        <>
        <div className="chart-sizer">
            <Line
                data={{
                    datasets: [lineObj]
                }}
                //sets up onclick for element to link to show page
                getElementAtEvent={(elems) => {
                    if(elems[0]){
                        props.history.push(`/event/${props.features[elems[0]._index].id}`)
                    }
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
    //extracts date to the x, magnitude to the y, and place to the location key
    //Chart.js reads x and y for graphing, location key used to label
    //y can scale differently dependant on toggle status of scaleLineToLog (logarithmic vs linear)
    let data = []
    features.forEach((quake) => {
        data.push({
            x: quake.properties.time,
            y: props.scaleLineToLog ? Math.pow(2, quake.properties.mag) : quake.properties.mag,
            location: quake.properties.place
        })
    })
    //Generates object in dataset format that Chart.js accepts, with customized attributes specified
    return {
        label: "Earthquakes",
        data: data,
        pointBackgroundColor: getLineColor,
        pointHoverBackgroundColor: getLineColor,
        pointBorderColor: "rgb(0,0,0,0)",
        lineTension: 0,
        pointRadius: "2"
    }
}

function getLineColor(context){
    return linear(context.dataset.data[context.dataIndex].y)
}

//generates histogram
function genHist(props){
    //reduces feature data to an array with a list of labels, and a dataset object formatted for Chart.js
    let barArr = reduceFetchToBar(props.features)
    return (
        <>
        <div className="chart-sizer">
            <Bar
                data={{
                    labels: barArr[0],
                    datasets: [barArr[1]]
                }}
                getElementAtEvent={(elems) => {
                    //handles onclick for a single bar, sets the new date range to the specified bin, fetches, then routes to GlobeView
                    if(elems[0]){
                        let start = barArr[1].startEnds[elems[0]._index].start
                        let end = barArr[1].startEnds[elems[0]._index].end
                        let date = end
                        if(start == end){
                            date = new Date(end)
                            date.setDate(date.getDate() + 2)
                            date = formatSlugDate(date)
                        }
                        props.setDateRange(start, date)
                        props.history.push('/globe')
                    }
                }}
                options={{
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
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
                <p>Plots frequency of seismic event in incremental bins, starting from oldest quake to one week following. Sturges rule used to determine bin size.</p>
                <br></br>
                <p>Frequency may correspond interestingly to the other charts, see if you notice anything exciting!</p>
            </div>
        </div>
        </>
    )
}

function reduceFetchToBar(features){
    //bin number calculated using Sturges Rule
    const totalBins = 1+(3.322*Math.log10(features.length))

    //sorts features by date
    let sortedFeats = [...features]
    sortedFeats.sort((a, b) => {
        return a.properties.time - b.properties.time
    })

    let data = []
    let labels = []
    let startEnds = []
    //pushes arrays into data equal to the total number of bins
    //pushes bin ranges into labels array, and sifts through the sorted feature array dropping events into their appropriate bin based on time of occurrence
    if(sortedFeats[0]){
        let min = sortedFeats[0].properties.time
        let max = sortedFeats[sortedFeats.length - 1].properties.time
        let interval = max-min
        for(let i = 0; i < totalBins; i++){
            data.push([])
        }
        for(let i = 0; i < totalBins; i++){
            labels.push(getDateRange(min, max, i, totalBins))
            startEnds.push(getStartEnds(min, max, i, totalBins))
        }
        features.forEach((feature, i) => {
            let day = Math.floor((feature.properties.time-min)/(interval/totalBins))
            if (day == totalBins){day = totalBins-1 }
            data[day].push(feature)
        })
    }
    //Once all features are in their appropriate bin, the data is mapped to their array lengths instead, producing an array of bin sizes corresponding to their labels
    data = data.map((datum) => {
        return datum.length
    })
    const linearBar = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range(["rgb(100,200,0,0.5)", "	rgb(200,0,0,0.4)"])

    //formats dataset object for Chart.js with customization specs.
    return  ([
        labels,
        {
            label: "Seismic Event Occurrences",
            backgroundColor: (context) => {
                return getBarColor(context, linearBar)
            },
            hoverBackgroundColor: "rgb(200,200,200, 0.5)",
            data: data,
            startEnds: startEnds
        }])
}

function getBarColor(context, linearBar){
    return linearBar(context.dataset.data[context.dataIndex])
}

function getDateRange(min, max, index, totalBins){
    let interval = (max-min)/totalBins
    let startBin = new Date(min + index*interval)
    let endBin = new Date(min + (index+1)*interval)
    return `${formatBinDate(startBin)} - ${formatBinDate(endBin)}`
}

//startEnds array used to label on-hover boxes for bars
function getStartEnds(min, max, index, totalBins){
    let interval = (max-min)/totalBins
    let startBin = new Date(min + index*interval)
    let endBin = new Date(min + (index+1)*interval)
    return {
        start: formatSlugDate(startBin),
        end: formatSlugDate(endBin)
    }
}

function genBubble(props){
    //reduces feature data and returns an array of objects corresponding to magnitude bins
    let bubbleArr = reduceFetchToBubble(props.features, props)
    return (
        <>
        <div className="chart-sizer">
            <Bubble
            className="bubbleChart"
            data={{
                datasets: bubbleArr
            }}
            getElementAtEvent={(elems) => {
                if(elems[0]){
                    props.history.push(`/event/${bubbleArr[elems[0]._datasetIndex].data[elems[0]._index].id}`)
                }
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
                <p>Occurrences with depth of origin(km) on the y, time on the x, and magnitude corresponding to bubble size.</p>
                <br></br>
                <p>Defaults to scaling circle area to relative amplitude (mag8 will have 10x the area of a mag4).</p>
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

function reduceFetchToBubble(features, props){
    let data = []
    //Formats features into chart.js objects
    features.forEach((quake) => {
        data.push({
            x: quake.properties.time,
            y: quake.geometry.coordinates[2],
            r: props.scaleBubbleToLin ? quake.properties.mag*2.5 : Math.sqrt(Math.pow(10, quake.properties.mag)/Math.PI)/translator,
            location: quake.properties.place,
            id: quake.id
        })
    })
    //Passes the formatted features into digestion to separate them based on magnitude
    let splitData = digestMagnitudeBins(data, features)
    return splitData
}

function digestMagnitudeBins(data, features){
    //Nine bins pre-determined for clear magnitude labelling. (0-2, 2-3, 3-4, 4-5, 5-6, 6-7, 7-8, 8-9, 9-10)
    //Bubble color dependant on corresponding bin
    let digested = [[],[],[],[],[],[],[],[],[]]
    //Filters quake features into their appropriate bins based on magnitude
    data.forEach((quake, i) => {
        let floor = Math.floor(features[i].properties.mag)-1 < 0 ? 0 : Math.floor(features[i].properties.mag)-1
        digested[floor].push(quake)
    })

    //Formats bins into dataset categories, with array of features stored in data key
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