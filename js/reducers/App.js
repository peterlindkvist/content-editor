import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  drawer_open : true
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.APP_SHOW_DRAWER:
      return {...state, drawer_open: action.open};
    default:
      return state;
  }
}
