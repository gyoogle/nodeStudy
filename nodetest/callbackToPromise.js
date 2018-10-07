function findAndSaveUser(Users) {
    Users.findOne({}, (err, user) => { // 첫번째 콜백
        if(err) {
            return console.error(err);
        }
        user.name = 'kim';
        user.save((err) => { // 두번째 콜백
            if(err) {
                return console.error(err);
            }
            Users.findOne({gender: 'm'}, (err, user) => { // 세번째 콜백
                // 생략
            });
        });
    });
}

function findAndSaveUser1(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'kim';
            return user.save();
        })
        .then((user) => {
            return Users.findOne({gender: 'm'});
        })
        .then((user) => {
            // 생략
        })
        .catch(err => {
            console.error(err);
        });
}