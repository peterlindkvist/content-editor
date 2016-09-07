import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import mui, {AppBar, Drawer, MenuItem, List, ListItem, FlatButton} from 'material-ui';
import { push } from 'redux-router'
import titleCase from 'title-case';
import * as AppActions from '../actions/AppActions';
import * as ContentActions from '../actions/ContentActions';
import styles from '../../css/app.css';
import * as EditorUtils from '../utils/EditorUtils';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleSave = this._handleSave.bind(this);
  }

  _handleOpen = (open) => (evt) => this._handleChange(open);

  _handleChange = (open) => this.props.dispatch(AppActions.showDrawer(open))

  _handleClick = (path) => (evt) => {
    this.props.dispatch(push({ pathname: path }));
    this.props.dispatch(AppActions.showDrawer(false));
  }

  _handleSave = (evt) => this.props.dispatch(ContentActions.save());

  render() {
    const {title, data, drawer_open, schema} = this.props;
    const _this = this;

    return (
      <div>
        <Drawer ref="leftNav" docked={false} width={200}
          open={drawer_open} onRequestChange={this._handleChange}>
          <List >
          { _.map(schema, (obj, key) =>
            <div key={'list_' + key}>
              {( _.isArray(obj) || EditorUtils.isMap(schema[key]) ?
                <ListItem key={key} primaryText={titleCase(key)} initiallyOpen={false}
                primaryTogglesNestedList={false} onTouchTap={this._handleClick('/' + key)}
                 nestedItems={
                   _.map(data[key], (child, i) =>
                     <ListItem key={key + i} primaryText={EditorUtils.getTitle(child)}
                     onTouchTap={_this._handleClick('/' + key + '[' + i + ']')}/>
                   )}
               />
              :
                <ListItem key={key} primaryText={titleCase(key)} onTouchTap={_this._handleClick('/' + key)} />
              )}
              </div>
          )}
          </List>

        </Drawer>
        <header>
          <AppBar title={title} onLeftIconButtonTouchTap={this._handleOpen(true)}
            iconElementRight={<FlatButton label="Save" onClick={this._handleSave}/>} />
        </header>
      </div>
    );
  }
}

Navigation.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    data: state.Content.data ? state.Content.data.toJS() : null,
    schema: state.Content.schema,
    drawer_open: state.App.drawer_open,
  }
}

export default connect(mapStateToProps)(Navigation)
