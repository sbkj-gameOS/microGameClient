/*
* @全局方法
*/
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // use this for initialization
    onLoad: function () {
        
    },
    //判断是否有初始化创建wjf全局变量
    ready:function(){
        var check = false ;
        if(cc.weijifen){
            check = true ;
        }else{
            this.scene("login" , this) ;
        }
        return check ;
    },
    connect:function(){
        /**
         * 登录成功后，创建 Socket链接，
         */
        this.disconnect();
        //cc.weijifen.socket = window.io.connect(cc.weijifen.http.wsURL + '/bm/game');
        cc.weijifen.socket = window.io.connect(cc.weijifen.http.wsURL,{'reconnect': true});

        cc.weijifen.socket.ondisconnect = function(){
            console.log('user disconnected');
        };
        cc.weijifen.socket.on('connect_failed', function(data) {
                console.log("connect_failed to Server");  
        });
        cc.weijifen.socket.on('connect_failed', function(data) {
                console.log("connect_failed to Server");
        });
        cc.weijifen.socket.on('error', function(data) {
            console.log("error");
        });
        cc.weijifen.socket.on('error', function(data) {
            console.log("error");
        });
        cc.weijifen.socket.on('reconnecting', function (data) {
            console.log("reconnecting");
        });
        cc.weijifen.socket.on('reconnect', function (data) {
            console.log("reconnect");
        });
        return cc.weijifen.socket ;
    },
    disconnect:function(){
        if(cc.weijifen.socket != null){
            cc.weijifen.socket.disconnect();
            cc.weijifen.socket = null ;
        }
    },
    getCommon:function(common){
        var object = cc.find("Canvas/script/"+common) ;
        return object.getComponent(common);
    },
    loadding:function(){
        if(cc.weijifen.loadding.size() > 0){
            this.loaddingDialog = cc.weijifen.loadding.get();
            this.loaddingDialog.parent = cc.find("Canvas");

            this._animCtrl = this.loaddingDialog.getComponent(cc.Animation);
            var animState = this._animCtrl.play("loadding");
        }
    },
    /*
    * 提示框
    * @param messge 提示文字
    * @param matchFlag isStop倒计时停止，提示框消失的标志；isMatch“确定按钮消失”
    */
    alert:function(message,matchFlag){
        if(cc.weijifen.dialog.size() > 0){
            this.alertdialog = cc.weijifen.dialog.get();
            this.alertdialog.parent = cc.find("Canvas");
            let node = this.alertdialog.getChildByName("message") ;
            if(node!=null && node.getComponent(cc.Label)){
                node.getComponent(cc.Label).string = message ;
            }
        }
        return this.alertdialog;
    },
    closeloadding:function(){
        cc.weijifen.loadding.put(cc.find("Canvas/loadding"));
    },
    closealert:function(){
        if(cc.find("Canvas/alert")){
            cc.weijifen.dialog.put(cc.find("Canvas/alert"));
        }
    },
    scene:function(name , self){
        cc.director.preloadScene(name, function () {
            if(cc.weijifen){
                self.closeloadding(self.loaddingDialog);
            }
            cc.director.loadScene(name);
        });
    },
    root:function(){
        return cc.find("Canvas");
    },
    decode:function(data){
        var cards = new Array();
        if(!cc.sys.isNative) {
            var dataView = new DataView(data);
            for(var i= 0 ; i<data.byteLength ; i++){
                cards[i] = dataView.getInt8(i);
            }
        }else{
            var Base64 = require("Base64");
            var strArray = Base64.decode(data) ;
            if(strArray && strArray.length > 0){
                for(var i= 0 ; i<strArray.length ; i++){
                    cards[i] = strArray[i];
                }
            }
        }
        return cards ;
    },
    parse(result){
        var data ;
        if(!cc.sys.isNative){
            data = result;
        }else{
            data = JSON.parse(result) ;
        }
        return data ;
    },
    reset:function(data , result){
        //放在全局变量
        if ( data.token ) {
            if ( data.token.id ) {
                cc.weijifen.authorization = data.token.id;
            } else {
                cc.weijifen.authorization = data.token;
            }
        };
    
        if(data.data){
            cc.weijifen.user = data.data ;
        }
        if(data.playUser){
            cc.weijifen.user = data.playUser;
        }
        
        if(data.game){
            cc.weijifen.games = data.games ;
        }
        cc.weijifen.playway = null ;
        cc.weijifen.localStorage.put("userinfo" ,result );
    },
    logout:function(){
        if(cc.weijifen.dialog != null){
            cc.weijifen.dialog.destroy();
            cc.weijifen.dialog = null ;
        }
        cc.weijifen.authorization = null ;
        cc.weijifen.user = null ;
        cc.weijifen.games = null ;

        cc.weijifen.playway = null ;

        this.disconnect();
    },
    socket:function(){
        let socket = cc.weijifen.socket ;
        if(socket == null){
            socket = this.connect();
        }
        return socket ;
    },
    map:function(command, callback,self){
        self.routes[command] = callback || function(){};
    },
    /*
    * @param self MJDataBind.js节点
    */
    route:function(command,self){
        return self.routes[command] || function(){};
    },
    talkPlay:function(){},
    talkRecord:function(){},
    ab2str: function(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    },
    str2ab: function(str) {
        var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
             bufView[i] = str.charCodeAt(i);
        }
        return buf;
    },
    getGame: function(data,room){
        if(data.match){
            cc.weijifen.match = data.match ; 
        }
        if(data.room){
            cc.weijifen.room = data.room;
        }else if(room){
            cc.weijifen.room = data.room;
        }
        if(data.playway){
            cc.weijifen.playway = data.playway;
        }
        if(data.playerNum){
            cc.weijifen.playerNum = data.playerNum;
        }
        if(data.cardNum){
            cc.weijifen.cardNum = data.cardNum;
        }
        if(data.maxRound){
            cc.weijifen.maxRound = data.maxRound;
        }
    },
    //加载玩家头像
    headImg: function(img,pic,bol){
        if(pic){
            let imgurl = pic;
            let sprite = img.getComponent(cc.Sprite);
            cc.loader.load({url:imgurl,type:'jpg'},function(err,texture){
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                img.width = 64;
                img.height = 64;
                if(bol == true){
                    img.radius = 10;
                }
            })
        } 
    },
    //点击打开弹窗
    hall:function(num,url){
        if (num == 90) {
            this.alert('敬请期待！');
            return
        }
		let menu = cc.weijifen.menu.get();//拿到公用弹框PreFab
        let single = menu.getComponent('menuSet');//获取当前PreFab中名字为menuSet  js文件
        menu.parent = cc.find('Canvas');// 将节点放在Canvas节点下面。
        single.init(num,url);//调用js文件中的init方法
    },
    wrong: function(){
        let menu = cc.find("Canvas/menu") ;// 在cocos对象下找到menu节点
        cc.weijifen.menu.put(menu);
    },
    /*阻止点击冒泡*/
    stopBubble: function (event) {
        event.bubble = false;
    },
      /*
    * 比赛倒计时
    */
    countDown: function (matchStartTime) {
        let self = this;
        // matchStartTime = '2018-05-22 17:01:03'
        // let times = (new Date('2018-05-22 17:27:00').getTime() - new Date('2018-05-22 17:17:00').getTime()) / 1000;
        let times = (new Date(matchStartTime).getTime() - new Date().getTime()) / 1000;
        let msg,
            matchFlag = {isStop: null,isMatch: true};
        var timer=null;
      /*  var fenNode = list.getChildByName('time').getChildByName('f').getComponent(cc.Label);
        var miaoNode = list.getChildByName('time').getChildByName('m').getComponent(cc.Label);*/
        if(times<=0 || timer){
            clearInterval(timer);
            return
        }
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        // if(cc.weijifen.dialog.size() > 0){
       /* // 弹窗模式倒计时
        this.alertdialog = cc.weijifen.dialog.get();
        if(this.alertdialog){
            let node = self.alertdialog.getChildByName("message") ;
            if(node!=null && node.getComponent(cc.Label)){
                timer=setInterval(function(){
                    if(times > 0){
                        day = Math.floor(times / (60 * 60 * 24));
                        hour = Math.floor(times / (60 * 60)) - (day * 24);
                        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    } else {
                        clearInterval(timer);
                        self.alertdialog.destroy();
                    }
                    // fenNode.string = minute;
                    // miaoNode.string = second;
                    times--;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    msg = `距比赛开始：${minute}分${second}秒`;
                    node.getComponent(cc.Label).string = msg;
                },1000);
                setTimeout(function(){
                    self.alertdialog.parent = cc.find("Canvas");
                },1000)
            }
        }*/
        // 直接显示在玩法框中
        let wanfa = cc.find('Canvas/rules').getChildByName('label')._components[0];
        timer = setInterval(function(){
            if(times > 0){
                day = Math.floor(times / (60 * 60 * 24));
                hour = Math.floor(times / (60 * 60)) - (day * 24);
                minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            } else {
                clearInterval(timer);
                cc.sys.localStorage.removeItem('matchFlag'); 
                wanfa = cc.weijifen.wanfa;
            }
            // fenNode.string = minute;
            // miaoNode.string = second;
            times--;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            msg = `距比赛开始：${minute}分${second}秒`;
            wanfa.string = msg;
        },1000);
    }
});




