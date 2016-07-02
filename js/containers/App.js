import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Main from '../containers/Main';
import DevTools from './DevTools';
import * as ContentActions from '../actions/ContentActions';
import mui from 'material-ui';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ReduxRouter, browserHistory } from 'redux-router'
import { Route } from 'react-router';


const store = configureStore();

export default React.createClass({
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Provider store={store}>

          <div>
            <ReduxRouter>
              <Route path="/" component={Main} >
                <Route path=":path" component={Main} />
              </Route>
            </ReduxRouter>
            {(true && __DEV__ &&
                <DevTools />
            )}
          </div>
          </Provider>
      </MuiThemeProvider>
    );
  }
});
