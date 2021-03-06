var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        button:cc.Node,
        labei: cc.Node,
        txt:cc.Label,
        button2:cc.Node,
        nosure:cc.Label,
        labei2:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.button.active = true;
        this.labei.active = false;
        this.time;
    },
    // 解散游戏按钮  弹出弹窗
    // overGamenotice:function(){
    //     var mj = cc.find('Canvas').getComponent('MJDataBind');
    //     if(mj.alert.size()>0){
    //         var alert = mj.alert.get();
    //         alert.parent = cc.find("Canvas");
    //         let node = alert.getComponent('overGameClick') ;
    //         node.txt.string = '是否发起解散' ;
            
    //     }
    // },
   
    //离开游戏  不结束游戏
    // leaveGameClick:function(){

    //     this.scene("gameMain" , this);
    //     this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    // },
    //点击 确认结束游戏
    init: function(){
        this.button.active = true;
        this.labei.active =false;
        this.labei2.active =false;
       /* cc.weijifen.GameBase.gameModel == 'ch' ? this.time = 120
                                               : this.time = 30;*/
    },
    overGameClick:function(){
        /*
        * button为overGame时下部按钮
        * button2为离开但不退游戏的下部按钮
        * labei：等待玩家显示字
        */
        //this.scene("gameMain" , this);
        let date = new Date();
        cc.sys.localStorage.setItem('unOver','true');
        // cc.sys.localStorage.setItem('overClickTime',date);
        this.button.active = false;
        this.button2.active = false;
        this.labei.active = true;
        this.labei2.active = false;
        /**
         * cango：当用户对解散请求做过处理，点过同意或者拒绝，存入数据值
         * 解决问题：防止用户在没处理解散请求的时候，刷新了界面或者离开了游戏再次进入的时候，加载了页面，获取了overinfo事件，将同意拒绝的弹框过滤掉了
         */
        cc.sys.localStorage.setItem("cango",1);
        this.daojishi();
        this.labei2.string = '还有'+this.time +'自动解散';
        this.node.dispatchEvent( new cc.Event.EventCustom('overGame', true) );
        //两秒内消失
        let timer = setTimeout(function(){
            let mj = cc.find('Canvas').getComponent('MJDataBind');
            if (!mj) {return};
            let dialog = cc.find("Canvas/alert") ;
            mj.alert.put(dialog);
            cc.sys.localStorage.removeItem("jiesanTime");
            clearTimeout(timer);
        },2000);
    },
    //继续游戏 发送一个不退出请求
    goonGameClick: function(){
        
        if(cc.sys.localStorage.getItem("userOverBtn") != 1){
            let REFUSE = true;
            var oper = new cc.Event.EventCustom('overGame', true) ;
            // var oper = new cc.Event.EventCustom('overGame', true) ;
            oper.setUserData(REFUSE) ;
            this.node.dispatchEvent( oper );
        }
        cc.sys.localStorage.setItem("cango",1);//
        let mj = cc.find('Canvas').getComponent('MJDataBind');
        cc.sys.localStorage.removeItem("dengdai");
        cc.sys.localStorage.removeItem("userOverBtn");
        let dialog = cc.find("Canvas/alert") ;
        mj.alert.put(dialog);
    },
    dontLeaveGameClick: function(){
        let mj = cc.find('Canvas').getComponent('MJDataBind');        
        let dialog = cc.find("Canvas/alert") ;
        dialog.destroy();
    },
    leaveGameClick:function(){
        // cc.sys.localStorage.setItem('dis','true');        
        
        /*if(cc.weijifen.GameBase.gameModel=='wz'){
            this.scene("温州" , this) ;
        }else{
            this.scene("gameMain" , this);
        }*/
        var msg={
            token:cc.weijifen.authorization,
            orgi:cc.weijifen.GameBase.gameModel,
        }
       
        cc.weijifen.http.httpPost('/apps/platform/room/quit',msg,function(data){
        	var data=JSON.parse(data);
        	if(data.success){
                var a = {};
                a.key = true;
                var oper = new cc.Event.EventCustom('restar', true) ;
                oper.setUserData(a) ;
                this.node.dispatchEvent( oper );
               // cc.director.loadScene('gameMain');
           }else{
             this.txt.string=data.msg;
           }        	
             }.bind(this),
             function(){this.txt.string='离开失败，请稍后重试';
        }.bind(this));    
        // this.scene("gameMain" , this);
        // this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    },
    daojishi: function(){
        this.time =this.time-1;
        if(this.labei2 && this.time > -1){
            this.labei2.getComponent(cc.Label).string = this.time;
            return
        }
        if (this.time < 0 && this.txt && cc.director.getScene().name == 'majiang') {
            let mj = cc.find('Canvas').getComponent('MJDataBind');
            mj.alert.put(this.txt.node.parent);
            cc.sys.localStorage.removeItem('overGameTime');
            clearInterval(mj.t);
        }
    }
    
       
    // setting:function(){

    //     let mjdata = cc.find('Canvas').getComponent('MJDataBind');
    //     var action = cc.moveTo(0.5,336,274);
    //     mjdata.setting_coin.runAction(action);
    //     this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );
        
    // }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
