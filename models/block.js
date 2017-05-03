/**
 * Created by memebox on 16/9/6.
 */

module.exports = function (sequelize, DataTypes) {
    var block =  sequelize.define("Block", {
            id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
            position: {type: DataTypes.STRING(100), allowNull: false, comment: 'block 位置'},
            type : {type : DataTypes.INTEGER , allowNull: false,  comment: 'block 类型'},
            cid: {type: DataTypes.BIGINT(11), field: 'canvas_id', allowNull: false, comment: 'canvas id'}
        },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'block',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            
            classMethods:{
                associate : function (models) {
                    block.hasMany(models.Attribute,{foreignKey:'block_id', targetKey:'id', as:'blockAttribute'})
                }
            } 
        });
    return block;

};