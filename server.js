const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname)));

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

const USERS_FILE = 'users.json';
const MESSAGES_FILE = 'messages.json';

app.post('/api/register', (req, res) => {
    const { username, email, password, image } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const users = readJSON(USERS_FILE);

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        image: image || null
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    res.json({ success: true, message: 'Registration successful' });
});

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

const LOGINS_FILE = 'logins.json';
const STATS_FILE = 'statistics.json';

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const logins = readJSON(LOGINS_FILE);
        logins.push({
            email: user.email,
            timestamp: new Date().toISOString()
        });
        writeJSON(LOGINS_FILE, logins);

        res.json({ success: true, message: 'Login successful', user: { username: user.username, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/visit', (req, res) => {
    let stats = readJSON(STATS_FILE);
    if (!stats.visits) stats = { visits: 0 };

    stats.visits += 1;
    writeJSON(STATS_FILE, stats);

    res.json({ success: true });
});

app.get('/api/admin/data', (req, res) => {
    const users = readJSON(USERS_FILE);
    const logins = readJSON(LOGINS_FILE);
    const stats = readJSON(STATS_FILE);

    res.json({
        users,
        logins,
        visits: stats.visits || 0
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
