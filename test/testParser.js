var assert = require('assert');
var parseToken = require('../parseToken');
var loader = require("./fileLoader.js");
var fs = require("fs");

describe('Parser', function() {
  
  const datas = {
    template1 : "./test/templates/test_template_1.hbs",
    template1_n1 : "./test/templates/test_template_1_n1.hbs",
    template1_n2 : "./test/templates/test_template_1_n2.hbs",
    with1: './test/templates/with.hbs',
  }
      
  var beforeVar = {};
  before(function(done){
    const load = loader(beforeVar,done);
    load(Object.values(datas),Object.keys(datas));
  });
  
  describe('Parsing token from template', function() {
    
    it('should get the correct tokens from test template files', function() {
      const parsedData = parseToken(beforeVar.template1);
      let tokens = [
        'text','var','text','#if','text','#if','text','var','text','var','text','#if','text',
        '#if','text','var','text','var','text','var','text'
      ];
      let tokenchilds = {
        3: [ 'text', '/if' ],
        5: [ 'text', '/if' ],
        11: [ 'text','var','text','var','text', '/if' ],
        13: [ 'text', '/if' ],
        };
      for(let i in tokens)
        assert.equal(parsedData[i][0],tokens[i]);
      for(let i in tokenchilds)
        for(let j in tokenchilds[i])
          assert.equal(parsedData[i][3][j][0],tokenchilds[i][j]);
    });
    
  });
  describe('negative test Template Test-case 1', function() {
    
    it('should get the correct throws from negative test template files', function() {
      assert.throws(()=>parseToken(beforeVar.template1_n1),/unexpected token { at .*/);
      assert.throws(()=>parseToken(beforeVar.template1_n2), /expected token } at/);
    });
    
  });
  
  describe('Parsing token from template: with', function() {
    
    it('should get the correct tokens from test template files', function() {
      const parsedData = parseToken(beforeVar.with1);
      let tokens = [
        'text','var','text','#with','text'
      ];
      for(let i in tokens)
        assert.equal(parsedData[i][0],tokens[i]);
    });
    
  });
  
  describe('Parsing token from template: with', function() {
    
    it('should get the correct tokens from test template files', function() {
      const parsedData = parseToken(beforeVar.with1);
      let tokens = [
        'text','var','text','#with','text'
      ];
      for(let i in tokens)
        assert.equal(parsedData[i][0],tokens[i]);
    });
    
  });
  
  
  
});