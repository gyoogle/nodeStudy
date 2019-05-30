### npm

----

노드 패키지 매니저로, 오픈 소스를 활용할 수 있음



##### npm을 통해 pakage.json 생성

```
npm init
```

다 enter 치면서 넘어가도 무방



##### express 설치

```
npm install express
```

pakage.json에 dependency가 추가, 그리고 프로젝트에 node_modules가 추가된 것을 확인할 수 있음

(node_modules는 익스프레스가 의존하는 패키지들이 들어있음)



##### 모듈 여러개 설치해보기

```
npm install morgan cookie-parser express-session
```

morgan : 요청에 대한 정보를 콘솔에 로그로 남겨주는 모듈

cookie-parser : 요청에 동봉된 쿠키를 해석

express-session : 로그인 등 세션을 구현할 때 매우 유용



##### 개발용 패키지

`--save-dev`로 설치함 (실제 배포 시에는 포함되지 않고 개발할 때만 사용하는 패키지)

```
npm install --save-dev nodemon
```

nodemon은 소스코드가 바뀔 때마다 자동으로 노드를 재실행해준다.

개발용 패키지는 따로 `devDependencies` 속성으로 관리됨



##### 전역 설치

```
npm install -global rimraf
```

`-global`이나 `-g`로 가능

rimraf : 윈도우에서도 리눅스에서 사용하는 rm -rf 명령어를 사용할 수 있도록 해주는 패키지



##### rimraf를 통해 node_modules 지워보기

```
rimraf node_modules
```

node_modules 폴더가 삭제됨..

당황할 필요 없음. 이미 pakage.json에 설치한 패키지 내역이 존재하므로 `npm install`만 다시 해주면 만들어짐!







### 익스프레스를 통한 웹 서버 만들기

---

##### npm 전역 설치

```
npm i -g express-generator
```



##### 새 익스프레스 프로젝트 생성하기

```
express learn-express --view=pug
```

우리는 익스프레스 프로젝트 명을 `learn-express`로 만든 상황



이곳에 들어가서 필요한 노드 모듈 패키지들을 설치한다

(&&을 사용하면 한꺼번에 역할 수행 가능)

```
cd learn-express && npm i
```



##### 폴더 구조 확인하기

```
app.js : 핵심적 서버 역할
bin/www : 서버를 실행하는 스크립트
public : 외부에서 접근 가능한 파일을 모아둔 곳(image, javascript, css)
routes : 주소별 라우터들 모아둠
views : 템플릿 파일 모아둠(pug)
```



서버 로직은 모두 routes 폴더 안의 파일에서 작성하게 됨

화면 부분은 모두 views 폴더 안에 작성하게 됨

나중에 DB가 추가되면, 데이터 부분은 models 폴더를 따로 만들어 그 안에 작성하게 됨



이렇게 구조를 명확하게 구분해야 서버 관리에 편함 (웹에서 MVC 패턴 구조와 유사)



##### 서버 실행

```
npm start
```

<http://localhost:3000/>로 접속하면 기본 루트 페이지인 index.pug에 작성된 모습이 출력되는 걸 확인할 수 있음



핵심 파일에 속하는 bin/www를 살펴보자

```javascript
#!/usr/bin/env node

var app = require('../app');
var debug = require('debug')('learn-express:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

```

(주석은 다 지운 상태)

bin/www 파일은 http 모듈에 express 모듈을 연결하고, port를 지정하는 부분이다.



이 중에서 중요한 핵심은 크게 3가지 부분인데 따로따로 살펴보자

```javascript
var app = require('../app');
var debug = require('debug')('learn-express:server');
var http = require('http');
```

서버에 필요한 모듈을 가져오고 있다.

debug 모듈 : 콘솔에 로그를 남기는 모듈



```javascript
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
```

process.env 객체에 포트 속성이 있으면 그걸 활용하고, 아니면 기본값으로 3000포트를 이용한다는 뜻

app.set(key, value)를 통해 데이터를 저장할 수 있으며 app.get(key)로 값을 가져올 수도 있음



```javascript
var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
```

http.createServer에 app 모듈을 넣어준다

listen을 통해 port를 연결하고 서버를 실행하는 부분





이제 app 모듈을 살펴보자

```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
```



app.set : 익스프레스 앱 설정

app.use : 미들웨어 연결

마지막에 module.exports를 통해 app 객체를 모듈로 만들었음. 이게 바로 bin/www에서 사용된 app 모듈임



####  미들웨어

---

미들웨어는 익스프레스의 핵심

요청과 응답의 중간에 위치해서 미들웨어라고 부름



미들웨어는 요청과 응답을 조작하여 기능을 추가하기도 하고, 나쁜 요청을 걸러내는 역할을 함

주로 app.use와 함께 사용되며, 순차적으로 라우터를 통해 클라이언트로 응답을 보냄



커스텀 미들웨어를 만들면 마지막에 next()를 호출해야 다음 미들웨어로 넘어갈 수 있으니 주의하기



##### express-session

세션 관리용 미들웨어

```
npm i express-session
```



app.js에 express-session을 연결한다

```javascript
var session = require('express-session');

...

app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
```

일반적으로 cookie-parser 미들웨어 뒤에 놓는게 안전



안에서 사용되는 메소드 역할을 알아보자

resave : 요청이 왔을 때 세션에 수정사항이 생기더라도 세션을 다시 저장할지에 대한 설정

saveUninitialized : 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정 (보통 방문자 추적에 사용)

secret : 필수 항목임. cookie-parser의 비밀키와 같은 역할



세션 관리 시 클라이언트에 쿠키를 보내는데 이를 '세션 쿠키'라고 부름. 

안전하게 쿠키 전송하려면 쿠키 서명을 추가해야 되는데, 이때 필요한게 secret 값

`cooke-parser`와 secret의 값을 같도록 설정해야 함!



httpOnly : true를 통해 클라이언트에서 쿠키를 확인하지 못하도록 설정

secure : false를 통해 https가 아닌 환경에서도 사용할 수 있도록



##### connect-flash

일회성 메시지들을 웹 브라우저에 나타낼 때 사용

```
npm i connect-flash
```

이 미들웨어는 쿠키와 세션을 사용하므로 이들보다 뒤에 위치해야 함



##### 라우터 응답 메서드

- send : 버퍼 또는 문자열 또는 html 또는 json 전송
- sendFile : 파일 전송
- json : json 데이터 전송
- redirect : 응답을 다른 라우터로 보냄
- render : 템플릿 엔진 렌더링

