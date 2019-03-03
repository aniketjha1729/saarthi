var socket = require('socket.io');
var hbs = require('hbs');
var express = require('express');

var mongoose = require("mongoose"),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');

// App setup
mongoose.connect("mongodb://ani4aniket:aniket1999@ds213255.mlab.com:13255/saarthi", { useNewUrlParser: true });


var app = express();
const port = process.env.PORT || 3000;


var server = app.listen(port, function () {
    console.log(`listening for requests on port ${port}`);
});

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'This is the secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/admin',isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
})

app.get('/login', (req, res) => {
    res.render(__dirname+'/public/login.hbs')
})



app.get('/register', (req, res) => {
    res.render(__dirname+'/public/register.hbs')
})

app.get('/users', (req, res) => {
    res.sendFile(__dirname + '/public/users.html');
})

app.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render(__dirname+'/public/register.hbs')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/admin');
        })
    });
});

// Signin routes
app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
}), (req, res) => {

});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};


// Static files
app.use(express.static('public'));

var io = socket(server);

// Socket setup & pass server
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('broadcast', function (data) {
        console.log("data from server socket: ", data);
        io.sockets.emit('broadcast', data);
    });

    socket.on('broadcastMessage', function (data) {
        console.log("data from server socket: ", data);
        io.sockets.emit('broadcastMessage', data);
    });
});
