var passport = require('passport'),
	LocalStrategy = require('passport-local'),
	LocallyDB = require('locallydb'),
	db = new LocallyDB('./.data'),
	users = db.collection('users'),
	crypto = require('crypto'),
	bodyParser = require('body-parser');

function hash (password) {
	return crypto.createHash('sha512').update(password).digest('hex')
}

passport.use(new LocalStrategy(function(username, password, done){

	var user = users.where({username : username, passwordHash : hash(password)}).items[0];

	if(user){
		done(null, user)
	}else{
		done(null, false)
	}

}))

passport.serializeUser(function(user, done){
	done(null, user.cid)
})

passport.deserializeUser(function(cid, done){
	done(null, users.get(cid))
})

var router = require('express').Router()

router.use(bodyParser.urlencoded({extended : true})); // Login
router.use(bodyParser.json()); // API
router.use(require('cookie-parser')());
router.use(require('express-session')({
	secret : '12984hjfadsohu13894ywehjuhfds9814aslj38sd97fysd7g6',
	resave : false,
	saveUninitialized: true
}))
router.use(passport.initialize())
router.use(passport.session())

router.get('/login', function(req, res){
	res.render('login', { title: 'Zeeza :: Login', message: 'Please Login'})
})

exports.routes = router;