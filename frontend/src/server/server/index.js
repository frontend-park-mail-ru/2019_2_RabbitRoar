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
    'siberiacalling': {
        username: 'siberiacalling',
        password: 'password',
        email: 'smirnova@mail.ru',
        rating: 3,
    },
    'prikol': {
        username: 'prikol',
        password: 'password',
        email: 'egor@mail.ru',
        rating: 100500,
    },
    'egooor': {
        username: 'egooor',
        password: 'password',
        email: 'kekor@mail.ru',
        rating: 72,
    },
};

app.post('/user/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (
        !username || !password || !email ||
        !username.match(/^[a-zA-Z\-]+$/) ||
        !password.match(/^\S{4,}$/) ||
        !email.match(/@/)
    ) {
        return res.status(400).json({error: 'Не валидные данные пользователя'});
    }
    if (users[username]) {
        return res.status(400).json({error: 'Пользователь с такой почтой уже существует'});
    }
    users[username] = {username, password, email, rating: 0};

    res.cookie('autorized', true, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.cookie('username', username, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(201).end();
});

app.post('/user/login', function (req, res) {
    console.log("here");
    res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    const password = req.body.password;
    const username = req.body.username;
    if (!password || !username) {
        return res.status(401).json({error: 'Не указан юзернейм или пароль'});
    }
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({error: 'Не верный юзернейм и/или пароль'});
    }

    res.cookie('autorized', true, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.cookie('username', username, {expires: new Date(Date.now() + 1000 * 60 * 10)});

    res.status(200).end();
});

app.options('/user/login', function (req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});


	res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
	res.set('Access-Control-Allow-Methods', 'POST,PUT');
	res.set('Access-Control-Allow-Headers', 'Content-Type,X-Lol');
	res.set('Access-Control-Allow-Credentials', 'true');

	res.status(204).end();
});

app.get('/user', function (req, res) {
    const username = req.cookies['username'];
    if (!email || !users[username]) {
        return res.status(401).end();
    }

    res.json(users[username]);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
