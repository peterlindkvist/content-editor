import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Home from '../components/Home';
import Sidebar from '../containers/Sidebar';
import {renderDevTools} from '../utils/devTools';
import * as ContentActions from '../actions/ContentActions';

const store = configureStore();

export default React.createClass({

  render() {
    return (
      <div>

        {/* <Home /> is your app entry point */}
        <Provider store={store}>
          <div>
            <Sidebar />
            <Home />
          </div>
        </Provider>

        {/* only renders when running in DEV mode */
          renderDevTools(store)
        }
      </div>
    );
  }
});
