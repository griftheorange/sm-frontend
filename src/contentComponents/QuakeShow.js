import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Loader, Segment, Header, Button, Icon, Container, Input } from 'semantic-ui-react'

import * as d3 from 'd3'
import SweetAlert from 'sweetalert2-react'
import CountriesMap from '../quakeShowComponents/CountriesMap'
import Stats from '../quakeShowComponents/Stats'
import CommentList from '../profileComponents/CommentList'

import '../CSS/Quake.css'

function QuakeShow(props) {

    const linearColor = d3.scaleLinear()
                            .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])
                            .domain([0, 5])

    let [bookmarked, setBookmarked] = useState(false)
    let [commenting, setCommenting] = useState("")
    let [commentContent, setCommentContent] = useState("")
    let [alerting, setAlerting] = useState(false)
    let [comments, setComments] = useState([])

    useEffect(() => {
        props.setDetailFeature(null)
        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=${props.match.params.id}&format=geojson`)
        .then(r => r.json())
        .then((response) => {
            props.setDetailFeature(response)
            fetch(`http://${props.domain}/commented_quakes/${response.id}`)
            .then(r => r.json())
            .then((commented_quake) => {
                if(commented_quake.comments){
                    setComments(commented_quake.comments)
                }
            })
        })
        if(props.loggedIn){
            fetch(`http://${props.domain}/users/${props.loggedIn.user_id}`, {
                headers: {
                    "Authorization": JSON.stringify(props.loggedIn)
                }
            })
            .then(r => r.json())
            .then((response) => {
                if(!response["errors"] && !response.unauthorized ){
                    let found = response.bookmarks.find((bookmark) => {
                        return bookmark.quake_db_id == props.match.params.id
                    })
                    if (found) {
                        setBookmarked(found)
                    }
                } else if(response.unauthorized){
                    window.localStorage.clear()
                    props.setLoggedIn(null)
                } else {
                    console.log("Errors in QuakeShow.js, useEffect()")
                }
            })
        }

    }, [props.loggedIn])

    function handleDelete(comment){
        fetch(`http://${props.domain}/comments/${comment.id}`, {
            method: "DELETE"
        })
        .then(r => r.json())
        .then((response) => {
            let newComments = [...comments]
            let foundIndex = 0
            newComments.forEach((comment, i) => {
                if(comment.id == response.id){foundIndex = i}
            })
            if(foundIndex == 0){
                newComments = newComments.slice(1)
            } else {
                newComments = [...newComments.slice(0, foundIndex), ...newComments.slice(foundIndex+1)]
            }
            setComments(newComments)
        })
    }

    function formatDate(date){
        return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+'/'+date.getFullYear()
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

    function toggleCommenting(){
        setCommenting("show")
    }

    function getComments(){
        return (
            <>
                {props.loggedIn ? <Button onClick={toggleCommenting} size="mini" compact style={{position: "absolute", left: "calc(100% - 5em)", marginRight: "0.5em"}}><Icon name="comment" style={{margin: 0}}></Icon></Button> : null}
                <CommentList comments={comments} handleDelete={handleDelete}/>
            </>
        )
    }

    function handleBookmarking(evt){
        if(!bookmarked){
            fetch(`http://${props.domain}/bookmarks`, {
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
            fetch(`http://${props.domain}/bookmarks/${bookmarked.id}`, {
                method: 'DELETE'
            }).then(r => r.json())
            .then((response) => {
                if(!response["errors"]){
                    setBookmarked(false)
                }
            })
        }
    }

    function handleChange(evt){
        setCommentContent(evt.target.value)
    }

    function handleComment(){
        let date = new Date(Date.now())
        fetch(`http://${props.domain}/comments`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                'accept':'application/json'
            },
            body: JSON.stringify({
                user_id: props.loggedIn.user_id,
                quake_db_id: props.fetchedQuake.id,
                date_posted: `${formatDate(date)} - ${formatTime(date)}`,
                content: commentContent,
                quake_name: props.fetchedQuake.properties.place,
                quake_mag: props.fetchedQuake.properties.mag
            })
        })
        .then(r => r.json())
        .then((response) => {
            if(response.errors){
                setAlerting(response.errors)
            } else {
                setComments([...comments, response])
                setCommenting(false)
                setCommentContent("")
            }
        })
    }

    function getCommentBox(){
        if(props.loggedIn){
            return (
                <div className={`comment-box ${commenting}`}>
                    <div className="pretty-comment-container">
                        <Header as="h1" textAlign="left" style={{marginLeft: "0.5em"}}>Comment</Header>
                        <Icon onClick={()=>{setCommenting("")}} name="window close outline" size="big" style={{position: "absolute", left: "calc(100% - 2em)", top: "0.5em"}}></Icon>
                        <Input
                            type="textarea"
                            fluid
                            focus
                            style={{margin: "1em", height: "50%", fontSize: "1.5em", wordBreak: "break-all", overflowWrap: "break-word"}}
                            value={commentContent}
                            onChange={handleChange}></Input>
                        <div style={{display: "flex", marginBottom: "0.5em"}}>
                            <Button onClick={handleComment} style={{margin: "auto"}}>Submit</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function getErrors(errors){
        let strArr = []
        for(let key in errors){
            strArr.push(`${key.charAt(0).toUpperCase() + key.slice(1)} ${errors[key][0]}`)
        }
        let str = strArr.join(", ")
        return str
    }

    if(props.fetchedQuake){
        return (
            <div style={{display: "flex", flexFlow: "column", overflowY: "hidden", position: "relative"}}>
            {alerting ? <SweetAlert show={true} title="Invalid Input" text={getErrors(alerting)} onConfirm={() => {setAlerting(false)}}/> : null}
            <div className="content-box show-page" style={{borderColor: linearColor(Number(props.fetchedQuake.properties.mag)), borderWidth: `10px`}}>
                <div className="quake-show left">
                    <Segment className="quake-show-header" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <Header as='h1'><a href={props.fetchedQuake.properties.url} target="_blank">USGS Reference Page</a></Header>
                    </Segment>
                    <Segment className="quake-show-map" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <CountriesMap centered={true} quake={props.fetchedQuake}></CountriesMap>
                    </Segment>
                    <Segment className="quake-show-comments" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>
                        <Container style={{height: "100%", display: "flex", flexFlow: "column"}}>
                            <Container style={{display: "flex", height: "2.8em"}}>
                                <Header as="h1" style={{marginTop: "0.1em", marginBottom: "0.1em"}}>Insights</Header>
                                <div className="spacer"></div>
                                {props.loggedIn ? <Button onClick={handleBookmarking} floated="right"><Icon name={bookmarked ? "bookmark" : "bookmark outline"} style={{margin: 0}}></Icon></Button> : null}
                            </Container>
                            <Segment style={{flex: "1 1 auto", overflowY: "scroll"}}>
                                {getComments()}
                            </Segment>
                        </Container>
                    </Segment>
                </div>
                <div className="quake-show right">
                    <Stats/>
                </div>
            </div>
            {getCommentBox()}
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
        fetchedQuake: state.detailFeature,
        loggedIn: state.loggedIn,
        domain: state.domain
    }
}

function mapDispatchToProps(dispatch){
    return {
        setDetailFeature: (quake) => {
            dispatch({
                type: "SET_DETAIL_FEATURE",
                value: quake
            })
        },
        setLoggedIn: (value) => {
            dispatch({
                type: "SET_LOGGED_IN",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuakeShow);