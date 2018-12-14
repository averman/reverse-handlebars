const parseToken = require("./parseToken");
const Helpers = require("./helpers");
const resolve = require("./resolveBlock")
const utils = require("./utils.js")
const handlebars = require("handlebars");
const flatten = require('flat');

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

module.exports = handlePlus;

