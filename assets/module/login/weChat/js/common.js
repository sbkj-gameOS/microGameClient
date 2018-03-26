var WJFCommon = require("WJFCommon");
var tongyi = true;
var a = 1;
cc.Class({
    extends: WJFCommon,
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
    },
    // 首次加载页面方法
    onLoad: function () {
        let WXorBlow;
        tongyi = true;
        var sprite = this.loginLogoNode.getComponent(cc.Sprite);
        if(cc.weijifen.GameBase.gameModel =='wz'){
            sprite.spriteFrame = this.WZLogo;
        }else if(cc.weijifen.GameBase.gameModel == 'ch'){
            sprite.spriteFrame = this.CCLogo;
        }else if(cc.weijifen.GameBase.gameModel == 'jx'){
            sprite.spriteFrame = this.JXLogo;
        }
        /**
         * 游客登录，无需弹出注册对话框，先从本地获取是否有过期的对话数据，如果有过期的对话数据，则使用过期的对话数据续期
         * 如果没有对话数据，则重新使用游客注册接口
         */
        var xySuccess = cc.weijifen.localStorage.get("xySuccess");
        this.tourist();  

        if(xySuccess == 1){
            this.successBtn.active = false;
            this.login();
        }       
        WXorBlow = require('ShareWx');  
        cc.weijifen.WXorBlow = new WXorBlow();
        // cc.weijifen.authorization = '61d8be72e66449aa9e0dc93df8a6122c';//测试用token、
        // 构建打包是放开
        cc.weijifen.http.httpGet('/api/room/reConnection?token='+cc.weijifen.authorization,this.roomSuccess,this.roomError,this);        
        cc.weijifen.WXorBlow.init();   
        //请求获取当前用户是否已经参加了房间   
        
    },
    //重连后进入重新获得的一些数据
    roomSuccess: function(result,object){
        let data = JSON.parse(result);
        if(result.room){
            object.getGame(data);
        }else{
            cc.weijifen.room = null;
        }   
    },
    roomError: function(object){
        object.alert("网络异常");
    },
    //游客登录方法
    tourist: function(){
        if(tongyi){
            this.loadding();
            if(cc.weijifen.localStorage.get("userinfo") == null){
                //发送游客注册请求
                var xhr = cc.weijifen.http.httpGet("/api/guest", this.guestSucess , this.error , this);
            }else{
                //通过ID获取 玩家信息
                var data = JSON.parse(cc.weijifen.localStorage.get("userinfo")) ;
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
        var data = JSON.parse(result) ;
        if(data.error){
            object.alert(data.msg);
            object.closeloadding();
        }else if(data!=null && data.token!=null && data.data!=null){
            object.closealert();
            //放在全局变量
            object.reset(data , result);
            //预加载场景
           object.scene("gameMain" , object) ;        
        }
    },
    wxlogin: function(){
        if(tongyi){
            cc.weijifen.localStorage.put("xySuccess","1");
            this.login();    
        }else{
            this.alert('请同意用户使用协议');
        }
    },
    login:function(){
        this.loadding();
        if(this.getUrlParam("invitationcode")){
            var code = values[i].split('=')[1];
            cc.weijifen.http.httpGet('/wxController/getLoginCode?invitationcode='+this.getUrlParam("invitationcode"),this.wxseccess,this.error,this);
        }
        //判断是否有充值
        if (this.getUrlParam('status')){
            cc.weijifen.paystatus = this.getUrlParam("invitationcode");
        }
        //直接点击链接登陆
        if (this.getUrlParam('userId')){
            cc.weijifen.http.httpGet('/wxController/getWxUserToken?userId='+this.getUrlParam('userId'),this.sucess,this.error,this);
        }
    },
   sucess:function(result,object){
       var data = JSON.parse(result) ;
       if(data.error){
            object.alert(data.msg);
            object.closeloadding();
       }else if(data != null && data.success == true && data.token!=null){
             object.reset(data,result);  
            //房间号参数不为空    直接进入房间
            if (object.getUrlParam('roomNum') != 'null' && object.getUrlParam('roomNum') != null){
                let rooms = object.getUrlParam('roomNum');
                if(typeof(rooms) =='number'&&((cc.weijifen.room!=null&&cc.weijifen.room == rooms)||cc.weijifen.room==null)){
                    var room={};
                    room.token = cc.weijifen.authorization;
                    room.room = rooms;
                }
                cc.weijifen.http.httpPost('/api/room/query',room,object.JRsucess,object.JRerror,object);
            }else{
                object.closealert();
                object.connect();
                object.scene("gameMain" , object) ;
            }
       }
   },
   error:function(object){
       object.closeloadding();
       object.alert("网络异常，服务访问失败");
   },
   JRsucess: function(result,object){
        let data = JSON.parse(result);
        let room = object.getUrlParam('roomNum');
        if(data.error){
            object.alert(data.msg);
            object.closeloadding();
        }else{
            object.closealert();
            if(data.playway&&data.room){
                object.getGame(data,room);
                cc.director.preloadScene('majiang',function(){
                    cc.director.loadScene('majiang');
                });
            }else{
                object.connect();
                object.scene("gameMain" , object) ;  
            } 
        }  
    },
    JRerror: function(object){
        object.closeloadding();
        object.alert('房间加入失败');
    },
   //获取url中的参数
   getUrlParam:function(name) {
       var url = window.location.search.replace("amp;","");
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
       var r = url.substr(1).match(reg); //匹配目标参数
       if (r != null) return unescape(r[2]); return null; //返回参数值
    },
});
