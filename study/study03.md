## TDD로 API 서버 개발하기

### Mocha, Should를 이용한 BDD 테스트 코드 작성하기

#### 1. Given
- **Given** 단계는 테스트의 **초기 상태**를 설정하는 단계이다. 어떤 조건이나 상황이 주어졌을 때를 정의한다.
- 이 단계에서는 **Mocha의 `describe()`와 `before()`** 등을 사용해 **테스트 환경을 설정**하고 준비 작업을 한다.

```javascript
describe('User API', function() {
   // Given: 사용자 목록을 조회하는 API가 주어졌을 때
});
```

#### 2. When

- When 단계는 테스트할 행동이 일어나는 단계이다. 어떤 액션이 수행되는지를 나타낸다.
- 이 단계에서는 비즈니스 로직의 실행과 그 결과를 검증한다. 
- Mocha와 Should를 사용하여 해당 로직의 올바른 동작을 확인할 수 있다.
```javascript
const result = someFunction();
result.should.be.equal(expectedValue);  // When: someFunction을 실행한 결과가 예상 값과 같은지 확인
```

#### 3. Then
- Then 단계는 그 행동에 따른 결과를 확인하는 단계이다. 예상한 결과가 맞는지 검증한다.
- 이 단계에서는 Should를 사용해 Assertion 을 작성하여, 실제 결과가 예상과 일치하는지 검증한다.
```javascript
result.should.be.a('number');  // Then: 결과가 숫자 형식이어야 한다
```

- 예시 코드: Mocha, Should를 사용한 Given-When-Then
```javascript
const should = require('should');

describe('User API', function() {
   // Given: 어떤 상황에서
   it('should return correct user data', function() {
      // When: 특정 액션이 실행되고
      const result = getUserData(1);

      // Then: 결과가 예상과 일치해야 한다
      result.should.have.property('id', 1);
   });
});
```

### 통합 테스트: Supertest를 이용한 API 테스트
- Supertest는 주로 통합 테스트를 수행할 때 사용된다. 
- 여기서는 서버에 실제로 요청을 보내고, 그 결과가 예상한 대로 동작하는지 검증하는 방식으로 테스트를 수행한다.

#### Supertest를 이용한 통합 테스트 예시
```javascript
const request = require('supertest');
const app = require('./app');  // Express 앱 불러오기

describe('User API 통합 테스트', function() {
   // When: GET /users 요청을 보낼 때
   it('should return a list of users', function(done) {
      request(app)
              .get('/users')  // When: GET 요청을 /users 경로에 보냈을 때
              .expect(200)  // Then: 응답 상태 코드가 200이어야 한다
              .expect('Content-Type', /json/)  // Then: 응답이 JSON 형식이어야 한다
              .end(function(err, res) {
                 if (err) return done(err);
                 res.body.should.be.an.Array();  // Then: 응답 본문이 배열이어야 한다
                 done();
              });
   });

   it('should return a single user by ID', function(done) {
      request(app)
              .get('/users/1')  // When: GET 요청을 /users/1 경로에 보냈을 때
              .expect(200)  // Then: 응답 상태 코드가 200이어야 한다
              .expect('Content-Type', /json/)  // Then: 응답이 JSON 형식이어야 한다
              .end(function(err, res) {
                 if (err) return done(err);
                 res.body.should.have.property('id', 1);  // Then: 응답의 id가 1이어야 한다
                 done();
              });
   });
});
```

<br/>
<br/>





### 번외: Morgan 을 사용한 로그출력

- **Morgan**은 Node.js 애플리케이션에서 주로 사용하는 **HTTP 요청 로깅 미들웨어**이다. 
- Express나 NestJS와 같은 프레임워크에서 사용되어 **서버로 들어오는 모든 HTTP 요청을 자동으로 기록**해준다.

#### Morgan의 주요 역할

1. **자동화된 요청 정보 로깅**  
   Morgan은 요청 메소드, URL, 상태 코드, 처리 시간 등의 **요청 정보를 자동으로 로그**로 남긴다. 수동으로 요청 정보를 출력하는 것과 달리, Morgan은 설정만으로 필요한 정보를 쉽게 로깅할 수 있다.

2. **다양한 로그 포맷 제공**  
   Morgan은 미리 정의된 다양한 **로그 포맷(dev, common, combined 등)**을 제공하여, 로그를 일관성 있게 관리할 수 있다. 예를 들어, `dev` 모드는 간결한 로그를, `combined` 모드는 더 자세한 정보를 기록한다.

3. **요청 처리 시간 측정**  
   Morgan은 요청이 처리되는 데 걸린 시간을 자동으로 기록한다. 이는 서버의 성능을 모니터링하고 요청 처리 시간을 최적화하는 데 유용하다.

4. **로그 파일 저장 및 외부 툴 연동**  
   Morgan을 사용하면 **로그를 파일로 저장**하거나, **외부 로그 관리 툴과 연동**할 수 있다. 이를 통해 로그 데이터를 분석하거나 장기 보관할 수 있다.

#### Morgan 사용 예시

```javascript
const express = require('express');
const morgan = require('morgan');
const app = express();

// 'dev' 모드로 Morgan 설정 (간결한 로그 출력)
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

```javascript
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();

// 로그 파일 저장을 위한 스트림 생성
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// 'combined' 모드로 로그 파일 저장
app.use(morgan('combined', { stream: accessLogStream }));
```

#### Morgan과 `console.log()`의 차이점
- 자동화된 로깅: Morgan은 요청 정보를 자동으로 로깅하므로, `console.log()`처럼 일일이 수동으로 출력할 필요가 없다.
- 다양한 포맷 제공: Morgan은 여러 로그 포맷을 제공해 개발 환경과 프로덕션 환경에 맞게 설정할 수 있다.
- 처리 시간 기록: Morgan은 요청이 처리되는 데 걸린 시간을 자동으로 기록해 성능 모니터링에 유리하다.
- 로그 파일 저장: Morgan은 로그를 파일에 저장하거나 외부 툴과 쉽게 연동할 수 있다.
