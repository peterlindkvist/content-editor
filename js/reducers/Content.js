import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:
      return {...state, data: action.data};
    default:
      return state;
  }
}
