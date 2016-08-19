import * as ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';
import * as EditorUtils from '../utils/EditorUtils';

let defaultState = {

};

export default function(state = defaultState, action) {
  let keyPath, newData;

  const addItemToCollection = (item, mapIndex, isMap) => (collection) => {
    return isMap ? collection.set(mapIndex, item) : collection.push(item)
  }

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

    case ActionTypes.CONTENT_ADD_ITEM:
      let itemKeyPath = EditorUtils.getImmutableKeyPath(action.path)
      let newItem, newPath, imItem;



      if(action.isReference){
        let dataKeyPath = EditorUtils.getImmutableKeyPath(action.itemType)

        if(action.index === -1){
          const refSchema = action.itemType + (action.isMap ? '[_id]' : '[0]');

          //get new item to add and convert to immutable
          newItem = Object.assign({}, _.get(state.schema, refSchema));
          imItem = Immutable.fromJS(newItem);

          //set an id for the map to add or index for array
          const addIndex = action.isMap ? EditorUtils.randomString() : state.data.getIn(dataKeyPath).size;

          //add the data to to the reference collection and get new path
          newData = state.data.updateIn(dataKeyPath, addItemToCollection(imItem, addIndex, action.isMap));
          newPath = '#' + action.itemType + '[' + addIndex + ']';

          newData = newData.updateIn(itemKeyPath, addItemToCollection(newPath, addIndex, action.isMap))
        } else {
          newPath = '#' + action.itemType + '[' + action.index + ']';
          newData = state.data.updateIn(itemKeyPath, addItemToCollection(newPath, action.index, action.isMap))
        }
      } else {
        newItem = _.isObject(action.itemType) ? Object.assign({}, _.get(state.schema, action.path + '[0]')) : '';
        imItem = Immutable.fromJS(newItem);
        newData = state.data.updateIn(itemKeyPath, addItemToCollection(imItem, action.index, action.isMap));
      }

      return {
        ...state,
        data: newData
      }

    case ActionTypes.CONTENT_REMOVE_ITEM:
      keyPath = EditorUtils.getImmutableKeyPath(action.path + '.' + action.index)
      console.log("reducer remove", action.path, action.index, keyPath)
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

    case ActionTypes.CONTENT_REPLACE_ITEM:
      keyPath = EditorUtils.getImmutableKeyPath(action.path);

      if(action.index === -1){
        let dataKeyPath = EditorUtils.getImmutableKeyPath(action.itemType)
        let collection = state.data.getIn(keyPath);
        const isMap = action.isMap;
        const refSchema = action.itemType + (isMap ? '[_id]' : '[0]');

        //get new item to add and convert to immutable
        newItem = Object.assign({}, _.get(state.schema, refSchema));
        imItem = Immutable.fromJS(newItem);

        //set an id for the map to add or index for array
        const addIndex = isMap ? EditorUtils.randomString() : state.data.getIn(dataKeyPath).size;

        //add the data to to the reference collection and get new path
        newData = state.data.updateIn(dataKeyPath, addItemToCollection(imItem, addIndex, isMap));
        const newPath = '#' + action.itemType + '[' + addIndex + ']';

        newData = newData.setIn(keyPath, newPath)
      } else {
        const newPath = '#' + action.itemType + '[' + action.index + ']';
        newData = state.data.setIn(keyPath, newPath);
      }


      return {
        ...state,
        data: newData
      }

    default:
      return state;
  }
}
