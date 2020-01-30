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
    return date.getFullYear()+'-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'-'+date.getDate()
  }
  useEffect(() => {
    let now = new Date(Date.now())
    let past = new Date()
    past.setDate(now.getDate() - 6)
    now.setDate(now.getDate() + 1)
    let end = formatDate(now)
    let start = formatDate(past)
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}`)
    .then(r => r.json())
    .then((response) => {
      props.updateFeatures(response.features)
    })
  }, [])

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
    }
  }
}

function mapStateToProps(state){
  return {...state}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
