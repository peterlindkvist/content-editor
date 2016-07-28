import * as ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';
import * as EditorUtils from '../utils/EditorUtils';

let defaultState = {

};

export default function(state = defaultState, action) {
  let keyPath, newData;
  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:
      return {
        ...state,
        data: Immutable.fromJS(action.data),
        schema: action.schema
      };

    case ActionTypes.CONTENT_UPDATE_VALUE:
      console.log("update", action.path, action.value)
      keyPath = EditorUtils.getImmutableKeyPath(action.path);
      newData = Immutable.fromJS(action.value);
      return {
        ...state,
        data: state.data.setIn(keyPath, newData)
      };

    case ActionTypes.CONTENT_ADD_ARRAY_ITEM:
      //console.log("addArrayItem", action.path, action.itemType, action.isReference, action.index);

      let itemKeyPath = EditorUtils.getImmutableKeyPath(action.path)
      let newItem, newPath, imItem;

      if(action.isReference){
        let dataKeyPath = EditorUtils.getImmutableKeyPath(action.itemType)

        if(action.index === -1){
          newItem = Object.assign({}, _.get(state.schema, action.itemType + '[0]'))
          imItem = Immutable.fromJS(newItem);

          newData = state.data.updateIn(dataKeyPath, (arr) => arr.push(imItem))
          const len = newData.getIn(dataKeyPath).size;
          newPath = '#' + action.itemType + '[' + (len - 1) + ']';
          newData = newData.updateIn(itemKeyPath, (arr) => arr.push(newPath))
        } else {
          newPath = '#' + action.itemType + '[' + action.index + ']';
          newData = state.data.updateIn(itemKeyPath, (arr) => arr.push(newPath))
        }
      } else {
        newItem = _.isObject(action.itemType) ? Object.assign({}, _.get(state.schema, action.path + '[0]')) : '';
        imItem = Immutable.fromJS(newItem);
        newData = state.data.updateIn(itemKeyPath, (arr) => arr.push(imItem));
      }

      return {
        ...state,
        data: newData
      }

    case ActionTypes.CONTENT_REMOVE_ARRAY_ITEM:
      keyPath = EditorUtils.getImmutableKeyPath(action.path + '[' + action.index + ']')
      newData = state.data.removeIn(keyPath);

      return {
        ...state,
        data: newData
      }

    case ActionTypes.CONTENT_MOVE_ARRAY_ITEM:
      keyPath = EditorUtils.getImmutableKeyPath(action.path);
      let list = state.data.getIn(keyPath)
      const moveItem = list.get(action.fromIndex);
      list = list.remove(action.fromIndex);
      list = list.insert(action.toIndex, moveItem);
      newData = state.data.setIn(keyPath, list);

      return {
        ...state,
        data: newData
      }

    default:
      return state;
  }
}
