import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ContentActions from '../actions/ContentActions';
import * as AppActions from '../actions/AppActions';
import styles from '../../css/app.css';
import _ from 'lodash';
import mui, {AppBar, Drawer, MenuItem} from 'material-ui';

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
            <div>
              <MenuItem key={key} onTouchTap={this._handleOpen(false)}>{key}</MenuItem>

              {( _.isArray(obj) &&
                <MenuItem>
                  { _.map(obj, (child, i) =>
                    <MenuItem key={(key + i)} onTouchTap={this._handleOpen(false)}>
                      {(child.name || child.title)}
                    </MenuItem>
                  )}
                </MenuItem>
              )}
            </div>
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