import React from 'react';

import * as d3 from 'd3'

import { Card } from 'semantic-ui-react'
import { connect } from 'react-redux';

function QuakeCard(props) {

    //sets D3 color scale for border color
    const linearColor = d3.scaleLinear()
                            .range(["rgb(100,200,0,0.5)", "	rgb(150,0,0,0.5)"])
                            .domain([0, 5])

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

    //translates magnitude value to format that semantic-ui accepts for card colors
    function getColor(mag){
        if (mag <= 3){
            return 'green'
        } else if (mag < 5){
            return 'yellow'
        } else {
            return 'red'
        }
    }

    function handleClick(evt, quake){
        props.setSelected(quake)
    }

    
    let date = new Date(props.quake.properties.time)
    return (
        <Card onClick={(evt)=>{handleClick(evt, props.quake)}} fluid color={getColor(props.quake.properties.mag)} style={{fontSize: "0.8em", textAlign: "left"}}>
            <Card.Content>
                <Card.Header textAlign="left">{props.quake.properties.place}</Card.Header>
                <Card.Meta>Magnitude {props.quake.properties.mag}</Card.Meta>
                <Card.Description>Date-Time: {formatDate(date)}, {formatTime(date)}</Card.Description>
            </Card.Content>
        </Card>
    );
}

function mapStateToProps(){
    return {}
}

function mapDispatchToProps(dispatch){
    return {
        setSelected: (quake) => {
            dispatch({
                type: "SET_SELECTED",
                value: quake
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuakeCard);