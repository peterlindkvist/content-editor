import * as ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';
import * as EditorUtils from '../utils/EditorUtils';

let defaultState = {

};

export default function(state = defaultState, action) {
  let keyPath = undefined;
  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:
      return {
        ...state,
        data: Immutable.fromJS(action.data),
        schema: action.schema
      };
    case ActionTypes.CONTENT_UPDATE_VALUE:
      keyPath = EditorUtils.getImmutableKeyPath(action.path);
      return {
        ...state,
        data: state.data.setIn(keyPath, action.value)
      };
    case ActionTypes.CONTENT_ADD_ARRAY_ITEM:
      let itemKeyPath = EditorUtils.getImmutableKeyPath(action.itemPath)
      let dataKeyPath = EditorUtils.getImmutableKeyPath(action.dataPath)
      let newData;

      if(action.index === -1){
        const newItem = Object.assign({}, _.get(state.schema, action.dataPath + '[0]'))
        newData = state.data.updateIn(dataKeyPath, (arr) => arr.push(Immutable.fromJS(newItem)))
        const len = newData.getIn(dataKeyPath).size;
        const newPath = '#' + action.dataPath + '[' + (len - 1) + ']';
        newData = newData.updateIn(itemKeyPath, (arr) => arr.push(newPath))
      } else {
        const newPath = '#' + action.dataPath + '[' + action.index + ']';
        newData = state.data.updateIn(itemKeyPath, (arr) => arr.push(newPath))
      }

      return {
        ...state,
        data: newData
      }
    default:
      return state;
  }
}
