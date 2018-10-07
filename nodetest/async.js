async function findAndSaveUser(Users) {
    try{
        let user = await Users.findOne({});
        user.name = 'kim';
        user = await user.save();
        user = await Users.findOne({gender: 'm'});
        // 생략

    } catch(err) {
        console.error(err);
    } 
}

const findAndSaveUser = async (Users) => {
    try{
        let user = await Users.findOne({});
        user.name = 'kim';
        user = await user.save();
        user = await user.findOne({gender: 'm'});
    } catch(err){
        console.error(err);
    }
}