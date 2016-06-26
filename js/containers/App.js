import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Home from '../components/Home';
import Sidebar from '../containers/Sidebar';
import DevTools from './DevTools';
import * as ContentActions from '../actions/ContentActions';
import {Layout, Header} from 'react-mdl';

const store = configureStore();

export default React.createClass({

  render() {
    return (
      <div>
        <Provider store={store}>
          <div style={{height: '300px', position: 'relative'}}>
            <Layout fixedHeader>
              <Header title={<span><span style={{ color: '#ddd' }}>Area / </span><strong>The Title</strong></span>}>
              </Header>
              <Sidebar />
              <Home />
            </Layout>
            {(__DEV__ &&
                <DevTools />
            )}
          </div>
        </Provider>

      </div>
    );
  }
});
