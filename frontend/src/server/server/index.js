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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFF6tCXWJuWRLxP0Ovu785xFo3oiw_kKf0ZRJCIGH0jbIFvo1',
    },
    'prikol': {
        username: 'prikol',
        password: 'password',
        email: 'egor@mail.ru',
        rating: 100500,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFF6tCXWJuWRLxP0Ovu785xFo3oiw_kKf0ZRJCIGH0jbIFvo1',
    },
    'egooor': {
        username: 'egooor',
        password: 'password',
        email: 'kekor@mail.ru',
        rating: 72,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFF6tCXWJuWRLxP0Ovu785xFo3oiw_kKf0ZRJCIGH0jbIFvo1',
    },
};

const ids = {};

app.post('/user/signup', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
    res.set('Access-Control-Allow-Credentials', 'true');

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (
        !username || !password || !email ||
        !username.match(/^[a-zA-Z\-]+$/) ||
        !email.match(/@/)
    ) {
        return res.status(400).json({error: 'Не валидные данные пользователя'});
    }
    if (users[username]) {
        return res.status(400).json({error: 'Пользователь с такой почтой уже существует'});
    }

    const id = uuid();
    const user = {username, password, email, rating: 0};
    ids[id] = username;
    users[username] = user;

    res.cookie('id', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(201).end();
    
    console.log("send");
});

app.options('/user/signup', function (req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});

	res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
	res.set('Access-Control-Allow-Methods', 'POST');
	res.set('Access-Control-Allow-Headers', 'Content-Type');
	res.set('Access-Control-Allow-Credentials', 'true');
	res.status(200).end();
});

app.post('/user/login', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    const password = req.body.password;
    const username = req.body.username;
    if (!password || !username) {
        return res.status(401).json({error: 'Не указан юзернейм или пароль'});
    }
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({error: 'Неверный юзернейм и/или пароль'});
    }

    const id = uuid();
    ids[id] = username;

    res.cookie('id', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});    
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

	res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
	res.set('Access-Control-Allow-Methods', 'POST');
	res.set('Access-Control-Allow-Headers', 'Content-Type');
	res.set('Access-Control-Allow-Credentials', 'true');
	res.status(200).end();
});


app.put('/user', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
    res.set('Access-Control-Allow-Credentials', 'true');

    // const id = req.cookies['id'];
    // const username = ids[id];

    // if (!username || !users[username]) {
    //     return res.status(401).end();
    // }

    // const newUsername = req.body.username;
    // const newPassword = req.body.password;
    // const newEmail = req.body.email;
    // const newUrl = req.body.url;

    // if (!newUsername || !newPassword || !newEmail || !newUrl) {
    //     return res.status(401).json({error: 'Новые данные не были введены'});
    // }
    // if (newEmail) {
    //     users[username].email = newEmail;
    // }
    // if (newPassword) {
    //     users[username].password = newPassword;
    // }
    // if (newUrl) {
    //     users[username].url = newUrl;
    // }
    // if (newUrl) {
    //     users[username].url = newUrl;
    // }
    res.status(200).end();
});

app.get('/user', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    const id = req.cookies['id'];
    const username = ids[id];

    if (!username || !users[username]) {
        return res.status(401).end();
    }

    res.json(users[username]);
    res.status(200).end();
});

app.options('/user', function (req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});

	res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
	res.set('Access-Control-Allow-Methods', '*');
	res.set('Access-Control-Allow-Headers', 'Content-Type');
	res.set('Access-Control-Allow-Credentials', 'true');
	res.status(200).end();

});

app.delete('/user/logout', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    const id = req.cookies['id'];
    const username = ids[id];
    delete ids[id];
    res.cookie('id', '', {expires: new Date(Date.now() + 1000 * 60 * 10)});  
    res.status(200).end();
});

app.options('/user/logout', function (req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});

    res.set('Access-Control-Allow-Origin', 'http://frontend.photocouple.space');
	res.set('Access-Control-Allow-Methods', 'DELETE');
	res.set('Access-Control-Allow-Headers', 'Content-Type');
	res.set('Access-Control-Allow-Credentials', 'true');
	res.status(200).end();
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
