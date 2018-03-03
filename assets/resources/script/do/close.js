var allclose = require('allclose');
cc.Class({
    extends: allclose,

    properties: {
        button:cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        console.log(this.button)
        if(this.button){
            this.button.node.on('click', this.callback, this);
        }
    },
    callback:function(event){
        let name = this.button.clickEvents[0].customEventData;
        this[name]();
    },
    //关闭alert
    alert: function(){
        this.closeAlert();
    },
    //关闭菜单
    menu: function(){
        this.closeMenu();
    },
    // 关闭音效等设置
    setting: function () {
        this.closeSetting();   
    },  
    //退出之后返回房间
    hall:function(){
        this.leavaNotice();
        this.toHall();
    },
    //关闭当前弹窗
    wind: function(){
        this.closeWIND();
    },
    //确定结束游戏
    over: function(){
        this.overNotice();
    },
});
