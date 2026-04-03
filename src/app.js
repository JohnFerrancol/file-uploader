import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import flash from 'connect-flash';
import 'dotenv/config';

import passport from './config/passport.js';
import sessionMiddleware from './config/session.js';

import createLocals from './middleware/locals.middleware.js';
import errorHandler from './middleware/error.middleware.js';

import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import filesRoutes from './routes/files.routes.js';
import foldersRoutes from './routes/folders.routes.js';

const app = express();

// Get filename, dirname and assetPaths for CSS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, 'public');

// Let Express App use Express Layouts and static files
app.use(expressLayouts);
app.use(express.static(assetsPath));

// Use the passport and flash instances and run the session middleware
app.use(sessionMiddleware);
app.use(flash());
app.use(passport.session());

// Parse incoming POST request data to be converted into a useable JS object
app.use(express.urlencoded({ extended: true }));

// Set Views engine anf Express layout
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(createLocals);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/files', filesRoutes);
app.use('/folders', foldersRoutes);

app.use(errorHandler);

export default app;
