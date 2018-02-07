var MJDataBind = require("MJDataBind");
var allclose = require("allclose");
cc.Class({
    extends: MJDataBind,

    properties: {
        alert2 : cc.Prefab,
        summary:{
            default:null ,
            type : cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
       
    },
    //设置
    
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
        // cc.log(settting_box)
    },
    //离开房间
    leaveClick:function(){
        this.openAlert('是否退出房间','hall');
        let btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');
        btn.active = false;
    },
    // 点击解散房间按钮
    overClick:function(){
        this.openAlert('是否解散房间','over');
        let btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');
        btn.active = true;
    },

    // 弹框弹出
    openAlert:function(str,close){

        let alert = cc.instantiate(this.alert2);
        alert.children[2].getComponent(cc.Label).string= str;
        alert.children[3].getComponent(cc.Button).clickEvents[0].customEventData = close;
        alert.parent = cc.find('Canvas');
    },

    /**
     * 解散房间的事件
     */
    isOver_event:function(){
        var mj = cc.find('Canvas').getComponent('MJDataBind');
        cc.sys.localStorage.setItem('unOver','true');
        if(mj.alert.size()>0){
            var alert = mj.alert.get();
            alert.parent = cc.find("Canvas");
            let node = alert.getComponent('overGameClick') ;
            node.txt.string = '你的好友请求解散房间' ;
            node.button.active = false;
            node.button2.active = true;
            node.labei.active =false;
            node.labei2.active = true;
            node.time =30;
            mj.t = setInterval(function(){node.daojishi()},1000)  ;  
            
                   
        }
    },

    gameOver_event: function(data,context){
        let time;
        if(cc.sys.localStorage.getItem('unOver')=='true'){
            time = 0;
            cc.sys.localStorage.removeItem('unOver');
        }else{
            time = 3000;
        }
        setTimeout(function(){this.endGameOver(data,context)},time)   
    },
    endGameOver: function(data,context){
        let temp = cc.instantiate(this.summary) ;
        temp.parent = context.root() ;
        temp.getComponent('SummaryClick').setDataEnd(data); 
    },
    /**
    */
    over_event: function(){
              
        cc.weijifen.maxRound =null;
        cc.weijifen.op =null;
        cc.weijifen.playerNum = null;
        cc.weijifen.room=null;
        cc.weijifen.cardNum = null;
        cc.sys.localStorage.setItem('dis','true');        
        if(cc.weijifen.GameBase.gameModel=='wz'){
            cc.director.loadScene('温州');
        }else{
            cc.director.loadScene('gameMain');                    
        }
        let mj = cc.find('Canvas').getComponent('MJDataBind');
        clearTimeout(mj.t);  
        // var desk = require("DeskCards");
        // var jiantou = new desk();
        // jiantou.xiaochu();
    },
    unOver_event: function(){
        let mj = cc.find('Canvas').getComponent('MJDataBind')
        cc.sys.localStorage.removeItem('unOver');
        let dialog = cc.find("Canvas/isover") ;
        clearTimeout(mj.t);
        mj.alert.put(dialog);
    },

});
