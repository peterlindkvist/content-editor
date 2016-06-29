import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as ContentActions from '../actions/ContentActions';
import _ from 'lodash';
import * as EditorUtils from '../utils/EditorUtils';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import styles from '../../css/app.css';

class Home extends Component {
  getType(obj){
    let type = typeof obj;
    if(type === 'string'){
      console.log("html?", type, obj.indexOf("\n"))
      if(obj.indexOf("\n") !== -1){
        type = 'text'
      }
    }
    return type
  }

  getElement(obj, name){
    console.log("getElem", typeof obj, this.getType(obj));
    if(typeof obj === 'string'){
      switch (this.getType(obj)) {
        case 'string':
          return  <TextField key={name} id={name} floatingLabelText={name}
          floatingLabelFixed={true} defaultValue={obj}/>
          break;
        case 'text':
          return  <TextField key={name} id={name} floatingLabelText={name}
          floatingLabelFixed={true}  multiLine={true} defaultValue={obj}/>
          break;
        default:

      }
    } else {

    }

  }

  render() {
    const {path, node, data} = this.props;
    console.log("node", data, node);
    const _this = this;

    return (
      <main>
        <Card>
         <CardHeader
           title={EditorUtils.getTitle(node)}
         />
         <CardText>
          {_.map(node, (row, name) =>
            <section>
              {_this.getElement(row, name)}
            </section>
          )}

          </CardText>
        </Card>
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
