# nodeStudy
Node.js를 학습하며 기록한 코드 및 이슈 정리

2018.09.19 학습 시작



- ##### ES2015+

  > 요약 정리 : http://kim6394.tistory.com/103 (18/09/19)


- ##### Node.js 기능

  > 요약 정리 : http://kim6394.tistory.com/104 (18/09/26)

- ##### 익스프레스 웹 서버 만들기
  
  > 요약 정리 : [링크](https://github.com/kim6394/nodeStudy/blob/master/Express%20%EC%82%AC%EC%9A%A9%EB%B2%95.md)
  >
  > 코드 : https://github.com/kim6394/nodeStudy/tree/master/expressWebServer/learn-express
  >
  > express-generator를 통한 익스프레스 프레임워크 구조 빠른 설치
  >
  > 미들웨어 및 라우터 분리 습득
  >
  > 템플릿 엔진 - pug, ejs
  >
  > (18/10/3)

- ##### MYSQL로 시퀄라이즈 사용해서 CRUD 작업하기

  > 요약 정리 : http://kim6394.tistory.com/105 (18/10/7)
  >
  > 코드 : https://github.com/kim6394/nodeStudy/tree/master/sequelize/learn-sequelize
- ##### MongoDB로 몽구스 사용해서 CRUD 작업하기

  > 코드 : https://github.com/kim6394/nodeStudy/tree/master/mongoose/learn-mongoose (18/10/8)

```
시퀄라이즈와 몽구스로 CRUD 작업은 유사하지만, 약간의 차이점이 존재했음
(MySQL과 MongoDB의 차이점이기도.. ORM과 ODM)

1. router의 index.js에서 get메서드로 main('/')에 접속할 시 전체 유저를 불러올 때 시퀄라이즈는 User.findAll()를 사용하고 몽구스는 User.find()를 사용

2. 시퀄라이즈는 데이터베이스의 유저, 코멘트 등의 모델을 만들고, 몽구스는 이를 스키마로 생성

3. 데이터베이스에 연결할 때 시퀄라이즈는 config폴더 안에 config.json에서 데이터베이스 사용자 정보를 입력시킴. 몽구스는 스키마 폴더 안에 index.js에서 connection 처리 시 사용자 정보를 입력.
```



18/10/9 - 시퀄라이즈와 몽구스의 라우터에 존재하는 자바스크립트 파일을 promise 방식에서 ES8의 async/await 방식을 적용해 수정 완료

> 이슈 사항 : post 방식에서 시퀄라이즈와 몽구스의 차이점 
>
> - 시퀄라이즈
>
> ```
> const result = await User.create({
>     name: req.body.name,
>     age: req.body.age,
>     married: req.body.married,
> });
> ```
>
> 시퀄라이즈는 생성자로 만드는 것이 아니라 create 메서드를 활용해 User 모델을 만들기 때문에 바로 변수에 넣어 await으로 생성 
>
> - 몽구스
>
> ```
> const user = new User({
>     name: req.body.name,
>     age: req.body.age,
>     married: req.body.married,
> });
> ```
>
>  몽구스는 생성자로 스키마를 만들기 때문에 먼저 변수에 스키마를 생성한 이후 try-catch문으로 await user.save() 진행

 

- ##### 익스프레스로 SNS 서비스 만들기

> - 이슈
>
>   1. 폴더 내의 index.js 파일은 require 시 이름 생략 가능
>      `require('./passport') == require('./passport/index.js')`
>   2. req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 함
>   3. bcrypt 설치 오류 : 낮은 버전으로 설치해준다.
>      `npm i bcrypt@3.0.0`
>   4. serializeUser : 사용자 정보 객체를 세션에 아이디로 저장하는 것
>      deserializeUser : 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
>      **이렇게 하는 이유는? -> 세션에 불필요한 정보를 저장하지 않기 위해**
>   5. 미들웨어 내의 미들웨어에는 끝에 (req, res, next)를 붙인다.
>   6. LocalStrategy의 async 함수 중 세번째 인자인 done 함수는 passport.authenticate의 콜백 함수
>   7. 카카오톡 웹 플랫폼 사이트 도메인은 kakaoStrategy.js의 callbackURL과 일치해야 한다.
>   8. dotenv 패키지와 .env 파일로 유출되면 안되는 비밀키 관리하기
>   9. 라우터 - routes 폴더 / 데이터베이스 - models 폴더 / pug 파일 - views 폴더에 구분하여 저장하기. 이는 프로젝트 규모가 커져도 관리 용이
>   10. 데이터베이스는 1:1 / 1:N / N:M 관계를 잘 파악해서 만들자
>
> 코드 : https://github.com/kim6394/nodeStudy/tree/master/nodeSNS
>
> 정리 : [링크](https://github.com/kim6394/nodeStudy/blob/master/SNS%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8.md)

- ##### 웹 API 서버 만들기

- ##### 웹 소켓으로 실시간 데이터 전송하기

- ##### 실시간 경매 시스템 만들기

- ##### 구글 API로 장소 검색 서비스 만들기

- ##### CLI 프로그램 만들기

- ##### AWS와 GCP로 배포하기

- ##### 서버리스 노드 개발하기



