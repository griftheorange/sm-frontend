import React from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Navbar(props) {
    return (
        <div className="navbar">
            <div className="logo">
                <img src={'/earth_PNG39.png'} style={{maxHeight: "1.2em"}}></img>
                <div> SeisMix</div>
            </div>
            <Link to="/">
            <div>
                Home
            </div>
            </Link>
            <Link to="/about">
            <div>
                About
            </div>
            </Link>
            <Link to="/globe">
            <div>
                GlobeView
            </div>
            </Link>
            <Link to="/login">
            <div>
                Login
            </div>
            </Link>
            {props.loggedIn ? <Link to="/profile"><div>Profile</div></Link> : null}
        </div>
    );
}

function mapStateToProps(state){
    return {
        loggedIn: state.loggedIn
    }
}

export default connect(mapStateToProps)(Navbar);