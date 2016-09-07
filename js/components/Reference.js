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

class Reference extends Component {
  static propTypes = {
    onAddItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
    onMoveItem: PropTypes.func,
    onChange: PropTypes.func,
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    changeable: PropTypes.bool,
    fullpath: PropTypes.string,
    renderElement: PropTypes.func
  };

  state = {
    addValue: -1
  }

  _handleReplaceButton(path, newType, isReference, isMap){
    return function(){
      this.props.onReplaceItem(path, newType, this.state.addValue, isMap);
    }.bind(this);
  }


  _handleDropdownChange = (event, index, value) => this.setState({addValue: value});

  render () {
    const {data, schema, path, changeable, onAddItem, onMoveItem, onRemoveItem, onChange} = this.props;
    const value = _.get(data, path);
    const targetType = _.get(schema, EditorUtils.getSchemaPath(path));
    const targetNode = _.get(schema, targetType);
    const isMap = EditorUtils.isMap(targetNode);
    const isCollection = _.isArray(targetNode) || isMap;


    const targetPath = value.substr(1) //remove #
    const fullpath= fullpath + '_' + targetPath


    //console.log("render List", path, value, type, isReference);


    const targetItems = _.get(data, targetType);
    const menuItems = _.map(targetItems, (v, i) =>
      <MenuItem key={fullpath + '_menu_' + i} value={i} primaryText={EditorUtils.getTitle(v)} />
    )

    return (
      <div>
        <ElementContainer {...this.props} path={targetPath}/>
        {(isCollection && changeable &&
          <div className="item-array--add">
            <SelectField value={this.state.addValue} onChange={this._handleDropdownChange}>
              <MenuItem value={-1} primaryText={"New " + targetType} />
              {menuItems}
             </SelectField>
             <RaisedButton key={fullpath + '_change'} label={"Change item"} primary={true}
              onClick={this._handleReplaceButton(path, targetType, true, isMap).bind(this)} />
          </div>
        )}
       </div>
     )
  }
}

export default Reference;
