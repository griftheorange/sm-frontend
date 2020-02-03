import React from 'react';

import FetchForm from '../homeComponents/FetchForm'
import GlobeForm from '../globeComponents/GlobeForm'

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
            </div>
        </div>
    );
}

export default GlobeGuide;