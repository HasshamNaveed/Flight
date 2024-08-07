const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');

app.use(express.json({ limit: '16mb' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Ensure CORS settings allow credentials
app.use(methodOverride('_method'));

app.use(session({
    secret: 'web',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: 'Lax' } // Ensure secure is false for local testing
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes import
const userRouter = require('./routes/user.routes.js');
const adminRouter = require('./routes/admin.routes.js');

// Routes declaration
app.use('/users', userRouter);
app.use('/admins', adminRouter);

// Home route
app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});

module.exports = app;
