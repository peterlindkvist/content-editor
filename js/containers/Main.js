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
  getType(obj, path, schema){
    let type = _.get(schema, path);
    if(type === 'string'){
      if(obj.indexOf("\n") !== -1){
        type = 'text'
      }
    }
    return type
  }



  onChange(value){
    //this.state.value = value
    console.log("change", value);
  }

  getElement(value, name, path){
    const {data, schema} = this.props;
    let type = _.get(schema, path);
    let key = name;
    const attr = {
      key: name,
      id: name,
      floatingLabelText: name,
      floatingLabelFixed: true,
      fullWidth: true,
      value
    }

    let editorConfig = {

    }

    if(typeof type === 'string'){
      switch (type) {
        case 'string':
          return (<TextField {...attr}/>)
        case 'text':
          return (<TextField multiLine={true} {...attr} />)
        case 'number':
        case 'email':
          return (<TextField type={type} {...attr} />)
        case 'html':
          return (<HTMLEditor value={value}/>)
        case 'time':
          return (<TimePicker key={key} id={key} floatingLabelFixed={true}
            floatingLabelText={name} format='24hr' value={new Date(value)}/>)
        case 'date':
          return (<DatePicker key={key} id={key} floatingLabelFixed={true}
            floatingLabelText={name} value={new Date(value)}/>)
        case 'datetime':
          console.log("DATETIME", key);
          return (<div key={key} >
            <DatePicker id={key + '_date'} floatingLabelFixed={true}
            floatingLabelText={name} value={new Date(value)}/>
            <TimePicker id={key + '_time'} floatingLabelFixed={true}
            floatingLabelText={name} format='24hr' value={new Date(value)}/>
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
    console.log("node", path);

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
  console.log("Man msptp", ownProps);
  return {
    data: state.Content.data,
    schema: state.Content.schema,
    title: state.Sample.title,
    path: ownProps.params.path
  }
}

export default connect(mapStateToProps)(Home)
