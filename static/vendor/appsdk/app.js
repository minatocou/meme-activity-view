function encode(e){if("object"==typeof e)for(var o in e)if("object"==typeof e[o])e[o]=encode(e[o]);else if(Array.isArray(e[o]))for(var a=0;a<e[o].length;a++)e[o][a]="object"==typeof e[o][a]?encode(e[o][a]):encodeURIComponent(e[o][a]);else e[o]=encodeURIComponent(e[o]);else console.log("不是有效的对象");return e}function invoke(e,o,a){if(console.log("do app",e,o,a),360==appVer.androidVer()||360==appVer.iosVer())console.log("do app ver 360 ",e,o,a),location.href="memebox://"+e+"?action="+o+"&data="+JSON.stringify(a);else if(appVer.androidVer()>360||appVer.iosVer()>360||appVer.iosAlias()){var n={domain:e,action:o};a&&(n.data=a),console.log("do app ver 360 +","memebox://"+encodeURIComponent(JSON.stringify(n))),location.href="memebox://"+encodeURIComponent(JSON.stringify(n))}}function callByJS(e){var o=e.domain+e.action,a={};a.param=e.param||{},console.log(e,o),e.callback&&(callbacks[o]=e.callback),invoke(e.domain,e.action,e.param)}function appCallback(e,o,a){a=a||{};var n=e+o,r=callbacks[n];if(r)try{r(JSON.parse(a)),delete r}catch(c){r(a),delete r}else;}var callbacks=window.callbacks||{},appVer={iosVer:function(){var e=navigator.appVersion.match(/MWProjectTemplate.*/);return e&&e[0].match(/[\d]/g)&&e[0].match(/[\d]/g).join("")},iosAlias:function(){var e=navigator.appVersion.match(/MemeboxAlias.*/);return e&&e[0].match(/[\d]/g)&&e[0].match(/[\d]/g).join("")},androidVer:function(){var e=navigator.appVersion.match(/MeMeAndroid.*/);return e&&e[0].match(/[\d]/g)&&e[0].match(/[\d]/g).join("")}};