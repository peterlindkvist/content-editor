import titleCase from 'title-case';

const PRIMITIVES = {
  boolean : false,
  string: 'test s',
  text: '',
  number: 0,
  email: '',
  password: '',
  url: '',
  color: '#ffffff',
  html: '',
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

export function getStubItem(schemaNode){
  const rawObj = Object.assign({}, schemaNode);
  const defaultObj = _.cloneDeepWith(rawObj, (value, key, obj, stack) => {
    //console.log("clone", value, key, obj, stack);
    if(obj !== undefined && isMap(obj)){
      return undefined;
    } else if(_.isArray(obj)){
      return undefined;
    } else {
      return PRIMITIVES[value];
    }
  });
  return defaultObj;
}

//http://stackoverflow.com/questions/25333918/js-deep-map-function
function transformDeep(obj, iterator, context) {
    return _.transform(obj, function(result, val, key) {
        result[key] = _.isObject(val) ?
                            deepMap(val, iterator, context) :
                            iterator.call(context, val, key, obj);
    });
}

export function populateFromSchema(data, schema){
  return  _.transform(schema, (result, val, key) => {

    if(result[key] === undefined){
      if(isMap(val)){
        result[key] = {};
      } else if(_.isArray(val)){
        result[key] = [];
      } else if(_.isObject(val)){
        result[key] = populateFromSchema(result[key], val);
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
  return path.replace(/\[([0-9]*)\]/g, '.$1').split('.');
}
