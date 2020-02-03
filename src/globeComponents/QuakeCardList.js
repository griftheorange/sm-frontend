import React from 'react';
import { connect } from 'react-redux';

import QuakeCard from './QuakeCard'

function QuakeCardList(props) {

    function genQuakeCards(){
        if(props.features){
            return props.features.map((feature, i) => {
                return <QuakeCard key={i}/>
            })
        }
    }

    return (
        <>
        {genQuakeCards()}
        </>
    );
}

function mapStateToProps(state){
    return {
        features: state.features
    }
}

export default connect(mapStateToProps)(QuakeCardList);