import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import Globe from '../globeComponents/Globe.js'
import GlobeGuide from '../globeComponents/GlobeGuide'

import '../CSS/Globe.css'

function GlobeView(props) {

    //authorizes user token on mount
    useEffect(() => {
        if(props.loggedIn){
            fetch(`http://${props.domain}/users/${props.loggedIn.user_id}`, {
                headers: {
                    "Authorization": JSON.stringify(props.loggedIn)
                }
            })
            .then(r => r.json())
            .then((response) => {
                if(response.unauthorized){
                    window.localStorage.clear()
                    props.setLoggedIn(null)
                }
            })
        }
    }, [])

    return (
        <div className="flexer">
            <Globe/>
            <GlobeGuide history={props.history}/>
        </div>
    );
}

function mapStateToProps(state){
    return {
        loggedIn: state.loggedIn,
        domain: state.domain
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

export default connect(mapStateToProps, mapDispatchToProps)(GlobeView);