import React, { useEffect, useState } from 'react';

import topojson from '../resources/world-continents'

import { connect } from 'react-redux'
import { feature } from 'topojson-client'
import * as d3 from 'd3'
import { stat } from 'fs';

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
        let scale = props.scale * (scalePercent/100 + 1)

        if(canvasHolder){
            let sizer = canvasHolder.getBoundingClientRect()
            translateArr = [sizer.width/2 , sizer.height/2]
        }

        let projection
        switch(pathType){
            case "orthographic":
                projection = d3.geoOrthographic()
                    .translate(translateArr)
                    .scale(scale)
                    .rotate(props.rotation)
                break;
            case "mercator":
                projection = d3.geoMercator()
                    .translate(translateArr)
                    .scale(scale/2)
                    .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                break;
            case "azumithal equidistant":
                projection = d3.geoAzimuthalEquidistant()
                    .translate(translateArr)
                    .scale(scale/2)
                    .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                break;
            case 'conic conformal':
                projection = d3.geoConicConformal()
                    .translate(translateArr)
                    .scale(scale/2)
                    .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                break;
            case 'conic equidistant':
                    projection = d3.geoConicEquidistant()
                        .translate(translateArr)
                        .scale(scale/2)
                        .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                    break;
            case 'stereographic':
                projection = d3.geoStereographic()
                    .translate(translateArr)
                    .scale(scale/2)
                    .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                break;
            case 'gnomic':
                projection = d3.geoGnomonic()
                    .translate(translateArr)
                    .scale(scale/2)
                    .rotate([props.rotation[0], props.rotation[1], props.rotation[2]])
                break;
        }

        let path = d3.geoPath()
            .projection(projection)

        return path
    }
    
    function genGeography(){
        if(mounted){

            let features = feature(topojson, topojson.objects.continent).features
            let path = getPath(props.mapType)

            let paths = features.map((feature, i) => {
                return <path key={i+1} d={path(feature.geometry)} style={{fill:"#d0d0d0"}}></path>
            })

            paths.unshift(<path key={0} d={path({type:"Sphere"})} style={{fill:"#fbf5f5", strokeWidth:"0.7px", stroke:"a0a0a0"}}></path>)
            return paths
        }
    }

    function handleFeatureClick(evt, quake){
        props.setSelected(quake)
    }

    function genDatapoints(){
        if(mounted){
            if(props.features){
                let path = getPath(props.mapType, 3)
                let shadowPath = getPath(props.mapType)
    
                let circles = props.features.map((feature) => {
                    return d3.geoCircle().center([feature.geometry.coordinates[0],feature.geometry.coordinates[1]]).radius(Math.sqrt(Math.pow(props.globeLoggishness, feature.properties.mag)/Math.PI/Math.pow(2, props.globeLoggishness - 3))*0.6+(1/props.globeLoggishness))()
                })
    
                let shadows = props.features.map((feature) => {
                    return d3.geoCircle().center([feature.geometry.coordinates[0],feature.geometry.coordinates[1]]).radius(Math.sqrt(Math.pow(props.globeLoggishness, feature.properties.mag)/Math.PI/Math.pow(2, props.globeLoggishness - 3))*0.6+(1/props.globeLoggishness))()
                })
    
                let arr = []
    
                let circlePaths = circles.map((circle, i) => {
                    return <path onClick={(evt) => {handleFeatureClick(evt, props.features[i])}} key={i} d={path(circle)} style={{fill: linearColor(Number(props.features[i].properties.mag)), opacity: `${1/(props.globeLoggishness/10)/2}`}}></path>
                })
    
                shadows.forEach((shadow, i) => {
                    arr.push(<path key={(i+circles.length)+i} d={shadowPath(shadow)} style={{fill: "light-grey", opacity: `${(1/(props.globeLoggishness/4)/2)*0.1}`}}></path>)
                })
    
                circlePaths.forEach((path) => {arr.push(path)})
    
                return arr
    
            }
        }
    }

    function handleScaleChange(evt){
        props.changeScale(evt.deltaY)
    }

    return (
        <div onWheel={handleScaleChange} className="content-box globe">
            <svg className="canvas">
                {genGeography()}
                {!props.loading ? genDatapoints() : null }
            </svg>
        </div>
    );
}

function mapStateToProps(state){
    return {
        rotation: state.rotation,
        features: state.features,
        globeLoggishness: state.globeLoggishness,
        rotating: state.rotating,
        scale: state.scale,
        mapType: state.mapType,
        loading: state.loading
    }
}

function mapDispatchToProps(dispatch){
    return {
        changeScale: (value) => {
            dispatch({
                type: "MANIPULATE_SCALE",
                value: value
            })
        },
        setSelected: (quake) => {
            dispatch({
                type: "SET_SELECTED",
                value: quake
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Globe);