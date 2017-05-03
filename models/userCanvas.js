/**
 * Created by memebox on 16/9/23.
 */

module.exports = function (sequelize, DataTypes) {
    var userCanvas = sequelize.define('UserCanvas', {
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: 'userCanvas'
        });
    return userCanvas
}

