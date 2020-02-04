import React from 'react';
import { connect } from 'react-redux'
import { Container, Header, Segment, Divider } from 'semantic-ui-react'

function Stats(props) {
    console.log(props.quake)
    return (
        <div className="content-box body quake-show">
            <Segment style={{height: "100%", overflowY: "scroll"}}>
                <Header as='h1' style={{marginBottom: "0.1em", marginTop: "0.3em"}}>{props.quake.properties.place.split(", ")[0]}</Header>
                <Header sub style={{marginTop: 0}}>{props.quake.properties.place.split(", ")[1]}</Header>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Force</Header>
                    </Container>
                    <Divider></Divider>
                    <Container className="bold-labels" style={{marginTop: "0.2em"}}>
                    <p>
                    <label><str>{"Magnitude: "}</str></label>
                    <span>{props.quake.properties.mag}</span>
                    </p>
                    <p>
                    <label><str>{"Approximate Amplitude: "}</str></label>
                    <span>{`~ ${Math.pow(10, props.quake.properties.mag).toFixed(2)} micrometers`}</span>
                    </p>
                    <p>
                    <label><str>{"Approximate Energy: "}</str></label>
                    <span>{`~ ${Math.pow(10, (4.8 + 1.5*props.quake.properties.mag))} joules`}</span>
                    </p>
                    <p>
                    <label><str>{"Felt Responses Reported: "}</str></label>
                    <span>{props.quake.properties.mag}</span>
                    </p>
                    <p>
                    <label><str>{"Maximum Reported Intensity: "}</str></label>
                    <span>{props.quake.properties.mag}</span>
                    </p>
                    </Container>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Date and Time</Header>
                    </Container>
                    <Divider></Divider>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Position Data</Header>
                    </Container>
                    <Divider></Divider>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Advisory</Header>
                    </Container>
                    <Divider></Divider>
                </Segment>
            </Segment>
        </div>
    );
}

function mapStateToProps(state){
    return {
        quake: state.detailFeature
    }
}

export default connect(mapStateToProps)(Stats);