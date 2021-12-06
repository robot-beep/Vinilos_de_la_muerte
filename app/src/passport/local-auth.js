const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/usuarios');

//1
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
//1
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });





//signup
passport.use('local-signup', new LocalStrategy({
    usernameField: 'correo_cl',
    passwordField: 'contraseña_cl',
    passReqToCallback: true
  }, async (req, correo_cl, contraseña_cl, done) => {
    const user = await User.findOne({'correo_cl': correo_cl})
    console.log(user)
    if(user) {
      return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
    } else {
      const newUser = new User();
      newUser.correo_cl = correo_cl;
      newUser.contraseña_cl = newUser.encryptPassword(contraseña_cl);
      console.log(newUser)
      await newUser.save();
      done(null, newUser);
    }
}));


//signin

passport.use('local-signin', new LocalStrategy({
    usernameField: 'correo_cl',
    passwordField: 'contraseña_cl',
    passReqToCallback: true
  }, async (req, correo_cl, contraseña_cl, done) => {
    const user = await User.findOne({correo_cl: correo_cl});
    if(!user) {
      return done(null, false, req.flash('signinMessage', 'No User Found'));
    }
    if(!user.comparePassword(contraseña_cl)) {
      return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }

    return done(null, user);
}));
  




