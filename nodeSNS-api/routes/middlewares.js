// 로그인이 되어있는 상황
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

// 로그인이 되어있지 않은 상황
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else {
        res.redirect('/');
    }
};