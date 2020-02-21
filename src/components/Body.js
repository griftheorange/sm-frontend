import React from 'react';

import Home from '../contentComponents/Home'
import About from '../contentComponents/About'
import GlobeView from '../contentComponents/GlobeView'
import Login from '../contentComponents/Login'
import Profile from '../contentComponents/Profile'
import QuakeShow from '../contentComponents/QuakeShow'

import { Switch, Route } from 'react-router-dom'

//Router switches 
function Body(props) {
    return (
        <div className="body-content">
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route path="/about" component={About}></Route>
                <Route path="/globe" component={GlobeView}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/profile" component={Profile}></Route>
                <Route path="/event/:id" component={QuakeShow}></Route>
            </Switch>
        </div>
    );
}

export default Body;