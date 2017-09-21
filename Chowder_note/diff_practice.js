var el = require('./diff');

console.log(element);

var ul = el('ul',{id:'list'},[
    el('li',{class:'item'},['item 1']),
    el('li',{class:'item'},['item 2']),
    el('li',{class:'item'},['item 3'])
])

console.log(el)