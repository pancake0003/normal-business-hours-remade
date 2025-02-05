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
  const formattedTime = currentTime.toFormat('hh:mm a');
  console.log(`Current Eastern Time (ET): ${formattedTime}`);

  const normalBusinessHours = {
    open: 11,  
    close: 3 
  };

  console.log(`Is within business hours? ${isWithinBusinessHours ? 'Yes' : 'No'}`);
  if (req.path === '/') {
    if (currentHour >= normalBusinessHours.open || currentHour <= normalBusinessHours.close) {
      return res.sendFile(path.resolve('public', 'Yuemeng_Song_Resume.pdf'));
    } else {
      return res.sendFile(path.resolve('public', 'denied.html'));
    }
  }

  next();
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

app.use((req, res) => {
  console.log(`404: ${req.path} not found`);
  res.status(404).send('Not Found');
});

module.exports = app;