import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  path: 'post[0]'
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:
      return {...state, data: action.data};
    default:
      return state;
  }
}
