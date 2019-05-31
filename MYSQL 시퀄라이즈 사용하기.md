## MYSQL 시퀄라이즈 사용하기



##### 시퀄라이즈란?

MYSQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리

ORM(Object-relational Mapping)으로 분류됨
(ORM : 자바스크립트 객체와 데이터베이스 릴레이션을 매핑해주는 도구)



##### 시퀄라이즈를 사용하는 이유?

자바스크립트 구문을 알아서 SQL로 바꿔줌

SQL 언어를 직접 사용하지 않아도 자바스크립트만으로 MYSQL 조작이 가능



##### 시퀄라이즈 설치

```
npm i sequelize mysql2
npm i -g sequelize-cli
sequelize init
```

init할 때 warning이 나와도 무시해도 됨

config, models, migrations, seedres 폴더가 생성되었을 것임



models/index.js를 열고, 아래와 같이 수정한다

(cli가 자동으로 생성해주는 코드는 그대로 사용할 때 에러가 발생하기 때문에 필요없는 부분 생략 과정)



```javascript
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```



app.js에 시퀄라이즈를 통해 express app과  mysql을 연결해준다

```javascript
var sequelize = require('./models').sequelize;
sequelize.sync();
```

(index.js는 require시 이름 생략 가능)

sync 메소드를 통해 서버 실행 시 mysql과 연동



※ mysql에 미리 테이블이 만들어져 있어야 연동이 가능함

```sql
CREATE schema nodejs;

use nodejs;

create table nodejs.users (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age INT UNSIGNED NOT NULL,
    married TINYINT NOT NULL,
    comment TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    UNIQUE INDEX name_UNIQUE (name ASC))
	COMMENT = '사용자 정보'
    DEFAULT CHARSET=utf8
    ENGINE=InnoDB;


create table nodejs.comments (
	id INT NOT NULL AUTO_INCREMENT,
	commenter INT NOT NULL,
    comment VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    INDEX commenter_idx (commenter ASC),
    CONSTRAINT commenter
    foreign key (commenter)
    references nodejs.users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    COMMENT = '댓글'
    DEFAULT CHARSET=utf8
    ENGINE=InnoDB;
```





##### models/user.js

```javascript
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        age: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        married: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
    }, {
        timestamps: false,
    });
};
```

시퀄라이즈는 id를 기본키로 연결하므로 id 컬럼은 따로 적을 필요X

sequelize.define 메소드에 테이블명과 각 컬럼 스펙 입력하기



MYSQL 테이블과 컬럼 내용이 일치해야 정확하게 대응함



##### MYSQL : 시퀄라이즈

```
VARCHAR : STRING
INT : INTEGER
TINYINT : BOOLEAN
DATETIME : DATE
NOT NULL : allowNull
```

defaultValue는 기본값(default)를 의미



define 메소드의 3번째 인자는 테이블 옵션임

timestamps가 true라면? createdAt, updatedAt 컬럼을 추가함 (생성 및 수정 시 시간이 자동 입력)

(사용하지 않을거면 위처럼 false로 지정해주기)



댓글에 해당하는 comment.js도 생성한다

```javascript
module.exports = (sequelize, DataTypes) => {

    return sequelize.define('comment', {
        comment: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('now()'),
        },
    }, {
        timestamps: false,
    });

};
```



##### models/index.js에 추가

```javascript
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
```



config/config.json에서 내가 사용하는 mysql 커넥션과 일치시키기 (username, password, database)





#### 관계 정의

---

사용자 한 명은 댓글을 여러개 작성할 수 있다

하지만 댓글 하나에 사용자가 여러명일 수는 없다



이런 관계를 일대다(1:N) 관계라고 함 (사용자 1, 댓글 N)



사용자와 사용자 정보 테이블은 일대일(1:1) 관계

게시글 테이블과 해시태그(#)는 다대다(N:M) 관계



MYSQL에서는 JOIN 기능을 통해 관계를 설정함. 시퀄라이즈에서도 JOIN 기능 구현이 가능



- 1:N = hasMany 메소드 사용 (N:1은 belongsTo)

- 1:1 = hasOne 메소드 사용

- N:M = belongsToMany 메소드 사용



##### models/index.js에 추가

```javascript
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id'});
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id'});
```



##### row 조회

```
select * from users;
User.findAll({});

select * from users limit 1;
User.find({});

select name, married from users;
User.findAll({
    attributes: ['name', 'married'],
});

select name, age from users where married = 1 and age > 30;
const {User, Sequelize: { Op }} = require('../models');
User.findAll({
   attributes: ['name', 'age'],
   where: {
       married: 1,
       age: { [Op.gt]: 30 },
   },
});
```



Op 객체를 불러와 연산자를 활용할 수 있음

- Op.gt : 초과
- Op.gte : 이상
- Op.lt : 미만
- Op.lte : 이하
- Op.ne : 같지 않음
- Op.or : 또는
- Op.in : 배열 요소 중 하나
- Op.notIn : 배열 요소와 모두 다름



##### row 수정

```
UPDATE users set commet = '수정할 내용' where id = 2;

User.update({
    comment: '수정할 내용',
}, {
    where: { id: 2},
});
```



##### row 삭제

```
DELETE FROM users where id = 2;

User.delete({
     where: { id: 2},
});
```

