import {CONTENT_REFRESH, CONTENT_UPDATED} from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';

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

export function update(parameter) {
  return (dispatch, getState) => {
    dispatch(contentRefresh(parameter));
    Promise.all([
      fetch('data/content.json').then(response => response.json()),
      fetch('data/wp.json').then(response => response.json())
    ]).then(([contentJSON, schemaJSON]) => {
      dispatch(contentUpdated(contentJSON, schemaJSON));
    });
  }
}
