import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ContentActions from '../actions/ContentActions';
import styles from '../../css/app.css';
import _ from 'lodash';
import {Drawer, Navigation} from 'react-mdl';

class Sidebar extends Component {
  componentDidMount(){
    //ResourceActions.getResources();
    const {title, dispatch} = this.props;
    dispatch(ContentActions.update());
  }

  renderItemList(obj){
    console.log("renderItemList", obj);
    if(_.isArray(obj)){
      return (
        <ul>
        {_.map(obj, value =>
          <li>{value}</li>
        )}
        </ul>
      );
    } else {
      return '';
    }
  }


  /*{(_.isArray(value) &&
    <ul>
      {value.map(obj =>
        <li>{obj.title || obj.name}</li>
      )}
    </ul>
  )}*/


  render() {
    const {title, dispatch, data} = this.props;
    console.log("props", _.map(data, (value, key) => {return key}));

    return (
      <Drawer title="Title">
        <Navigation>
          <ul>
          { _.map(data, (value, key) =>
            <li>
              <a key={key} href="">{key}</a>
              {(_.isArray(value) &&
                <ul>
                  {value.map(obj =>
                    <li>{obj.title || obj.name}</li>
                  )}
                </ul>
              )}
            </li>
          )}
          </ul>
        </Navigation>
      </Drawer>
    );
  }
}

export default connect(state => state.Content)(Sidebar)
