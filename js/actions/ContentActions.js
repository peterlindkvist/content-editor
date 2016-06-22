import {CONTENT_REFRESH, CONTENT_UPDATED} from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';

function contentUpdated(json){
  return {
    type: CONTENT_UPDATED,
    data: json
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
    return fetch('data/content.json').
      then(response => response.json()).
      then(json => {
        dispatch(contentUpdated(json));
      });
  }
}
