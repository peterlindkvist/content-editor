import React, {Component, PropTypes} from 'react';
import {TextField, DatePicker, TimePicker, MenuItem, SelectField, RaisedButton, FlatButton} from 'material-ui';
import HTMLEditor from '../components/primitives/HTMLEditor';

class PrimitiveElement extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.number
    ]),
    path: PropTypes.string,
    name: PropTypes.string
  };

  _handleChange(path, target=false){
    return function(value, date) {
      const val = target ? value.target.value : value;
      this.props.onChange(path, val);
    }.bind(this);
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

  render(){
    const {value, name, path, type} = this.props;

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
        return <TextField {...attr}/>
      case 'text':
        return <TextField {...attr} multiLine={true} />
      case 'number':
      case 'email':
      case 'password':
        return <TextField {...attr} type={type} />
      case 'html':
        return <HTMLEditor key={path} value={value} onChange={this._handleChange(path)}/>
      case 'time':
        return <TimePicker {...dtAttr} format='24hr' />
      case 'date':
        return <DatePicker {...dtAttr} />
      case 'datetime':
        return <div className='editor-datetime'>
          <DatePicker {...dtAttr}
          floatingLabelText={' date'} onChange={this._handleChangeDateTime(path, 'time')}/>
          <TimePicker {...dtAttr}
          floatingLabelText={' time'} format='24hr' onChange={this._handleChangeDateTime(path, 'date')}/>
        </div>
      default:
    }
  }
}

export default PrimitiveElement;
