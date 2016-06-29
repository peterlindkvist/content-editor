import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Main from '../containers/Main';
import Navigation from '../containers/Navigation';
import DevTools from './DevTools';
import * as ContentActions from '../actions/ContentActions';
import mui from 'material-ui';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const store = configureStore();

export default React.createClass({
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Provider store={store}>

          <div>
            <Navigation />
            <Main />
            {(__DEV__ &&
                <DevTools />
            )}
          </div>
          </Provider>
      </MuiThemeProvider>
    );
  }
});
