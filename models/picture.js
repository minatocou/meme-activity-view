/**
 * Created by memebox on 16/9/18.
 */
module.exports = function (sequelize, DataTypes) {
    var picture =  sequelize.define("Picture", {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            url: {type: DataTypes.STRING(100), field: 'url', allowNull: true, comment: '图片地址'}
        },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'picture',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    return picture;
};