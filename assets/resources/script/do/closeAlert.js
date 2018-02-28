cc.Class({
    extends: cc.Component,

    properties: {
        button:cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.button.node.on('click', this.closeAlert, this);
    },
    closeAlert: function(){
        let dialog = cc.find("Canvas/alert") ;
        cc.weijifen.dialog.put(dialog);
    },
    toHall:function(){
        cc.director.loadScene("gameMain") ;
    }
});