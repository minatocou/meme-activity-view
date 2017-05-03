/*
* @Author: Derek Zhou
* @Date:   2017-02-13 15:40:45
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-14 19:18:08
*/
module.exports = function(sequelize, DataTypes) {
    var appdownload = sequelize.define("appdownload", {
    	urlKey: { type: DataTypes.STRING(100), field: 'urlKey', allowNull: false, comment: 'app下载设置'},
        ios: { type: DataTypes.STRING(100), field: 'ios', allowNull: true, comment: 'ios下载地址' },
        android: {type: DataTypes.STRING(100), field: 'android', allowNull: true, comment: 'android下载地址'},
        wechat: {type: DataTypes.STRING(100), field: 'wechat', allowNull: true, comment: 'wechat下载地址'}
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'appdownload',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    return appdownload;
};
