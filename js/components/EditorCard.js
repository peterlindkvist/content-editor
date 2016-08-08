import React, {Component, PropTypes} from 'react';
import {RaisedButton, FlatButton, Divider, Subheader} from 'material-ui';
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
    const node = _.get(this.props.schema, EditorUtils.getSchemaPath(path));

    if(_.isArray(node)){
      return <ItemArray {...this.props} />
    } else if(_.isObject(node)){
      const description = node._description ? <p className="description"> {node._description}</p> : ''
      const toRenderItems = _.pickBy(node, (p, name) => name[0] !== '_');
      const items = _.map(toRenderItems, (row, name) =>
        <div key={fullpath + '.'+ name}>
          <ElementContainer {...this.props} name={name + ''} path={path + '.' + name} />
        </div>
      )
      return (<div>{description}{items}</div> )
    } else {
      return <span>{node}</span>
    }
  }

  render () {
    const {title, expandable, data, path, fullpath, schema} = this.props;
    const node = _.get(data, path);
    const newTitle =  title ? title : EditorUtils.getTitle(node)

    const source = (
      <div>
        <Divider />
        <Subheader>Data</Subheader>
        <textarea className="source" defaultValue={JSON.stringify(node, null, 2)} />
        <Subheader>Schema</Subheader>
        <textarea className="source" defaultValue={JSON.stringify(_.get(schema, path), null, 2)}/>
      </div>
    )

    return (
      <Card>
        <CardHeader title={newTitle} showExpandableButton={expandable} />
        <CardText expandable={expandable}>
         {this.renderContent(path, fullpath)}
         {false && source}
        </CardText>
      </Card>
    )
  }
}

export default EditorCard;
