import React, {Component, PropTypes} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionHome from 'material-ui/svg-icons/action/home';
import {cyan500} from 'material-ui/styles/colors';
import titleCase from 'title-case';

class StartPage extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  static propTypes = {
    path: PropTypes.string,
    data: PropTypes.object,
    schema: PropTypes.object,
    onClick: PropTypes.func
  };

  _handleClick(path) {
    return function(evt){
      this.props.onClick(path)
    }.bind(this);
  }


  render() {
    const {path, data, schema} = this.props;

    const styles = {
      root: {
        marginTop: 100,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: 500,
        height: 500,
        marginBottom: 24,
      },
      icon: {
        width: 160,
        height: 160,
        margin: '0 40'
      }
    };

    return (
      <div style={styles.root}>
        <GridList cellHeight={200} style={styles.gridList}>
          {_.map(schema, (data, name) =>
            <GridTile key={path + '.' + name} title={titleCase(name)} onClick={this._handleClick(name)}>
              <ActionHome style={styles.icon} color={cyan500}/>
            </GridTile>
          )}
        </GridList>
      </div>
    )
  }
}

export default StartPage
