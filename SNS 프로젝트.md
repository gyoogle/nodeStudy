## SNS 프로젝트

<br>

### 프로젝트 구조 세팅

<br>

폴더 생성(nodebird)

```
npm init
```

```json
{
  "name": "nodebird",
  "version": "1.0.0",
  "description": "SNS Service",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

<br>

##### 시퀄라이즈 설치

```
npm i -g sequelize-cli
npm i sequelize mysql2
sequelize init
```

<br>

passport 폴더도 추가로 생성

<br>

필요한 npm 패키지 설치

```
npm i express cookie-parser express-session morgan connect-flash pug
npm i -g nodemon
npm i -D nodemon
```

nodemon은 개발용으로 사용하기

<br>

##### app.js 만들기

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const pageRouter = require('./routes/page');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('nodebirdsecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'nodebirdsecret',
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(flash());

//라우터
app.use('/', pageRouter);

//404 미들웨어
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//에러 핸들링 미들웨어
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중..');
});
```

<br>

이제 cookieParser와 express-session의 비밀키는 하드코딩하지 않을 것임

<br>

이를 위한 패키지가 `dotenv`

비밀키는 .env 파일에 모아두고, dotenv가 .env파일을 읽어서 process.env 객체에 넣음

```
npm i dotenv
```

<br>

##### .env 파일 생성

```
COOKIE_SECRET=nodebirdsecret
```

<br>

이 파일을 app.js에서 불러오자

```javascript
require('dotenv').config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
```

.env 파일만 외부로 유출되지 않게 관리해주면 된다

<br>

경로를 설정할 router 폴더와 페이지뷰에 해당하는 views 폴더를 만듬

<br>

##### router/page.js

```javascript
const express = require('express');

const router = express.Router();

router.get('/profile', (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: null });
});

router.get('/join', (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: null,
        joinError: req.flash('joinError'),
    });
});

router.get('/', (req, res) => {
    res.render('main', {
        title: 'NodeBird',
        user: null,
        loginError: req.flash('loginError'),
    });
});

module.exports = router;
```

현재 /profile, /join, /로 총 3개의 페이지로 구성

회원가입이나 로그인에 대한 에러 메시지를 보여주기 위해 /join과 /에는 각각 flash로 메시지 연결이 이루어져 있음

render 메서드 안의 twits와 user는 현재는 빈 배열과 null 값이지만 나중에 넣을 것임

<br>

css와 pug 파일은 복사해서 가져올 것(github)

<br>

##### layout.pug

```jade
doctype
html
  head
    meta(charset='UTF-8')
    title= title
    meta(name='viewport' content='width=device-width, user-scalable=no')
    meta(http-equiv='X-UA-Compatible' content='IE=edge')
    link(rel='stylesheet' href='/main.css')
  body
    .container
      .profile-wrap
        .profile
          if user && user.id
            .user-name= '안녕하세요! ' + user.nick + '님'
            .half
              div 팔로잉
              .count.following-count= user.Followings && user.Followings.length || 0
            .half
              div 팔로워
              .count.follower-count= user.Followers && user.Followers.length || 0
            input#my-id(type='hidden' value=user.id)
            a#my-profile.btn(href='/profile') 내 프로필
            a#logout.btn(href='/auth/logout') 로그아웃
          else
            form#login-form(action='/auth/login' method='post')
              .input-group
                label(for='email') 이메일
                input#email(type='email' name='email' required autofocus)
              .input-group
                label(for='password') 비밀번호
                input#password(type='password' name='password' required)
              if loginError
                .error-message= loginError
              a#join.btn(href='/join') 회원가입
              button#login.btn(type='submit') 로그인
              a#kakao.btn(href='/auth/kakao') 카카오톡
        footer
          | Made by&nbsp;
          a(href='https://kim6394.tistory.com' target='_blank') Gyoogle
      block content
```

if - else로 구성된 상태

user가 있고 없을 때로 나타나는 화면 모습이 다르게 되어있음

<br>

##### views/main.pug

```jade
extends layout

block content
  .timeline
    if user
      div
        form#twit-form(action='/post' method='post' enctype='multipart/form-data')
          .input-group
            textarea#twit(name='content' maxlength=140)
          .img-preview
            img#img-preview(src='' style='display: none;' width='250' alt='미리보기')
            input#img-url(type='hidden' name='url')
          div
            label#img-label(for='img') 사진 업로드
            input#img(type='file' accept='image/*')
            button#twit-btn.btn(type='submit') 짹짹
    .twits
      form#hashtag-form(action='/post/hashtag')
        input(type='text' name='hashtag' placeholder='태그 검색')
        button.btn 검색
      for twit in twits
        .twit
          input.twit-user-id(type='hidden' value=twit.user.id)
          input.twit-id(type='hidden' value=twit.id)
          .twit-author= twit.user.nick
          -const follow = user && user.Followings.map(f => f.id).includes(twit.user.id);
          if user && user.id !== twit.user.id && !follow
            button.twit-follow 팔로우하기
          .twit-content= twit.content
          if twit.img
            .twit-img
              img(src=twit.img alt='섬네일')
  script.
    if (document.getElementById('img')) {
      document.getElementById('img').addEventListener('change', function (e) {
        var formData = new FormData();
        console.log(this, this.files);
        formData.append('img', this.files[0]);
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status === 200) {
            var url = JSON.parse(xhr.responseText).url;
            document.getElementById('img-url').value = url;
            document.getElementById('img-preview').src = url;
            document.getElementById('img-preview').style.display = 'inline';
          } else {
            console.error(xhr.responseText);
          }
        };
        xhr.open('POST', '/post/img');
        xhr.send(formData);
      });
    }
    document.querySelectorAll('.twit-follow').forEach(function (tag) {
      tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        if (isLoggedIn) {
          var userId = tag.parentNode.querySelector('.twit-user-id').value;
          var myId = isLoggedIn.value;
          if (userId !== myId) {
            if (confirm('팔로잉하시겠습니까?')) {
              var xhr = new XMLHttpRequest();
              xhr.onload = function () {
                if (xhr.status === 200) {
                  location.reload();
                } else {
                  console.error(xhr.responseText);
                }
              };
              xhr.open('POST', '/user/' + userId + '/follow');
              xhr.send();
            }
          }
        }
      });
    });
```

<br>

##### views/profile.pug

```jade
extends layout

block content
  .timeline
    .followings.half
      h2 팔로잉 목록
      if user.Followings
        for following in user.Followings
          div= following.nick
    .followers.half
      h2 팔로워 목록
      if user.Followers
        for follower in user.Followers
          div= follower.nick
```

<br>

##### views/error.pug

```jade
extends layout

block content
  h1= message
  h2= error.status
  pre #{error.stack}
```

에러내역 보여주는 곳

<br>

##### public/main.css

```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; }
.btn {
  display: inline-block;
  padding: 0 5px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
  background: white;
  border: 1px solid silver;
  color: crimson;
  height: 37px;
  line-height: 37px;
  vertical-align: top;
  font-size: 12px;
}
input[type='text'], input[type='email'], input[type='password'], textarea {
  border-radius: 4px;
  height: 37px;
  padding: 10px;
  border: 1px solid silver;
}
.container { width: 100%; height: 100%; }
@media screen and (min-width: 800px) {
  .container { width: 800px; margin: 0 auto; }
}
.input-group { margin-bottom: 15px; }
.input-group label { width: 25%; display: inline-block; }
.input-group input { width: 70%; }
.half { float: left; width: 50%; margin: 10px 0; }
#join { float: right; }
.profile-wrap {
  width: 100%;
  display: inline-block;
  vertical-align: top;
  margin: 10px 0;
}
@media screen and (min-width: 800px) {
  .profile-wrap { width: 290px; margin-bottom: 0; }
}
.profile {
  text-align: left;
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid silver;
  background: lightcoral;
}
.user-name { font-weight: bold; font-size: 18px; }
.count { font-weight: bold; color: crimson; font-size: 18px; }
.timeline {
  margin-top: 10px;
  width: 100%;
  display: inline-block;
  border-radius: 4px;
  vertical-align: top;
}
@media screen and (min-width: 800px) { .timeline { width: 500px; } }
#twit-form {
  border-bottom: 1px solid silver;
  padding: 10px;
  background: lightcoral;
  overflow: hidden;
}
#img-preview { max-width: 100%; }
#img-label {
  float: left;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid crimson;
  padding: 0 10px;
  color: white;
  font-size: 12px;
  height: 37px;
  line-height: 37px;
}
#img { display: none; }
#twit { width: 100%; min-height: 72px; }
#twit-btn {
  float: right;
  color: white;
  background: crimson;
  border: none;
}
.twit {
  border: 1px solid silver;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  margin-bottom: 10px;
}
.twit-author { display: inline-block; font-weight: bold; margin-right: 10px; }
.twit-follow {
  padding: 1px 5px;
  background: #fff;
  border: 1px solid silver;
  border-radius: 5px;
  color: crimson;
  font-size: 12px;
  cursor: pointer;
}
.twit-img { text-align: center; }
.twit-img img { max-width: 75%; }
.error-message { color: red; font-weight: bold; }
#search-form { text-align: right; }
#join-form { padding: 10px; text-align: center; }
#hashtag-form { text-align: right; }
footer { text-align: center; }
```

<br>

<br>

### 데이터베이스 세팅하기

<br>

mysql과 시퀄라이즈를 통한 데이터베이스 설정

<br>

models파일에 user, post, hashtag.js를 생성한다

<br>

##### models/user.js

```javascript
module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);
```

사용자 정보 저장 모델

이메일, 닉네임, 비밀번호를 갖고 있음

SNS 로그인을 했을 때는 provider와 snsId를 저장함

(provider가 local이면 로컬 로그인, kakao면 카카오 로그인. 기본적으로 로컬로 가정해서 defaultValue를 local로 주었음)

테이블 옵션으로 timestamp와 paranoid를 true로 주었기 때문에  createdAt, updateAt, deleteAt 컬럼도 추가로 생성됨

<br>

##### models/post.js

```javascript
module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        content: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);
```

게시글 모델 : 게시글 내용과 이미지 경로 저장

게시글 등록자 id 컬럼은 관계만 설정해주면 알아서 시퀄라이즈가 생성해줌

<br>

##### models/hashtag.js

```javascript
module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', {
        title: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);
```

해시태그 모델

해시태그를 모델로 따로 두는 이유는, 나중에 태그로 검색하기 위함

<br>

이제 생성한 모델을 시퀄라이즈에 등록하자

models/index.js에 있는 기존 코드를 수정한다.

<br>

```javascript
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('/../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

//User와 Post는 1:N 관계
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

//Post와 Hashtag는 N:M 관계
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});

//User와 User간 N:M 관계 - 팔로워, 팔로잉
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});

db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

module.exports = db;

```

<br>

같은 테이블간의 다대다 관계에서는 모델과 컬럼 이름을 따로 정해줘야 함

through 옵션으로 모델 이름을 생성할 수 있음

<br>

Follow모델에서는 사용자 아이디를 저장하는 컬럼 이름이 둘다 userId면 구분이 되지 않기 때문에 따로 설정해야함 (foreign key로 구별시키자)

as 옵션은 시퀄라이즈가 JOIN 작업 시 사용하는 이름

<br>

<br>

즉, NodeBird의 모델은 직접 생성한 User, Post, Hashtag와 시퀄라이즈가 관계를 파악해 생성해준 PostHashtag, Follow까지 총 5개로 구성되어있다.

<br>

시퀄라이즈는 config.json을 읽어 데이터베이스를 생성해주는 기능이 존재함

config.json에서 자신이 사용하는 mysql db의 password를 입력하고 db이름은 nodebird로 바꾼다

<br>

콘솔에 아래와 같이 입력하면 시퀄라이즈가 db를 자동으로 생성해줌!

```
sequelize db:create
```

<br>

app.js에 모델을 서버와 연결시킨다

```javascript
...

const { sequelize } = require('./models'); // 추가
const app = express();
sequelize.sync(); // 추가

...
```

<br>

<br>

### Passport 모듈로 로그인 구현하기

<br>

회원가입과 로그인을 직접 구현할 수 있지만, 쿠키와 세션 등 복잡한 작업이 많기 때문에 검증된 모듈을 사용하는 것이 좋다.

이때 사용하는 것이 바로 Passport 모듈

<br>

Passport를 통해 카카오, 구글 등 SNS 로그인도 가능하게 만들 수 있다.

<br>

설치

```
npm i passport passport-local passport-kakao bcrypt
```

<br>

app.js에 passport 모듈 미리 연결해두기

```javascript
const passport = require('passport');
const passportConfig = require('./passport');

...

passportConfig(passport);

...

app.use(passport.initialize());
app.use(passport.session());
```

`require('passport');`은 `require('passport/index.js');`와 같음

<br>

app.use(passport.initialize()); : 요청 설정일 심음
app.use(passport.session()); : req.session 객체에 passport 정보 저장

<br>

> req.session 객체는 express-session에서 생성하기 때문에 passport 미들웨어는  express-session 미들웨어보다 뒤에 연결해야 함

<br>

passport폴더에 index.js를 만든다

```javascript
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.find({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
```

serializeUser는 req.session 객체에 어떤 데이터를 저장할지 선택하는 것

매개변수로 user를 받고, done 함수에 두번째 인자로 user.id를 넘기고 있음

(첫번째 인자는 에러 발생 시 사용하는 것이므로 두번째 인자가 중요)

※세션에 사용자 정보 모두 저장하면 용량이 커지므로 아이디만 저장하라고 한 상황

<br>

deserializeUser는 매 요청 시 실행됨. passport.session() 미들웨어가 이 메서드를 호출함

serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회함. 

조회한 정보를 req.user에 저장하면서  이를 통해 로그인한 사용자의 정보를 가져올 수 있음

<br>

#### 로컬 로그인 구현하기

SNS 서비스가 아닌 자체 회원가입 후 로그인하는 것을 의미

따라서 회원가입을 따로 만들어야 함

<br>

이를 라우터로 구현해야 하는데, 접근 조건이 있음

왜냐하면, 로그인 이후에는 회원가입 혹은 로그인 라우터에 접근하면 안됨

마찬가지로, 로그인 하기 전에는 로그아웃 라우터에 접근하면 안됨

<br>

이처럼 접근 권한을 제어하는 미들웨어가 필요한데, 이 메소드가 `isAuthenticated`임

<br>

##### routes/middlewares.js

```javascript
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};
```

로그인 중이면 req.isAuthenticated()가 true

<br>

이 미들웨어를 활용하기 위해  page.js를 수정해보자

```javascript
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/', (req, res) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

module.exports = router;
```

<br>

profile은 로그인해야 볼 수 있으므로  isLoggedIn

회원가입은 로그인하지 않은 상태여야 하므로 isNotLoggedIn

<br>

이 미들웨어는 다양한 곳에서 활용이 가능함

<br>

이제  user의 값에 req.user를 넣은 것을 확인할 수 있음

pug에서  user 객체를 통해 사용자 정보에 접근할 수 있게 되었음

<br>

##### routes/auth.js

```javascript
const express = require('express');
const passport = require('passort');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.find({ where: { email }});
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다

});

router.get('/logout', isLoggedIn, (req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
```

<br>

join 라우터 부분은 회원가입 영역이다.

기존에 같은 이메일 가입 사용자가 있는 지 조회하고, 

있으면 flash를 통해 메시지를 설정하고 회원가입 페이지로 되돌려보냄

없으면 비밀번호를 암호화하고, 사용자 정보를 생성

이때, 회원가입 시 비밀번호는 암호화해서 저장해야 함 (bcrypt 모듈 사용)

bcrypt 모듈의 hash 메소드를 통해 쉽게 비밀번호 암호화가 가능함

12로 설정한 두번째 인자는 비밀번호를 숫자가 높을수록 더욱 어렵게 만듬

<br>

login 라우터 부분은 로그인 영역이다.

미들웨어 안에  passport.authenticate('local') 미들웨어를 만들었는데, 사용자 정의를 추가하고 싶을 때 이렇게 함. 마지막에 (req, res, next) 인자를 제공해 호출하면 됨

req.login은 serializeUser를 호출함

<br>

logout 라우터 부분은 로그아웃 영역이다.

req.logout 메소드는 req.user 객체를 제거

req.session.destroy는 req.session 객체의 내용을 제거

세션 정보 지운 후에는 메인 페이지로 돌아감

<br>

##### passport에 로그인 전략 구현

##### passport/localStrategy.js

```javascript
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const exUser = await User.find({ where: { email }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};
```

<br>

usernameField와 passwordField에 req.body 속성명을 적어주면 됨

<br>

실제 전략 수행은 async에서 일어남

위에 넣어준 email과 password가 매개변수로 들어오고, done은 passport.authenticate의 콜백함수임

<br>

<br>

#### 카카오 로그인 구현하기

카카오 로그인 전략은 로컬보다 약간 복잡

##### passport/kakaoStrategy.js

```javascript
const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
```

카카오에서 발급받는 아이디 또한 노출되지 않아야 하므로 `process.env.KAKAO_ID`로 만들고 .env에서 관리하도록 해야함

<br>

회원가입을 따로 짤 필요는 없고 auth.js에 아래와 같이 추가만 해준다

```javascript
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});
```

<br>

layout.pug 카카오톡 버튼에 /auth/kakao 링크가 붙어있음

이 결과는 /auth/kakao/callback으로 받고, 이 라우터에서 카카오 로그인 전략을 수행

<br>

##### 로컬 로그인과 다른점?

passport.authenticate 메소드에서 콜백 함수를 제공하지 않음

카카오 로그인은 내부적으로 req.login을 호출하므로 우리가 직접 할 필요X

콜백 함수 대신 로그인 실패시 어디로 이동할지 failureRedirect로 경로를 적어주기만 하면 됨

<br>

이제 추가된 auth 라우터를 app.js에 연결

```javascript
const authRouter = require('./routes/auth');

...

app.use('/auth', authRouter);
```

<br>

이제 kakaoStrategy.js의 클라이언트ID를 발급받아야 함

https://developers.kakao.com에 접속해 회원가입 후 카카오용 NodeBird 앱 생성하기

앱 만들고 REST API 키를 .env 파일에 담아둔다

일반-설정으로 들어가서 플랫폼 추가를 눌러 웹으로 http://localhost:8001을 추가해둔다.

설정-사용자 관리 메뉴에서 사용을 ON으로 만들고 프로필 정보와 이메일만 수집하도록 설정후 저장하면 끝

<br>

<br>

<br>

### Multer 모듈로 이미지 업로드 구현하기

<br>

SNS이므로 이미지 업로드가 필요함

이에 활용되는 multer 모듈을 설치하자

```
npm i multer
```

<br>

우리는 input 태그를 통해 이미지를 선택할 때 먼저 업로드를 진행하고, 업로드된 사진 주소를 다시 클라이언트에 알려주는 방식으로 진행할 것임

<br>

따라서 게시글 저장 시에는 이미지 데이터가 아닌 이미지 주소를 저장한다

이에 필요한 post 라우터를 작성해보자

<br>

##### routes/post.js

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// fs 모듈은 이미지를 업로드할 uploads 폴더가 없을 때 uploads 폴더를 생성함
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

// storage : 파일 저장 방식, 경로, 파일명 등 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 날짜를 붙이는 건 중복 막기 위해
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024}, // 최대 허용치
});

// 이미지 업로드를 처리하는 라우터
// single 미들웨어를 사용했고, 앱에서 ajax로 이미지를 보낼때 속성이름을 img로 설정함
// 이미지 처리 후 req.file 객체에 결과를 저장함
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});


// 게시글 업로드를 처리하는 라우터
// 이미지를 업로드했으면, 이미지 주소도 req.body.url로 전송됨
// 이미지 데이터를 직접 가져오는 것이 아니라 url을 가져오므로 none() 메소드를 사용한 상태
// 게시글을 db에 저장한 후, 내용에서 해시태그를 정규표현식으로 추출해냄
// 추출한 해시태그를 db에 저장한 후, addHashtags 메소드로 게시글과 해시태그 관계를 PostHashtag 테이블에 넣음
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map( r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
```

<br>

게시글 작성 기능이 추가되었으니 메인 페이지 로딩시 메인 페이지와 게시글을 함께 로딩하도록 바꾸자

<br>

##### routeds/page.js

```javascript
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/', (req, res) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
    })
        .then((posts) => {
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;
```

<br>

<br>

### 프로젝트 마무리

해시태그 검색 기능과 팔로잉 추가까지 완료한다

<br>

##### routes/post.js

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// fs 모듈은 이미지를 업로드할 uploads 폴더가 없을 때 uploads 폴더를 생성함
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

// storage : 파일 저장 방식, 경로, 파일명 등 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 날짜를 붙이는 건 중복 막기 위해
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024}, // 최대 허용치
});

// 이미지 업로드를 처리하는 라우터
// single 미들웨어를 사용했고, 앱에서 ajax로 이미지를 보낼때 속성이름을 img로 설정함
// 이미지 처리 후 req.file 객체에 결과를 저장함
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});


// 게시글 업로드를 처리하는 라우터
// 이미지를 업로드했으면, 이미지 주소도 req.body.url로 전송됨
// 이미지 데이터를 직접 가져오는 것이 아니라 url을 가져오므로 none() 메소드를 사용한 상태
// 게시글을 db에 저장한 후, 내용에서 해시태그를 정규표현식으로 추출해냄
// 추출한 해시태그를 db에 저장한 후, addHashtags 메소드로 게시글과 해시태그 관계를 PostHashtag 테이블에 넣음
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map( r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
      return res.redirect('/');
    }
    try {
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
        posts = await hashtag.getPosts({ include: [{ model: User }] });
      }
      return res.render('main', {
        title: `${query} | NodeBird`,
        user: req.user,
        twits: posts,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

module.exports = router;
```

<br>

<br>

##### routes/user.js

```javascript
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
```

<br>

##### passport/index.js

```javascript
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
```

<br>

<br>

##### app.js에 추가

```javascript
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

...

app.use('/img', express.static(path.join(__dirname, 'uploads')));

...

app.use('/post', postRouter);
app.use('/user', userRouter);
```

<br>
