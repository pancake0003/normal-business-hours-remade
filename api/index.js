const express = require('express');
const path = require('path');
const { DateTime } = require('luxon');

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

  const currentTime = DateTime.now().setZone('America/New_York');
  const currentHour = currentTime.hour;
  const currentMinute = currentTime.minute;
  const formattedTime = currentTime.toFormat('hh:mm a');
  console.log(`Current Eastern Time (ET): ${formattedTime}`);

  const normalBusinessHours = {
    open1: 11,  // 11 AM
    close1: 24, // Midnight (12 AM)
    open2: 0,   // Midnight (12 AM)
    close2: 3   // 3 AM
  };

  if (
    (currentHour >= normalBusinessHours.open1 && currentHour < normalBusinessHours.close1) || 
    (currentHour >= normalBusinessHours.open2 && currentHour < normalBusinessHours.close2)
  ) {
    console.log(`Within business hours: ${formattedTime} ET - Allowed`);
    next();
  } else {
    console.log(`Outside business hours: ${formattedTime} ET - Redirecting to denied.html`);
    res.sendFile(path.resolve('public', 'denied.html'));
  }
}

app.use(workingHours);
app.use(express.static(path.resolve('public')));

app.get('/current-time', (req, res) => {
  const currentTime = DateTime.now().setZone('America/New_York');
  res.json({ 
    message: "Current Eastern Time", 
    time: currentTime.toFormat('hh:mm a'),
    hour: currentTime.hour,
    minute: currentTime.minute
  });
});

app.get('/', (req, res) => {
  console.log("Auto: Serving denied.html");
  res.sendFile(path.resolve('public', 'denied.html'));
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