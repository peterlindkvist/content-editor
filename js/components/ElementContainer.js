import React, {Component, PropTypes} from 'react';
import {RaisedButton, FlatButton} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ItemArray from '../components/ItemArray';
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
    onChange: PropTypes.func,
    onAddArrayItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
    onMoveItem: PropTypes.func,
    expandable: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
    movable: PropTypes.bool,
    renderChildren: PropTypes.bool
  };

  static getDefaultProps =  {
     movable: false,
     renderChildren: false
  };

  render(){
    const {name, path, renderChildren, fullpath, movable, data, schema,
      onChange, onAddItem, onRemoveItem, onMoveItem, onUpload} = this.props;
    const schemapath = EditorUtils.getSchemaPath(path);
    const value = _.get(data, path);
    const type = _.get(schema, schemapath);

    //console.log("renderElement", path, value, type, typeof type, _.isArray(type), schemapath);
    const title = titleCase(name)

    const attr = {
      path: path,
      data: data,
      schema: schema,
      onAddItem: onAddItem,
      onRemoveItem: onRemoveItem,
      onMoveItem: onMoveItem,
      onChange: onChange,
      onUpload: onUpload
    }

    if(_.isArray(type)){
      return (
        <div>
          <Subheader>{title}</Subheader>
          <ItemArray {...attr} fullpath={fullpath} />
        </div>
      )
    } else if(_.isObject(type)){
      return (
        <div>
          <Subheader>{title}</Subheader>
          <EditorCard {...attr} fullpath={fullpath + '.' + name} expandable={true} />
        </div>
      )
    } else if(typeof type === 'string'){
      if(EditorUtils.isPrimitive(type)){
        return <PrimitiveElement value={value} name={title} path={path}
        type={type} onChange={onChange} onUpload={onUpload} />
      } else if(value === undefined){
        return <span> Missing value for {path}</span>
      } else if(value[0] === '#'){
        //check for missing types
        const targetPath = value.substr(1)
        const targetValue = _.get(data, targetPath);

        if(targetPath !== undefined){
          return <ElementContainer {...attr} name={name} path={targetPath}
            fullpath={fullpath + '_' + targetPath} />
        } else {
          return ''
        }
      }
    } else {

    }
  }
}

export default ElementContainer;
