var action = require('./action');

Object.keys(action).forEach(function(key){
	console.log(key);
	console.log(action[key].toString());
})