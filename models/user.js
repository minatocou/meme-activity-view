/**
 * Created by memebox on 16/9/6.
 */

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('User', {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            username: {type: DataTypes.STRING, allowNull: false, comment: '用户名',unique: true},
            realname: {type: DataTypes.STRING, allowNull: true, comment: '登录名'},
            password: {type: DataTypes.STRING, allowNull: false, comment: '用户密码'},
            salt: {type: DataTypes.STRING, allowNull: false, comment: '盐'},
            active: {type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true, comment: '是否正常状态'}
        },
        {
            timestamps: true,
            underscored: true,
            paranoid: false,
            freezeTableName: true,
            tableName: 'user',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            
            classMethods: {
                associate: function (models) {
                    user.belongsToMany(models.Canvas, {through: models.UserCanvas , foreignKey: 'user_id', targetKey: 'id'});
                    user.belongsToMany(models.Role, { through: models.UserRoles , foreignKey: 'user_id', targetKey: 'id'});
                    user.hasMany(models.Picture ,{ foreignKey: 'user_id', targetKey: 'id'})
                }
            }
        });
    
    return user;
}