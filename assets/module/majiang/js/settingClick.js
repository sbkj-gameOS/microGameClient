var WJFCommon = require("WJFCommon");
var allclose = require("allclose");
cc.Class({
    extends: WJFCommon,

    properties: {
        alert2 : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
       
    },
    leaveClick:function(){
        this.openAlert('是否退出房间','hall');
    },
    overClick:function(){
        this.openAlert('是否解散房间','over');
    },
    // 弹框弹出
    openAlert:function(str,close){
        let alert = cc.instantiate(this.alert2);
        alert.children[2].getComponent(cc.Label).string= str;
        alert.children[3].getComponent(cc.Button).clickEvents[0].customEventData = close;
        alert.parent = cc.find('Canvas');
    },
   
});
