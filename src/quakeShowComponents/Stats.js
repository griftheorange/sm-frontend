import React from 'react';
import { connect } from 'react-redux'
import { Container, Header, Segment, Divider } from 'semantic-ui-react'

function Stats(props) {

    const effectCollection = [
        "Usually not felt, but can be recorded by seismograph. Almost zero impact on dat to day life.",
        "Often felt, but only causes minor damage. Little precaution needed outside of standard earthquake safety practices.",
        "Slight damage to buildings and other structures. Exit buildings and move away from possible sources of falling objects.",
        "May cause a lot of damage in very populated areas. Exit buildings and move away from possible sources of falling objects.",
        "Major earthquake. Serious damage. Exit buildings and move away from possible sources of falling objects. Evacuate to emergency response centers if necessary.",
        "Great earthquake. Can totally destroy communities near the epicenter. Exit buildings and move away from possible sources of falling objects. Evacuate to emergency response centers if available"
    ]

    const estimatedPerYear = ["900,000", "30,000", "500", "100", "20", "One every 5 to 10 years"]

    const quakeClasses = ["Minor", "Light", "Moderate", "Strong", "Major", "Great"]

    function getClass(mag){
        if(mag < 3){
            return "N/A"
        } else if(mag >= 3 && mag < 4){
            return quakeClasses[0]
        } else if(mag >= 4 && mag < 5){
            return quakeClasses[1]
        } else if(mag >= 5 && mag < 6){
            return quakeClasses[2]
        } else if(mag >= 6 && mag < 7){
            return quakeClasses[3]
        } else if(mag >= 7 && mag < 8){
            return quakeClasses[4]
        } else {
            return quakeClasses[5]
        }
    }

    function getEffect(mag){
        if(mag <= 2.5){
            return `Mag ${mag}, ${effectCollection[0]}`
        } else if(mag <= 5.4){
            return `Mag ${mag}, ${effectCollection[1]}`
        } else if(mag <= 6){
            return `Mag ${mag}, ${effectCollection[2]}`
        } else if(mag <= 6.9){
            return `Mag ${mag}, ${effectCollection[3]}`
        } else if(mag <= 7.9){
            return `Mag ${mag}, ${effectCollection[4]}`
        } else {
            return `Mag ${mag}, ${effectCollection[5]}`
        }
    }

    function getOccurrences(mag){
        if(mag <= 2.5){
            return `${estimatedPerYear[0]}`
        } else if(mag <= 5.4){
            return `${estimatedPerYear[1]}`
        } else if(mag <= 6){
            return `${estimatedPerYear[2]}`
        } else if(mag <= 6.9){
            return `${estimatedPerYear[3]}`
        } else if(mag <= 7.9){
            return `${estimatedPerYear[4]}`
        } else {
            return `${estimatedPerYear[5]}`
        }
    }

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
                    <label>{"Magnitude: "}</label>
                    <span>{props.quake.properties.mag}</span>
                    </p>
                    <p>
                    <label>{"Approximate Amplitude(logA=M): "}</label>
                    <span>{`~ ${Math.pow(10, props.quake.properties.mag).toFixed(2) > 100000 ? Math.pow(10, props.quake.properties.mag).toExponential(2): Math.pow(10, props.quake.properties.mag).toFixed(2)} micrometers`}</span>
                    </p>
                    <p>
                    <label>{"Approximate Energy(logE=()): "}</label>
                    <span>{`~ ${Math.pow(10, (4.8 + 1.5*props.quake.properties.mag)).toExponential(2)} joules`}</span>
                    </p>
                    <p>
                    <label>{"Felt Responses Reported: "}</label>
                    <span>{props.quake.properties.felt ? props.quake.properties.felt: "N/A"}</span>
                    </p>
                    <p>
                    <label>{"Maximum Reported Intensity: "}</label>
                    <span>{props.quake.properties.cdi ? props.quake.properties.cdi : "N/A"}</span>
                    </p>
                    </Container>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Date and Time</Header>
                    </Container>
                    <Divider></Divider>
                    <Container className="bold-labels" style={{marginTop: "0.2em"}}>
                    <p>
                    <label>{"Date: "}</label>
                    <span>{formatDate(new Date(props.quake.properties.time))}</span>
                    </p>
                    <p>
                    <label>{"Time: "}</label>
                    <span>{formatTime(new Date(props.quake.properties.time))}</span>
                    </p>
                    <p>
                    <label>{"Time Offset UTC: "}</label>
                    <span>{`${props.quake.properties.tz} minutes`}</span>
                    </p>
                    </Container>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.5em"}}>Position Data</Header>
                    </Container>
                    <Divider></Divider>
                    <Container className="bold-labels" style={{marginTop: "0.2em"}}>
                    <p>
                    <label>{"Longitude: "}</label>
                    <span>{props.quake.geometry.coordinates[0] > 0 ? `${props.quake.geometry.coordinates[0]}° E` : `${props.quake.geometry.coordinates[0]}° W`}</span>
                    </p>
                    <p>
                    <label>{"Latitude: "}</label>
                    <span>{props.quake.geometry.coordinates[1] > 0 ? `${props.quake.geometry.coordinates[1]}° N` : `${props.quake.geometry.coordinates[1]}° S`}</span>
                    </p>
                    <p>
                    <label>{"Depth of Origin: "}</label>
                    <span>{`${props.quake.geometry.coordinates[2]}km`}</span>
                    </p>
                    </Container>
                </Segment>
                <Segment>
                    <Container>
                    <Header as="h2" style={{marginBottom: "0.1em"}}>Advisory</Header>
                    <Header sub style={{marginTop: "0.1em", marginBottom: "0.5em"}}>Stats pulled from <a href="http://www.geo.mtu.edu/UPSeis/magnitude.html">UPSeis</a></Header>
                    </Container>
                    <Divider></Divider>
                    <Container className="bold-labels" style={{marginTop: "0.2em"}}>
                        <Header sub style={{fontSize: "1em"}}>Quake Class</Header>
                        <p style={{marginBottom: "0.3em"}}>
                            {getClass(props.quake.properties.mag)}
                        </p>
                        <Header sub style={{fontSize: "1em", marginTop: "1.2em"}}>Effects</Header>
                        <p style={{marginBottom: "0.3em"}}>
                            {getEffect(Number(props.quake.properties.mag))}
                        </p>
                        <Header sub style={{fontSize: "1em", marginTop: "1.2em"}}>Estimated Occurrences Per Year</Header>
                        <p style={{marginBottom: "0.3em"}}>
                            {getOccurrences(Number(props.quake.properties.mag))}
                        </p>
                    </Container>
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