var candyMachine = {
    status: {
        name: 'node',
        count: 5,
    },
    getCandy: function(){
        this.status.count--;
        return this.status.count;
    }
};

var getCandy = candyMachine.getCandy;
var count = candyMachine.status.count;


const candyMachine1 = {
    status: {
        name: 'node',
        count1: 5,
    },
    getCandy1() {
        this.status.count--;
        return this.status.count;
    }
};

const { getCandy1, status: { count1 } } = candyMachine1;

var array = ['nodejs', {}, 10, true];
var node = array[0];
var obj = array[1];
var bool = array[array.length - 1];

const array1 = ['nodejs', {}, 10, true];
const [node, obj, , bool] = array1;