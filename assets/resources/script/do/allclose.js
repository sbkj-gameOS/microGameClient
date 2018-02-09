cc.Class({
    extends: cc.Component,
    properties: {
    },
    // use this for initialization
    onLoad: function () {},
    closeAlert: function(){
        let dialog = cc.find("Canvas/alert") ;
        cc.weijifen.dialog.put(dialog);
    },
    closeMenu: function(){
        let menu = cc.find("Canvas/menu");
        cc.weijifen.menu.put(menu);
    },
    toHall:function(){
        cc.director.loadScene("gameMain") ;
    },
    closeWIND: function()
        // 摧毁弹出框
        cc.find('Canvas/alert').destroy();
    },
    leavaNotice: function(){
        this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    },
     //离开游戏  不结束游戏
    leaveGameClick:function(){
        let WJFFn = require('WJFCommon');
        let WJF = new WJFFn();
        WJF.scene("gameMain" ,WJF);
        this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    },
    /*确定结束游戏*/
    overNotice: function(){
        this.node.dispatchEvent( new cc.Event.EventCustom('overGame', true) );
        // 以下代码可能会会影响房间进入速度
        /*let WjfFn = require('WJFCommon');
        let WJF = new WjfFn();
        let socket = WJF.connect();
        socket.emit("overGame" ,JSON.stringify({})) ;

        this.node.on('gameOver',function(e){
            cc.log('eeeeeeeeeeee',e)
            let alert_pre = cc.find('Canvas/alert');//弹出框
            this.closeMenu();
        })*/
    },
});
