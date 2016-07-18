import React, {Component, PropTypes} from 'react';
import {TextField, DatePicker, TimePicker, MenuItem, SelectField, RaisedButton} from 'material-ui';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import HTMLEditor from '../components/HTMLEditor';
import * as EditorUtils from '../utils/EditorUtils';


class ItemArray extends Component {
  static propTypes = {
    onAdd: PropTypes.func,
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    fullpath: PropTypes.string,
    renderElement: PropTypes.func
  };

  state = {
    addValue: -1
  }

  _handleAddButton(){
    const targetPath = _.get(this.props.schema, this.props.path)[0];
    console.log("Add", this.props.path, targetPath, this.state.addValue);
    this.props.onAdd(this.props.path, targetPath, this.state.addValue);
  }

  _handleAddChange = (event, index, value) => this.setState({addValue: value});

  render () {
    const {data, schema, path, fullpath} = this.props;
    const _this = this;
    const value = _.get(data, path);
    const targetPath = _.get(schema, path);
    const targetItems = _.get(data, targetPath);

    const items = _.map(value, (v, i) =>
      <div key={fullpath + '[' + i + ']'}>
        {_this.props.renderElement(_.get(_this.props.data, path + '[' + i + ']'), name + '[' + i + ']', path + '[' + i + ']', true, fullpath + '.' + name + '[' + i + ']')}
      </div>
    )

    const menuItems = _.map(targetItems, (v, i) =>
      <MenuItem key={fullpath + '_menu_' + i} value={i} primaryText={EditorUtils.getTitle(v)} />
    )

    return (
      <div>
        {items}
        <SelectField value={this.state.addValue} onChange={this._handleAddChange}>
           <MenuItem value={-1} primaryText="New Item" />
           {menuItems}
         </SelectField>
         <RaisedButton key={fullpath + '_add'}label="Add" primary={true} fullWidth={true} onClick={this._handleAddButton.bind(this)} />
       </div>
     )
  }
}

export default ItemArray;
