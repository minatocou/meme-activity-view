/**
 * Created by memebox on 16/9/6.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Attribute", {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            bid: {type: DataTypes.BIGINT(11), field: 'block_id', allowNull: false, comment: '引用的 block id'}

        },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'attribute',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });

};