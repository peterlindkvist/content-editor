import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';

import styles from '../../css/app.css';

class Home extends Component {
  render() {
    const {title, dispatch} = this.props;
    const homeActions = bindActionCreators(HomeActions, dispatch);
    const contentActions = bindActionCreators(ContentActions, dispatch);

    return (
      <main>
        <h1 className={styles.text}>Welcome {title}!</h1>
        <button onClick={e => homeActions.changeTitle(prompt())}>
          Update Title
        </button>
        <button onClick={e => contentActions.update()}>
          Update Content
        </button>
      </main>
    );
  }
}

export default connect(state => state.Sample)(Home)
