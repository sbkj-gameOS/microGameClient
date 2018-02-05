var MJDataBind = require("MJDataBind");
var allclose = require("allclose");
cc.Class({
    extends: MJDataBind,

    properties: {
        alert2 : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
       
    },
    settingBtnClick: function (event) {
        // var action = cc.moveTo(0.5,cc.p(390,265));
        let settting_box = cc.find('Canvas/other/setting');
        cc.weijifen.settingflag = !cc.weijifen.settingflag;
        if(cc.weijifen.settingflag){
            settting_box.active = true;
            var action = cc.moveTo(0.5,cc.p(408,306));
            settting_box.runAction(action);
        }else{
            var action = cc.moveTo(0.5,cc.p(850,306));
            settting_box.runAction(action);
        }
        // this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );
        cc.log(settting_box)
    },
    //离开房间
    leaveClick:function(){
        this.openAlert('是否退出房间','hall');
    },
    //解散房间
    overClick:function(){
        this.openAlert('是否解散房间','over');
    },
    //设置
    

    
    // 弹框弹出
    openAlert:function(str,close){

        let alert = cc.instantiate(this.alert2);
        alert.children[2].getComponent(cc.Label).string= str;
        alert.children[3].getComponent(cc.Button).clickEvents[0].customEventData = close;
        alert.parent = cc.find('Canvas');
    },
   
});
