var express = require('express');
var app = express();
var morgan = require('morgan');

var users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'bob'},
    {id: 3, name: 'bobhorn'},
];

app.use(morgan('dev'));

app.get('/users', function (req, res) {
    const limit = req.query.limit
    res.json(users.slice(0, limit));
});

module.exports = app;
