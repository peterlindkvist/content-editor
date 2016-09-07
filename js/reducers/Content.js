import * as ActionTypes from '../constants/ActionTypes';
import Immutable, {Map} from 'immutable';
import * as EditorUtils from '../utils/EditorUtils';

let defaultState = {

};

export default function(state = defaultState, action) {
  let keyPath, newData;

  const addItemToCollection = (item, mapIndex, isMap) => (collection) => {
    console.log("addItemToCollection", item, mapIndex, Map.isMap(collection))
    return Map.isMap(collection) ? collection.set(mapIndex, item) : collection.push(item)
  }

  switch (action.type) {
    case ActionTypes.CONTENT_UPDATED:

      /*const d = {
        a: "test",
        c: {
          cb: "test"
        },
        b : [
          'a',
          'b'
        ]
      }
      const s = {
        a : "string",
        b : ["array"],
        c : {
          ca : "number",
          cb : "image",
          cc : {
            cca : "boolean"
          }
        },
        d : {
          _id : 'map'
        }
      };

      const out = EditorUtils.populateFromSchema(d, s);
      console.log("test", d, s);

      */

      //prepopulate empty data

      const data = EditorUtils.populateFromSchema(action.schema, action.data);


      return {
        ...state,
        data: Immutable.fromJS(data),
        schema: action.schema
      };

    case ActionTypes.CONTENT_UPDATE_VALUE:
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
          const targetIsMap = !_.isArray(_.get(state.schema, action.itemType));
          const refSchema = action.itemType + (targetIsMap ? '[_id]' : '[0]');

          //get new item to add and convert to immutable
          newItem = EditorUtils.populateFromSchema(_.get(state.schema, refSchema));
          console.log("Add", refSchema, action.itemType, targetIsMap, newItem);
          imItem = Immutable.fromJS(newItem);

          //set an id for the map to add or index for array
          const addIndex = targetIsMap ? EditorUtils.randomString() : state.data.getIn(dataKeyPath).size;

          //add the data to to the reference collection and get new path
          newData = state.data.updateIn(dataKeyPath, addItemToCollection(imItem, addIndex));
          newPath = '#' + action.itemType + '[' + addIndex + ']';

          newData = newData.updateIn(itemKeyPath, addItemToCollection(newPath, addIndex))
        } else {
          newPath = '#' + action.itemType + '[' + action.index + ']';
          newData = state.data.updateIn(itemKeyPath, addItemToCollection(newPath, action.index))
        }
      } else {
        newItem = _.isObject(action.itemType) ? Object.assign({}, _.get(state.schema, action.path + '[0]')) : '';
        imItem = Immutable.fromJS(newItem);
        newData = state.data.updateIn(itemKeyPath, addItemToCollection(imItem, action.index));
      }

      return {
        ...state,
        data: newData
      }

    case ActionTypes.CONTENT_REMOVE_ITEM:
      keyPath = EditorUtils.getImmutableKeyPath(action.path + '.' + action.index)
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
        const isMap = Map.isMap(collection);
        const refSchema = action.itemType + (isMap ? '[_id]' : '[0]');

        //get new item to add and convert to immutable
        newItem = EditorUtils.populateFromSchema(_.get(state.schema, refSchema));
        imItem = Immutable.fromJS(newItem);

        //set an id for the map to add or index for array
        const addIndex = isMap ? EditorUtils.randomString() : state.data.getIn(dataKeyPath).size;

        //add the data to to the reference collection and get new path
        newData = state.data.updateIn(dataKeyPath, addItemToCollection(imItem, addIndex));
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
