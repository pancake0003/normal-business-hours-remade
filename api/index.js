const express = require ('express');
const path = require ('path');

const app = express();

app.use((req, res, next) => {
	console.log(`Incoming request: $req.method} ${req.path}`);
	next;
});

function workingHours (req, res, next){
	if(req.path === 'Yuemeng_Song_Resume.pdf') {
		console.log ("Accessing resume: Allowed");
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
		res.sendFile(path.join(__dirname, 'public', 'denied.html'));
	}
}
app.use (express.static(path.join(__dirname, 'public')));

app.use(workingHours);

app.get('/Yuemeng_Song_Resume.pdf', (req, res) => {
	res.sendFIle(path.join(__dirname, 'public', 'Yuemeng_Song_Resume.pdf'));
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

