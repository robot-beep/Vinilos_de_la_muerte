//const express = require('express');
//const router = express.Router();
const router = require('express').Router();
const passport = require('passport');
const usuarios = require('../models/usuarios')

router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/signup', (req, res, next) => {
  res.render('usuarios/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('usuarios/signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));


router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('usuarios/profile');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;
