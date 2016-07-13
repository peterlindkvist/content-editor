import {CONTENT_REFRESH, CONTENT_UPDATED, CONTENT_UPDATE_VALUE, CONTENT_SAVE} from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import * as EditorUtils from '../utils/EditorUtils';
const stripJsonComments = require('strip-json-comments');

function contentUpdated(contentJSON, schemaJSON){
  return {
    type: CONTENT_UPDATED,
    data: contentJSON,
    schema: schemaJSON
  };
}

function contentRefresh(parameter){
  return {
    type: CONTENT_REFRESH,
    parameter
  };
}

export function set(path, value){
  return {
    type: CONTENT_UPDATE_VALUE,
    path,
    value
  }
}

export function save(path, value){
  return (dispatch, getState) => {
    const json = JSON.stringify(getState().Content.data, null, 2);
    EditorUtils.downloadFile('content.json', json, 'application/json');
    return {
      type: CONTENT_SAVE,
      json
    }
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
