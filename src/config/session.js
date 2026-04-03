import session from 'express-session';
import { Pool } from 'pg';
import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';

// Creating a session via a session store in the database
const PgStore = connectPgSimple(session);

const sessionStore = new PgStore({
  pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  tableName: 'sessions',
});

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
