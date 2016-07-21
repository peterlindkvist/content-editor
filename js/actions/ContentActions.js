import * as ActionTypes from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import * as EditorUtils from '../utils/EditorUtils';
const stripJsonComments = require('strip-json-comments');

function contentUpdated(contentJSON, schemaJSON){
  return {
    type: ActionTypes.CONTENT_UPDATED,
    data: contentJSON,
    schema: schemaJSON
  };
}

function contentRefresh(parameter){
  return {
    type: ActionTypes.CONTENT_REFRESH,
    parameter
  };
}

function contentSave(json){
  return {
    type: ActionTypes.CONTENT_SAVE,
    json
  }
}

export function set(path, value){
  return {
    type: ActionTypes.CONTENT_UPDATE_VALUE,
    path,
    value
  }
}

export function addArrayItem(path, itemType, isReference, index){
  return {
    type: ActionTypes.CONTENT_ADD_ARRAY_ITEM,
    path,
    itemType,
    isReference,
    index
  }
}

export function removeArrayItem(path, index){
  return {
    type: ActionTypes.CONTENT_REMOVE_ARRAY_ITEM,
    path,
    index
  }
}

export function moveArrayItem(path, fromIndex, toIndex){
  return {
    type: ActionTypes.CONTENT_MOVE_ARRAY_ITEM,
    path,
    fromIndex,
    toIndex
  }
}


export function save(path, value){
  return (dispatch, getState) => {
    const json = JSON.stringify(getState().Content.data, null, 2);
    EditorUtils.downloadFile('content.json', json, 'application/json');
    dispatch(contentSave(json));
  }
}

export function update(parameter) {
  return (dispatch, getState) => {
    dispatch(contentRefresh(parameter));
    Promise.all([
      fetch(parameter.content).then(response => response.text()),
      fetch(parameter.schema).then(response => response.text())
    ]).then(([contentText, schemaText]) => {
      const contentJSON = JSON.parse(stripJsonComments(contentText));
      const schemaJSON = JSON.parse(stripJsonComments(schemaText));
      dispatch(contentUpdated(contentJSON, schemaJSON));
    });
  }
}
