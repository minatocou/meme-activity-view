module.exports = function(sequelize, DataTypes) {
    var girlsday = sequelize.define("girlsday", {
        productId : { type: DataTypes.BIGINT(20), field: 'product_id', allowNull: false, comment: '产品ID'},
        link: { type: DataTypes.STRING(100), field: 'h5_url', allowNull: true, comment: 'H5链接' },
        name: {type: DataTypes.STRING(100), field: 'product_name', allowNull: true, comment: '产品名称'},
        desc: {type: DataTypes.STRING(100), field: 'description', allowNull: true, comment: '文案'}
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'girls_day',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    return girlsday;
};