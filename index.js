const parseToken = require("./parseToken");
const Helpers = require("./helpers");
const resolve = require("./resolveBlock")
const utils = require("./utils.js")
const handlebars = require("handlebars");

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
    apply: function(template,data){
        return handlebars.compile(template)(data);
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

