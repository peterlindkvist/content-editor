import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Home from '../components/Home';
import Navigation from '../containers/Navigation';
import DevTools from './DevTools';
import * as ContentActions from '../actions/ContentActions';
import mui from 'material-ui';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const store = configureStore();

export default React.createClass({

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <Navigation />
            <Home />
            {(__DEV__ &&
                <DevTools />
            )}
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
});
