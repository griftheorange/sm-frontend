import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import * as d3 from 'd3'

import Stats from '../quakeShowComponents/Stats'

import '../CSS/Quake.css'

function QuakeShow(props) {

    const linearColor = d3.scaleLinear()
                            .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])
                            .domain([0, 5])

    useEffect(() => {
        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=${props.match.params.id}&format=geojson`)
        .then(r => r.json())
        .then((response) => {
            props.setDetailFeature(response)
        })
    }, [])

    if(props.fetchedQuake){
        return (
            <div className="content-box show-page" style={{borderColor: linearColor(Number(props.fetchedQuake.properties.mag)), borderWidth: `${props.fetchedQuake.properties.mag}px`}}>
                <div className="quake-show left">

                </div>
                <div className="quake-show right">
                    <Stats/>
                </div>
            </div>
        )
    } else {
        return (
            <div className="content-box show-page">
                <Loader active></Loader>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        passedQuake: state.selectedFeature,
        fetchedQuake: state.detailFeature
    }
}

function mapDispatchToProps(dispatch){
    return {
        setDetailFeature: (quake) => {
            dispatch({
                type: "SET_DETAIL_FEATURE",
                value: quake
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuakeShow);