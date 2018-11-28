var assert = require('assert');
var parseToken = require('../parseToken');
var loader = require("./fileLoader.js")

describe('Parser', function() {
  
  const datas = {
    template1 : "./test/test_template_1.hbs",
    template1_n1 : "./test/test_template_1_n1.hbs",
    template1_n2 : "./test/test_template_1_n2.hbs",
    token1: './test/test_template_token_1.json',
  }
      
  var beforeVar = {};
  before(function(done){
    const load = loader(beforeVar,done);
    load(Object.values(datas),Object.keys(datas));
  });
  
  describe('Parsing token from template', function() {
    
    it('should get the correct tokens from test template files', function() {
      const parsedData = parseToken(beforeVar.template1);
      assert.equal(JSON.stringify(parsedData),beforeVar.token1);
    });
    
  });
  describe('negative test Template Test-case 1', function() {
    
    it('should get the correct throws from negative test template files', function() {
      assert.throws(()=>parseToken(beforeVar.template1_n1),/unexpected token { at .*/);
      assert.throws(()=>parseToken(beforeVar.template1_n2), /expected token } at/);
    });
    
  });
  
  
  
});