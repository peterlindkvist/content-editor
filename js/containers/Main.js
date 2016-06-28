import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';

import styles from '../../css/app.css';

class Home extends Component {
  getType(obj){
    return typeof obj
  }

  getElement(obj){
    switch (this.getType(obj)) {
      case 'string':
        return <input type='text' value={obj} />
        break;
      default:

    }
  }

  render() {
    const {path, node, data} = this.props;
    console.log("node", data, node);
    const _this = this;

    return (
      <main>
        <h1>{path}</h1>
        <span>{EditorUtils.getTitle(node)}</span>
        {_.map(node, (row, name) =>
          <section>
            {_this.getElement(row)}
          </section>
        )}


      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    path: state.Content.path,
    node: _.get(state.Content.data, state.Content.path),
    data: state.Content.data,
    title: state.Sample.title
  }
}

export default connect(mapStateToProps)(Home)
