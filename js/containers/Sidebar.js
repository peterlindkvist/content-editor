import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ContentActions from '../actions/ContentActions';
import styles from '../../css/app.css';
import _ from 'lodash';

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



  render() {
    const {title, dispatch} = this.props;
    console.log("props", this.props);

    return (
      <nav>
        <ul>
        { _.map(this.props.data, (value, key) =>
          <li>
            <button>{key}</button>
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
      </nav>
    );
  }
}

export default connect(state => state.Content)(Sidebar)
