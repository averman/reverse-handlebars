var assert = require('assert');
var reverse = require('../index');
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
    each1: './test/templates/each.hbs'
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
      const template = handlebars.compile(beforeVar.template1);
      const content = template(data1);
      const data = reverse.reverse({template: beforeVar.template1, content: content});
      assert.deepStrictEqual(data1,data);
    });
    
    it('should get the correct data from content files, case 2: negative if', function() {
      let data1= {
        wantHeaders: false,
        wantMessages: true,
        type: 'React.Component',
        name: 'test'
      }
      const template = handlebars.compile(beforeVar.template1);
      const content = template(data1);
      const data = reverse.reverse({template: beforeVar.template1, content: content});
      assert.deepStrictEqual(data1,data);
    });
    
    it('should get the correct data from content files, case 2: with', function() {
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
      const template = handlebars.compile(beforeVar.with1);
      const content = template(data1);
      const data = reverse.reverse({template: beforeVar.with1, content: content});
      assert.deepStrictEqual(data1,data);
    });
    
    it('should get the correct data from content files, case 2: each', function() {
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
      const template = handlebars.compile(beforeVar.each1);
      const content = template(data1);
      const data = reverse.reverse({template: beforeVar.each1, content: content});
      assert.deepStrictEqual(data1,data);
    });
    
  });
  
});