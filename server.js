const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname)));

// Helper function to read/write JSON
const readJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file);
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const writeJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Files
const USERS_FILE = 'users.json';
const MESSAGES_FILE = 'messages.json';

// Routes

// 1. Register User
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const users = readJSON(USERS_FILE);
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = { 
        id: Date.now(), 
        username, 
        email, 
        password // Note: In a real app, hash this!
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    res.json({ success: true, message: 'Registration successful' });
});

// 2. Login User
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful', user: { username: user.username, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 3. Contact Form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const messages = readJSON(MESSAGES_FILE);
    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    messages.push(newMessage);
    writeJSON(MESSAGES_FILE, messages);

    res.json({ success: true, message: 'Message sent successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
