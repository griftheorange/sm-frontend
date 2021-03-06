import React, { useState, useEffect } from 'react';

import topojson from '../resources/world-countries'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { connect } from 'react-redux'

function CountriesMap(props) {

    let [mounted, setMounted] = useState(false)
    let [x, setX] = useState(0)
    let [y, setY] = useState(0)

    //on mount, sets the mounted state to the bounding rect of the canvas svg to assist in map rendering
    useEffect(() => {
        let svg = document.querySelector(".countries-canvas")
        setMounted(svg.getBoundingClientRect())
    }, [])

    function handleScaleChange(evt){
        props.changeScale(evt.deltaY)
    }

    //returns a D3 path generator function on a Mercator projection, if rendering with a centered prop, centers on the giver lat and long, else default centers
    function getPath(){
        let canvasHolder = document.querySelector(".countries-canvas")
        let translateArr = [0, 0]
        let scale = props.scale

        if(canvasHolder){
            let sizer = canvasHolder.getBoundingClientRect()
            translateArr = [sizer.width/2 , sizer.height/2]
        }

        let projection
        if(props.centered){
            projection = d3.geoMercator()
            .translate(translateArr)
            .scale(scale/2)
            .center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]])
        } else {
            projection = d3.geoMercator()
            .translate(translateArr)
            .scale(scale/2)
        }

        let path = d3.geoPath()
            .projection(projection)

        return path
    }

    function handleClick(quake){
        if(props.history){
            props.setHoveredEvent(null)
            props.history.push(`/event/${quake.quake_db_id}`)
        }
    }

    function handleMouseEnter(quake){
        props.setHoveredEvent(quake.quake_db_id)
    }

    function handleMouseExit(){
        props.setHoveredEvent(null)
    }

    //Conditionally renders different number of events and different listeners if props.quake (singular) exists, or props.quakes (plural) exists.
    //The singular specifies conditions for a single quake show page
    //The plural specifies conditions for a users profile page, displaying bookmared events
    function genGeography(){
        if(mounted){
            if(props.quake){
                let features = feature(topojson, topojson.objects.countries1).features
                let path = getPath()

                let paths = features.map((feature, i) => {
                    return <path key={i} d={path(feature)} style={{fill:"#d0d0d0", stroke: "gray", strokeWidth: "0.4px"}}></path>
                })

                paths.push(
                    <path key={paths.length} d={path(d3.geoCircle().center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]]).radius(6)())} style={{fill: "red", opacity: "0.2"}}></path>
                )

                paths.push(
                    <path key={paths.length} d={path(d3.geoCircle().center([props.quake.geometry.coordinates[0], props.quake.geometry.coordinates[1]]).radius(2)())} style={{fill: "red"}}></path>
                )
                return paths
            } else if(props.quakes){
                let features = feature(topojson, topojson.objects.countries1).features
                let path = getPath()

                let paths = features.map((feature, i) => {
                    return <path key={i} d={path(feature)} style={{fill:"#d0d0d0", stroke: "gray", strokeWidth: "0.4px"}}></path>
                })

                props.quakes.forEach((quake, i) => {
                    paths.push(<path onClick={() => {handleClick(quake)}} onMouseEnter={() => {handleMouseEnter(quake)}} onMouseLeave={() => {handleMouseExit()}} key={paths.length} d={path(d3.geoCircle().center([quake.long, quake.lat]).radius((quake.quake_db_id == props.hoveredEventId ? 10 : 6))())} style={{fill: (quake.quake_db_id == props.hoveredEventId ? "green" : "red"), opacity: "0.2"}}></path>)
                    paths.push(<path onClick={() => {handleClick(quake)}} onMouseEnter={() => {handleMouseEnter(quake)}} onMouseLeave={() => {handleMouseExit()}} key={paths.length} d={path(d3.geoCircle().center([quake.long, quake.lat]).radius((quake.quake_db_id == props.hoveredEventId ? 3 : 2))())} style={{fill: (quake.quake_db_id == props.hoveredEventId ? "green" : "red")}}></path>)
                })
           
                return paths
            }
        }
    }

    //updates the x and y states for moving the on-hover description box for the profile page map
    function handleMouseMove(evt){
        if(props.quakes){
            let mouseX = evt.clientX - mounted.x
            let mouseY = evt.clientY - mounted.y
            if(props.hoveredEventId && props.hoveringMap){
                setY(mouseY)
                if(mouseX > mounted.width/2){
                    setX(mouseX-220)
                } else {
                    setX(mouseX+3)
                }
            }
        }
    }
    let hoveredEvent = null
    if(props.quakes){
        hoveredEvent = props.quakes.find((quake) => {
            return quake.quake_db_id == props.hoveredEventId
        })
    }

    //formats location for label
    function formatLocation(loc){
        let arr = loc.split(/\sof\s/)
        if(arr.length > 1){
            return arr[1]
        } else {
            return loc
        }
    }

    return (
        <svg className="countries-canvas" onWheel={handleScaleChange} onMouseMove={handleMouseMove}
            onMouseEnter={()=>{props.setHoveringMap(true)}}
            onMouseLeave={()=>{props.setHoveringMap(false)}}>
            {genGeography()}
            <g>
                {/* renders the info display box on hover if all conditions are met */}
                <rect className={props.hoveredEventId && props.hoveringMap && props.quakes ? "info-box show" : "info-box"} width="220" height="90" x={x} y={y} style={{transform: "translate(0.3em, 1.6em)"}}/>
                <text className={props.hoveredEventId && props.hoveringMap && props.quakes ? "text show" : "text"} x={x} y={y} style={{transform: "translate(1.5em, 4em)"}}>Place: {hoveredEvent ? formatLocation(hoveredEvent.place) : null}</text>
                <text className={props.hoveredEventId && props.hoveringMap && props.quakes ? "text show" : "text"} x={x} y={y} style={{transform: "translate(1.5em, 5.4em)"}}>Mag: {hoveredEvent ? hoveredEvent.mag : null}</text>
                <text className={props.hoveredEventId && props.hoveringMap && props.quakes ? "text show" : "text"} x={x} y={y} style={{transform: "translate(1.5em, 6.8em)"}}>Date/Time:</text>
                <text className={props.hoveredEventId && props.hoveringMap && props.quakes ? "text smaller show" : "text"} x={x} y={y} style={{transform: "translate(1.5em, 8.2em)"}}>{hoveredEvent ? hoveredEvent.dateAndTime : null}</text>
            </g>
        </svg>
    );
}

function mapStateToProps(state){
    return {
        scale: state.scale,
        hoveredEventId: state.hoveredEventId,
        hoveringMap: state.hoveringMap
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
        setHoveredEvent: (value) => {
            dispatch({
                type: "SET_HOVERED_EVENT",
                value: value
            })
        },
        setHoveringMap: (value) => {
            dispatch({
                type: "SET_HOVERING_MAP",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountriesMap);