import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'redux-router'
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';
import styles from '../../css/app.css';
import EditorCard from '../components/EditorCard';
import Navigation from '../containers/Navigation';
import StartPage from '../components/StartPage';
var titleCase = require('title-case');


class Main extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleAddItem = this._handleAddItem.bind(this);
    this._handleRemoveItem = this._handleRemoveItem.bind(this);
    this._handleMoveItem = this._handleMoveItem.bind(this);
    this._handleReplaceItem = this._handleReplaceItem.bind(this);
    this._handleNavigate = this._handleNavigate.bind(this);
    this._handleUpload = this._handleUpload.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(ContentActions.update({
      content: this.props.query.content || '/data/test.json',
      schema: this.props.query.schema || '/data/test_schema.json'
    }));
  }

  _handleChange(path, value){
    this.props.dispatch(ContentActions.set(path, value));
  }

  _handleAddItem(path, itemType, index, isReference, isMap){
    this.props.dispatch(ContentActions.addItem(path, itemType, index, isReference, isMap));
  }

  _handleRemoveItem(path, index){
    this.props.dispatch(ContentActions.removeItem(path, index));
  }

  _handleMoveItem(path, fromIndex, toIndex){
    this.props.dispatch(ContentActions.moveArrayItem(path, fromIndex, toIndex));
  }

  _handleReplaceItem(path, itemType, index, isMap){
    this.props.dispatch(ContentActions.replaceItem(path, itemType, index, isMap));
  }

  _handleNavigate(path){
    this.props.dispatch(push({ pathname: path }));
  }

  _handleUpload(path, files){
    this.props.dispatch(ContentActions.upload(path, files));
  }


  renderMain(path, data, schema){
    if(data){
      if(path){
         return <EditorCard path={path} key={path} data={data} schema={schema}  title={titleCase(path)} expandable={false}
          onChange={this._handleChange} onAddItem={this._handleAddItem} onRemoveItem={this._handleRemoveItem}
          onMoveItem={this._handleMoveItem} onReplaceItem={this._handleReplaceItem} onUpload={this._handleUpload} />
      } else {
        return <StartPage path={path} key={path} data={data} schema={schema}
        onClick={this._handleNavigate}/>
      }
    } else {
      return <span> Loading data </span>
    }
  }

  render() {
    const {path, data, schema} = this.props;

    return (
      <div>
        <Navigation/>
        <main>
          {this.renderMain(path, data, schema)}
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
