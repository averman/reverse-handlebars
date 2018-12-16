const parseToken = require("./parseToken");
const Helpers = require("./helpers");
const resolve = require("./resolveBlock")
const utils = require("./utils.js")
const handlebars = require("handlebars");
const flatten = require('flat');
const changeCase = require("change-case"); 

const def = {	
    camelCase: [changeCase.camel,changeCase.camel],
	snakeCase: [changeCase.camel,changeCase.snake],
	dotCase: [changeCase.camel,changeCase.dot],
	pathCase: [changeCase.camel,changeCase.path],
	lowerCase: [changeCase.camel,changeCase.lower],
	upperCase: [changeCase.camel,changeCase.upper],
	sentenceCase: [changeCase.camel,changeCase.sentence],
	constantCase: [changeCase.camel,changeCase.constant],
	titleCase: [changeCase.camel,changeCase.title],
	dashCase: [changeCase.camel,changeCase.dash],
	kabobCase: [changeCase.camel,changeCase.kebab],
	kebabCase: [changeCase.camel,changeCase.kebab],
	properCase: [changeCase.camel,changeCase.proper],
	pascalCase: [changeCase.camel,changeCase.pascal]
}

let handlePlus = { 
    reverse: function(template,content){
        let tokens = parseToken(template);
        let result = {};
        let tempRes = this.resolve(tokens, content, Helpers.get('null',null));
        for(var n of tempRes){
            var keys = n[0].split(' ');
            n[0] = keys.pop();
            utils.assignTo(result,n[0],n[1])
        }
        utils.convertArray(result);
        return result;
    },
    resolve: resolve,
    helpers: Helpers,
    checkPreq: function(data,preq){
        const prqs = flatten(preq);
        const d = Object.assign({},data);
        const res = {};
        for(const p in prqs){
            let posd = data;
            for(const i of p.split('.')){
                if(posd[i])posd=posd[i];
                else{
                    res[p]=prqs[p];
                }
            }
        }
        return res;
    },
    apply: function(template,data,preq){
        let allowed = true;
        if(preq){
            let uns = this.checkPreq(data,preq);
            uns = flatten.unflatten(uns);
            if(JSON.stringify(uns)!='{}')
                allowed=false;
        }
        if(allowed)
            return handlebars.compile(template)(data);
        throw new Error('prerequisite not statisfied');
    },
    registerHelper: function(helper){
        handlebars.registerHelper(helper.helperName, helper.handlebars)
        this.helpers.add(helper);
    },
    registerPartial: function(name, template){
        const partial = {
            helperName: name,
            template: template
        }
        handlebars.registerPartial(partial.helperName, partial.template);
        partial.tokens = parseToken(partial.template);
        this.helpers.add(partial);
    }
}

const b64helper = {
    helperName: 'b64',
    map: function(x){
        return Buffer.from(x.toString()).toString('base64')
    },
    handlebars: function(x){
        return Buffer.from(x.toString(),'base64').toString('ascii')
    }
}
handlePlus.registerHelper(b64helper);
Object.keys(def).map(k=>{
    handlePlus.registerHelper( { helperName: k, map: def[k][0], handlebars: def[k][1]} )
})

module.exports = handlePlus;

