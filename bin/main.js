var express = require('express');
var app = express();
var morgan = require('morgan');

var users = [
    { id: 1, name: 'alice' },
    { id: 2, name: 'bob' },
    { id: 3, name: 'bobhorn' },
];

app.use(morgan('dev'));

app.get('/users', function (req, res) {
    const limit = parseInt(req.query.limit, 10);

    // limit이 제공되지 않으면 users 전체를 반환
    if (!req.query.limit) {
        return res.json(users);
    }

    // limit이 숫자가 아니면 400 반환
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    // limit에 맞는 users 반환
    res.json(users.slice(0, limit));
});

module.exports = app;
