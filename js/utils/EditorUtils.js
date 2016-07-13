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
