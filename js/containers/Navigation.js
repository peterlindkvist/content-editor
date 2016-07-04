import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ContentActions from '../actions/ContentActions';
import * as AppActions from '../actions/AppActions';
import styles from '../../css/app.css';
import _ from 'lodash';
import mui, {AppBar, Drawer, MenuItem, List, ListItem, FlatButton} from 'material-ui';
import * as EditorUtils from '../utils/EditorUtils';
import { push } from 'redux-router'

class Navigation extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleSave = this._handleSave.bind(this);
  }

  _handleOpen(open) {
    return function(evt){
      this._handleChange(open)
    }.bind(this);
  }

  _handleChange(open) {
    this.props.dispatch(AppActions.showDrawer(open))
  }

  _handleClick(path) {
    return function(evt){
      this.props.dispatch(push({ pathname: path }));
      this.props.dispatch(AppActions.showDrawer(false));

    }.bind(this);
  }

  _handleSave(evt) {
    this.props.dispatch(ContentActions.save());
  }

  render() {
    const {title, data, drawer_open} = this.props;
    const _this = this;

    return (
      <div>
        <Drawer ref="leftNav" docked={false} width={200}
          open={drawer_open} onRequestChange={this._handleChange}>

          { _.map(data, (obj, key) =>
            <List key={'list_' + key}>
              {( _.isArray(obj) ?
                <ListItem key={key} primaryText={key} initiallyOpen={false}
                primaryTogglesNestedList={true} onTouchTap={this._handleClick('/' + key)}
                 nestedItems={
                   _.map(obj, (child, i) =>
                     <ListItem key={key + i} primaryText={EditorUtils.getTitle(child)}
                     onTouchTap={_this._handleClick('/' + key + '[' + i + ']')}/>
                   )}
               />
              :
                <ListItem key={key} primaryText={key} onTouchTap={_this._handleClick('/' + key)} />
              )}
            </List>
          )}

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
    title: state.Sample.title,
    drawer_open: state.App.drawer_open,
  }
}

export default connect(mapStateToProps)(Navigation)
