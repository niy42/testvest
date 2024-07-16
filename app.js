const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models'); // Adjust the path as necessary

const app = express();


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));*/

// Test the database connection
db.sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Sync the database (optional)
db.sequelize.sync()
    .then(() => {
        console.log("Database synced.");
    })
    .catch((err) => {
        console.log("Failed to sync database: " + err.message);
    });

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files (like CSS)
app.use(express.static('public'));

// Handle GET request for homepage
app.get('/', (req, res) => {
    res.render('login', { title: 'Express' });
});

app.get('/index', (req, res) => (
    res.render('index', { title: 'Home' })
));

// Handle sign up route
const signupRoute = require('./routes/mysql/signup-mysql');
app.use('/mysqlsignup', signupRoute);

// Handle login with mysql route
const mysqlloginRoute = require('./routes/mysql/login-mysql');
app.use('/mysqllogin', mysqlloginRoute);

// Handle user-panel route
const dashboardRoute = require('./routes/mysql/dashboard');
app.use('/user-panel', dashboardRoute);

// Handle deposit route
const depositRoute = require('./routes/mysql/deposit');
app.use('/deposit', depositRoute);

// Handle withdrawal route
const withdrawalRoute = require('./routes/mysql/withdrawal');
app.use('/withdraw', withdrawalRoute);

// Handle invest route
const investRoute = require('./routes/mysql/invest');
app.use('/invest', investRoute);

// Handle transaction route
const transactionRoute = require('./routes/mysql/transaction');
app.use('/transaction', transactionRoute);

// Handle notifications route
const notificationsRoute = require('./routes/mysql/notifications');
app.use('/notifications', notificationsRoute);

// Handle settings route
const settingsRoute = require('./routes/mysql/settings');
app.use('/user-info', settingsRoute);

// Handle plan route
const planRoute = require('./routes/mysql/plan');
app.use('/plan', planRoute);

// Handle terms route
const termsRoute = require('./routes/pages/terms');
app.use('/terms', termsRoute);

// Handle team route
const ourteamRoute = require('./routes/pages/team');
app.use('/ourteam', ourteamRoute);

// Handle review route
const reviewRoute = require('./routes/pages/review');
app.use('/review', reviewRoute);

// Handle faq route
const faqRoute = require('./routes/pages/faq');
app.use('/faq', faqRoute);

// Handle contact route
const contactRoute = require('./routes/pages/contact');
app.use('/contact', contactRoute);

// Handle about route
const aboutRoute = require('./routes/pages/about');
app.use('/about', aboutRoute);

// Handle blog route
const blogRoute = require('./routes/pages/blog');
app.use('/blog', blogRoute);

//Handle blog-details route
const blogdetailsRoute = require('./routes/pages/blog-details');
app.use('/blogdetails', blogdetailsRoute);

// Handle GET request for logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/mysqllogin');
});

// Handle Get request for forgot password
app.get('/passwordreset', (req, res) => {
    res.render('forgot-password', { title: 'Password Reset' })
});

/*// Handle post request for forgot password
const passwordResetRoutes = require('./routes/mysql/about-to-reset-password');
app.use('/', passwordResetRoutes);*/

// Handle post request to reset user password
const resetpassword = require('./routes/mysql/reset-password');
app.use(resetpassword);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
