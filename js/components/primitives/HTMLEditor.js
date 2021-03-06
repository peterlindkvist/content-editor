import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import Subheader from 'material-ui/Subheader';

class HTMLEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string
  };

  state = {
    value: RichTextEditor.createValueFromString(this.props.value, 'html')
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  };

  render () {
    return (
      <div>
        <Subheader>{this.props.name}</Subheader>
        <RichTextEditor value={this.state.value} onChange={this.onChange} />
      </div>
    );
  }
}

export default HTMLEditor;
