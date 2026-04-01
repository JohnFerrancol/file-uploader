import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByName, getUserById } from '../services/auth.services.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Finding the username from the database
      const user = await getUserByName(username);

      // If no matching user, throw error
      if (!user) {
        return done(null, false, { message: 'Username not found' });
      }

      // If password does not match, throw error
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

// serializeUser method is used to store the user session in memory as the user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// derializeUser method is used to retrieve data from the user from the current session user id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
