import React from 'react';

import { connect } from 'react-redux'

function GlobeForm(props) {

    function handleRotChange(evt){
        let rot
        switch(evt.target.name){
            case "lambda":
                rot = [...props.rotation]
                rot[0] = Number(evt.target.value)
                if(rot[0] >= 360){rot[0] = Number(rot[0]%360)}
                if(rot[0] < 0){rot[0] = 360+Number(rot[0])}
                props.setRotation(rot)
                break;
            case "phi":
                rot = [...props.rotation]
                rot[1] = Number(evt.target.value)
                if(rot[1] >= 360){rot[1] = Number(rot[1]%360)}
                if(rot[1] < 0){rot[1] = 360+Number(rot[1])}
                props.setRotation(rot)
                break;
            case "gamma":
                rot = [...props.rotation]
                rot[2] = Number(evt.target.value)
                if(rot[2] >= 360){rot[2] = Number(rot[2]%360)}
                if(rot[2] < 0){rot[2] = 360+Number(rot[2])}
                props.setRotation(rot)
                break;
            default: 
                return null;
        }
    }

    function handleRotSpeedChange(evt){
        let rot
        switch(evt.target.name){
            case "lambda":
                rot = [...props.rotationSpeeds]
                rot[0] = Number(evt.target.value)
                props.setRotationSpeed(rot)
                break;
            case "phi":
                rot = [...props.rotationSpeeds]
                rot[1] = Number(evt.target.value)
                props.setRotationSpeed(rot)
                break;
            case "gamma":
                rot = [...props.rotationSpeeds]
                rot[2] = Number(evt.target.value)
                props.setRotationSpeed(rot)
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
        <>
        <div className="content-box header">
            <h1>Globe Parameters</h1>
        </div>
        <div className="content-box form">
            <h3>Lambda Rotation(°)</h3>
            <input onChange={handleRotChange} name="lambda" className="rotation" type="number" value={props.rotation[0]}></input>
            <h4> Speed: ~°/sec</h4>
            <input onChange={handleRotSpeedChange} name="lambda" className="rotation" type="number" value={props.rotationSpeeds[0]}></input>
            <h3>Phi Rotation(°)</h3>
            <input onChange={handleRotChange} name="phi" className="rotation" type="number" value={props.rotation[1]}></input>
            <h4> Speed: ~°/sec</h4>
            <input onChange={handleRotSpeedChange} name="phi" className="rotation" type="number" value={props.rotationSpeeds[1]}></input>
            <h3>Gamma Rotation(°)</h3>
            <input onChange={handleRotChange} name="gamma" className="rotation" type="number" value={props.rotation[2]}></input>
            <h4> Speed: ~°/sec</h4>
            <input onChange={handleRotSpeedChange} name="gamma" className="rotation" type="number" value={props.rotationSpeeds[2]}></input>
            <h3>Magnitude Logishness</h3>
            <div className="scale-bar">
                <span>1</span>
                <input onChange={handleLogChange} type="range" min="1" max="10" value={props.globeLoggishness}></input>
                <span>10</span>
            </div>
            <button onClick={toggleRotating}>{props.rotating ? "Turn Off Rotation" : "Turn On Rotation"}</button>
        </div>
        </>
    );
}

function mapStateToProps(state){
    return {
        rotation: state.rotation,
        rotationSpeeds: state.rotationSpeeds,
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
        setRotationSpeed: (newSpeeds) => {
            dispatch({
                type: "SET_ROTATION_SPEEDS",
                value: newSpeeds
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