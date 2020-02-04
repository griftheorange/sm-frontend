import React from 'react';
import { Card, Segment, Header, Container, Button, Icon, Label } from 'semantic-ui-react' 
import { connect } from 'react-redux'

function QuakeDetails(props) {

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

    if(props.quake){
        let date = new Date(props.quake.properties.time)
        return (
            <Card fluid color={getColor(props.quake.properties.mag)} style={{height: "99%", overflowY: "scroll"}}>
                <Card.Content>
                    <Card.Header>{props.quake.properties.place}</Card.Header>
                    <Card.Meta>Magnitude: {props.quake.properties.mag}</Card.Meta>
                    <Button as='div' labelPosition='right' style={{marginTop: "0.4em"}}>
                        <Button icon>
                            <Icon name='map'/>
                            View Page
                        </Button>
                        <Label as='a' basic target="_blank" href={props.quake.properties.url}>
                            USGS Site
                        </Label>
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
        quake: state.selectedFeature
    }
}

export default connect(mapStateToProps)(QuakeDetails);