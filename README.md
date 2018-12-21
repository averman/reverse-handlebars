# REVERSIBLE HANDLEBARS

Library for extracting data from a file and a handlebars template

### Installation
```bash
npm install --save reversible-handlebars
```
### Usage
you can use vanilla handlebarsjs with apply function, and the reverse with reverese function
```javascript
const reversibleHandlebars = require("reversible-handlebars");
const template = "test {{value}} reverse";
const content = reversibleHandlebars.apply(template,{value:"handlebars"});
reversibleHandlebars.reverse(template,content); //{value:"handlebars"}
```

### Helpers 

Reversible handlebars support standard handlebarsjs helper and add some more helper to the default such as changecase. Reversible handlebars also support custom helper to certain extent, by calling registerHelper function
```javascript
const b64helper = {
    helperName: 'b64',
    //reverse function from content to data called by reverse
    map: function(x){
        return Buffer.from(x.toString()).toString('base64')
    },
    //function to register to handlebars
    handlebars: function(x){
        return Buffer.from(x.toString(),'base64').toString('ascii')
    }
}
reversibleHandlebars.registerHelper(b64helper);
```

### Block Helpers
Reversible handlebars support standard handlebarsjs block helper such as with, if, and each. Reversible handlebars also support custom block helper to certain extent, with the caveat that the reverse block mechanism is given. You can register new block helper by calling registerHelper function

example of with block helper:

```javascript
const withHelper = {
    helperName: 'with',
    //this function is called when 
    //a variable found (non helper/partial)
    varFound: function(result,name,value){
        result.push([this.addPath(name),value]);
    },
    //this function is called when 
    //a block helper instatiated to 
    //change default data path
    chain: function(){
        this.path = this.addPath(this.varname);
    },
    //function to register to handlebars
    handlebars: function(context, options) {
        return options.fn(context);
    }
}
reversibleHandlebars.registerHelper(withHelper);
```

### Partials
Reversible handlebars also support partials and called with registerPartial function
```javascript
reversibleHandlebars.registerPartial('testPartial','test {{value}}');
const template = "partial {{> testPartial}} test";
const content = reversibleHandlebars.apply(template,{value:"handlebars"});
//partial test handlebars test
reversibleHandlebars.reverse(template,content); 
//{value:"handlebars"}
```