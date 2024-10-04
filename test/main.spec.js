const app = require('../bin/main'); // 서버 인스턴스 불러오기
const request = require('supertest'); // Supertest의 request 불러오기

describe('GET /users는', () => {
    it('사용자 목록을 가져온다', (done) => {
        request(app)
            .get('/users') // /users 경로로 GET 요청
            .end((err, res) => {
                if (err) return done(err); // 에러 발생 시 처리
                console.log(res.body); // 응답 결과 출력
                done(); // 테스트 완료
            });
    });
});


describe('GET /users는', () => {
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
               res.body.should.have.lengthOf(2)
               done();
           })
    });

    describe('실패시', () => {
        it('limit이 숫자형이 아니면 400을 응답한다', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done)
        })
    })
})


describe('GET /users/1는', () => {
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다', (done) => {
            request(app)
                .get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1);
                    done();
                })
        })
    })
    describe('실패시', () => {
        it('id 가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        });
        it('id가 유저를 찾을 수 없을 경우 404로 응답한다', (done) => {
            request(app)
                .get('/user/999')
                .expect(400)
                .end(done);
        })
    })


})