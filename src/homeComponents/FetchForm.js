import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

function handleDateChange(evt, setters, getters){
    if(evt.target.value){
        if(evt.target.name == 'start'){
            if(evt.target.value <= getters[1]){
                setters[0](evt.target.value)
            }
        } else if(evt.target.name == 'end'){
            if(evt.target.value >= getters[0]){
                setters[1](evt.target.value)
            }
        }
    }
}

function formatDate(date){
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+(date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1)
  }

function handleMagChange(evt, setters, getters){
    if(!(evt.target.value == "")){
        if(evt.target.name == 'min'){
            if(Number(evt.target.value) <= getters[3]){
                setters[2](Number(evt.target.value))
            }
        } else if(evt.target.name == 'max'){
            if(Number(evt.target.value) >= getters[2]){
                setters[3](Number(evt.target.value))
            }
        }
    }
}

function handleSubmit(getters, props){
    props.setDate(getters[0], getters[1])
    props.setMag(getters[2], getters[3])
}

function handleDefault(props){
    let now = new Date(Date.now())
    let past = new Date()
    past.setDate(now.getDate() - 6)
    now.setDate(now.getDate() + 1)
    let end = formatDate(now)
    let start = formatDate(past)
    let min = -10
    let max = 10
    props.setDate(start, end)
    props.setMag(min, max)
}

function FetchForm(props) {

    const [start, setStart] = useState(props.start)
    const [end, setEnd] = useState(props.end)
    const [minMag, setMin] = useState(props.minMag)
    const [maxMag, setMax] = useState(props.maxMag)

    useEffect(()=>{
        setStart(props.start)
        setEnd(props.end)
        setMin(props.minMag)
        setMax(props.maxMag)
    }, [props.start, props.end, props.minMag, props.maxMag])

    let getters = [start, end, minMag, maxMag]
    let setters = [setStart, setEnd, setMin, setMax]

    return (
        <div className="content-box form">
            <span>Start Date YYYY-MM-DD</span>
            <div className="date">
                <input name="start" onChange={(evt)=>{handleDateChange(evt, setters, getters)}} type="date" value={start ? start : ""}></input>
            </div>
            <span>End Date YYYY-MM-DD</span>
            <div className="date">
                <input name="end" onChange={(evt)=>{handleDateChange(evt, setters, getters)}} type="date" value={end ? end : ""}></input>
            </div>
            <span>Minimum Magnitude</span>
            <div className="mag">
                <input name="min" onChange={(evt)=>{handleMagChange(evt, setters, getters)}} type="number" value={minMag ? minMag : ""}></input>
            </div>
            <span>Maximum Magnitude</span>
            <div className="mag">
                <input name="max" onChange={(evt)=>{handleMagChange(evt, setters, getters)}} type="number" value={maxMag ? maxMag : ""}></input>
            </div>
            <button onClick={(evt)=>{handleSubmit(getters, props)}}>Submit</button>
            <button onClick={(evt)=>{handleDefault(props)}}>Return to Default</button>
        </div>
    );
}

function mapStateToProps(state){
    return {
        start: state.start,
        end: state.end,
        minMag: state.minMagnitude,
        maxMag: state.maxMagnitude
    }
}

function mapDispatchToProps(dispatch){
    return {
        setDate: (start, end)=>{
            dispatch({
                type: "SET_DATE_RANGE",
                start: start,
                end: end
            })
        },
        setMag: (min, max)=>{
            dispatch({
                type: "SET_MAG_RANGE",
                min: min,
                max: max
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchForm);