const request = require('supertest');
const app = require('../bin/main');

describe('GET /users', () => {
    describe('성공시', () => {
        it('유저 객체를 담은 배열로 응답한다', (done) => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });

        it('최대 limit 갯수만큼 응답한다', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2);
                    done();
                });
        });
    });

    describe('실패시', () => {
        it('limit이 숫자가 아니면 400을 응답한다', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    });
});

describe('GET /users/:id', () => {
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다', (done) => {
            request(app)
                .get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1);
                    done();
                });
        });
    });

    describe('실패시', () => {
        it('id로 유저를 찾을 수 없을 때 404를 응답한다', (done) => {
            request(app)
                .get('/users/999') // 존재하지 않는 유저 ID 요청
                .expect(404)
                .end(done);
        });
    });
});

describe('GET /users/1', () => {
    describe('성공시', () => {
        it('204를 응답한다', (done) => {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        })
    })

    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
                .delete('/users/one')
                .expect(404)
                .end(done);
        })
    })

    describe('POST /users', () => {
        describe('성공시', () => {
            let name = 'alice',
                body;
            before(done => {
                request(app)
                    .post('/users')
                    .send({ name: name }) // name을 POST 요청으로 보냄
                    .expect(201) // 201 상태 코드를 기대
                    .end((err, res) => {
                        if (err) return done(err);
                        body = res.body; // 응답 본문(body) 저장
                        done();
                    });
            });

            it('생성된 유저 객체를 반환한다', done => {
                body.should.have.property('id'); // id 속성이 존재하는지 확인
                done();
            });

            it('입력한 name을 반환한다', done => {
                body.should.have.property('name', name); // name 속성이 정확한지 확인
                done();
            });
        });
        describe('실패시', () => {
            it('name 파라미터 누락시 400을 반환한다', (done) => {
                request(app)
                    .post('/users')
                    .send({})
                    .expect(400)
                    .end(done)
            })
            it("name 이 중복일 경우 409를 반환한다", (done) => {
                request(app)
                    .post('/users')
                    .send({name: 'bobhorn'})
                    .expect(409)
                    .end(done)
            })
        })
    });

    describe('PUT /users/:id', () => {
        describe('성공시', () => {
            it('변경된 name을 응답한다', (done) => {
                const name = 'changedName'
                request(app)
                    .put('/users/1')
                    .send({ name: name})
                    .end((err, res) => {
                        res.body.should.have.property(name);
                    })
            })
        })
    })

});