import React, { useState, useEffect } from 'react';
import { Card, Segment, Header, Container, Button, Icon, Label } from 'semantic-ui-react' 
import { connect } from 'react-redux'
import { switchStatement } from '@babel/types';

function QuakeDetails(props) {

    function formatDate(date){
        return (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'/'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+'/'+date.getFullYear()
    }

    let [usersBookmarks, setUsersBookmarks] = useState([])

    useEffect(() => {
        if(props.loggedIn){
            fetch(`http://${props.domain}/users/${props.loggedIn.user_id}`, {
                headers: {
                    "Authorization": JSON.stringify(props.loggedIn)
                }
            })
            .then(r => r.json())
            .then((response) => {
                if(response.unauthorized){
                    window.localStorage.clear()
                    props.setLoggedIn(null)
                } else {
                    let mappedBookmarks = response.bookmarks.map((bookmark) => {
                        return {
                            id: bookmark.id,
                            quake_id: bookmark.quake_db_id
                        }
                    })
                    setUsersBookmarks(mappedBookmarks)
                }
            })
        }
    }, [props.loggedIn])

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

    function routeToQuakeShow(){
        //Detail Feature is the fetched quake for the current quake show page, quake is the selected quake on the globeview page
        //These steps are kept separate so that a different quake can be held in view on the globe page and maintained on the Quake show page
        //Prevents re-fetch if visiting the same page again
        if(props.detailFeature && !(props.detailFeature.id == props.quake.id)){
            props.setDetailFeature(null)
        }
        props.stopRotation()
        props.history.push(`/event/${props.quake.id}`)
    }

    function getBookmarkButton(){
        if(props.loggedIn && usersBookmarks){
            let bookmark_db_ids = usersBookmarks.map((bookmark) => {
                return bookmark.quake_id
            })
            return (
                <Button
                    onClick={handleBookmarking}>
                    <Icon 
                        name={bookmark_db_ids.includes(props.quake.id) ? "bookmark" : "bookmark outline"} 
                        style={{margin: 0}}></Icon>
                </Button>
            )
        }
    }

    function handleBookmarking(){
        let bookmark_db_ids = usersBookmarks.map((bookmark) => {
            return bookmark.quake_id
        })
        if(!bookmark_db_ids.includes(props.quake.id)){
            fetch(`http://${props.domain}/bookmarks`, {
                method: 'POST',
                headers: {
                    'content-type':'application/json',
                    'accept':'application/json'
                },
                body: JSON.stringify({
                    quake_db_id: props.quake.id,
                    user_id: props.loggedIn.user_id,
                    place: props.quake.properties.place,
                    dateAndTime: `${formatDate(new Date(props.quake.properties.time))} - ${formatTime(new Date(props.quake.properties.time))}`,
                    mag: props.quake.properties.mag,
                    lat: props.quake.geometry.coordinates[1],
                    long: props.quake.geometry.coordinates[0]
                })
            }).then(r => r.json())
            .then((response) => {
                if(!response["errors"]){
                    setUsersBookmarks([...usersBookmarks, {quake_id: response.quake_db_id, id: response.id}])
                }
            })
        } else {
            let found = usersBookmarks.find((bookmark) => {
                return bookmark.quake_id == props.quake.id
            })
            if(found){
                fetch(`http://${props.domain}/bookmarks/${found.id}`, {
                    method: 'DELETE'
                }).then(r => r.json())
                .then((response) => {
                    if(!response["errors"]){
                        removeBookmarkFromState(props.quake.id)
                    }
                })
            }
        }
    }

    function removeBookmarkFromState(id){
        let foundIndex
        usersBookmarks.forEach((bookmark, i) => {
            if(bookmark.quake_id == id){foundIndex = i}
        })
        let newBookmarks
        if(foundIndex == 0){
            newBookmarks = [...usersBookmarks.slice(1)]
        } else {
            newBookmarks = [...usersBookmarks.slice(0, foundIndex), ...usersBookmarks.slice(foundIndex+1)]
        }
        setUsersBookmarks(newBookmarks)
    }

    if(props.quake){
        let date = new Date(props.quake.properties.time)
        return (
            <Card fluid color={getColor(props.quake.properties.mag)} style={{height: "99%", overflowY: "scroll"}}>
                <Card.Content>
                    <Card.Header>{props.quake.properties.place}</Card.Header>
                    <Card.Meta>Magnitude: {props.quake.properties.mag}</Card.Meta>
                    <Button as='div' labelPosition='right' style={{marginTop: "0.4em"}}>
                        <Button icon onClick={routeToQuakeShow}>
                            <Icon name='map'/>
                            View Page
                        </Button>
                        <Label as='a' basic target="_blank" href={props.quake.properties.url}>
                            USGS Site
                        </Label>
                        {getBookmarkButton()}
                    </Button>
                    <Segment>
                        <Header>Date-Time</Header>
                        <Container>{formatDate(date)}, {formatTime(date)}</Container>
                    </Segment>
                    <Segment>
                        <Header>Position Data</Header>
                        <Container>
                            Longitude: {Math.abs(props.quake.geometry.coordinates[0])}{props.quake.geometry.coordinates[0] > 0 ? "E" : "W"}
                        </Container>
                        <Container>
                            Latitude: {Math.abs(props.quake.geometry.coordinates[1])}{props.quake.geometry.coordinates[0] > 0 ? "N" : "S"}
                        </Container>
                        <Container>
                            Depth: {Math.abs(props.quake.geometry.coordinates[2])}km
                        </Container>
                    </Segment>
                </Card.Content>
            </Card>
        )
    }
    else {
        return null
    }
}

function getColor(mag){
    if (mag <= 3){
        return 'green'
    } else if (mag < 5){
        return 'yellow'
    } else {
        return 'red'
    }
}

function mapStateToProps(state){
    return {
        quake: state.selectedFeature,
        detailFeature: state.detailFeature,
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
        stopRotation: () => {
            dispatch({
                type: "SET_ROTATING",
                value: null
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuakeDetails);