const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.port || 4000;

let aFileName = __dirname + '/www/data/persons.json';

function getPersons(req, res) {
	fs.readFile(aFileName, function (err, data) {
		let persons = [];
		if (!err) persons = JSON.parse(data);
		res.status(200).json(persons);
	});
}

function getPerson(req, res) {
	const id = parseInt(req.params.id)
	fs.readFile(aFileName, function (err, data) {
		let persons = [];
		if (!err) persons = JSON.parse(data);
		res.status(200).json(persons.filter(p => p.id === id));
	});
}

function addPerson(req, res) {
	const { id, name, phone, age } = req.body;
	const newPerson = {id:parseInt(id), name, phone, age};
	fs.readFile(aFileName, function (err, data) {
		let persons = [];
		if (!err) persons = JSON.parse(data);
		persons.push(newPerson);
		fs.writeFile(aFileName,JSON.stringify(persons),function(err){
				if (err){
					res.status(200).json(`Error adding id: ${id}`);
				}
				else{
					res.status(200).json(`Person added with id: ${id}`);
				}
			});
	});
}

function updatePerson(req, res) {
	const { id, name, phone, age } = req.body
	const aPerson = {id:parseInt(id), name, phone, age};
	fs.readFile(aFileName, function (err, data) {
		let persons = [];
		if (!err) persons = JSON.parse(data);
		const anIndex = persons.findIndex(p=>p.id===aPerson.id);
		if (anIndex < 0 ) {
			res.status(200).json(`Cannot find ID: ${id}`);
			return;
		}
		persons[anIndex] = aPerson;
		fs.writeFile(aFileName,JSON.stringify(persons),function(err){
				if (err){
					res.status(200).json(`Error updating id: ${id}`);
				}
				else{
					res.status(200).json(`Updated id: ${id}`);
				}
			});
	});
}

function deletePerson(req, res) {
	const id = parseInt(req.body.id)
	fs.readFile(aFileName, function (err, data) {
		let persons = [];
		if (!err) persons = JSON.parse(data);
		const anIndex = persons.findIndex(p=>p.id===id);
		if (anIndex < 0 ) {
			res.status(200).json(`Cannot find ID: ${id}`);
			return;
		}
		persons.splice(anIndex, 1)
		fs.writeFile(aFileName,JSON.stringify(persons),function(err){
				if (err){
					res.status(200).json(`Error deleting id: ${id}`);
				}
				else{
					res.status(200).json(`Deleted id: ${id}`);
				}
			});
	});
}

app.get('/api/persons', (req, res) => getPersons(req, res));
app.get('/api/persons/:id', (req, res) => getPerson(req, res));
app.post('/api/persons', (req, res) => addPerson(req, res));
app.put('/api/persons/:id', (req, res) => updatePerson(req, res));
app.delete('/api/persons/:id', (req, res) => deletePerson(req, res));

app.use(express.static(__dirname + "/www"));

app.listen(port, function () {
	console.log("Server listening at port " + port)
})