var weijifenCommon = require("WJFCommon");
var tongyi = true;
var a = 1;
cc.Class({
    extends: weijifenCommon,
    properties: {
        agree:{
            default:null,
            type: cc.Node
        },
        successBtn:{
            default:null,
            type: cc.Node
        },
        loginLogoNode:{
            default:null,
            type:cc.Node
        },
        WZLogo:{
            default:null,
            type:cc.SpriteFrame
        },
        CCLogo:{
            default:null,
            type:cc.SpriteFrame
        },
        JXLogo:cc.SpriteFrame,
        NJLogo:cc.SpriteFrame,
    },
    // 首次加载页面方法
    onLoad: function () {
        var GameBase = {'gameModel':'ch'} ;
        cc.weijifen.GameBase = GameBase ;
        var sprite = this.loginLogoNode.getComponent(cc.Sprite);
        if(cc.weijifen.GameBase.gameModel =='wz'){
            sprite.spriteFrame = this.WZLogo;
        }else if(cc.weijifen.GameBase.gameModel == 'ch'){
            sprite.spriteFrame = this.CCLogo;
            //隐藏游客登录按钮
            let youkeBtn = cc.find("Canvas/global/button/button2");
            youkeBtn.active = false;
            //微信登录按钮剧中
            let wxBtn = cc.find("Canvas/global/button/button1");
            wxBtn.setPosition(0,-63);
        }else if(cc.weijifen.GameBase.gameModel == 'jx'){
            sprite.spriteFrame = this.JXLogo;
            let rightTopLogo = cc.find("Canvas/global/image/xuntianyou");
            rightTopLogo.active = false;
            this.loginLogoNode.width = 480;
            this.loginLogoNode.height = 120;
        }else if(cc.weijifen.GameBase.gameModel == 'nj'){
            let rightTopLogo = cc.find("Canvas/global/image/xuntianyou");
            rightTopLogo.active = false;
            sprite.spriteFrame = this.NJLogo;
            this.loginLogoNode.width = 480;
            this.loginLogoNode.height = 120;
        }
        var self = this ;
        cc.weijifen.wxAuth = function(code) {
            self.login(code,self) ;
        };
        cc.weijifen.game = {
            model : null ,
            playway : null,
            type:function(name){
                var temp ;
                if(cc.weijifen.game.model !=null){
                    for(var i=0 ; i<cc.weijifen.game.model.types.length ; i++){
                        var type = cc.weijifen.game.model.types[i] ;
                        if(type.code == name){
                            temp = type ;
                        }
                    }
                }
                return temp ;
            }
        };

        //app支付初始化
        cc.weijifen.pay = function(shopId) {
            cc.weijifen.http.httpGet("/ipay/sign?token="+cc.weijifen.authorization+"&shopId="+shopId, self.signSucess , self.error , self);
        };
        
        //获取分享进入的时候，是否分享的游戏房间
        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareParam","");
        if(res){
            res = JSON.parse(res);
            if(res.code != "10086" && res.roomNum){
                cc.weijifen.shareRoomNum = res.roomNum;
            }
        }
    },

    signSucess:function(result , object){
        //object.alert(result);
        //document.location = 'matchList://${data}';
        var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "iPayHandler",result);
        //document.location = 'matchList://{"code": "${data}"}';
    },
    error:function(result , object) {
        
    },

    //游客登录方法
    tourist: function(){
        if(tongyi){
            this.io = require("IOUtils");
            this.loadding();
            if(this.io.get("userinfo") == null){
                //发送游客注册请求
                var xhr = cc.weijifen.http.httpGet("/api/guest", this.guestSucess , this.error , this);
            }else{
                //通过ID获取 玩家信息
                var data = JSON.parse(this.io.get("userinfo")) ;
                if(data.token != null){     //获取用户登录信息
                    var xhr = cc.weijifen.http.httpGet("/api/guest?token="+data.token.id, this.guestSucess , this.error , this);
                }
            }
        }else{
            this.alert('请同意用户使用协议');
        }     
    },
    //同意协议内容
    click: function(toggle){
        tongyi = toggle.isChecked;
    },
    guestSucess:function(result , object){
        object.alert(result);
        var data = JSON.parse(result) ;
        if(data!=null && data.token!=null && data.data!=null){
            //放在全局变量
            object.reset(data , result);
            //预加载场景
            console.log('ok');
            //if(cc.weijifen.games && cc.weijifen.games.length == 1){//只定义了单一游戏类型 ，否则 进入游戏大厅
                object.scene("gameMain" , object) ;
                //cc.director.loadScene('gameMain');
                /**
                 * 传递全局参数，当前进入的游戏类型，另外全局参数是 选场
                 */
                //cc.weijifen.game.model = cc.weijifen.games[0];
            //}else{
                /**
                 * 暂未实现功能
                 */
            //}
        }
    },

    wxlogin: function(){
        // if(cc.sys.localStorage.getItem("xySuccess")!=1){
        //     cc.sys.localStorage.setItem("xySuccess","1");
        //     this.hall("uiuiui");
        //     this.hall("0");
        // }else 
        if(tongyi){
            var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "WXLoginOK","1");
            //this.login('12345',this) ;
            //WXLoginOK
            //this.tourist();
            //this.login();
        }else{
            this.alert('请同意用户使用协议');
        }
    },
    login:function(code,target){
        this.io = require("IOUtils");
        this.loadding();
        // if(this.getUrlParam("invitationcode")){
        //     var code = values[i].split('=')[1];
        //     this.loadding();
        //     cc.weijifen.http.httpGet('/wxController/getLoginCode?invitationcode='+this.getUrlParam("invitationcode"),this.wxseccess,this.error,this);
        // }

        // //判断是否有充值
        // if (this.getUrlParam('status')){
        //     cc.weijifen.paystatus = this.getUrlParam("invitationcode");
        // }

        //直接点击链接登陆
        //console.log(value);
        cc.weijifen.http.httpGet('/android/appLogin?code='+code+'&gameModel='+cc.weijifen.GameBase.gameModel,target.sucess,target.error,target);
    },
    sucess:function(result,object){
        var data = JSON.parse(result) ;
        if(data != null && data.success == true && data.token!=null){
           //放在全局变量
           //object.reset(data , result);
           //cc.weijifen.authorization = data.token;
           //cc.weijifen.user = data.playUser;
           //cc.sys.localStorage.setItem('userinfo',result);
            object.reset(data,result);  
           /**
            * 登录成功后即创建Socket链接
            */
            console.log('ok:'+data.token);
            object.loadding();
            //房间号参数不为空    直接进入房间
            //if (object.getUrlParam('roomNum') != 'null' && object.getUrlParam('roomNum') != null){
            //     var room={};
            //     room.room = object.getUrlParam('roomNum');
            //     room.token = cc.weijifen.authorization;
            //     cc.weijifen.http.httpPost('/api/room/query',room,object.JRsucess,object.JRerror,object);
            // }else{
            //object.connect();
            object.scene('gameMain' , object) ;
            // }
        }
    },
   error:function(object){
       object.closeloadding(object.loaddingDialog);
       object.alert("网络异常，服务访问失败");
   },
   JRsucess: function(result,object){
        var data = JSON.parse(result);
        if(data.playway&&data.room){
            cc.weijifen.room = object.getUrlParam('roomNum');
            if(data.game){
                cc.weijifen.playType = data.game;
            }
            cc.weijifen.playway = data.playway;
            if(data.playerNum){
                cc.weijifen.playerNum = data.playerNum;
            }
            if(data.cardNum){
                cc.weijifen.cardNum = data.cardNum;
            }
            if(data.maxRound){
                cc.weijifen.maxRound = data.maxRound;
            }
            cc.director.preloadScene('majiang',function(){
                cc.director.loadScene('majiang');
            });
        }else{
            object.connect();
            object.scene('gameMain' , object) ;
        }     
    },
    JRerror: function(object){
       
    },
   //获取url中的参数
   getUrlParam:function(name) {
       var url = window.location.search.replace("amp;","");
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
       var r = url.substr(1).match(reg); //匹配目标参数
       if (r != null) return unescape(r[2]); return null; //返回参数值
    }
});
