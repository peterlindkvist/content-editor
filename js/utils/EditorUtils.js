import titleCase from 'title-case';

/* const with the posible primitives with there default values */
const PRIMITIVES = {
  boolean : false,
  string: '',
  text: '',
  number: 0,
  email: '',
  password: '',
  url: '',
  color: '#ffffff',
  html: '',
  link: {
    url: '',
    text: ''
  },
  image: {
    url: undefined,
    caption: '',
    name: '',
    width: 0,
    height: 0,
    size: 0,
    type: ''
  },
  time: new Date() + '',
  date: new Date() + '',
  datetime: new Date() + ''
}

export function isPrimitive(type){
  return Object.keys(PRIMITIVES).indexOf(type) !== -1
}

export function populateFromSchema(schema, data){
  return  _.transform(schema, (result, val, key) => {

    if(result[key] === undefined){
      if(isMap(val)){
        result[key] = {};
      } else if(_.isArray(val)){
        result[key] = [];
      } else if(_.isObject(val)){
        result[key] = populateFromSchema(val, result[key]);
      } else {
        result[key] = PRIMITIVES[val];
      }
    }
  }, data);


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
    } else {
      console.log("Missing type: ", node, value);
    }
  }
}




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
  return path.replace(/\[([0-9a-z]*)\]/g, '.$1').split('.');
}
