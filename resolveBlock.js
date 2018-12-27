
function resolveBlock(tokens, content, helper){
    helper = helper || this.helpers.get('null',null);
    let result = [];
    let remaining = content;
    let tokenStack = [];
    let tokenIdx = 0;
    let done = false;
    if(helper.init)helper.init(tokens, content, this);
    while(!done){
        let token = tokens[tokenIdx];
        if(tokenIdx>=tokens.length && tokenStack.length>0){
            token=['text',''];
        }
        if(token[0] == 'text'){
            let k = tokenIdx<tokens.length?remaining.indexOf(token[1].trim()):remaining.length;
            if(k<0){
                if(helper.textNotFound)helper.textNotFound(result, token[1].trim(),remaining);
                else throw new Error('text not found: '+token[1]);
            }else{
                let b = remaining.substring(0,k);
                let proposedValue = b.trim();
                if(tokenStack.length == 0){
                    if(proposedValue.length > 0)
                        throw new Error('unmatched string '+proposedValue+'\n\n with : '+token[1]);
                    if(helper.textFound)helper.textFound(result, token[1].trim());
                }else{
                    let ts = tokenStack.pop();
                    if(ts[0]=='var'){
                        let keys =ts[1].split(' ');
                        if(keys.length>1 && keys[0]=='>'){
                            keys.shift();
                            const partialName = keys.shift();
                            let additional = {};
                            for(let v of keys){
                                const d = v.split('=');
                                additional[d[0]]=eval(d[1]);
                            }
                            let tokens2 = this.helpers.get(partialName,'').tokens;
                            let tempres = this.resolve(tokens2,proposedValue);
                            for(let r of tempres){
                                if(additional[r[0]]){
                                    if(additional[r[0]]!=r[1]) throw new Error('unmatched static variables: '+additional[r[0]]+' != '+r[1]);
                                }else
                                    result.push([helper.addPath(r[0]),r[1]]);
                            }
                        }else{
                            if(keys.length>1 && this.helpers.get(keys[0])){
                                proposedValue = this.helpers.get(keys.shift()).map(proposedValue);
                                ts[1]=keys.join(' ');
                            }
                            if(helper.varFound)helper.varFound(result, ts[1], proposedValue);
                        }
                    }else{
                        if(ts[0].charAt(0) == '/'){
                            
                        }else{
                            let newHelper = this.helpers.get(ts[0].substr(1),ts[1],helper);
                            let blockResult = this.resolve(ts[3],proposedValue,newHelper);
                            result = result.concat( blockResult ); 
                        }
                    }
                }
            }
            if(tokenIdx<tokens.length)
                remaining = remaining.substr(k+token[1].trim().length);
        }else{
            tokenStack.push(token);
        }
        tokenIdx++;
        // console.log(tokenIdx);
        // console.log(tokens.length);
        // console.log(tokenStack);
        if(tokenIdx>=tokens.length && tokenStack.length==0){
            done=true;
            // console.log('DONE!')
        }
    }
    // console.log("with helper : "+helper.helperName+" >>>> "+helper.varname);
    // console.log(remaining);
    if(helper.end)result = helper.end(tokens, remaining, result, this);
    // console.log("with helper : "+helper.helperName+" >> "+helper.varname);
    // console.log(result);
    return result;
}

module.exports = resolveBlock;