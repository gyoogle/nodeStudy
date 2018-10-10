const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const { User } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.find({ 
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

// serializeUser : req.session 객체에 어떤 데이터를 저장할지 선택
// - 매개변수로 user를 받아 done 함수에 두번째 인자로 user.id를 넘기는 상황
// - done 함수의 첫번째 인자는 에러 발생 시 사용, 즉 두번째 인자가 중요
// - 사용자 정보 모두 저장 시 메모리 용량 문제로 아이디만 저장하고 있는 것

// deserializeUser : 매 요청 시 실행. passport.session() 미들웨어가 이 메서드 호출
// - serializeUser에서 세션에 저장했던 아이디를 받아 DB에서 사용자 정보 조회
// - 조회한 정보 req.user에 저장함. 이제 req.user를 통해 로그인한 사용자 정보 가져오기 가능

// 요약
// serializeUser : 사용자 정보 객체를 세션에 아이디로 저장하는 것
// deserializeUser : 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것