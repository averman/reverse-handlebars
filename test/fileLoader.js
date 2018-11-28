module.exports = function (res,done){
    function load(fn,name){
        const fs = require('fs');
        if(Array.isArray(fn) && fn.length>1){
            fs.readFile(fn[0], 'utf8', function(err, data) {
                if (err) throw err;
                res[name[0]]=data;
                if(fn.length==2) load(fn[1],name[1])
                else{
                    fn.shift();
                    name.shift();
                    load(fn,name);
                }
            });
        }else{
            fs.readFile(fn, 'utf8', function(err, data) {
                if (err) throw err;
                res[name]=data;
                done();
            });
        }
    }
    return load;
}
