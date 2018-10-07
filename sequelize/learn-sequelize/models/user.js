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
    },{
        timestamps: false,
    });
};

// 시퀄라이즈는 알아서 id를 기본 키로 연결하기 때문에 id 컬럼 필요없음
// sequelize.define 메서드로 테이블명, 각 컬럼의 스펙 입력 (mysql 테이블과 일치하도록 작성)

// 세번째 인자 timestamps는 테이블 옵션
// timestamps를 true로 설정하면, 시퀄라이즈는 createdAt과 updateAt 컬럼 추가
// 우리는 이미 created_at을 만들었기 때문에 자동생성하는 timestamps를 false로 설정해둠


// 실무에서는 paranoid, underscored, tableName 옵션도 자주 사용하니 알아둘 것