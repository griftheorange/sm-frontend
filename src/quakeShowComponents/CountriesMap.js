import React, { useState, useEffect } from 'react';

import topojson from '../resources/world-countries'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { connect } from 'react-redux'

function CountriesMap(props) {

    let [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    function handleScaleChange(evt){
        props.changeScale(evt.deltaY)
    }

    function getPath(){
        let canvasHolder = document.querySelector(".countries-canvas")
        let translateArr = [0, 0]
        let scale = props.scale

        if(canvasHolder){
            let sizer = canvasHolder.getBoundingClientRect()
            translateArr = [sizer.width/2 , sizer.height/2]
        }

        let projection = d3.geoMercator()
            .translate(translateArr)
            .scale(scale/2)
            .center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]])

        let path = d3.geoPath()
            .projection(projection)

        return path
    }

    function genGeography(){
        if(mounted){
            let features = feature(topojson, topojson.objects.countries1).features
            let path = getPath()

            let paths = features.map((feature, i) => {
                return <path key={i} d={path(feature)} style={{fill:"#d0d0d0"}}></path>
            })

            paths.push(
                <path key={paths.length} d={path(d3.geoCircle().center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]]).radius(6)())} style={{fill: "red", opacity: "0.2"}}></path>
            )

            paths.push(
                <path key={paths.length} d={path(d3.geoCircle().center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]]).radius(2)())} style={{fill: "red"}}></path>
            )
            return paths
        }
    }

    return (
        <svg className="countries-canvas" onWheel={handleScaleChange}>
            {genGeography()}
        </svg>
    );
}

function mapStateToProps(state){
    return {
        scale: state.scale
    }
}

function mapDispatchToProps(dispatch){
    return {
        changeScale: (value) => {
            dispatch({
                type: "MANIPULATE_SCALE",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountriesMap);