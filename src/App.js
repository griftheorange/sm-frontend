import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { connect } from 'react-redux'

import Navbar from './components/Navbar'
import Body from './components/Body'
import {
  BrowserRouter as Router,
} from "react-router-dom"

function App(props) {

  function formatDate(date){
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+(date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1)
  }
  
  useEffect(() => {
    let now = new Date(Date.now())
    let past = new Date()
    past.setDate(now.getDate() - 6)
    now.setDate(now.getDate() + 1)
    let end = formatDate(now)
    let start = formatDate(past)
    let min = -10
    let max = 10
    props.setDateRange(start, end)
    props.setMagRange(min, max)
  }, [])

  useEffect(() => {
    if(props.start && props.end && props.minMagnitude && props.maxMagnitude){
      fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${props.start}&endtime=${props.end}&minmagnitude=${props.minMagnitude}&maxmagnitude=${props.maxMagnitude}`)
      .then(r => r.json())
      .then((response) => {
        props.updateFeatures(response.features)
      })
      .catch(error => console.log(error))
    }
  }, [props.start, props.end, props.minMagnitude, props.maxMagnitude])

  return (
    <Router>
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
    }
  }
}

function mapStateToProps(state){
  return {...state}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
