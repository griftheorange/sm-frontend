import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { connect } from 'react-redux'

import Navbar from './components/Navbar'
import Body from './components/Body'
import SweetAlert from 'sweetalert2-react'
import {
  BrowserRouter as Router,
} from "react-router-dom"

function App(props) {

  let [alerting, setAlerting] = useState(null)
  let [timer, setTimer] = useState(null)

  function formatDate(date){
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())
  }

  useEffect(() => {
    let now = new Date(Date.now())
    let past = new Date()
    past.setDate(now.getDate() - 6)
    now.setDate(now.getDate() + 1)
    let end = formatDate(now)
    let start = formatDate(past)
    let min = 4
    let max = 10
    props.setDateRange(start, end)
    props.setMagRange(min, max)
  }, [])

  useEffect(() => {
    props.setLoading(true)
    if(props.start && props.end && props.minMagnitude && props.maxMagnitude){
      fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${props.start}&endtime=${props.end}&minmagnitude=${props.minMagnitude}&maxmagnitude=${props.maxMagnitude}`)
      .then(r => r.json())
      .then((response) => {
        if(response.features.length > 12000){
          setAlerting({
            title: "Query response too large",
            message: `Sorry, your request returned over 12,000 events [${response.features.length} events returned]. At this time, we don't support queries that high. Try altering the parameters of your query for a smaller pool!`
          })
          handleDefault()
        } else {
          props.updateFeatures(response.features)
          props.setLoading(false)
        }
      })
      .catch((error) => {
        handleDefault()
      })
    }
  }, [props.start, props.end, props.minMagnitude, props.maxMagnitude])

  function handleDefault(){
    let now = new Date(Date.now())
    let past = new Date()
    past.setDate(now.getDate() - 6)
    now.setDate(now.getDate() + 1)
    let end = formatDate(now)
    let start = formatDate(past)
    let min = 4
    let max = 10
    props.setDateRange(start, end)
    props.setMagRange(min, max)
  }

  function startClock(){
    let clock = setInterval(()=>{
      props.incrementLambda()
    }, 50)
    setTimer(clock)
  }

  function stopClock(){
    clearInterval(timer)
    setTimer(null)
  }

  useEffect(() => {
    if(props.rotating){
      startClock()
    } else {
      stopClock()
    }
  }, [props.rotating])

  return (
    <Router>
      {alerting ? <SweetAlert show={true} title={alerting.title} text={alerting.message} onConfirm={() => {setAlerting(false)}}/> : null}
      <Navbar/>
      <Body/>
    </Router>
  );
}

function mapDispatchToProps(dispatch){
  return {
    updateFeatures: (features) => {
      dispatch({
        type: "UPDATE_FEATURES",
        features: features
      })
    },
    setDateRange: (start, end) => {
      dispatch({
        type: "SET_DATE_RANGE",
        start: start,
        end: end
      })
    },
    setMagRange: (min, max) => {
      dispatch({
        type: "SET_MAG_RANGE",
        min: min,
        max: max
      })
    },
    setLoading: (value)=>{
        dispatch({
            type: "SET_LOADING",
            value: value
        })
    },
    setBuffered: (value)=>{
        dispatch({
            type: "SET_BUFFERED",
            value: value
        })
    },
    setRotation: (value)=>{
      dispatch({
        type: "SET_ROTATION",
        value: value
      })
    },
    incrementLambda: ()=>{
      dispatch({
        type: "INCREMENT_ROTATION"
      })
    }
  }
}

function mapStateToProps(state){
  return {...state}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
