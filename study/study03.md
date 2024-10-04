## TDD로 API서버 개발하기


### Mocha, Should, Supertest를 이용한 BDD 테스트 코드 작성하기

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
- 이 단계에서는 Supertest를 사용해 API 요청을 보내거나, Should를 사용해 조건을 실행한다.

```javascript
request(app)
    .get('/users')  // When: GET 요청을 /users 경로에 보냈을 때
```

#### 3. Then
- Then 단계는 그 행동에 따른 결과를 확인하는 단계이다. 예상한 결과가 맞는지 검증한다.
- 이 단계에서는 Should를 사용해 **Assertion** 을 작성하여, 실제 결과가 예상과 일치하는지 검증한다.

```ja vascript
    .expect(200)  // Then: 응답 상태 코드가 200이어야 한다
    .expect('Content-Type', /json/)  // Then: 응답이 JSON 형식이어야 한다
    res.body.should.be.an.Array();  // Then: 응답 본문이 배열이어야 한다
```


#### 예시 코드: Mocha, Should, Supertest를 사용한 Given-When-Then

```javascript
const request = require('supertest');
const app = require('./app'); // Express 앱
const should = require('should');

describe('User API', function() {
// Given: 사용자 목록을 조회하는 API가 주어졌을 때
it('should return a list of users', function(done) {
// When: GET 요청을 /users 경로에 보냈을 때
    request(app)
        .get('/users')
        .expect(200) // Then: 응답 상태 코드가 200이어야 한다
        .expect('Content-Type', /json/) // Then: 응답이 JSON 형식이어야 한다
        .end(function(err, res) {
            if (err) return done(err);
                // Then: 응답 본문이 배열이어야 한다
                res.body.should.be.an.Array();done();
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
