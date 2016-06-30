import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ContentActions from '../actions/ContentActions';
import * as AppActions from '../actions/AppActions';
import styles from '../../css/app.css';
import _ from 'lodash';
import mui, {AppBar, Drawer, MenuItem, List, ListItem} from 'material-ui';
import * as EditorUtils from '../utils/EditorUtils';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(ContentActions.update());
  }

  _handleOpen(open) {
    return function(evt){
      this._handleChange(open)
    }.bind(this);
  }

  _handleChange(open) {
    this.props.dispatch(AppActions.showDrawer(open))
  }

  render() {
    const {title, data, drawer_open} = this.props;
    console.log("props", _.map(data, (value, key) => {return key}));

    return (
      <div>
        <Drawer ref="leftNav" docked={false} width={200}
          open={drawer_open} onRequestChange={this._handleChange}>

          { _.map(data, (obj, key) =>
            <List key={'list_' + key}>
              {( _.isArray(obj) ?
                <ListItem key={key} primaryText={key} initiallyOpen={false} primaryTogglesNestedList={true}
                 nestedItems={
                   _.map(obj, (child, i) =>
                     <ListItem key={key + i} primaryText={EditorUtils.getTitle(child)} />
                   )}
               />
              :
                <ListItem key={key} primaryText={key} onTouchTap={this._handleOpen(false)} />
              )}
            </List>
          )}

        </Drawer>
        <header>
          <AppBar title={title} onLeftIconButtonTouchTap={this._handleOpen(true)}
            isInitiallyOpen={true} />
        </header>
      </div>
    );
  }
}

Navigation.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    data: state.Content.data,
    title: state.Sample.title,
    drawer_open: state.App.drawer_open
  }
}

export default connect(mapStateToProps)(Navigation)
