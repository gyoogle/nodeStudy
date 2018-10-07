var relationship1 = {
    name: ['kim', 'lee', 'park'],
    friends: ['a', 'b', 'c'],
    logFriends: function() {
        var that = this; // relationship1을 가리키는 this를 that에 저장
        num = 0;
        this.friends.forEach(function(friend){
            console.log(that.name[num], friend);
            num += 1;
        });
    },
};
relationship1.logFriends();

const relationship2 = {
    name: 'kim',
    friends: ['a', 'b', 'c'],
    logFriends() {
        this.friends.forEach(friend => {
            console.log(this.name, friend);
        });
    },
};
relationship2.logFriends();