import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {persistState} from 'redux-devtools';
import DevTools from '../containers/DevTools';
import * as reducers from '../reducers/index';
import { routerStateReducer, reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';

let createStoreWithMiddleware;

// Configure the dev tools when in DEV mode 
if (__DEV__) {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware),
    reduxReactRouter({
       createHistory
     }),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&#]+)\b/))
  )(createStore);
} else {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware),
    reduxReactRouter({
       createHistory
     })
  )(createStore);
}

const rootReducer = combineReducers({
  ...reducers,
  router: routerStateReducer
});

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
