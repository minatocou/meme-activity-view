/**
 * Created by memebox on 16/9/18.
 */
module.exports = function (sequelize, DataTypes) {
    var action = sequelize.define('Action', {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            name : {type: DataTypes.STRING(100) ,allowNull: false, comment: 'permission name'},
            action :{type: DataTypes.STRING(100) ,allowNull: false, comment: 'action name'}
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            tableName: 'action',
            charset: 'utf8',
            collate: 'utf8_general_ci',

            classMethods: {
                associate: function (models) {
                    action.belongsToMany(models.Role, {through: models.RoleAction, foreignKey: 'action_id', targetKey: 'id'});
                }
            }
        });

    return action;
}