const changeCase = require("change-case");
const parseToken = require("./parseToken");

//TODO: existing var checking, loop

const def = {	
    camelCase: changeCase.camel,
	snakeCase: changeCase.camel,
	dotCase: changeCase.camel,
	pathCase: changeCase.camel,
	lowerCase: changeCase.camel,
	upperCase: changeCase.camel,
	sentenceCase: changeCase.camel,
	constantCase: changeCase.camel,
	titleCase: changeCase.camel,
	dashCase: changeCase.camel,
	kabobCase: changeCase.camel,
	kebabCase: changeCase.camel,
	properCase: changeCase.camel,
	pascalCase: changeCase.camel
}

function resolveToken(tokens, proposedValue, opts, result, fromText){
    const reverseHelper = Object.assign({},opts,def);
    const head = tokens[tokens.length-1]
    let value = proposedValue;
    switch (head[0]) {
        case 'var':
            let subtokens = head[1].split(' ');
            while(subtokens.length>1){
                let val = subtokens[subtokens.length-1];
                const mod = subtokens[subtokens.length-2];
                if(!reverseHelper[mod])throw new Error('unrecognized helper '+mod);
                subtokens[subtokens.length-2] = val;
                value = reverseHelper[mod](value);
                subtokens.pop();
            }
            result[subtokens[0]]=value;
            if(value.length>0 && tokens[tokens.length-2]=='#if'){
                const t = Array.from(tokens);
                t.pop();
                result = resolveToken(t,true,opts,result,false);
            }
            tokens.pop();
            return result
            
        case '#if':
            result[head[1]]=fromText;
            if(tokens[tokens.length-2]=='#if'){
                const t = Array.from(tokens);
                t.pop();
                result = resolveToken(t,true,opts,result,false);
            }
            return result;
            
        case '#%#if':
            result[tokens[tokens.length-1][1]] = proposedValue;
            tokens.pop();
            return result;
        
        default:
            return result;
    }
}

module.exports = function(opts){
    let template = opts.template;
    let content = opts.content;
    let tokens = parseToken(template);
    let remaining = content;
    let tokenStack = [];
    let result = {};
    let ghostingFlag = undefined;
    while(tokens.length>0){
        const token = tokens[0];
        // console.log('######\n######\n######\n######\n######\n');
        // console.log(token);
        // console.log('############');
        // console.log(tokenStack);
        // console.log('@@@@@@@@@@@@');
        // console.log([remaining]);
        // console.log(result);
        
        if(ghostingFlag && token[0] != ghostingFlag) {
            tokens.shift();
            continue;
        }else ghostingFlag = undefined;
        
        switch (token[0]) {
            case 'text':
                let k = remaining.indexOf(token[1].trim());
                if(k<0){
                    if(tokenStack[tokenStack.length-1][0]=='#if'){
                        tokenStack.push(['#%#if']);
                        result = resolveToken(tokenStack,false,opts.inverseHelper,result,true);
                        ghostingFlag = '/if';
                        continue;
                    }else
                        throw new Error('text not found: '+token[1]);
                }
                let b = remaining.substring(0,k);
                // console.log('>>>>>>>>>'+k);
                if(b.trim().length>0){
                    const proposedValue = b.trim();
                    if(tokenStack.length == 0)throw new Error('unmatched string '+proposedValue+'\n\n with : '+token[1]);
                    result = resolveToken(tokenStack,proposedValue,opts.inverseHelper,result,true);
                    remaining = remaining.substr(k+token[1].trim().length);
                }else{
                    if(tokenStack.length==0){
                    }else{
                        result = resolveToken(tokenStack,'',opts.inverseHelper,result,true);
                    }
                    remaining = remaining.substr(k+token[1].trim().length);
                }
                tokens.shift();
                break;
                
            case 'var':
                tokenStack.push(token);
                tokens.shift();
                break;
                
            case '#if':
                tokenStack.push(token);
                tokens.shift();
                break;
                
            case '/if':
                const head = tokenStack.pop();
                if(head[0]!='#if')throw new Error('unexpected token /if... remaining: '+remaining);
                tokens.shift();
                break;
            
            default:
                throw new Error('unknown token '+token[0]);
        }
    }
    return result;
}

