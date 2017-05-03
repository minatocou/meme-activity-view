/**
 * Created by memebox on 16/9/23.
 */
/**
 * Created by memebox on 16/9/23.
 */

module.exports = function (sequelize, DataTypes) {
    var userRoles = sequelize.define('UserRoles', {

        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: 'userRoles'
        });
    return userRoles;
}


