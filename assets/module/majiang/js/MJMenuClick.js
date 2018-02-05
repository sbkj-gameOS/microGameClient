var weijifenCommon = require("WJFCommon");
cc.Class({
    extends: weijifenCommon,

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
        txt: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    // 解散游戏按钮  弹出弹窗
    overGamenotice:function(){
        var mj = cc.find('Canvas').getComponent('MajiangDataBind');
        if(mj.alert.size()>0){
            var alert = mj.alert.get('isOver');
            alert.parent = cc.find("Canvas");
            let node = alert.getComponent('overGameClick') ;
            node.init();
            node.txt.string = '确定解散房间么？' ;
        }
    },
    //离开游戏  不结束游戏
    leaveGameClick:function(){

        this.scene("gameMain" , this);
        this.node.dispatchEvent( new cc.Event.EventCustom('leaveGame', true) );
    },
    //点击 确认结束游戏
    sureLiveGameClick:function(){
        let mjdata = cc.find('Canvas').getComponent('MajiangDataBind');
        console.log('cc',cc)
        if(cc.sys.localStorage.getItem('already') != 'true' &&cc.weijifen.match == 'true'){
            debugger
            this.leaveGameClick();
        }else{
            let setting = cc.instantiate(mjdata.leave_alert);
            let set = setting.getComponent('overGameClick');
            setting.parent = mjdata.node;
            if(cc.weijifen.match == 'true'){
                let count = this.player();
                if(count +1 == cc.weijifen.playerNum){
                    set.txt.string = '离开即解散房间';
                }else{
                    set.txt.string = '游戏开始后退出可返回房间';
                }
            }
        }

        //this.node.dispatchEvent( new cc.Event.EventCustom('overGame', true) );
        
    },
    player: function(){
        let count = 0;
        let context = cc.find('Canvas').getComponent('MajiangDataBind');
        var players = context.playersarray
        for(let i = 0 ; i < players.length ; i++){
            let play = players[i].getComponent('MaJiangPlayer');
            if(play.on_off_line.active == true){
                count = count +1 ;
            }
        }
        return count;
    },
    // goonGameClick: function(){
    //     let mj = cc.find('Canvas').getComponent('MajiangDataBind')
    //     let dialog = cc.find("Canvas/alert") ;
    //     mj.alert.put(dialog);
    // },
    setting:function(){

        let mjdata = cc.find('Canvas').getComponent('MajiangDataBind');
        //var action = cc.moveTo(0.5,cc.p(390,265));
       if(mjdata.setting_coin.x != 390){
            mjdata.setting_coin.x = 390;
       }else{
            var action = cc.moveTo(0.5,880,274);
            mjdata.setting_coin.runAction(action);
       }
        this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );
        
    },
    gameSetting:function(){
        let mjdata = cc.find('Canvas').getComponent('MajiangDataBind');
        let setting = cc.instantiate(mjdata.gameSettingClick);
        setting.parent = mjdata.node;
    },
    backSetting: function(){
        let mj = cc.find('Canvas').getComponent('MajiangDataBind')
        let dialog = cc.find("Canvas/setting") ;
        mj.setting.put(dialog);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
