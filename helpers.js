

const Helpers = {
    items: {},
    add: function(helper){
        this.items[helper.helperName] = helper;  
    },
    get: function(helperName, varname,current){
        if(!this.items[helperName]) return this.get('null',varname);
        let res = Object.assign({},this.items[helperName]);
        if(current)res.path = current.path;
        else res.path='';
        res.addPath = function(key){return (this.path.length>0?this.path+'.':'')+key;};
        res.varname = varname;
        if(res && res.chain)res.chain();
        return res;
    }
}

const nullHelper = {
    helperName: 'null',
    varFound: function(r,n,v){
        r.push([this.addPath(n),v]);
    }
    // textFound(result, text)
    // textNotFound(result, text)
    // varFound(result, name, value)
    // chain(newHelper)
    // init(tokens, content, context)
    // end(tokens, content, result, context)
    // map(value)
}

const ifHelper = {
    helperName: 'if',
    value: true,
    textFound: function(r,t){
        r.push([this.addPath(this.varname),true]);
    },
    textNotFound: function(r,t){
        this.value = false;
        r.push([this.addPath(this.varname),false]);
    },
    varFound: function(r,n,v){
        if(this.value){
            r.push([this.addPath(this.varname),true]);
            r.push([this.addPath(n),v]);
        }
    }
}

const withHelper = {
    helperName: 'with',
    varFound: function(r,n,v){
        r.push([this.addPath(n),v]);
    },
    chain: function(){
        this.path = this.addPath(this.varname);
    }
}

const eachHelper = {
    helperName: 'each',
    varFound: function(r,n,v){
        r.push([this.addPath(n),v]);
    },
    chain: function(){
        this.path = this.addPath(this.varname);
    },
    idx: 0,
    init: function(tokens, content, ctx){
        if(!this.basepath){
            this.basepath = this.path;
            this.path = this.addPath(this.idx);
        }
        this.tokens = Array.from(tokens);
    },
    end: function(tokens, remaining, result, ctx){
        if(remaining.trim().length>0){
            this.idx++;
            this.path = this.basepath;
            this.path = this.addPath(this.idx);
            // console.log('%%%%'+this.idx);
            // console.log(remaining);
            let res = result.concat(ctx.resolve(this.tokens,remaining,this));
            // console.log('%%'+this.idx);
            // console.log(res);
            return res;
        }
        return result
    }
}

Helpers.add(nullHelper);
Helpers.add(ifHelper);
Helpers.add(withHelper);
Helpers.add(eachHelper);

// console.log(Helpers.items);

module.exports = Helpers;