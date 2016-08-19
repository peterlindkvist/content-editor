import titleCase from 'title-case';
//import * as EditorUtils from '../utils/EditorUtils';

export function getTitle (obj = {name: 'missing'}, schemaTitle) {
  if(schemaTitle){
    return schemaTitle;
  } else {
    return titleCase(typeof obj === 'string' ? obj : obj.name || obj.title);
  }
}

/**
The map schema is defined as an object with only one property, id
"obj" : {
  "_id": {
    "title" : "string"
  }
}
*/
export function isMap(obj){
  //if(obj === undefined) return false;
  const keys = Object.keys(obj);
  return (keys.length === 1 && keys[0] === '_id');
}

export function randomString(len = 4){
  return _.map(_.range(len), (a, b) => {
    return String.fromCharCode(97 + Math.floor(Math.random()*25));
  }).join('');
}

export function getType(node, value){
  if(_.isArray(node) || isMap(node)){
    return 'collection';
  } else if(_.isObject(node)){
    return 'object';
  } else if(typeof node === 'string'){
    if(isPrimitive(node)){
      return 'primitive';
    } else if(value === undefined){
      return 'missing';
    } else if(value[0] === '#'){
      return 'reference';
    }
  }
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

export function getSchemaPath(path){
  //const inPath = path;
  path = path.replace(/\[[0-9]*\]/g, '[0]').replace(/\.[0-9]/g, '.0');
  path = path.replace(/\[[a-zA-Z]*\]/g, '[_id]');
  //console.log("schemaPath", inPath, path);
  return path;
}

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
      'color',
      'html',
      'image',
      'time',
      'date',
      'datetime'
    ].indexOf(type) !== -1
  }
