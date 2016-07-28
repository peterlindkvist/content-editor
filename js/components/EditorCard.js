import React, {Component, PropTypes} from 'react';
import {RaisedButton, FlatButton} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ItemArray from '../components/ItemArray';
import ElementContainer from '../components/ElementContainer';
import PrimitiveElement from '../components/PrimitiveElement';
import * as EditorUtils from '../utils/EditorUtils';


class EditorCard extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onAddItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
    onMoveItem: PropTypes.func,
    onUpload: PropTypes.func,
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    expandable: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
    movable: PropTypes.bool
  };

  /*static getDefaultProps =  {
     movable: false
 }*/

  state = {
    expanded: false
  }

  renderContent(path, fullpath=path) {
    const {data} = this.props
    const node = _.get(data, path);

    if(_.isArray(node)){
      return <ItemArray {...this.props} />
    } else if(_.isObject(node)){
      return (_.map(node, (row, name) =>
        <div key={fullpath + '.'+ name}>
          <ElementContainer {...this.props} name={name + ''} path={path + '.' + name} />
        </div>
      ))
    } else {
      return <span>{node}</span>
    }
  }

  render () {
    const {title, expandable, data, path, fullpath} = this.props;
    const node = _.get(data, path);
    const newTitle =  title ? title : EditorUtils.getTitle(node)
    const _this = this;
    return (
      <Card>
        <CardHeader title={newTitle} showExpandableButton={expandable} />
        <CardText expandable={expandable}>
         {this.renderContent(path, fullpath)}
        </CardText>
      </Card>
    )
  }
}

export default EditorCard;
