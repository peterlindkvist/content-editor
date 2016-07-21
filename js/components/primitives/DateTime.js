

render(){
  return <div className='editor-datetime'>
    <DatePicker {...dtAttr}
      floatingLabelText={' date'} onChange={this._handleChangeDateTime(path, 'time')}/>
    <TimePicker {...dtAttr}
    floatingLabelText={' time'} format='24hr' onChange={this._handleChangeDateTime(path, 'date')}/>
  </div>
}
