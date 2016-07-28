export function getTitle (obj = {name:'missing'}) {
  return typeof obj === 'string' ? obj : obj.name || obj.title;
}

export function downloadFile(filename, content, contentType){
  contentType = contentType === undefined ? 'text/plain' : contentType;
  var elem = document.createElement('a');
  elem.setAttribute('href', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(content));
  elem.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    elem.dispatchEvent(event);
  } else {
    elem.click();
  }
};

export function getImmutableKeyPath(path){
  return path.replace(/\[([0-9]*)\]/g, '.$1').split('.');
}

export function isPrimitive(type){
    return [
      'boolean',
      'string',
      'text',
      'number',
      'email',
      'password',
      'url',
      'html',
      'image',
      'time',
      'date',
      'datetime'
    ].indexOf(type) !== -1
  }
