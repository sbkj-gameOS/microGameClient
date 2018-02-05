cc.Class({
    extends: cc.Component,
    properties: {
    },
    // use this for initialization
    onLoad: function () {},
    closeAlert: function(){
        debugger
        let dialog = cc.find("Canvas/alert") ;
        cc.weijifen.dialog.put(dialog);
    },
    closeMenu: function(){
        debugger
        let menu = cc.find("Canvas/menu");
        cc.weijifen.menu.put(menu);
    },
    toHall:function(){
        debugger
        cc.director.loadScene("gameMain") ;
    },
    closeWIND: function(){
        debugger
        // 摧毁弹出框
        cc.find('Canvas/alert').destroy();
    },
    leavaNotice: function(){
        debugger
        this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    },
    overNotice: function(){
        debugger
        this.node.dispatchEvent( new cc.Event.EventCustom('overGame', true) );
    },
});
