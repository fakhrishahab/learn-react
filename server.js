var express = require('express'),
	app = express(),
	router = express.Router(),
	fs = require('fs'),
	login = require('./login');

module.exports = {	
	listenServer : function(){		
		app
			.engine('ejs',  function(path, options, callback){
				fs.readFile(path, function(err, content){
					if (err) return callback(new Error(err));	
					// console.log(content.toString())			
					var rendered = content.toString().replace('#title#', '<title>'+ options.title +'</title>')
				    .replace('#message#', options.message);
				    return callback(null, rendered);
				})
			})
			.set('view engine', 'ejs')
			.use(express.static('public'))
			.use(login.routes)
			.use('/', router)			
			.listen(3000, function(){
				console.log('listening on port 3000')
			})

		router.use('/', function(req, res, next){
			res.render('index', { title: 'Zeeza :: Home', message: 'Baby Warehouse Online Store'})
		})
		router.use('/about/:id', function(req, res, next){
			res.send(req.params.id)
		})
		
	}
}