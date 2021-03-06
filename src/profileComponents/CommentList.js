import React, { useState } from 'react';
import { Card, Divider, Header, Container, Segment, Button, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SweetAlert from 'sweetalert2-react'

function CommentList(props) {

    //Hovered event is a redux state that allows Countries Map to highlight events when they are hovered in any component in the app
    //Also allows it to render description box on profile page
    function handleMouseEnter(comment){
        props.setHoveredEvent(comment.comment_quake)
    }

    //Reverses hovered event
    function handleMouseLeave(){
        props.setHoveredEvent(null)
    }

    function getCards(){
        if(props.comments){
            let comments = props.comments.map((comment, i) => {
                return (
                    <div key={i}>
                    <Container style={{width: "calc(100% - 6.5em)", marginTop: 0, marginBottom: 0}}>
                        <Container>
                            <Container style={{display: "flex", height: "3em"}}>
                                {getCommentImage(comment)}
                                <Header style={{position: "relative", marginTop:0}} textAlign="left" as="h1">{comment.comment_user.charAt(0).toUpperCase() + comment.comment_user.slice(1)}</Header>
                            </Container>
                            <Header textAlign="left" sub style={{marginTop: "0.1em"}}>Posted: {comment.date_posted}</Header>
                            {props.from_profile ? <Header textAlign="left" sub style={{marginTop: "0.1em"}}><Link onClick={() => {props.setHoveredEvent(null)}} onMouseLeave={handleMouseLeave} onMouseEnter={() => {handleMouseEnter(comment)}} to={`/event/${comment.comment_quake}`}>{`${comment.quake_name} - Mag: ${comment.quake_mag}`}</Link></Header> : null}
                            <Segment>
                                <p style={{margin: 0, width: "calc(100% - 4em)"}}>{comment.content}</p>
                                {(props.loggedIn && props.loggedIn.user_id == comment.user_id) ? <Button onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this comment?')){
                                        props.handleDelete(comment)
                                    }
                                }} size="mini" style={{position: "absolute", left: "calc(100% - 5em)", top: "1em"}}><Icon name="trash" style={{margin: 0}}></Icon></Button> : null}
                            </Segment>
                        </Container>
                    </Container>
                    <Divider ></Divider>
                    </div>
                )
            })
            
            return (
                <>
                {comments}
                </>
            )
        }
    }

    return (
        <>
        {getCards()}
        </>
    );
}

function getCommentImage(comment){
    return (
        <Image className="profile-img"
                circular size="mini" 
                src={comment.user_img_URL ? comment.user_img_URL : "/default_pic.jpg" }
                style={{width: "35px", height: "35px", marginRight: "0.5em"}}
                >
        </Image>
    )
}

function mapStateToProps(state){
    return {
        loggedIn: state.loggedIn
    }
}

function mapDispatchToProps(dispatch){
    return {
        setHoveredEvent: (value) => {
            dispatch({
                type: "SET_HOVERED_EVENT",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);