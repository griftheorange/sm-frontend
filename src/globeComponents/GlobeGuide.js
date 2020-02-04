import React from 'react';

import FetchForm from '../homeComponents/FetchForm'
import GlobeForm from './GlobeForm'
import QuakeCardList from './QuakeCardList'
import QuakeDetails from './QuakeDetails'

function GlobeGuide(props) {
    return (
        <div className="content-box globe-guide">
            <div className="top">
            <div className="content-box header">
                <h1>GlobeView Details and Customization</h1>
            </div>
            </div>
            <div className="bottom">
                <div className="forms">
                    <GlobeForm/>
                    <FetchForm/>
                </div>
                <div className="guide-segments">
                    <div className="content-box body info">
                        <h1>Info</h1>
                        <p>GlobeView is an interactive visual for plotting seismic activity data geographically. The same query functions apply as with the charts on the home page.</p>
                        <p>If you notice drops in framerate, try reducing the size of your query, poor chrome can only handle so much.</p>
                        <p>Adjust the params to change the globes position/rotation, check out the feed of queried quakes bellow for specific events, and click on an event if you want to view its details. Have fun!</p>
                    </div>
                    <div className="content-box body cards">
                        <QuakeCardList/>
                    </div>
                    <div className="content-box body barless">
                        <QuakeDetails history={props.history}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GlobeGuide;