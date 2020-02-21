import React from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Navbar(props) {

    function handleLogout(){
        window.localStorage.clear()
        props.setLoggedIn(null)
    }

    //handles callback to App.js
    function stopRotation(){
        props.stopRotation()
    }

    //Checks status of loggedIn, if 'true', renders logout link with onCLick
    //If not logged in, renders link to login page
    function getLoginLogout(){
        if(props.loggedIn){
            return (
                    <div onClick={handleLogout}>
                        <a>Logout</a>
                    </div>
            )
        } else {
            return (
                <Link to="/login"  onClick={stopRotation}>
                    <div>
                        Login
                    </div>
                </Link>
            )
        }
    }

    return (
        <div className="navbar">
            <div className="logo">
                <img src={'/earth_PNG39.png'} style={{maxHeight: "1.2em"}}></img>
                <div> SEISMIX</div>
            </div>
            <Link to="/" onClick={stopRotation}>
            <div>
                Home
            </div>
            </Link>
            <Link to="/about"  onClick={stopRotation}>
            <div>
                About
            </div>
            </Link>
            <Link to="/globe">
            <div>
                GlobeView
            </div>
            </Link>
            {window.localStorage.getItem("loggedIn") ? <Link to="/profile"  onClick={stopRotation}><div>Profile</div></Link> : null}
            {getLoginLogout()}
        </div>
    );
}

function mapStateToProps(state){
    return {
        loggedIn: state.loggedIn
    }
}

function mapDispatchToProps(dispatch){
    return {
        setLoggedIn: (value) => {
            dispatch({
                type: "SET_LOGGED_IN",
                token: value
            })
        },
        stopRotation: () => {
            dispatch({
                type: "SET_ROTATING",
                value: null
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);