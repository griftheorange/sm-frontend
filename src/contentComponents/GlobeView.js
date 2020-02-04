import React from 'react';

import Globe from '../globeComponents/Globe.js'
import GlobeGuide from '../globeComponents/GlobeGuide'

import '../CSS/Globe.css'

function GlobeView(props) {
    return (
        <div className="flexer">
            <Globe/>
            <GlobeGuide history={props.history}/>
        </div>
    );
}

export default GlobeView;