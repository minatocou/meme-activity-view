/**
 * Created by memebox on 16/9/6.
 */

module.exports = function (sequelize, DataTypes) {
    var canvas =  sequelize.define("Canvas", {
            id: {type: DataTypes.STRING(50), primaryKey: true, unique: true,allowNull:false},
            urlKey: {type: DataTypes.STRING(100), field: 'url_key', allowNull: false, comment: 'url key'},
            background: {type: DataTypes.STRING(11), allowNull: true, comment: '背景色'},
            title: {type: DataTypes.STRING(20), allowNull: true, comment: '页面title'},
            state:{type:DataTypes.BOOLEAN,comment:'页面状态'},
            setting:{type:DataTypes.TEXT,allowNull: false,comment:'canvas设置项'},
            lastOne:{type: DataTypes.STRING, allowNull: false, comment: '最后操作人'},
            type:{type: DataTypes.INTEGER, allowNull: false, defaultValue : 0, comment: 'canvas 类型(h5 pc)'},
            department:{type: DataTypes.INTEGER, allowNull: false, defaultValue : 1, comment: '部门类型'}
        },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'canvas',
            charset: 'utf8',
            collate: 'utf8_general_ci',

            classMethods :{
                associate : function (models) {
                    canvas.hasMany(models.Block,{foreignKey:'canvas_id', targetKey:'id', as:'canvasBlock'})
                    canvas.belongsToMany(models.User, {through: 'userCanvas',as :'UserCanvas', foreignKey: 'canvas_id', targetKey: 'id'});
                }
            }
        });
    return canvas;
};