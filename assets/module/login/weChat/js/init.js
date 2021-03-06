/*
* @游戏初始化
*/
var WJFCommon = require("WJFCommon");
var GameBase = {'gameModel':'ch'}
// var GameBase = {'gameModel':'haz'}
// var GameBase = {'gameModel':'ls'}
// var GameBase = {'gameModel':'jx'}


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
        this.initMgr();        
        let he = this;
        if(!cc.sys.isNative && cc.sys.isMobile){
            var canvas = this.node.getComponent(cc.Canvas);
            canvas.fitHeight = true;
            canvas.fitWidth = true;
        }
        //预加载majiang场景
        cc.director.preloadScene('majiang');
    },
    initMgr:function(){
        let he = this;
        if(cc.weijifen == null){
            cc.weijifen = {};
            cc.weijifen.settingflag = false;
            cc.weijifen.GameBase = GameBase ;            
            cc.weijifen.http = require("HTTP");
            cc.weijifen.localStorage = require('IOUtils');
            cc.weijifen.seckey = "weijifen";
            cc.weijifen.dialog = null ;
            cc.weijifen.dialogtwo = null;
            cc.weijifen.paystatus = null ;
            cc.weijifen.matchTime = null;
            cc.weijifen.starttime ='';
            cc.weijifen.room = null;
            cc.weijifen.loadding = new cc.NodePool();
            cc.weijifen.loadding.put(cc.instantiate(this.loaddingPrefab)); // 创建节点
            cc.weijifen.dialog = new cc.NodePool();
            cc.weijifen.dialog.put(cc.instantiate(this.alertPrefab)); // 创建节点
            cc.weijifen.menu = new cc.NodePool();
            cc.weijifen.menu.put(cc.instantiate(this.menuPrefab));//菜单框
            cc.weijifen.cardPostion = {
                x: 540,
                y: -300
            };
            cc.weijifen.genders = {
            }
               /* current: null,
                right: null,
                top: null,
                left: null*/

            // cc.weijifen.matchNodeArr = {2:null,4:null};
            //单击/双击
            cc.weijifen.click = cc.sys.localStorage.getItem('click');
            //游戏场景的背景
            cc.weijifen.bgcolor = cc.sys.localStorage.getItem('bgcolor');
            //唱戏场景的麻将牌花色
            cc.sys.localStorage.setItem('cardcolor','yellow');
            cc.weijifen.cardcolor = cc.sys.localStorage.getItem('cardcolor');
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
            var h5CallCocos = require('h5CallCocos');
            cc.weijifen.match = new h5CallCocos();
        }
    },
});
