
# JSON Content Editor

A client side editor for JSON data written in redux/react.

### Examples
[Wordress-ish](http://editor.tndr.io?content=/data/wp.json&schema=/data/wp_schema.json)
[Test Admin](http://editor.tndr.io?content=/data/test.json&schema=/data/test_schema.json)

## Admin schema
 The editor uses a schema for defining properties in the JSON. The schema in NOT a  [JSON-schema](http://json-schema.org/ "JSON schema") but a admin schema in JSON.

The admin schema has the same structure as the content JSON and defines the possible primitive data types together with relations between nodes.  

#### Example

The admin schema for a simple page:

	{
		"header": "string",
		"excerpt": "text",
		"body": "html",
		"author": {
			"name" : "string",
			"website": "url"
		},
		tags:["string"]
	}

The corresponding content JSON:

	{
		"header": "Long live JSON",
		"excerpt": "pros and cons with JSON",
		"body": "<p>Pros: It's easy and slim.</p><p>Cons: Lacks possibility to add comments and handle references between nodes as <a href="json-schema.org">JSON schema</a> does.<p>",
		"author": {
			"name" : "Peter Lindkvist",
			"website": "http://editor.tndr.io"
		},
		tags:["JSON", "Editor"]
	}

## Primitives
The different input alternatives for editing of properties.

|  Primitive | HTML equivalent            | Default value  | Note   |
|------------|----------------------------|----------------|--------|
|boolean     | `<input type=checkbox />`  | ""             |
|color       | `<input type=color />`     | \#ffffff       |Adds a text-input as well|
|date        | `<input type="date" />`    | `new Date()`   |
|datetime    | `<input type="datetime" />`| `new Date()`   |
|email       | `<input type=email />`     | ""             |
|html        | `<RichTextEditor />`       | 0              | From [react-rte](https://react-rte.org)|
|image       | `<input type="file" />`    | \[object\]     | See paragraph about image below
|link        | `<input type=url + text />`| \[object\      | See paragraph about link below
|number      | `<input type=number />`    | 0              |
|password    | `<input type=password />`  | ""             | Nothing is encrypted so use with caution. |
|string      | `<input type=text />`      | ""             |
|text        | `<textarea />`             | ""             |
|time        | `<input type="time" />`    | `new Date()`   |
|url         | `<input type=url />`       | ""             |


#### Image
The image datatype is a composed type and contains a file upload and a input for image caption. When an image are added the size, type and filename are added as properties to the object.

The default values for an image is:

	{
		url: undefined,
	    caption: '',
	    name: '',
	    width: 0,
	    height: 0,
	    size: 0,
	    type: ''
	}
#### Link
The link datatype is a composed type and contains a url input and a text input for the link text.

The default values for a link is:

	{
		url: '',
	    text: ''
	}


## Collections
There are two types of collections, lists and maps. Think of them as the old javascript array `[]` and object `{}`.

### Lists
Lists or Arrays are a collection of data where the order of the elements matter. Is defined in the admin schema as a simple JSON array

	"tags": ["string"]

Creates a list of strings, in which new strings can be added, removed and  rearranged.

If it is a list of objects. The item are folded by default and needs to be expanded to be able to edit the nodes.

	"authors" : [{
		"name" : "string",
		"webpage" : "url"
	}]

### Maps
In maps, also known as hashes or objects, the order of the items are not guarantied so the items can't be reordered. A map are defined as an object with only one key named `_id`.  In the admin schema a map of strings are  defined as:

	"tags" : {
		"_id" : "string"
	}

The corresponding content JSON might look like:

	"tags: {
		"oisj" : "JSON",
		"yxlr" : "Editor"
	}

The id for the property are randomized and can't be set. It's only used internally for relations, see below

### When to use List or Maps

TL;DR use maps.

In most cases the rendering of the page defines the order of elements to be rendered so the order are irrelevant in the editor. Use something like:

	let alphabetical_persons = Object.values(persons).sort((a, b) => a.name > b.name)

To sort a map of persons in a alphabetical order.

References to nodes in a list are not changed if the order of the items in the collection changes or the list is modified. So `#user[0]`will always point to the first user in the list. Even if a new user is added to the top.

Lists are useful when the rendering order of items should be controlled in the editor. As with block order for website elements. The best way to preserve the reference and be able to sort the collection is to use a list of map items.

	{
		"posts" : {
			"tags" : ["tag"]
		},
		"tag" : {
			"_id" : "string"
		}
	}

The content JSON than becomes something like:

	{
		"posts" : {
			"tags" : ["#tag[ozyt]", "#tag[prqw]"]
		},
		"tag" : {
			"ozyt" : "JSON",
			"prqw" : "Editor"
		}
	}


### Relations
Relations between nodes are not possible by default in JSON. But some "hacks" of the JSON data makes it possible during parsing of the JSON into JS. Example:

- [CircularJSON](https://github.com/WebReflection/circular-json)
- [Cycle.js](https://github.com/douglascrockford/JSON-js/blob/master/cycle.js)

The editor uses an own relations syntax. But might change to the CircularJSON syntax in the future to make it easier to parse into circular JS objects, an operation not used in the editor.

References are defined as string values that are not primitives. As `author`  in the relation below.

Admin JSON

	"post" : [{
		"header" : "string",
		"author" : "author"
	}],
	"author" : {
		"_id" : "string"
	}

Content JSON

	"post" : [{
		"title" : "About IOI",
		"author" : "#author[oxfg]"
	}],
	"author" : {
		"oxfg" : "Parzival",
		"ztsr" : "Art3mis"
	}



#### Reference to single entity (One-To-One)
The simpliest and not so useful relation are the reference to a node that are not a collection, as `settings` in the example below.

It is not possible to change the reference if the target node of the definitions of the reference is not a collection.

	"settings": {
		"base_url" : "url"
	},
	"post":[{
		"title": "string",
		"settings": "settings"
	}]

All posts will then point to the same settings and it can't be changed in the editor.

	"settings": {
		"base_url" : "http://editor.tndr.io"
	},
	"post":[{
		"title": "docs",
		"settings": "#settings"
	}]

#### Single reference to a property in a List or Map (One-To-Many)
To reference a single node in a collection add the collections name as value.  Here are an example for a reference to a map (author) and a list (category). They will behave the same in the editor, with the exception that if a node are added to the top of `category` the reference will still be to position `1` which might not be the prefered behaviour. See paragraph in Collections above.

	"post" : [{
		"author" : "person",
		"category: "category"
	}],
	"person": {
		"_id" : {
			"name" : "string"
		}
	},
	"category" : ["string"]

And the content JSON

	"post" : [{
		"author" : "#person[owsa]",
		"category: "category[1]"
	}],
	"person": {
		"owsa" : {
			"name" : "Parzival"
		}
	},
	"category" : [
		"IOI",
		"gunter"
	]


#### Collection of references to collections (Many-To-Many)

To create a collection of items in a collection are defined in a similar way as other relations, but with the reference inside an list or an map .

	"post" : {
		authors :{
			"_id:" : "person"
		},
		"categories" : ["category"],
		"tags" : ["tag"]
	},
	"person" : {
		"_id" : "string"
	},
	"category" : ["string"],
	"tag" : {
		"_id" : "string"
	}

**Note** It's not possible to create a relationship of a map of list items.


### Modifications in references.

If an item are added to a reference collection its added to the target collection as well. But if an item are deleted, only the reference are removed.

## Special admin JSON properties

All property names starting with a underscore `_` are internal or hidden properties. Internal reserved properties are:

#### _id
Used in  definitions of maps

	{
		"_id" : "string"
	}

Defines a map of strings.

#### _description
Adds a description on top of the admin for that node.

## Future roadmap

- Ditch the material design, it looks ok, not great. It's only there be course of laziness.
- Add support for polymorpic associations: 	`"sections" : ["page", "tag"]`
- Update the references in both nodes in a relationship not only the edited node if the reference exists in the other node. `{"tag" : ["post"], "post" : ["tag"]}`.  
- Add support for JSON as a primitive data type `"custom_data" : "json"` , a colored textarea whould be nice. Validation of the JSON is necessary.
- Add support for exports to [CircularJSON](https://github.com/WebReflection/circular-json) and [Cycle.js](https://github.com/douglascrockford/JSON-js/blob/master/cycle.js)
- add `_created_at` and `_updated_at`properties in JSON which are updated behind the scene with the correct values, as in ruby on rails.
- ~~Create relations between maps and lists. ~~ [Issue #6]



## Running the project

The generated project includes a development server on port `3000`, which will rebuild the app whenever you change application code. To start the server (with the dev-tools enabled), run:

	$ npm start

To run the server with the dev-tools disabled, run:

	$ DEBUG=false npm start

To build for production, this command will output optimized production code:

	$ npm run build
