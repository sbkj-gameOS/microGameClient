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
        LSLogo:cc.SpriteFrame,
    },
    // 首次加载页面方法
    onLoad: function () {
        cc.log('self',self)
        var GameBase = {'gameModel':'ch'} ;
        cc.weijifen.GameBase = GameBase ;
        cc.sys.localStorage.setItem('version',"1.0.1");
        var sprite = this.loginLogoNode.getComponent(cc.Sprite);
        if(cc.weijifen.GameBase.gameModel =='wz'){
            sprite.spriteFrame = this.WZLogo;
        }else if(cc.weijifen.GameBase.gameModel == 'ch'){
            sprite.spriteFrame = this.CCLogo;
            //隐藏游客登录按钮
            let youkeBtn = cc.find("Canvas/global/button/button2");
            // youkeBtn.active = false;
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
        }else if(cc.weijifen.GameBase.gameModel == 'ls'){
            let rightTopLogo = cc.find("Canvas/global/image/xuntianyou");
            rightTopLogo.active = false;
            sprite.spriteFrame = this.LSLogo;
            this.loginLogoNode.width = 480;
            this.loginLogoNode.height = 120;
        }
        var self = this ;
        cc.weijifen.wxAuth = function(code) {
            



            self.alert('调到wxAuth方法！');




            self.login(code,self) ;
        };
        // 检测是否重新下载app 
        cc.weijifen.http.httpGet('/gameVersion/findVersionNum?orgi='+cc.weijifen.GameBase.gameModel,self.updateSuccess,self.error,self) ;  
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
        // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "shareParam","");
        
        var res = jsb.reflection.callStaticMethod(self.anMethodParam()[0],self.anMethodParam()[1],self.anMethodParam()[2], "shareParam","");
        if(res){
            res = JSON.parse(res);
            if(res.code != "10086" && res.roomNum){
                cc.weijifen.shareRoomNum = res.roomNum;
            }
        }
        
    },
    updateSuccess:function (result,object) {
    	result = JSON.parse(result);
        if (result.success && result.version != cc.sys.localStorage.getItem('version')) {
            cc.find('Canvas/downloadapp').active = true;
            cc.sys.localStorage.setItem('appUrl',result.url);
        }
    },
    signSucess:function(result , object){
        // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "iPayHandler",result);
        var res = jsb.reflection.callStaticMethod(object.anMethodParam()[0],object.anMethodParam()[1],object.anMethodParam()[2], "iPayHandler",result);
       
    },
    err:function(result , object) {
        
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
            object.scene("gameMain" , object) ;
        }
    },

    wxlogin: function(event){
        if(tongyi){
            let object = cc.find('Canvas/js/AppCommon').getComponent('AppCommon');
            // var res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/event/EventManager", "raiseEvent", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "WXLoginOK","1");
            var res = jsb.reflection.callStaticMethod(object.anMethodParam()[0],object.anMethodParam()[1],object.anMethodParam()[2], "WXLoginOK","1");
            
        }else{
            this.alert('请同意用户使用协议');
        }
    },
    login:function(code,target){
        this.io = require("IOUtils");
        this.loadding();
        cc.weijifen.http.httpGet('/android/appLogin?code='+code+'&gameModel='+cc.weijifen.GameBase.gameModel,target.sucess,target.error,target);
    },
    sucess:function(result,object){
        var data = JSON.parse(result) ;
        if(data != null && data.success == true && data.token!=null){
            object.reset(data,result);  
           /**
            * 登录成功后即创建Socket链接
            */
            console.log('ok:'+data.token);
            object.loadding();
            object.scene('gameMain' , object) ;
            // }
        }
    },
   error:function(object){
       object.closeloadding(object.loaddingDialog);
       object.alert("网络异常，服务访问失败");
   },
   //获取url中的参数
   getUrlParam:function(name) {
       var url = window.location.search.replace("amp;","");
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
       var r = url.substr(1).match(reg); //匹配目标参数
       if (r != null) return unescape(r[2]); return null; //返回参数值
    }
});
