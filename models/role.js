/**
 * Created by memebox on 16/9/18.
 */
module.exports = function (sequelize, DataTypes) {
    var role = sequelize.define('Role', {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            rolename: {type: DataTypes.STRING, allowNull: false, comment: '角色名', unique: true}
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: 'role',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            
            classMethods: {
                associate: function (models) {
                    role.belongsToMany(models.User, {through: models.UserRoles ,foreignKey: 'role_id', targetKey: 'id'});
                    role.belongsToMany(models.Action, {through: models.RoleAction, foreignKey: 'role_id', targetKey: 'id'});
                }
            }
        });
    
    return role;
}