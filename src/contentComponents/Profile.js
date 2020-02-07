import React, { useState, useEffect } from 'react';
import { Segment, Header } from 'semantic-ui-react'
import '../CSS/Profile.css'
import CountriesMap from '../quakeShowComponents/CountriesMap';
import UserCard from '../profileComponents/UserCard'
import BookmarkList from '../profileComponents/BookmarkList'
import CommentList from '../profileComponents/CommentList'
import { connect } from 'react-redux'

function Profile(props) {

    let [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:3000/users/${props.loggedIn.user_id}`)
        .then(r => r.json())
        .then((response) => {
            if(!response.errors){
                setUser(response)
            }
        })
    }, [])

    function getBookmarkedQuakes(){
        if(user){
            return user.bookmarks
        }
    }

    function getUserBlock(){
        if(user){
            return (
                <>
                <UserCard user={user}></UserCard>
                <Segment className="profile-containers" style={{overflowY: "scroll"}}>
                    <BookmarkList history={props.history} bookmarks={user.bookmarks}></BookmarkList>
                </Segment>
                <Segment className="profile-containers">
                    <CommentList></CommentList>
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
        loggedIn: state.loggedIn
    }
}

export default connect(mapStateToProps)(Profile);