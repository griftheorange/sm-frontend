import React from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Navbar(props) {

    function handleLogout(){
        window.localStorage.clear()
        props.setLoggedIn(null)
    }

    function getLoginLogout(){
        if(props.loggedIn){
            return (
                    <div onClick={handleLogout}>
                        <a>Logout</a>
                    </div>
            )
        } else {
            return (
                <Link to="/login">
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
            {window.localStorage.getItem("loggedIn") ? <Link to="/profile"><div>Profile</div></Link> : null}
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);