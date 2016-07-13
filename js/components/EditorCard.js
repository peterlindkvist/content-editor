import React, {Component, PropTypes} from 'react';
import {TextField, DatePicker, TimePicker, MenuItem, SelectField} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import HTMLEditor from '../components/HTMLEditor';
import * as EditorUtils from '../utils/EditorUtils';


class EditorCard extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    expandable: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string
  };

  state = {
    expanded: false
  }

  isPrimitive(type){
    return [
      'string',
      'text',
      'number',
      'email',
      'password',
      'html',
      'time',
      'date',
      'datetime'
    ].indexOf(type) !== -1
  }

  _handleChange(path, target=false){
    return function(value, date) {
      const val = target ? value.target.value : value;
      this.props.onChange(path, val);
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

  renderPrimitiveElement(value, name, path, type){
    const attr = {
      id: path,
      fullWidth: true,
      defaultValue: value,
      onChange: this._handleChange(path, true)
    }

    const dtAttr = {
      floatingLabelFixed: true,
      floatingLabelText: name,
      fullWidth: true,
      value: new Date(value),
      onChange: this._handleChangeDateTime(path)
    }

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
        return (<div className='editor-datetime'>
          <DatePicker {...dtAttr}
          floatingLabelText={' date'} onChange={this._handleChangeDateTime(path, 'time')}/>
          <TimePicker {...dtAttr}
          floatingLabelText={' time'} format='24hr' onChange={this._handleChangeDateTime(path, 'date')}/>
        </div>)
      default:

    }
  }

  renderElement(value, name, path, renderChildren, fullpath){
    const {data, schema} = this.props;
    const schemapath = path.replace(/\[[0-9]*\]/g, '[0]');
    let type = _.get(schema, schemapath);
    const _this = this;

    //console.log("renderElement", this, path, type, typeof type, _.isArray(type));

    if(_.isArray(type)){
      return _.map(value, (v, i) =>
        <div key={fullpath + '[' + i + ']'}>
          {_this.renderElement(_.get(data, path + '[' + i + ']'), name + '[' + i + ']', path + '[' + i + ']', true, fullpath + '.' + name + '[' + i + ']')}
        </div>
      )
    } else if(_.isObject(type)){
      return <EditorCard path={path}  fullpath={fullpath + '.' + name}
        expandable={true} data={data} schema={schema} onChange={this.props.onChange}/>
    } else if(typeof type === 'string'){
      if(this.isPrimitive(type)){
        return this.renderPrimitiveElement(value, name, path, type)
      } else if(value[0] === '#'){
        //check for missing types
        const targetPath = value.substr(1)
        const targetValue = _.get(data, targetPath);
        //console.log("targetPath", name, value.substr(1), targetPath, targetValue)

        if(targetPath !== undefined){
          return this.renderElement(targetValue, name, targetPath, false, fullpath + '_' + targetPath)
        } else {
          return ''
        }
      }
    } else {

    }
  }

  renderContent(path, fullpath=path) {
    const _this = this;
    const node = _.get(this.props.data, path);
    //console.log('renderContent', fullpath, node, _.isArray(node))
    if(_.isArray(node) || _.isObject(node)){
      return (_.map(node, (row, name) =>
        <div key={fullpath + '.'+ name}>
          <span>{name + ' (' +  path + '.' + name + '):'}</span>
          {_this.renderElement(row, name, path + '.' + name, false, fullpath)}
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
