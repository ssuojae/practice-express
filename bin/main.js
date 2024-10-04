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

app.get('/users/:id', function (req, res) {
    const id = parseInt(req.params.id, 10);
    const user = users.find((user) => user.id === id); // find()로 해당 ID의 사용자 찾기

    if (!user) {
        return res.status(404).end(); // 유저가 없으면 404 반환
    }

    res.json(user); // 유저 정보 반환
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(404).end();
    users = users.filter((user) => user.id !== id); // 삭제하지않을 id 배열들로 바꿔치기
    res.status(204).end();

})

module.exports = app;
