import React, {Component, PropTypes} from 'react';
var Dropzone = require('react-dropzone');
import Subheader from 'material-ui/Subheader';
import {TextField} from 'material-ui';

class Image extends Component {
  static propTypes = {
    path: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onUpload: PropTypes.func,
    value: PropTypes.object
  };

  state = {
    ...this.props.value,
    preview: this.props.value.url
  }

  componentDidMount = () => {

  }

  onLoad = () => {
    this.imageContainer.style.width='100%';
    this.imageContainer.style.height='100%';
    const dimension = {
      width: this.image.width,
      height: this.image.height
    }
    this.setState(dimension);
    console.log("onLoad", this.image.width, this.imageContainer);
    this.imageContainer.style.width = null;
    this.imageContainer.style.height = null;

    if(dimension.width > dimension.height){
      this.image.style.width = '100%';
      this.image.style.height = null;
    } else {
      this.image.style.width = null;
      this.image.style.height = '100%';
    }


  }

  onDrop = (files) => {
    const file = files[0]
    const preview = file.preview;
    console.log("onDrop", files[0]);
    const newState = {
      preview,
      name: file.name,
      type: file.type,
      size: file.size
    }
    this.setState(newState);
    this.props.onChange(this.props.path, newState);
    this.props.onUpload(files, '.url');
  }

  hideImage = () => this.imageContainer.style.opacity = 0.3;

  showImage = () => this.imageContainer.style.opacity = 1;

  onClick = () => this.dropzone.open();

  _handleChange = (evt) => {
    this.props.onChange(this.props.path + '.caption', evt.target.value);
  }


  render () {
    const {path, label, src, value} = this.props;

    const attr = {
      floatingLabelFixed: true,
      floatingLabelText: name,
      id: path + '.caption',
      fullWidth: true,
      defaultValue: this.state.caption,
      onChange: this._handleChange.bind(this)
    }
    
    return (
      <div>
        <Subheader>{label}</Subheader>
        <div className="image">
          <Dropzone onDrop={this.onDrop.bind(this)} ref={(ref) => this.dropzone = ref}>
            <div>Dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div className="image--container" ref={(ref) => this.imageContainer = ref}
            onMouseOver={this.hideImage.bind(this)} onMouseOut={this.showImage.bind(this)}
            onClick={this.onClick.bind(this)}>
            <img src={this.state.preview} ref={(ref) => this.image = ref}
              onLoad={this.onLoad.bind(this)}/>
          </div>
          <div className="image--metadata">
            <TextField {...attr}/>
            <div>name : {this.state.name} </div>
            <div>width : {this.state.width} px</div>
            <div>height : {this.state.height} px</div>
            <div>size : {this.state.size} bytes</div>
            <div>type : {this.state.type} </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Image;
