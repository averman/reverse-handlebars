const parseToken = require("./parseToken");
const Helpers = require("./helpers");
const resolve = require("./resolveBlock")
const utils = require("./utils.js")

let reverseHandle = { 
    reverse: function(opts){
        let tokens = parseToken(opts.template);
        let result = {};
        let tempRes = this.resolve(tokens, opts.content, Helpers.get('null',null));
        for(var n of tempRes){
            var keys = n[0].split(' ');
            n[0] = keys.pop();
            utils.assignTo(result,n[0],n[1])
        }
        utils.convertArray(result);
        return result;
    },
    resolve: resolve,
    helpers: Helpers
}

module.exports = reverseHandle;

