import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Loader, Segment, Header, Button, Icon, Container } from 'semantic-ui-react'
import * as d3 from 'd3'

import CountriesMap from '../quakeShowComponents/CountriesMap'
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

    function getComments(){
        return (
            <div>
                Yeet
            </div>
        )
    }

    if(props.fetchedQuake){
        return (
            <div className="content-box show-page" style={{borderColor: linearColor(Number(props.fetchedQuake.properties.mag)), borderWidth: `${props.fetchedQuake.properties.mag}px`}}>
                <div className="quake-show left">
                    <Segment className="quake-show-header" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <Header as='h1'><a href={props.fetchedQuake.properties.url} target="_blank">USGS Reference Page</a></Header>
                    </Segment>
                    <Segment className="quake-show-map" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <CountriesMap quake={props.fetchedQuake}></CountriesMap>
                    </Segment>
                    <Segment className="quake-show-comments" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <Container style={{height: "100%", display: "flex", flexFlow: "column"}}>
                            <Container style={{display: "flex", height: "2.8em"}}>
                                <Header as="h1" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>Insights</Header>
                                <div className="spacer"></div>
                                <Button floated="right"><Icon name="bookmark outline" style={{margin: 0}}></Icon></Button>
                            </Container>
                            <Segment style={{flex: "1 1 auto"}}>
                                {getComments()}
                            </Segment>
                        </Container>
                    </Segment>
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