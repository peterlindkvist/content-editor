import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';

import styles from '../../css/app.css';

class Home extends Component {
  componentDidMount() {
    const { dispatch } = this.props

  }

  render() {
    const {title, dispatch} = this.props;

    const contentActions = bindActionCreators(ContentActions, dispatch);

    return (
      { _.map(this.props.data, (value, key) =>
        <li><button>{key}</button></li>

      )}
    );
  }
}

export default connect(state => state.Sample)(Home)
