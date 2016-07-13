import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';
import styles from '../../css/app.css';
import EditorCard from '../components/EditorCard';
import Navigation from '../containers/Navigation';

class Main extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(ContentActions.update({
      content: this.props.query.content || '/data/test.json',
      schema: this.props.query.schema || '/data/test_schema.json'
    }));
  }

  _handleChange(path, value){
    console.log("Main: handleChange", path, value)
    this.props.dispatch(ContentActions.set(path, value));
  }

  render() {
    const {path, data, schema} = this.props;

    return (
      <div>
        <Navigation/>
        <main>
          {(data ?
            <EditorCard path={path} key={path} data={data} schema={schema}
            expandable={false} onChange={this._handleChange} title={path}/>
          :
            <span> Loading data </span>
          )}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: state.Content.data ? state.Content.data.toJS() : null,
    schema: state.Content.schema,
    title: state.Sample.title,
    path: ownProps.params.path,
    query:  ownProps.location.query
  }
}

export default connect(mapStateToProps)(Main)
