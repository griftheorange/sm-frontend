import React, { useState, useEffect } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react'
import '../CSS/Profile.css'
import CountriesMap from '../quakeShowComponents/CountriesMap';
import UserCard from '../profileComponents/UserCard'
import BookmarkList from '../profileComponents/BookmarkList'
import CommentList from '../profileComponents/CommentList'
import { connect } from 'react-redux'

function Profile(props) {

    //stores user mount/successful fetch for page rendering
    let [user, setUser] = useState(null)
    //stores comments on successful fetch
    let [comments, setComments] = useState([])

    //authorizes user token on mount
    useEffect(() => {
        setUser(null)
        setComments(null)
        if(props.loggedIn){
            fetch(`http://${props.domain}/users/${props.loggedIn.user_id}`, {
                headers: {
                    "Authorization":JSON.stringify(props.loggedIn)
                }
            })
            .then(r => r.json())
            .then((response) => {
                if(!response.errors && !response.unauthorized ){
                    setUser(response)
                    setComments(response.comments)
                } else if(response.unauthorized){
                    window.localStorage.clear()
                    props.setLoggedIn(null)
                    props.history.push('/login')
                } else {
                    console.log("Errors in Profile, useEffect()")
                }
            })
        } else {
            props.history.push('/login')
        }
    }, [props.loggedIn])

    function getBookmarkedQuakes(){
        if(user){
            return user.bookmarks
        }
    }

    //handles deletion of user comment
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
    
    function getUserBlock(){
        if(user){
            return (
                <>
                <UserCard user={user}></UserCard>
                <Segment className="profile-containers">
                    <BookmarkList history={props.history} bookmarks={user.bookmarks}></BookmarkList>
                </Segment>
                <Segment className="profile-containers">
                    <Header as="h1">Your Insights</Header>
                    <Divider></Divider>
                    <CommentList from_profile={true} comments={comments} handleDelete={handleDelete}></CommentList>
                </Segment>
                </>
            )
        }
    }

    return (
        <div className="profile">
            <div className="profile-child profile-map">
            <Segment>
                <Header as='h1'>Bookmarked Quakes</Header>
                <CountriesMap history={props.history} quakes={getBookmarkedQuakes()}></CountriesMap>
            </Segment>
            </div>
            <div className="profile-child profile-info">
                {getUserBlock()}
            </div>
        </div>
    );
}

function mapStateToProps(state){
    return {
        loggedIn: state.loggedIn,
        domain: state.domain
    }
}

function mapDispatchToProps(dispatch){
    return {
        setLoggedIn: (value) => {
            dispatch({
                type: "SET_LOGGED_IN",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);