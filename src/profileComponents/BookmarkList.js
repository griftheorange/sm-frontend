import React from 'react';
import { Header, Container, Divider, Card } from 'semantic-ui-react'
import { connect } from 'react-redux'

function BookmarkList(props) {

    function getColor(mag){
        if (mag <= 3){
            return 'green'
        } else if (mag < 5){
            return 'yellow'
        } else {
            return 'red'
        }
    }

    function handleClick(bookmark){
        props.history.push(`/event/${bookmark.quake_db_id}`)
    }

    //Hovered event is a redux state that allows Countries Map to highlight events when they are hovered in any component in the app
    //Also allows it to render description box on profile page
    function handleMouseEnter(bookmark){
        props.setHoveredEvent(bookmark.quake_db_id)
    }

    //Reverses hovered event
    function handleMouseExit(){
        props.setHoveredEvent(null)
    }

    function genBookmarks(){
        return props.bookmarks.map((bookmark, i) => {
            return (
                <Card key={i} fluid color={getColor(bookmark.mag)} onClick={(evt) => {
                    handleClick(bookmark)
                }} onMouseEnter={() => {
                    handleMouseEnter(bookmark)
                }} onMouseLeave={() => {
                    handleMouseExit()
                }}>
                    <Card.Content>
                        <Card.Header textAlign="left">{bookmark.place}</Card.Header>
                        <Card.Meta>Mag: {bookmark.mag}</Card.Meta>
                        <Card.Meta>Date/Time: {bookmark.dateAndTime}</Card.Meta>
                    </Card.Content>
                </Card>
            )
        })
    }

    return (
        <>
        <Header as="h1">Your Bookmarks</Header>
        <Divider></Divider>
        <Container>
            {genBookmarks()}
        </Container>
        </>
    );
}

function mapStateToProps(state){
    return {
        hoveredEventId: state.hoveredEventId
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

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkList);