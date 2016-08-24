import React, {Component, PropTypes} from 'react';
import {RaisedButton, FlatButton} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Collection from '../components/Collection';
import Reference from '../components/Reference';
import PrimitiveElement from '../components/PrimitiveElement';
import EditorCard from '../components/EditorCard';
import * as EditorUtils from '../utils/EditorUtils';
import Subheader from 'material-ui/Subheader';
import titleCase from 'title-case';


class ElementContainer extends Component {
  static propTypes = {
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    changeable: PropTypes.bool,
    onChange: PropTypes.func,
    onAddItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
    onMoveItem: PropTypes.func,
    onReplaceItem: PropTypes.func,
    expandable: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
  };

  static getDefaultProps =  {
     changeable: true
  };

  render(){
    const {name, path, renderChildren, fullpath, data, schema,
      onChange, onAddItem, onRemoveItem, onMoveItem, onUpload, onReplaceItem} = this.props;
    const schemapath = EditorUtils.getSchemaPath(path);
    const value = _.get(data, path);
    const node = _.get(schema, schemapath);
    const type = EditorUtils.getType(node, value);

    //console.log("renderElement", path, value, type, typeof type, _.isArray(type), schemapath);
    const title = titleCase(name)
    const changeable = this.props.changeable === undefined ? true : this.props.changeable

    const attr = {
      path: path,
      data: data,
      schema: schema,
      onAddItem: onAddItem,
      onReplaceItem: onReplaceItem,
      onRemoveItem: onRemoveItem,
      onMoveItem: onMoveItem,
      onChange: onChange,
      onUpload: onUpload
    }

    switch(type){
      case 'collection':
        return (
          <div>
            <Subheader>{title}</Subheader>
            <Collection {...attr} fullpath={fullpath}/>
          </div>
        )
      case 'object':
        return (
          <div>
            <Subheader>{title}</Subheader>
            <EditorCard {...attr} fullpath={fullpath + '.' + name} expandable={true} />
          </div>
        )
      case 'primitive':
        return <PrimitiveElement value={value} name={title} path={path}
          type={node} onChange={onChange} onUpload={onUpload} />
      case 'missing':
        return <span> Missing value for {path}</span>
      case 'reference':
        return <Reference {...attr} name={name} changeable={changeable}/>
      default:
        return <span>Type error [{type}], {value}, {path}</span>
    }
  }
}

export default ElementContainer;
