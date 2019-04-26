# json-pages

Middleware for express that injects JSON objects into a html template and serves the resulting pages.

## Instalation

```sh
$ npm install json-pages
```

## Getting Started

To use the json-pages you will need to put your json files and a html template (.html suffixed) together into a folder.

Then you can use the middleware simply as:

```js
	var jsonPages = require('json-pages')

	app.use(jsonPages(pathToFolder [, id]))
```
'pathToFolder' - May be the relative or absolute path to the folder where the files are contained.

'id' - [optional] Is the key for the JSON objects that will be used to uniquely identify each object in the URL path. If one is not specified the paths will default to a number count, starting from 0.


Note: The HTML template must have the placeholder keys escaped with double curly braces,
similar to a mustache template.

```html
	<h1>{{title}}</h1>
```

## Example:
/index.js:
```js
	var jsonPages = require('json-pages')

	app.use('/books', jsonPages('./booksFolder', 'id'));
```
/bookFolder/books.json:
```json
    {
        "id": "CGVDDwAAQBAJ",
        "title": "Where the Crawdads Sing",
        "authors": "Delia Owens",
        "image": "http://image.com/dslfjdsklfj",
        "category": "Fiction"
    }
```
/bookFolder/book.html
```html
	<body>
		<h1>{{title}}</h1>
		<img src={{image}} alt="..."/>
		...
```

The page would be served at: '/books/CGVDDwAAQBAJ'
