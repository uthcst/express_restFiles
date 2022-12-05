const express = require('express');
const app = express();
const port = process.env.port || 4000;
const users = { 'user1': 'password1', 'user2': 'password2' };
const isAuthenticated = (req, res, next) => {
	const encodedAuth = (req.headers.authorization || '')
		.split(' ')[1] || '';
	const [name, password] = Buffer.from(encodedAuth, 'base64')
		.toString().split(':')
	// Check users credentials and return next if ok
	if (name && password === users[name]) return next(); 
	// User is not authenticated give a reponse 401
	res.set('WWW-Authenticate', 'Basic realm="Access to Index"')
	res.status(401).send("Unauthorised access")
}
app.use(express.static(__dirname + "/www"));
app.get('/api/data', isAuthenticated, function (req, res) {
	const data = [{ name: 'Nick', age: 21}, { name: 'Maris', age: 22 }];
	res.status(200).send(JSON.stringify(data));
})
app.listen(4000, function () {
	console.log("Server listening at port " + port)
})