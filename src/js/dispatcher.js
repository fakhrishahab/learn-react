var flux = require('flux'),
	dispatcher = module.exports = new flux.Dispatcher();

dispatcher.register(function(action){
	console.log(action)
})