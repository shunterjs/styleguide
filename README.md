# Styleguide
A Living Styleguide Module for your Shunter Application

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
```json
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
