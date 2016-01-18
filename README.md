# Styleguide
A Living Styleguide Module for your Shunter Application

## Table Of Contents

* [Set-up Steps](#set-up-steps)
* [Configuration](#configuration)
    * [Default Configuration Options](#default-configuration-options)
        * [path.templates](#pathtemplates)
        * [path.resources](#pathresources)
        * [exclude](#exclude)
        * [include](#include)
        * [components, componentStart, componentEnd, placeholderText](#components-componentstart-componentend-placeholdertext)
        * [css](#css)
	* [Optional Configuration Options](#optional-configuration-options)
* [Adding Components](#adding-components)
    * [Marking Up The Templates](#marking-up-the-templates)
    * [Adding Component Data](#adding-component-data)
* [Adding Custom Sections](#adding-custom-sections)
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

In order to build the styleguide you need to create a configuration file, e.g. `config/styleguide.json`. By default you get the following settings

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

### Default Configuration Options

You can overwrite the default options in your configuration file.

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
These deal with marking up components and the data that goes with them. This is covered in the section "Adding Components"

#### css
This is the name of your CSS file without the extension or the fingerprint. e.g for the file `main-7ea4e129e237c230ca7de77c1b47d2f4.css` you would use `main`. This is used to generate information about your stylesheet, and also in the display of your components.

### Optional Configuration Options

## Adding Components

The main aim of the Living Styleguide

### Marking Up The Templates

### Adding Component Data

## Adding Custom Sections

## Building The Styleguide

### Build Options
