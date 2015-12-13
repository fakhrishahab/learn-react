var express = require('express'),
	app = express(),
	router = express.Router(),
	fs = require('fs'),
	login = require('./login');

module.exports = {	
	listenServer : function(){		
		app			
			.set('view engine', 'ejs')
			.use(express.static('./public'))
			.use(login.routes)
			.use(require('./api'))
			.use('*', login.required, function(req, res, next){
				res.render('index', { 
					title: 'Zeeza', 
					message: 'Baby Warehouse Online Store',
					user : login.safe(req.user)
				})
			})
			// .use('/', router)			
			.listen(3000, function(){
				console.log('listening on port 3000')
			})

		// router.get('*',  function(req, res, next){
		// 	res.render('index', { 
		// 		title: 'Zeeza :: Home', 
		// 		message: 'Baby Warehouse Online Store'
		// 	})
		// })
		router.use('/about/:id', function(req, res, next){
			res.send(req.params.id)
		})
		
	}
}