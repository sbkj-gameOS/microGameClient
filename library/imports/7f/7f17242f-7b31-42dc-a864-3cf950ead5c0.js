"use strict";
cc._RF.push(module, '7f172QvezFC3KhkPPlQ6tXA', 'HTTP');
// resources/script/lib/HTTP.js

"use strict";

var HTTP = cc.Class({
    extends: cc.Component,

    properties: {},
    statics: {
        //127.0.0.1:8188 192.168.0.101
        // 测试
        baseURL: "http://game.daily.bizpartner.cn",
        wsURL: "http://game.daily.bizpartner.cn:9081",

        // 正式
        // baseURL:"http://game.bizpartner.cn",
        // wsURL : "http://game.bizpartner.cn:9081",

        /*  // 于浩
          baseURL:"http://192.168.123.222:8081",
          wsURL : "http://192.168.123.222:9081",*/

        authorization: null,
        httpGet: function httpGet(url, success, error, object) {
            var xhr = cc.loader.getXMLHttpRequest();
            cc.weijifen.url = HTTP.baseURL;

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var respone = xhr.responseText;
                        if (success) {
                            success(respone, object);
                        }
                    } else {
                        if (error) {
                            error(object);
                        }
                    }
                }
            };
            xhr.open("GET", HTTP.baseURL + url, true);
            if (HTTP.authorization != null) {
                xhr.setRequestHeader("authorization", HTTP.authorization);
            }
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.timeout = 3000; // 5 seconds for timeout

            xhr.send();
        },
        encodeFormData: function encodeFormData(data) {
            var pairs = [];
            var regexp = /%20/g;

            for (var name in data) {
                var value = data[name].toString();
                var pair = encodeURIComponent(name).replace(regexp, "+") + "=" + encodeURIComponent(value).replace(regexp, "+");
                pairs.push(pair);
            }
            return pairs.join("&");
        },
        httpPost: function httpPost(url, params, success, error, object) {
            var xhr = cc.loader.getXMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var respone = xhr.responseText;
                        if (success) {
                            success(respone, object);
                        }
                    } else {
                        if (error) {
                            error(object);
                        }
                    }
                }
            };
            xhr.open("POST", HTTP.baseURL + url, true);
            if (HTTP.authorization !== null) {
                xhr.setRequestHeader("authorization", HTTP.authorization);
            }
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.timeout = 5000; // 5 seconds for timeout
            xhr.send(HTTP.encodeFormData(params));
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RF.pop();