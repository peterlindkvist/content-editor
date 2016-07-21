import React, {Component, PropTypes} from 'react';
import {TextField, DatePicker, TimePicker, MenuItem, SelectField, RaisedButton} from 'material-ui';
import ElementContainer from '../components/ElementContainer';
import * as EditorUtils from '../utils/EditorUtils';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import DragIcon from 'material-ui/svg-icons/editor/drag-handle';
import {gray500} from 'material-ui/styles/colors';
import Sortable from 'react-anything-sortable';
//import { SortableContainer } from 'react-anything-sortable';
import SortableWrapper from '../components/SortableWrapper';
import 'react-anything-sortable/sortable.css';

class ItemArray extends Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onMove: PropTypes.func,
    onChange: PropTypes.func,
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    fullpath: PropTypes.string,
    renderElement: PropTypes.func
  };

  state = {
    addValue: -1
  }

  _handleAddButton(path, type, isReference){
    return function(){
      this.props.onAdd(path, type, isReference, this.state.addValue);
    }.bind(this);
  }

  _handleAddChange = (event, index, value) => this.setState({addValue: value});

  _handleRemoveButton(path, index){
    return function(){
      this.props.onRemove(path, index);
    }.bind(this);
  }

  _handleSort(sortedArray, currentDraggingSortData, currentDraggingIndex){
    this.props.onMove(this.props.path, currentDraggingSortData, currentDraggingIndex);
  }

  render () {
    const {data, schema, path, fullpath ,onAdd, onChange} = this.props;
    const _this = this;
    const value = _.get(data, path);
    const type = _.get(schema, path)[0];

    const isReference = !(EditorUtils.isPrimitive(type) || _.isObject(type))

    //console.log("render List", value, type, isReference);

    const items = _.map(value, (v, i) => {
      const index = '[' + i + ']';
      const value = _.get(_this.props.data, path + '[' + i + ']');
      return (
        <SortableWrapper key={fullpath + index} sortData={i}>
          <div  className="item-array">
            <div className="item-array--item">
              <ElementContainer name={name + index} path={path + index}
                fullpath={fullpath + '.' + name + index} data={data} schema={schema}
                onChange={onChange} onAddArrayItem={onAdd}
                renderChildren={true}/>
            </div>
            <div className="item-array--actions">
              <span className="item-array--dragitem">
                <DragIcon/>
              </span>
              <RemoveIcon onClick={this._handleRemoveButton(path, i).bind(this)}/>
            </div>
          </div>
        </SortableWrapper>
      )
      }
    )

    const targetItems = _.get(data, type);
    const menuItems = _.map(targetItems, (v, i) =>
      <MenuItem key={fullpath + '_menu_' + i} value={i} primaryText={EditorUtils.getTitle(v)} />
    )

    return (
      <div>
        <Sortable onSort={this._handleSort.bind(this)} direction="vertical" sortHandle="item-array--dragitem" >
          {items}
        </Sortable>
        {isReference && (
          <SelectField value={this.state.addValue} onChange={this._handleAddChange}>
            <MenuItem value={-1} primaryText="New Item" />
            {menuItems}
           </SelectField>
         )}
         <RaisedButton key={fullpath + '_add'}label="Add" primary={true}
         fullWidth={true} onClick={this._handleAddButton(path, type, isReference).bind(this)} />
       </div>
     )
  }
}

export default ItemArray;
