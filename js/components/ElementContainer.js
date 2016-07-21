import React, {Component, PropTypes} from 'react';
import {RaisedButton, FlatButton} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ItemArray from '../components/ItemArray';
import PrimitiveElement from '../components/PrimitiveElement';
import EditorCard from '../components/EditorCard';
import * as EditorUtils from '../utils/EditorUtils';


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
      onChange, onAddArrayItem, onRemoveItem, onMoveItem} = this.props;
    const schemapath = path.replace(/\[[0-9]*\]/g, '[0]');
    const value = _.get(data, path);
    const type = _.get(schema, schemapath);

    //console.log("renderElement", movable, path, type, typeof type, _.isArray(type));

    if(_.isArray(type)){
      return <ItemArray path={path} fullpath={fullpath} data={data} schema={schema}
        onAdd={onAddArrayItem} onRemove={onRemoveItem} onMove={onMoveItem} onChange={onChange}/>
    } else if(_.isObject(type)){
      return <EditorCard path={path} fullpath={fullpath + '.' + name}
        expandable={true} data={data} schema={schema} onChange={onChange} movable={movable}/>
    } else if(typeof type === 'string'){
      if(EditorUtils.isPrimitive(type)){
        return <PrimitiveElement value={value} name={name} path={path} type={type} onChange={onChange}/>
      } else if(value[0] === '#'){
        //check for missing types
        const targetPath = value.substr(1)
        const targetValue = _.get(data, targetPath);

        if(targetPath !== undefined){
          return <ElementContainer name={name} path={targetPath}
            fullpath={fullpath + '_' + targetPath} data={data} schema={schema}
            onChange={onChange} onAddArrayItem={onAddArrayItem} />
          //return this.renderElement(name, targetPath, false, fullpath + '_' + targetPath, movable)
        } else {
          return ''
        }
      }
    } else {

    }
  }
}

export default ElementContainer;
