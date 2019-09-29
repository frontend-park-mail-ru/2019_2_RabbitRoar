'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();


app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());


const users = {
	'egor140398@gmail.com': {
        email: 'egor140398@gmail.com',
        login: 'EgosKekos',
		password: 'qwerty',
		id: 1,
	},
	's.volodin@corp.mail.ru': {
        email: 'egor140398@gmail.com',
        login: 'EgosKekos',
		password: 'qwerty',
		id: 2,
	},
	'a.ts@corp.mail.ru': {
        email: 'egor140398@gmail.com',
        login: 'EgosKekos',
		password: 'qwerty',
		id: 3,
	},
	'a.ostapenko@corp.mail.ru': {
        email: 'egor140398@gmail.com',
        login: 'EgosKekos',
		password: 'qwerty',
		id: 4,
	},
};
const ids = {};


app.post('/signup', function (req, res) {
	const password = req.body.password;
	const email = req.body.email;
	const age = req.body.age;
	if (
		!password || !email || !age ||
		!password.match(/^\S{4,}$/) ||
		!email.match(/@/) ||
		!(typeof age === 'number' && age > 10 && age < 100)
	) {
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[email]) {
		return res.status(400).json({error: 'Пользователь уже существует'});
	}

	const id = uuid();
	const user = {password, email, age, score: 0};
	ids[id] = email;
	users[email] = user;

	res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.set('Access-Control-Allow-Credentials', 'true');

	const password = req.body.password;
	const email = req.body.email;
	if (!password || !email) {
		return res.status(400).json({error: 'Не указан E-Mail или пароль'});
	}
	if (!users[email] || users[email].password !== password) {
		return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
	}

	const id = uuid();
	ids[id] = email;

	res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(200).json({id});
});

app.options('/login', function (req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});


	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.set('Access-Control-Allow-Methods', 'POST,PUT');
	res.set('Access-Control-Allow-Headers', 'Content-Type,X-Lol');
	res.set('Access-Control-Allow-Credentials', 'true');

	res.status(204).end();
});

app.get('/me', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.set('Access-Control-Allow-Credentials', 'true');

	const id = req.cookies['podvorot'];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	users[email].score += 1;

	res.json(users[email]);
});


const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});



// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const options = {
//     port: 8000,
//     path: 'dist'
// };

// console.log(`Starting http server on ${options.port}.`);

// const server = http.createServer((req, res) => {
//     let file_path = req.url;

//     if (file_path.endsWith('/')) {
//         file_path += 'index.html';
//     }

//     file_path = path.join(options.path, file_path);

//     fs.readFile(file_path, (err, data) => {
//         if (err) {
//             res.statusCode = 404;
//             res.write('404');
//         } else {
//             res.write(data);
//         }
//         res.end();
//         console.log(res.statusCode, req.url);
//     });
// });

// server.listen(options.port);