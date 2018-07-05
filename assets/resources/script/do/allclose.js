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
    closeMenu: function(event){
        // let menu = cc.find("Canvas/menu");
        let menu = event.target.parent;
        if (menu.children[2].active) {
            cc.weijifen.gongaoAlertNum--;
        }
        cc.weijifen.matchFlag = false;
        cc.weijifen.menu.put(menu);
        if (cc.sys.localStorage.getItem('matchData')) {
            cc.sys.localStorage.removeItem('matchData');
        }
    },
    closeSetting: function () {
        let setting = cc.find("Canvas/setting");
        // cc.weijifen.menu.put(setting);
        setting.active = false;
    },
    toHall:function(){
        cc.director.loadScene("gameMain") ;
    },
    closeWIND: function(){
        // 摧毁弹出框
        // cc.find('Canvas/alert').destroy();
        cc.find('Canvas/setting').destroy();
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
        
    },
});
