import React from 'react';

import FetchForm from './FetchForm'

function handleClick(){

}

function GuideBox(props) {
    return (
        <div className="guide-box content-box">
            <div className="content-box header">
                <h1>Guide</h1>
            </div>
            <div className="content-box body guide">
                <p>Hi! Welcom to SeisMix, a website dedicated to bringing you the most up-to-date information on global seismic activity.</p>
                <p>Our application supports query dates from 1970 to the current date, and we supply a variety of other parameters to adjust your searches. Note we can only query 20000 events at a time rn, and approximately 2-3000 occur every week, so please take this into consideration before submitting your search.</p>
                <p>We also support a globeView function to render seismic events at the point of their origin, for real-time world mapping of seismic activity accross the year, feel free to play around with it!</p>
            </div>
            <FetchForm/>
            <div className="globe-view-box">
                <div className="header">
                    <h1>Globe View</h1>
                </div>
                <div onClick={()=>{props.history.push('/globe')}} className="globe-img-box content-box body">
                    <img src="Screen Shot 2020-01-30 at 5.32.02 PM.png"></img>
                </div>
            </div>
        </div>
    );
}

export default GuideBox;