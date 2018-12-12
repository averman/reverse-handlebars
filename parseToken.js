module.exports = function(template){
    let remaining = template;
    let tokens = [];
    let textStack = [];
    let escapeStack = [];
    let closeStack = [];
    let escapeEnd = false;
    let tokenEnding = false;
    let i = 0;
    let range=[0,-1];
    while(remaining.length > 0){
        let c = remaining.charAt(0);
        range[1]++
        if(closeStack.length==0){
            if(c=='{'){
                if(textStack.length>0){
                    const text = textStack.join('');
                    tokens.push(['text',text]);
                    range = [range[1]+1,range[1]];
                    textStack = [];
                }
                closeStack.push('}');
            }else{
                textStack.push(c);
            }
        }else{
            if(c!='{' && closeStack.length==1 && !tokenEnding){
                closeStack.pop();
                textStack.push('{');
                textStack.push(c);
            } else if(c==closeStack[closeStack.length-1]){
                closeStack.pop();
                if(closeStack.length==0){
                    const text = textStack.join('').trim();
                    let esc = escapeStack.join('').trim();
                    if(esc == '')esc='var';
                    tokens.push([esc,text]);
                    range = [range[1]+1,range[1]];
                    textStack = [];
                    escapeStack = [];
                    closeStack = [];
                    tokenEnding=false;
                    escapeEnd=false;
                }else{
                    if(!tokenEnding)
                        tokenEnding=true;
                }
            }else{
                if(!escapeEnd){
                    switch (c) {
                        case '{':
                            if(escapeStack.length==0)
                                closeStack.push('}');
                            else throw new Error('unexpected token { at '+range[1]+' near '+remaining.substr(0,10)+'...')
                            break;
                        case ' ': 
                            escapeEnd = true;
                            break;
                        
                        default:
                            if(escapeStack.length==0 && !(c=='#' || c=='/') ){
                                escapeEnd = true;
                                textStack.push(c);
                            }else
                                escapeStack.push(c);
                    }
                    
                }else{
                    if(tokenEnding) throw new Error('expected token '+closeStack.pop()+' at '+range[1]+' near '+remaining.substr(0,10)+'...')
                    if(c=='{')throw new Error('unexpected token { at '+range[1]+' near '+remaining)
                    textStack.push(c);
                }
            }
        }
        remaining=remaining.substr(1);
        i++;
    }
    if(closeStack.length == 0){
        if( textStack.length>0){
            const text = textStack.join('');
            tokens.push(['text',text,range[0]]);
            range = [range[1]+1,range[1]];
        }
    }
    else if(tokenEnding) throw new Error('expected token '+closeStack.pop()+' at '+range[1]+' (at the end) ')
    i=0;
    while(i<tokens.length-1){
        if(tokens[i][0] == 'text' && tokens[i+1][0]=='text'){
            tokens[i][1] += tokens[i+1][1];
            // tokens[i][3] += tokens[i+1][1].length;
            for(let j=i+1; j<tokens.length-1; j++)
                tokens[j]=tokens[j+1];
            tokens.pop();
        }else
            i++;
    }
    let tokenStack = [];
    let result = [];
    //prepare tokenization
    while(tokens.length>0){
        const token = tokens[0]; // [type, varname, parent, [children]]
        if(tokenStack.length == 0){
            token.push(null);
            result.push(token);
        }else{ 
            token.push(tokenStack[tokenStack.length - 1]);
            tokenStack[tokenStack.length-1][3].push(token);
        }
        if(token[0].startsWith('#')){
            token.push([]);
            tokenStack.push(token);
        }else if(token[0].startsWith('/')){
            let tkn = tokenStack.pop();
            if(tkn[0].substr(1) != token[0].substr(1))
                throw new Error('unexpected '+token[0]+' expect: /'+tkn[0].substr(1));
        }
        tokens.shift();
    }
    if(tokenStack > 0)
        throw new Error('unterminated block '+tokenStack.pop());
    return result;
}
