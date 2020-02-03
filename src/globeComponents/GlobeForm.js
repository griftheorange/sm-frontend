import React from 'react';

import { connect } from 'react-redux'

function GlobeForm(props) {

    function handleChange(evt){
        switch(evt.target.name){
            case "lambda":
                let rot = [...props.rotation]
                rot[0] = evt.target.value
                props.setRotation(rot)
                break;
            default: 
                return null;
        }
    }

    return (
        <div className="content-box form">
            <span>Lambda Rotation(°)</span>
            <input onChange={handleChange} name="lambda" className="rotation" type="number" value={props.rotation[0]}></input>
        </div>
    );
}

function mapStateToProps(state){
    return {
        rotation: state.rotation
    }
}

function mapDispatchToProps(dispatch){
    return {
        setRotation: (newRotation) => {
            dispatch({
                type: "SET_ROTATION",
                value: newRotation
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobeForm);