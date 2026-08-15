require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// הגדרת מנוע התבניות (EJS)
app.set('view engine', 'ejs');

// הגדרת התיקייה עבור קבצים סטטיים (תמונות, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Security Middleware (Helmet + Rate Limiting)
// Security Middleware: Helmet with custom CSP to allow Bootstrap and inline styles
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    }
}));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use(express.json());

// --- Routes (נתיבים דינמיים) ---

app.get('/', (req, res) => {
    res.render('index', { activePage: 'home' });
});

app.get('/cv', (req, res) => {
    res.render('cv', { activePage: 'cv' });
});

app.get('/about', (req, res) => {
    res.render('about', { activePage: 'about' });
});

// Honeypot (סייבר - מלכודת לסורקים)
app.all(['/wp-admin', '/.env', '/config.php'], (req, res) => {
    console.warn(`[SECURITY] Scanner detected at ${req.path} from IP: ${req.ip}`);
    res.status(403).send('Forbidden: Access Denied');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});