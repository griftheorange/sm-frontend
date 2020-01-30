let initialState = {
    features: [],
    scaleLineToLog: false,
    scaleBubbleToLin: false
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
        default:
            return state
    }
}