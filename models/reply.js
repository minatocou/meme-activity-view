/*
* @Author: Derek Zhou
* @Date:   2016-12-14 11:49:25
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-07 15:42:39
*/

module.exports = function(sequelize, DataTypes) {
    var wechatMsg = sequelize.define("wechatMsg", {
        id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true},
        rule_id: {type: DataTypes.STRING(50), field: 'rule_id', unique: true, allowNull: false, comment: '规则id'},
        title: {type: DataTypes.TEXT, field: 'title', allowNull: true, comment: '规则名'},
        keyword: {type: DataTypes.TEXT, field: 'keyword', allowNull: true, comment: '关键词'},
        reply_content: {type: DataTypes.TEXT, field: 'reply_content', allowNull: false, comment: '回复正文'},
        reply_type: {type: DataTypes.BIGINT(11), field: 'reply_type', allowNull: false, comment: '回复类型'},
        reply_on: {type: DataTypes.BIGINT(11), field: 'reply_on', allowNull: false, comment: '是否开启'}
    }, {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        paranoid: true,
        tableName: 'wechatMsg',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    return wechatMsg;
};
