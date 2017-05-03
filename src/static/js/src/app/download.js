/*
* @Author: Derek Zhou
* @Date:   2017-02-13 16:14:09
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-14 16:42:40
*/
var appDownload = document.getElementById('download');
var iosUrl = appDownload.getAttribute('data-ios');
var androidUrl = appDownload.getAttribute('data-android');
var wechatUrl = appDownload.getAttribute('data-wechat');

console.log(iosUrl,'1',androidUrl,'2',wechatUrl,'3');
if(/MicroMessenger/.test(window.navigator.userAgent)){
	location.href = wechatUrl;
}
else if(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())){
	location.href = iosUrl;
}
else if(/android/.test(window.navigator.userAgent.toLowerCase())){
	location.href = androidUrl;
}

