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
  console.log('refresh A');
  return (dispatch, getState) => {
    console.log('refresh B');

    dispatch(contentRefresh(parameter));
    console.log('refresh C');
    return fetch('data/content.json').
      then(response => response.json()).
      then(json => {
        console.log('refresh D', json);
        dispatch(contentUpdated(json));
      });
  }
}
