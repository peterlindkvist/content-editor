import * as ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:
      return {
        ...state,
        data: Immutable.fromJS(action.data),
        schema: action.schema
      };
    case ActionTypes.CONTENT_UPDATE_VALUE:
      const keyPath = action.path.replace(/\[([0-9]*)\]/g, '.$1').split('.'); //move to util
      window.state = {
        ...state,
        data: state.data.setIn(keyPath, action.value)
      };
      return window.state;
    default:
      return state;
  }
}
