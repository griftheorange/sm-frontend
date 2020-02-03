import React from 'react';

import { connect } from 'react-redux'

function GlobeForm(props) {

    function handleRotChange(evt){
        switch(evt.target.name){
            case "lambda":
                let rot = [...props.rotation]
                rot[0] = Number(evt.target.value)
                if(rot[0] >= 360){rot[0] = Number(rot[0]%360)}
                if(rot[0] < 0){rot[0] = 360+Number(rot[0])}
                props.setRotation(rot)
                break;
            default: 
                return null;
        }
    }

    function handleLogChange(evt){
        props.setLoggishness(Number(evt.target.value))
    }

    function toggleRotating(){
        props.toggleRotation(!props.rotating)
    }

    return (
        <div className="content-box form">
            <span>Lambda Rotation(°)</span>
            <input onChange={handleRotChange} name="lambda" className="rotation" type="number" value={props.rotation[0]}></input>
            <span>Magnitude Logishness</span>
            <div className="scale-bar">
                <span>1</span>
                <input onChange={handleLogChange} type="range" min="1" max="10" value={props.globeLoggishness}></input>
                <span>10</span>
            </div>
            <button onClick={toggleRotating}>{props.rotating ? "Turn Off Rotation" : "Turn On Rotation"}</button>
        </div>
    );
}

function mapStateToProps(state){
    return {
        rotation: state.rotation,
        globeLoggishness: state.globeLoggishness,
        rotating: state.rotating
    }
}

function mapDispatchToProps(dispatch){
    return {
        setRotation: (newRotation) => {
            dispatch({
                type: "SET_ROTATION",
                value: newRotation
            })
        },
        setLoggishness: (newLog) => {
            dispatch({
                type: "SET_LOGGISHNESS",
                value: newLog
            })
        },
        toggleRotation: (value) => {
            dispatch({
                type: "SET_ROTATING",
                value: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobeForm);