

const assignTo = function(obj, key, value){
    let keys = key.split('.');
    while(keys.length>0){
        let ckey = keys.shift();
        if(keys.length == 0){
            if(obj[ckey]){
                if(obj[ckey] != value) throw new Error('inconsistent result on '+key+': '+obj[ckey]+' != '+value);
            }else{
                obj[ckey] = value;
            }
        }else{
            if(obj[ckey]){
                obj = obj[ckey];
            }else{
                // if(Number.isNaN(Number.parseInt(ckey)))
                //     obj[ckey] = {};
                // else
                //     obj[ckey] = [];
                obj[ckey] = {};
                obj = obj[ckey];
            }
        }
    }
}

const convertArray = function(obj){
    for(let oi in obj){
        if(typeof obj[oi]!='object')continue;
        const oKey = Object.keys(obj[oi]);
        let isArray = true;
        for(let i =0; i<oKey.length; i++)if(i != oKey[i])isArray = false;
        if(isArray){
            const temp = obj[oi];
            obj[oi]=[];
            for(let k of oKey)obj[oi][k]=temp[k];
        }
        convertArray(obj[oi]);
    }
}

module.exports = {
    assignTo: assignTo,
    convertArray: convertArray
}