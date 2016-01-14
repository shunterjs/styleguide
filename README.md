# styleguide
A Living Styleguide Module for your Shunter Application

Set-up Steps
------------
1. In your application's `package.json`, add the styleguide module to dependencies, e.g.
```js
"dependencies": {
	"shunter": "^1",
	"shunter-styleguide": "~1.0"
},
```
2. Add the module name to `config/local.json`, e.g.
```json
{
	"modules": ["shunter-styleguide"]
}
```
3. Run `npm install` to add in the code
