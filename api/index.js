const express = require('express');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

function workingHours(req, res, next) {
  if (req.path === '/Yuemeng_Song_Resume.pdf') {
    console.log("Accessing resume: Allowed");
    return next();
  }

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const normalBusinessHours = {
    open: 15,
    close: 3,
  };

  if (currentHour >= normalBusinessHours.open || currentHour < normalBusinessHours.close) {
    console.log("Within business hours: Allowed");
    next();
  } else {
    console.log("Outside business hours: Redirecting to denied.html");
    res.sendFile(path.resolve('public', 'denied.html'));
  }
}

app.use(workingHours);
app.use(express.static(path.resolve('public')));

app.get('/', (req, res) => {
  console.log("Serving index.html");
  res.sendFile(path.resolve('public', 'index.html'));
});

app.get('/api', (req, res) => {
  console.log("API check successful");
  res.json({ message: 'API is working!' });
});

app.use((req, res) => {
  console.log(`404: ${req.path} not found`);
  res.status(404).send('Not Found');
});

module.exports = app;