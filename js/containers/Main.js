import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';
import {TextField, DatePicker, TimePicker} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import styles from '../../css/app.css';

class Home extends Component {
  getType(obj, path, schema){
    let type = _.get(schema, path);
    console.log("getType", obj, path, schema, stype);
    if(type === 'string'){
      console.log("html?", type, obj.indexOf("\n"))
      if(obj.indexOf("\n") !== -1){
        type = 'text'
      }
    }
    return type
  }

  getElement(value, name, path){
    const {data, schema} = this.props;
    let type = _.get(schema, path);
    let key = name;
    console.log("getEl", path, type);

    if(typeof type === 'string'){
      switch (type) {
        case 'string':
          return (<TextField key={key} id={key} floatingLabelText={name}
            floatingLabelFixed={true} value={value}/>)
        case 'text':
          return (<TextField key={key} id={key} floatingLabelText={name}
            floatingLabelFixed={true}  multiLine={true} value={value}/>)
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
            <section>
              {_this.getElement(row, name, path + '.' + name)}
            </section>
          )}
        </CardText>
      </Card>
    )
  }

  render() {
    const {path, node, data} = this.props;
    console.log("node", data, node);

    return (
      <main>
        {this.renderCard(path)}
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    path: state.Content.path,
    node: _.get(state.Content.data, state.Content.path),
    data: state.Content.data,
    schema: state.Content.schema,
    title: state.Sample.title
  }
}

export default connect(mapStateToProps)(Home)
