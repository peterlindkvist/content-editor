import React, {Component, PropTypes} from 'react';
import {TextField, DatePicker, TimePicker, MenuItem, SelectField, RaisedButton,
  FlatButton, Toggle} from 'material-ui';
import HTMLEditor from '../components/primitives/HTMLEditor';
import Image from '../components/primitives/Image';

class PrimitiveElement extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onUpload: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.object
    ]),
    path: PropTypes.string,
    name: PropTypes.string
  };

  _handleChange(path, target=false){
    return function(value) {
      const val = target ? value.target.value : value;
      this.props.onChange(path, val);
    }.bind(this);
  }

  _handleChangeBoolean(){
    this.props.onChange(this.props.path, !this.props.value);
  }

  _handleChangeDateTime(path, addType){
    return function(value, date) {

      if(addType !== undefined){
        const prevValue = new Date(this.props.value);
        if(addType === 'date'){
          date = new Date(prevValue.toDateString() + ' ' + date.toTimeString());
        } else if(addType === 'time'){
          date = new Date(date.toDateString() + ' ' + prevValue.toTimeString());
        }
      }
      this.props.onChange(path, val);
    }.bind(this);
  }

  _handleUpload(path){
    return function(files, subpath){
      this.props.onUpload(path + subpath, files);
    }.bind(this);
  }

  render(){
    const {value, name, path, type, onChange} = this.props;

    const attr = {
      floatingLabelFixed: true,
      floatingLabelText: name,
      id: path,
      fullWidth: true,
      defaultValue: value,
      onChange: this._handleChange(path, true)
    }

    const dtAttr = {
      floatingLabelFixed: true,
      floatingLabelText: name,
      id: path,
      fullWidth: true,
      value: new Date(value),
      onChange: this._handleChangeDateTime(path)
    }

    switch (type) {
      case 'boolean':
        return <Toggle label={name} defaultToggled={value} onToggle={this._handleChangeBoolean.bind(this)}/>
      case 'string':
        return <TextField {...attr}/>
      case 'text':
        return <TextField {...attr} multiLine={true} />
      case 'number':
      case 'url':
      case 'email':
      case 'password':
        return <TextField {...attr} type={type} />
      case 'color':
        return <div className="color">{name} :
            <input type="color" value={value} onChange={this._handleChange(path, true)} />
            <input type="text" value={value} onChange={this._handleChange(path, true)} />
          </div>
      case 'html':
        return <HTMLEditor key={path} value={value} onChange={this._handleChange(path).bind(this)}/>
      case 'image':
        return <Image value={value} label={name} path={path}
          onChange={onChange} onUpload={this._handleUpload(path)}/>
      case 'time':
        return <TimePicker {...dtAttr} format='24hr' />
      case 'date':
        return <DatePicker {...dtAttr} />
      case 'datetime':
        return <div className='editor-datetime'>
          <DatePicker {...dtAttr} floatingLabelFixed={true}
          floatingLabelText={' date'} onChange={this._handleChangeDateTime(path, 'time')}/>
          <TimePicker {...dtAttr} floatingLabelFixed={true}
          floatingLabelText={' time'} format='24hr' onChange={this._handleChangeDateTime(path, 'date')}/>
        </div>
      default:
    }
  }
}

export default PrimitiveElement;
