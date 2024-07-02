require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const users = {}; // Changed from array to object for easier lookup

app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

const secret = process.env.JWT_SECRET;

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword, profile: {} };
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/upload-resume', authenticateToken, upload.single('resume'), (req, res) => {
  const resumePath = path.join(__dirname, 'uploads', req.file.filename);
  fs.readFile(resumePath, (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading resume file' });

    pdfParse(data).then(parsedData => {
      const resumeText = parsedData.text;
      users[req.user.username].profile.resume = resumeText;
      res.json({ message: 'Resume uploaded and parsed successfully' });
    }).catch(err => {
      res.status(500).json({ message: 'Error parsing resume file' });
    });
  });
});

app.post('/update-profile', authenticateToken, (req, res) => {
  const { name, contact, workExperience } = req.body;
  users[req.user.username].profile = { name, contact, workExperience, ...users[req.user.username].profile };
  res.json({ message: 'Profile updated successfully' });
});

app.get('/profile', authenticateToken, (req, res) => {
  res.json(users[req.user.username].profile);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
