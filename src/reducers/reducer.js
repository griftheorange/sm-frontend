let initialState = {
    loggedIn: null,
    features: [],
    detailFeature: null,
    selectedFeature: null,
    start: null,
    end: null,
    minMagnitude: null,
    maxMagnitude: null,
    scaleLineToLog: false,
    scaleBubbleToLin: false,
    loading: false,
    scale: 300,
    rotation: [108, 0, 23.5],
    rotationSpeeds: [10, 0, 0],
    bufferedGlobe: null,
    globeLoggishness: 2,
    rotating: false,
    mapType: "orthographic"
}

export default function(state = initialState, action){
    switch(action.type){
        case "SET_LOGGED_IN":
            return {...state, features: action.token}
            break;
        case "UPDATE_FEATURES":
            return {...state, features: action.features}
            break;
        case "TOGGLE_LINE_SCALE":
            return {...state, scaleLineToLog: !state.scaleLineToLog}
            break;
        case "TOGGLE_BUBBLE_SCALE":
            return {...state, scaleBubbleToLin: !state.scaleBubbleToLin}
            break;
        case "SET_DATE_RANGE":
            return {...state, start: action.start, end: action.end}
            break;
        case "SET_MAG_RANGE":
            return {...state, minMagnitude: action.min, maxMagnitude: action.max}
            break;
        case "SET_LOADING":
            return {...state, loading: action.value}
            break;
        case "SET_ROTATION":
            return {...state, rotation: action.value}
            break;
        case "SET_ROTATION_SPEEDS":
            return {...state, rotationSpeeds: action.value}
            break;
        case "SET_BUFFERED":
            return {...state, bufferedGlobe: action.value}
            break;
        case "SET_LOGGISHNESS":
            return {...state, globeLoggishness: action.value}
            break;
        case "SET_ROTATING":
            return {...state, rotating: action.value}
            break;
        case "INCREMENT_ROTATION":
            let newRot = [...state.rotation]
            newRot[0] = Number(state.rotation[0] + state.rotationSpeeds[0]/25)
            if(newRot[0] >= 360){Number(newRot[0] = newRot[0]%360)}
            if(newRot[0] < 0){Number(newRot[0] = 360+newRot[0])}
            newRot[1] = Number(state.rotation[1] + state.rotationSpeeds[1]/25)
            if(newRot[1] >= 360){Number(newRot[1] = newRot[1]%360)}
            if(newRot[1] < 0){Number(newRot[1] = 360+newRot[1])}
            newRot[2] = Number(state.rotation[2] + state.rotationSpeeds[2]/25)
            if(newRot[2] >= 360){Number(newRot[2] = newRot[2]%360)}
            if(newRot[2] < 0){Number(newRot[2] = 360+newRot[2])}
            return {...state, rotation: newRot}
            break
        case "MANIPULATE_SCALE":
            let newVal = state.scale
            newVal = Number(state.scale) + Number(action.value)
            if(newVal < 50){newVal = 50}
            if(newVal > 900){newVal = 900}
            return {...state, scale: newVal}
            break;
        case "SET_SELECTED":
            return {...state, selectedFeature: action.value}
            break;
        case "SET_DETAIL_FEATURE":
            return {...state, detailFeature: action.value}
            break;
        case "CHANGE_MAP_TYPE":
            return {...state, mapType: action.value}
            break;
        default:
            return state
    }
}