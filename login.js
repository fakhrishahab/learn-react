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
});

router.post('/signup', function(req, res, next){
	if(users.where({username : req.body.username}).items.length === 0){
		// THERE IS NO USER IN DATABASE
		var user = {
			fullname : req.body.fullname,
			email : req.body.email,
			username : req.body.username,
			passwordHash : hash(req.body.password),
			following : []
		}

		var userId = users.insert(user)

		req.login(users.get(userId), function(err){
			if(err) return next(err)
				res.redirect('/')
		});
	}else{
		// USER IS EXIST
		res.redirect('/login')
	}

})

router.post('/login', passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login'
}))

router.get('/logout', function(req, res){
	req.logout();
	req.redirect('/login')
})

function loginRequired(req, res, next){
	if(req.isAuthenticated()){
		next()
	}else{
		res.redirect('/login')
	}
}

function makeUserSafe(user){
	var safeUser = {};

	var safeKeys = ['cid', 'fullname', 'email', 'username', 'following'];

	safeKeys.forEach(function(key){
		safeUser[key] = user[key];
	});
	return safeUser;
}

exports.routes = router;
exports.required = loginRequired;
exports.safe = makeUserSafe;