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
