import React, { useState, useEffect } from 'react';
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

    let [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=${props.match.params.id}&format=geojson`)
        .then(r => r.json())
        .then((response) => {
            props.setDetailFeature(response)
        })
        if(props.loggedIn){
            fetch(`http://localhost:3000/users/${props.loggedIn.user_id}`)
            .then(r => r.json())
            .then((response) => {
                if(!response["errors"]){
                    let found = response.bookmarks.find((bookmark) => {
                        return bookmark.quake_db_id == props.match.params.id
                    })
                    if (found) {
                        setBookmarked(found)
                    }
                }
            })
        }
    }, [])

    function formatDate(date){
        return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+(date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1)+'/'+date.getFullYear()
    }

    function formatTime(date){
        let hour = null
        let am = null
        if (date.getHours() == 0){
            hour = 12
            am = true
        } else if (date.getHours() < 13){
            hour = date.getHours()
            am = true
        } else {
            hour = date.getHours() - 12
            am = false
        }
        return `${hour}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()}${am ? 'AM' : 'PM'} - EST`
    }

    function getComments(){
        return (
            <div>
                Yeet
            </div>
        )
    }

    function handleBookmarking(evt){
        if(!bookmarked){
            fetch(`http://localhost:3000/bookmarks`, {
                method: 'POST',
                headers: {
                    'content-type':'application/json',
                    'accept':'application/json'
                },
                body: JSON.stringify({
                    quake_db_id: props.match.params.id,
                    user_id: props.loggedIn.user_id,
                    place: props.fetchedQuake.properties.place,
                    dateAndTime: `${formatDate(new Date(props.fetchedQuake.properties.time))} - ${formatTime(new Date(props.fetchedQuake.properties.time))}`,
                    mag: props.fetchedQuake.properties.mag,
                    lat: props.fetchedQuake.geometry.coordinates[1],
                    long: props.fetchedQuake.geometry.coordinates[0]
                })
            }).then(r => r.json())
            .then((response) => {
                if(!response["errors"]){
                    setBookmarked(response)
                }
            })
        } else {
            fetch(`http://localhost:3000/bookmarks/${bookmarked.id}`, {
                method: 'DELETE'
            }).then(r => r.json())
            .then((response) => {
                if(!response["errors"]){
                    setBookmarked(false)
                }
            })
        }
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
                                {props.loggedIn ? <Button onClick={handleBookmarking} floated="right"><Icon name={bookmarked ? "bookmark" : "bookmark outline"} style={{margin: 0}}></Icon></Button> : null}
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
        fetchedQuake: state.detailFeature,
        loggedIn: state.loggedIn
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