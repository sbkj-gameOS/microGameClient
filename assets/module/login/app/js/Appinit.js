var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {    
        loaddingPrefab: {
            default: null,
            type: cc.Prefab
        },
        alertPrefab: {
            default: null,
            type: cc.Prefab
        },
        menuPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    // use this for initialization
    onLoad: function () {
        var GameBase = {'gameModel':'ch'} ;
        this.clientPlatForm();
        this.initMgr(GameBase);        
        let he = this;
        if(!cc.sys.isNative && cc.sys.isMobile){
            var canvas = this.node.getComponent(cc.Canvas);
            canvas.fitHeight = true;
            canvas.fitWidth = true;
        }
        //预加载majiang场景
        cc.director.preloadScene('majiang');
    },
    initMgr:function(GameBase){
        let he = this;
        if(cc.weijifen == null){
            let HTTP = require('HTTP');
            cc.weijifen = {};
            cc.weijifen.settingflag = false;
            cc.weijifen.http = HTTP;
            cc.weijifen.localStorage = require('IOUtils');
            cc.weijifen.seckey = "weijifen";
            cc.weijifen.GameBase = GameBase ;
            // cc.weijifen.dialog = null ;
            cc.weijifen.dialogtwo = null;
            cc.weijifen.paystatus = null ;
            cc.weijifen.matchTime = null;
            cc.weijifen.starttime ='';
            cc.weijifen.room = null;
            cc.weijifen.loadding = new cc.NodePool();
            cc.weijifen.loadding.put(cc.instantiate(this.loaddingPrefab)); // 创建节点
            cc.weijifen.dialog = new cc.NodePool();
            cc.weijifen.dialog.put(cc.instantiate(this.alertPrefab)); // 创建节点
            cc.weijifen.dialog.put(cc.instantiate(this.alertPrefab)); 
            cc.weijifen.menu = new cc.NodePool();
            cc.weijifen.menu.put(cc.instantiate(this.menuPrefab));//菜单框
            //单击/双击
            cc.weijifen.click = cc.sys.localStorage.getItem('click');
            //游戏场景的背景
            cc.weijifen.bgcolor = cc.sys.localStorage.getItem('bgcolor');
            cc.weijifen.cardPostion = {
                x: 540,
                y: -300
            };
            cc.weijifen.genders = {
                current: null,
                right: null,
                top: null,
                left: null
            }
            cc.weijifen.cardcolor = cc.sys.localStorage.getItem('cardcolor');
            //唱戏场景的麻将牌花色
            cc.sys.localStorage.setItem('cardcolor','yellow');
            //声音的
            var Audios = require("Audios");
            cc.weijifen.audio = new Audios();
            cc.weijifen.audio.init();
            
            if(cc.sys.isNative){
                window.io = SocketIO;
            }else{
                window.io = require("socket.io");
            }
            //播放背景音乐
            if(cc.sys.localStorage.getItem('nobgm') != 'true'){
                cc.weijifen.audio.playBGM("bgFight.mp3");
            }
                // HTTP.wsURL = '121.40.98.233:9081';
            cc.weijifen.http.httpGet('/apps/platform/find/server/address?orgi='+ cc.weijifen.GameBase.gameModel,function(res){
                HTTP.wsURL = res;
            },function(err){console.log('请求出错')},he);
        }
    },
    downApp: function () {
        let object = cc.find('Canvas').getComponent('Appinit');
        let url = cc.sys.localStorage.getItem('appUrl');
        cc.find('Canvas/downloadapp').active = false;
        // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "openView",url);
        var res = jsb.reflection.callStaticMethod(...object.anMethodParam().openView,url);
    },
    hideDownTips: function () {
        cc.find('Canvas/downloadapp').active = false;
    },
  
});
