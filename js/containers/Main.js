import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';
import {TextField, DatePicker, TimePicker} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Navigation from '../containers/Navigation';
import HTMLEditor from '../components/HTMLEditor';
import styles from '../../css/app.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleChangeDateTime = this._handleChangeDateTime.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(ContentActions.update({
      content: this.props.query.content || '/data/content.json',
      schema: this.props.query.schema || '/data/wp.json'
    }));
  }

  getType(obj, path, schema){
    let type = _.get(schema, path);
    if(type === 'string'){
      if(obj.indexOf("\n") !== -1){
        type = 'text'
      }
    }
    return type
  }

  _handleChange(path, target=false){
    return function(value, date) {
      console.log("change", path, value, date)
      const val = target ? value.target.value : value;
      this.props.dispatch(ContentActions.set(path, val));
    }.bind(this);
  }

  _handleChangeDateTime(path, addType){
    return function(value, date) {

      if(addType !== undefined){
        const prevValue = new Date(_.get(this.props.data, path));
        if(addType === 'date'){
          date = new Date(prevValue.toDateString() + ' ' + date.toTimeString());
        } else if(addType === 'time'){
          date = new Date(date.toDateString() + ' ' + prevValue.toTimeString());
        }
      }

      this.props.dispatch(ContentActions.set(path, date));
    }.bind(this);
  }

  getElement(value, name, path){
    const {data, schema} = this.props;
    const schemapath = path.replace(/\[[0-9]*\]/g, '[0]');
    let type = _.get(schema, schemapath);

    let key = name;
    const attr = {
      key: path,
      id: path,
      floatingLabelText: name,
      floatingLabelFixed: true,
      fullWidth: true,
      defaultValue: value,
      onChange: this._handleChange(path, true)
    }

    const dtAttr = {
      key: path,
      floatingLabelFixed: true,
      floatingLabelText: name,
      fullWidth: true,
      value: new Date(value),
      onChange: this._handleChangeDateTime(path)
    }

    let editorConfig = {

    }

    if(typeof type === 'string'){
      switch (type) {
        case 'string':
          return (<TextField {...attr}/>)
        case 'text':
          return (<TextField {...attr} multiLine={true} />)
        case 'number':
        case 'email':
        case 'password':
          return (<TextField {...attr} type={type} />)
        case 'html':
          return (<HTMLEditor key={path} value={value} onChange={this._handleChange(path)}/>)
        case 'time':
          return (<TimePicker {...dtAttr} format='24hr' />)
        case 'date':
          return (<DatePicker {...dtAttr} />)
        case 'datetime':
          return (<div key={path} className='editor-datetime'>
            <DatePicker {...dtAttr} key={path + '_date'}
            floatingLabelText={name + ' date'} onChange={this._handleChangeDateTime(path, 'time')}/>
            <TimePicker {...dtAttr} key={path + '_time'}
            floatingLabelText={' time'} format='24hr' onChange={this._handleChangeDateTime(path, 'date')}/>
          </div>)
        default:

      }
    } else {

    }

  }

  renderCard(path) {
    const _this = this;
    const node = _.get(this.props.data, path);

    return (
      <Card>
        <CardHeader title={EditorUtils.getTitle(node)} />
        <CardText>
          {_.map(node, (row, name) =>
            <section key={name}>
              {_this.getElement(row, name, path + '.' + name)}
            </section>
          )}
        </CardText>
      </Card>
    )
  }

  render() {
    const {path} = this.props;

    return (
      <div>
        <Navigation />
        <main>
          {this.renderCard(path)}
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

export default connect(mapStateToProps)(Home)
