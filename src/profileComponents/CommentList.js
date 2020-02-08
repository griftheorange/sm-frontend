import React, { useState } from 'react';
import { Card, Divider, Header, Container, Segment, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SweetAlert from 'sweetalert2-react'

function CommentList(props) {

    function handleMouseEnter(comment){
        props.setHoveredEvent(comment.comment_quake)
    }

    function handleMouseLeave(){
        props.setHoveredEvent(null)
    }

    function getCards(){
        if(props.comments){
            let comments = props.comments.map((comment, i) => {
                return (
                    <div key={i}>
                    <Container style={{width: "calc(100% - 6.5em)", marginTop: 0, marginBottom: 0}}>
                        <Card.Content>
                            <Header textAlign="left" as="h1">{comment.comment_user.charAt(0).toUpperCase() + comment.comment_user.slice(1)}</Header>
                            <Header textAlign="left" sub style={{marginTop: "0.1em"}}>Posted: {comment.date_posted}</Header>
                            {props.from_profile ? <Header textAlign="left" sub style={{marginTop: "0.1em"}}><Link onClick={() => {props.setHoveredEvent(null)}} onMouseLeave={handleMouseLeave} onMouseEnter={() => {handleMouseEnter(comment)}} to={`/event/${comment.comment_quake}`}>{`${comment.quake_name} - Mag: ${comment.quake_mag}`}</Link></Header> : null}
                            <Segment>
                                <p style={{margin: 0, width: "calc(100% - 4em)"}}>{comment.content}</p>
                                {(props.loggedIn && props.loggedIn.user_id == comment.user_id) ? <Button onClick={() => {props.handleDelete(comment)}} size="mini" style={{position: "absolute", left: "calc(100% - 5em)", top: "1em"}}><Icon name="trash" style={{margin: 0}}></Icon></Button> : null}
                            </Segment>
                        </Card.Content>
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