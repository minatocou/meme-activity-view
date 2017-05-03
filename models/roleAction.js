/**
 * Created by memebox on 16/9/23.
 */
module.exports = function (sequelize, DataTypes) {
    var roleAction = sequelize.define('RoleAction', {

        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: 'roleAction'
        });
    return roleAction;
}
