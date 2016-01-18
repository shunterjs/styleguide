# Styleguide

A Living Styleguide Module for your Shunter Application. Mark up components (code snippets) within your templates and render them as a Living Styleguide that will use the assets from your application to always show a guide to the latest version of your website. The module will also use your CSS to auto-generate sections for Typography and Colors.

## Table Of Contents

* [Set-up Steps](#set-up-steps)
* [Configuration](#configuration)
    * [Default Configuration Options](#default-configuration-options)
        * [path.templates](#pathtemplates)
        * [path.resources](#pathresources)
        * [exclude](#exclude)
        * [include](#include)
        * [components, componentStart, componentEnd, placeholderText](#components-componentstart-componentend-placeholdertext)
        * [applicationCSS](#applicationCSS)
	* [Optional Configuration Options](#optional-configuration-options)
	    * [styleguideTitle](#styleguidetitle)
	    * [styleguideDescription](#styleguidedescription)
	    * [sandboxCSS](#sandboxcss)
	    * [sections](#sections)
* [Adding Components](#adding-components)
* [Building The Styleguide](#building-the-styleguide)
    * [Build Options](#build-options)

## Set-up Steps

In your application's `package.json`, add the styleguide module to dependencies, e.g.

```js
"dependencies": {
	"shunter": "^1",
	"shunter-styleguide": "~1.0"
}
```

Add the module name to `config/local.json`, e.g.

```json
{
	"modules": ["shunter-styleguide"]
}
```

Run `npm install` from your application to add in the code

## Configuration

In order to build the styleguide you need to create a configuration file, e.g. `config/styleguide.json`. By default (without creating a config file) you get the following settings:

```js
{
	path: {
		templates: 'your-app-root/view',
		resources: 'your-app-root/resources'
	},
	exclude: {
		all: false,
		folders: [],
		files: []
	},
	include: {
		folders: [],
		files: []
	},
	components: [],
	componentStart: '{! componentStart-placeholder !}',
	componentEnd: '{! componentEnd !}',
	placeholderText: 'placeholder',
	css: 'main'
}
```

> You can see an example of the default and optional configurations by looking at the [Sample JSON](styleguide.sample.json) file.

### Default Configuration Options

You can overwrite the default options in your configuration file:

#### path.templates
This should be the location of your template (`.dust`) files. Within these templates you will specify your components.

#### path.resources
This should be the location of the assets for your site (css, javascript, images). This location will be used to link to your assets in order to display components in the styleguide.

#### exclude
By default we will traverse every file in your templates folder specified at `path.templates`, including sub-directories. By including the names of folders in the `folders` array, and files in the `files` array you can skip these items. e.g.

```js
exclude: {
	all: false,
	files: [
		'templatea.dust',
		'templateb.dust'
	],
	folders: [
		'foldera',
		'folderb'
	]
}
```

If you set `exclude.all` to `true`, then the files and folders arrays are ignored and EVERYTHING is ignored by default. You can then add individual files and folders using `include`.

#### include
Specify files and folders to include using the `files` and `folders` arrays, e.g.

```js
exclude: {
	all: true
}
include {
	files: [
		'templatea.dust',
		'templateb.dust'
	],
	folders: [
		'foldera',
		'folderb'
	]
}
```

In this example the two template files will be included, as will all templates in the two folders specified.

#### components, componentStart, componentEnd, placeholderText
These deal with marking up components and the data that goes with them. This is covered in the section [Adding Components](#adding-components).

#### applicationCSS
This is the name of your application CSS file without the extension or the fingerprint. e.g for the file `main-7ea4e129e237c230ca7de77c1b47d2f4.css` you would use `main`. This is used to generate information about your stylesheet, and also in the display of your components.

### Optional Configuration Options

#### styleguideTitle
Give your styleguide a title. Defaults to 'Styleguide'. Takes HTML markup.

```js
{
	styleguideTitle: 'optional <em>title</em> here'
}
```

#### styleguideDescription
A description to go underneath the main title. Takes HTML markup.

```js
{
	styleguideDescription: '<p>optional descripton</p>'
}
```

#### sandboxCSS
Components in the styleguide are sandboxed within an iframe that includes your app CSS. If you want to add additional CSS, add it here. For example, if you want to remove margin/padding from the body of the iframe you can.

```js
{
	sandboxCSS: 'body{background:#fff;}'
}
```

#### sections
Add custom sections to the styleguide using the following markup:

```js
sections: [
	{
	    id: 'section-id',
	    title: 'Title For Your Section',
	    items: [
	        {
	            title: 'Optional Item Title',
	            html: '<p>Some html to include</p><p>another paragraph</p>'
	        },
	        {
	            html: '<div class="grid-item"><span class="styleguide_item">text</span></div>',
	            sandboxed: true,
				snippetCode: '<div class="grid-item">text</div>',
	            snippet: true,
	            css: '.styleguide_item{padding:10px;}',
	            language: 'markup'
	        }
	    ]
	}
]
```

All sections must contain a unique `id`, a `title`, and one or more `items`. Each item can have an optional `title` (which will appear as a sub-heading) and some `html` to print out. Items can also contain the following:  

##### `sandboxed`
if this is `true` then the code in `html` will be sandboxed inside an iframe with your application CSS.

##### `snippetCode`
use this if you want to show the code but tweak it from what is in `html`.  

##### `snippet`
if this is `true` then the the code from `snippetCode` (or `html` if not provided) with be displayed.  

##### `css`
any additional css to be be passed to the iframe for sandboxed items.  

##### `language`
if using snippets you can specify the language, deaults to `markup` (html).

## Adding Components

The main aim of the Living Styleguide is to display the latest version of components from your website. You add components by wrapping your code in specific Dust comments. The format of these can be set in your config file, but by default they look like this:

```js
{
	componentStart: '{! componentStart-placeholder !}',
	componentEnd: '{! componentEnd !}',
	placeholderText: 'placeholder'
}
```

Find the code snippet you wish to display within your template and wrap it with the `componentStart` and `componentEnd` tags. Make sure that in your config the value for `placeholderText` matches the text in `componentStart`. Then simply replace the word placeholder with a unique ID for your component. This might look something like this:

```html
{! componentStart-button !}
	<button type="button" class="default-button">{text}</button>
{! componentEnd !}
```

You now need to add some metadata and data about the component in the components section of your config. For the above example this might look something like:

```js
components: [
	{
		id: 'button',
		title: 'Default Button',
		description: '<p>This is a default button</p>',
		data: {
			text: 'Click Me!'
		}
	}
]
```

Each component needs to have an `ID` that matches value that you replaced the placeholder text with. You should also provide a `title` (HTML) and `description` (HTML) that will display alongside your component. If your component requires JSON data this should be provided within a `data` object.

## Building The Styleguide

Once you have marked up your components and set up your configuration file, you can build your styleguide. From the root of your Application run:

```
./node_modules/.bin/shunter-styleguide --c=config/styleguide.json
```

This will build the styleguide using the config found at `config/styleguide.json`. This process creates a `data/styleguide.json` file within the styleguide module that contains all data for the styleguide. An input filter then populates your template with this data if the JSON page request matches the following:

```js
{
	layout: {
		template: 'styleguide__layout'
	}
}
```

This looks for the `layout.dust` template within the `styleguide` namespace.

### Build Options

There are a number of configuration options you can pass when building:

##### `--c`
**config** Shown in the above example, this specifies the location of your config file. If nothing is passed the default config settings are used

##### `--v`
**verbose** Verbose output when logging to the command line if set to `true`. Defaults to `false`

##### `--d`
**data** Specify a location to save a sample data file. This will allow you to work on the styleguide locally

##### `--s`
**stylesheet** Specify your own CSS file for the styleguide. Will overwrite the one within this module

##### `--j`
**javascript** Specify your own Javascript file for the styleguide. Will overwrite the one within this module

Example of all the options:

```
./node_modules/.bin/shunter-styleguide --c=config/styleguide.json --v=true --d=data/styleguide --s=resources/css/styleguide.css --j=resources/js/styleguide.js
```

## Serving up the styleguide

In order to serve the styleguide on your website you will need to set up a [route in your application](https://github.com/nature/shunter/blob/master/docs/usage/routing.md#examples). Something like:

```js
{
    "www.example.com": {
        "/^\\/styleguide/": {
            "host": "styleguide.example.com",
            "port": 80
        }
    }
}
```

This should then be set up to return JSON in the following format:

```js
{
	layout: {
		template: 'styleguide__layout'
	}
}
```

## License

Styleguide is licensed under the [Lesser General Public License (LGPL-3.0)](LICENSE).  
Copyright &copy; 2016, ShunterJS
