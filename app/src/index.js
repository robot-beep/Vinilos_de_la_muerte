const express = require('express');
const path = require('path');
const engine= require('ejs-mate');
const flash = require('connect-flash');
var bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');


// Intializations
const app = express();
require('./database');
require('./passport/local-auth');

//Configuraciones / Settings
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //donde esta la carpeta views
app.engine('ejs',engine);
app.set('view engine', 'ejs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'reyneta',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  //console.log(app.locals)
  next();
});


//Routes
app.use('/', require('./routes/inicio'));
app.use('/', require('./routes/productos'));
app.use('/', require('./routes/usuarios'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto :',app.get('port'))
  });


