var assert = require('assert');
var reverse = require('../index');
var loader = require("./fileLoader.js")

describe('Reverse Handle', function() {
  
  const datas = {
    template1 : "./test/test_template_1.hbs",
    content1: './test/content_1.js.txt',
    content2: './test/content_2.js.txt',
  }
      
  var beforeVar = {};
  before(function(done){
    const load = loader(beforeVar,done);
    load(Object.values(datas),Object.keys(datas));
  });
  
  describe('Reversing the handlebars', function() {
    
    it('should get the correct data from content files, case 1: standard var and if', function() {
      const data = reverse({template: beforeVar.template1, content: beforeVar.content1});
      assert(data.wantHeaders);
      assert(data.wantMessages);
      assert.equal(data.name,"test");
      assert.equal(data.type, 'React.Component');
    });
    
    it('should get the correct data from content files, case 2: negative if', function() {
      const data = reverse({template: beforeVar.template1, content: beforeVar.content2});
      assert(!data.wantHeaders,"wantHeaders");
      assert(data.wantMessages,"wantMessages");
      assert.equal(data.name,"test");
      assert.equal(data.type, 'React.Component');
    });
    
  });
  
});