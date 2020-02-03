import React, { useEffect, useState } from 'react';

import topojson from '../resources/world-continents'

import { connect } from 'react-redux'
import { feature } from 'topojson-client'
import * as d3 from 'd3'

function Globe(props) {
    
    let [mounted, setMounted] = useState(false)
    const linearColor = d3.scaleLinear()
                            .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])
                            .domain([0, 5])

    let [timer, setTimer] = useState(null)

    useEffect(() => {
        setMounted(true)
    })


    function getPath(pathType, scalePercent = 0){
        let canvasHolder = document.querySelector(".canvas")
        let translateArr = [0, 0]
        let scale = 300 * (scalePercent/100 + 1)

        if(canvasHolder){
            let sizer = canvasHolder.getBoundingClientRect()
            translateArr = [sizer.width/2 , sizer.height/2]
        }

        let projection
        if(pathType == "orthographic"){
            projection = d3.geoOrthographic()
                .translate(translateArr)
                .scale(scale)
                .rotate(props.rotation)
        } else if(pathType == "mercator"){
            projection = d3.geoMercator()
                .translate(translateArr)
                .scale(scale)
        }

        let path = d3.geoPath()
            .projection(projection)

        return path
    }
    
    function genGeography(){
        if(mounted){

            let features = feature(topojson, topojson.objects.continent).features
            let path = getPath("orthographic")

            let paths = features.map((feature, i) => {
                return <path key={i+1} d={path(feature.geometry)} style={{fill:"#d0d0d0"}}></path>
            })

            paths.unshift(<path key={0} d={path({type:"Sphere"})} style={{fill:"#fbf5f5", strokeWidth:"0.7px", stroke:"a0a0a0"}}></path>)
            return paths
        }
    }

    function handleFeatureClick(evt, feature){
    }

    function genDatapoints(){
        if(props.features){
            let path = getPath("orthographic", 1)

            let circles = props.features.map((feature) => {
                return d3.geoCircle().center([feature.geometry.coordinates[0],feature.geometry.coordinates[1]]).radius(Math.sqrt(Math.pow(props.globeLoggishness, feature.properties.mag)/Math.PI/Math.pow(2, props.globeLoggishness - 3))*0.6)()
            })

            return circles.map((circle, i) => {
                return <path onClick={(evt) => {handleFeatureClick(evt, props.features[i])}} key={i} d={path(circle)} style={{fill: linearColor(Number(props.features[i].properties.mag)), opacity: `${1/(props.globeLoggishness/4)/2}`}}></path>
            })
        }
    }

    return (
        <div className="content-box globe">
            <svg className="canvas">
                {genGeography()}
                {genDatapoints()}
            </svg>
        </div>
    );
}

function mapStateToProps(state){
    return {
        rotation: state.rotation,
        features: state.features,
        globeLoggishness: state.globeLoggishness,
        rotating: state.rotating
    }
}

export default connect(mapStateToProps)(Globe);