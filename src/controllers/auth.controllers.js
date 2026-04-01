import bcrypt from 'bcryptjs';
import { validationResult, matchedData } from 'express-validator';
import newUserValidator from '../validators/auth.validators.js';
import { insertUser } from '../services/auth.services.js';
import passport from '../config/passport.js';

const registerUserGet = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

const registerUserPost = [
  newUserValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).render('auth/register', {
          title: 'Register',
          errors: errors.array(),
          formData: req.body,
        });
      }

      const { username } = matchedData(req);
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      await insertUser(username, hashPassword);
      console.log(`Inserting user: ${username}....`);
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  },
];

// Middleware used to render the login form
const loginUserGet = (req, res) => {
  console.log;
  res.render('auth/login', {
    title: 'Log In',
    authErrorMessages: req.flash('error'),
    usernameInput: req.flash('usernameInput') || '',
  });
};

// Middleware used to process the data from the form and authenticate the user via Passport.js
const loginUserPost = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash('usernameInput', req.body.username);
      req.flash('error', info.message);
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
};

const logoutUsersGet = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
};

export {
  registerUserGet,
  registerUserPost,
  loginUserGet,
  loginUserPost,
  logoutUsersGet,
};
