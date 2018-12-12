var assert = require('assert');
var hbp = require('../index');
var loader = require("./fileLoader.js")
var handlebars = require("handlebars");
var changeCase = require('change-case');

var helpers = {
	camelCase: changeCase.camel,
	snakeCase: changeCase.snake,
	dotCase: changeCase.dot,
	pathCase: changeCase.path,
	lowerCase: changeCase.lower,
	upperCase: changeCase.upper,
	sentenceCase: changeCase.sentence,
	constantCase: changeCase.constant,
	titleCase: changeCase.title,

	dashCase: changeCase.param,
	kabobCase: changeCase.param,
	kebabCase: changeCase.param,

	properCase: changeCase.pascal,
	pascalCase: changeCase.pascal
};

handlebars.registerHelper(helpers);

describe('Reverse Handle', function() {
  
  const datas = {
    template1 : "./test/templates/test_template_1.hbs",
    with1: './test/templates/with.hbs',
    with2: './test/templates/with2.hbs',
    each1: './test/templates/each.hbs',
    part: './test/templates/partials.hbs'
  }
      
  var beforeVar = {
  };
  before(function(done){
    const load = loader(beforeVar,done);
    load(Object.values(datas),Object.keys(datas));
  });
  
  describe('Reversing the handlebars', function() {
    
    it('should get the correct data from content files, case 1: standard var and if', function() {
      let data1= {
        wantHeaders: true,
        wantMessages: true,
        type: 'React.Component',
        name: 'test'
      }
      const content = hbp.apply(beforeVar.template1,data1);
      const data = hbp.reverse(beforeVar.template1, content);
      assert.deepStrictEqual(data,data1);
    });
    
    it('should get the correct data from content files, case 2: negative if', function() {
      let data1= {
        wantHeaders: false,
        wantMessages: true,
        type: 'React.Component',
        name: 'test'
      }
      const content = hbp.apply(beforeVar.template1,data1);
      const data = hbp.reverse(beforeVar.template1, content);
      assert.deepStrictEqual(data,data1);
    });
    
    it('should get the correct data from content files, case 3: with', function() {
      let data1= {
        title: 'Title',
        story: {
          intro: 'intro_1',
          body: {
            header: 'HEADER',
            content: 'content here'
          },
          flag: true
        }
      }
      const content = hbp.apply(beforeVar.with1,data1);
      const data = hbp.reverse(beforeVar.with1, content);
      assert.deepStrictEqual(data,data1);
    });
    
    it('should get the correct data from content files, case 4: each', function() {
      let data1= {
        data:[
          {
            footer: 'test footer',
            columns: {
              x: "a",
              y: 'test',
              z: 'z'
            }
          },
          {
            footer: 'test footer1',
            columns: {
              x: "b",
              y: "c",
              z: 'asf'
            }
          },
          {
            footer: 'test footer2',
            columns: {
              x: 'a',
              y: "d",
              z: "c"
            }
          }
        ]
      }
      const content = hbp.apply(beforeVar.each1,data1);
      const data = hbp.reverse(beforeVar.each1, content);
      assert.deepStrictEqual(data,data1);
    });
    
    it('should get the correct data from content files, case 5: custom helpers', function() {
      let data1= {
        title: 'Title',
        story: {
          intro: 'intro_1',
          body: {
            header: 'HEADER',
            content: 'content here'
          }
        }
      }
      const headerHelper = {
        helperName: 'header',
        handlebars: v=>'<h1>'+v+'</h1>',
        map: v=>v.substr(4,v.length-9)
      }
      hbp.registerHelper(headerHelper);
      const content = hbp.apply(beforeVar.with2, data1);
      const data = hbp.reverse(beforeVar.with2, content);
      assert.deepStrictEqual(data,data1);
    });
    
    it('should get the correct data from content files, case 6: partials', function() {
      let data1= {
        test : {
          testParam2: 'b'
        }
      }
      const partial = '### {{testParam1}} @@@ {{testParam2}} $$$';
      hbp.registerPartial('testPartial',partial);
      const content = hbp.apply(beforeVar.part, data1);
      // console.log(content);
      const data = hbp.reverse(beforeVar.part, content);
      assert.deepStrictEqual(data,data1);
    });
    
  });
  
});