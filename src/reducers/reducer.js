let initialState = {
    features: [],
    start: null,
    end: null,
    minMagnitude: null,
    maxMagnitude: null,
    scaleLineToLog: false,
    scaleBubbleToLin: false,
    loading: false,
    rotation: [108, 0, 23.5],
    bufferedGlobe: null
}

export default function(state = initialState, action){
    switch(action.type){
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
        default:
            return state
    }
}