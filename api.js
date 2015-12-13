var router = module.exports = require('express').Router(),
	login = require('./login'),
	db = new (require('locallydb'))('./.data'),
	accounts = db.collection('accounts');


router.route('/api/account')
	.all(login.required)
	.get(function(req, res){
		res.json(account.toArray())
	})
	.post(function(req, res){
		var account = req.body;
		account.userId = req.user.id;

		account.fullname = req.user.fullname;
		account.username = req.user.username;
		account.email = req.user.email;

		var id = accounts.insert(account);
		res.json(accounts.get(id))

	})