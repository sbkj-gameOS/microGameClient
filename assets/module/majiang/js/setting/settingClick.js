var MJDataBind = require("MJDataBind");
var jiesaiCode = false,df = 0;
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
    // statics: {

        settingBtnClick: function (event) {
            // var action = cc.moveTo(0.5,cc.p(390,265));
            let settting_box = cc.find('Canvas/other/setting');
            let layer = cc.find('Canvas/layer');
            cc.weijifen.settingflag = !cc.weijifen.settingflag;
            setTimeout(function(){
                if(cc.weijifen.settingflag){
                    settting_box.active = true;
                    var action = cc.moveTo(0.5,cc.p(408,306));
                    settting_box.runAction(action);
                    layer.active = true;
                    if (event.target.getComponent(cc.Button).clickEvents[0].customEventData == 'layer') {
                        event.stopPropagation();
                    }
                }else{
                    var action = cc.moveTo(0.5,cc.p(850,306));
                    settting_box.runAction(action);
                    layer.active = false;
                }
            },300)
          
            // this.node.dispatchEvent( new cc.Event.EventCustom('settingclick', true) );
            // cc.log(settting_box)
        },
        //离开房间
        leaveClick:function(){
            this.openAlert('是否退出房间','hall');
          /*  let btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');
            btn.active = false;*/
            let leave_btn = cc.find('Canvas').getChildByName('alert').getChildByName('isleave_btns');
            leave_btn.active = true;
            let over_btn = cc.find('Canvas').getChildByName('alert').getChildByName('isover_btns');
            over_btn.active = false;

        },
        // 点击解散房间按钮
        overClick:function(){
            // 房主解散房间
            // if (cc.sys.localStorage.getItem('waitting') == 'true' && cc.weijifen.user.id != cc.sys.localStorage.getItem('bankerId')) {
            if (cc.sys.localStorage.getItem('waitting') == 'true' && cc.weijifen.user.id != cc.sys.localStorage.getItem("roomNo1")) {
                this.alert('游戏未开始只有房主可以解散房间！');
                return
            }
            if(!cc.sys.localStorage.getItem("jiesanTime")){
                jiesaiCode = true;
            }else{
                if(cc.sys.localStorage.getItem("jiesanTime")){
                   /* var time = new Date(cc.sys.localStorage.getItem("jiesanTime"));
                    var time2 = new Date();
                    var df=(time2.getTime()-time.getTime()); */
                    var timer = setInterval(function(){
                        df++;
                        if(df>30){//大于30秒
                            jiesaiCode = true;
                            cc.sys.localStorage.removeItem("jiesanTime");
                            df = 0;
                            clearInterval(timer);
                        }
                    },1000);
                }else{
                    jiesaiCode = true;
                }
                
            }

            if(jiesaiCode){
                cc.sys.localStorage.setItem("userOverBtn",1);
                cc.sys.localStorage.setItem("jiesanTime",new Date());
                this.openAlert('是否解散房间','over');
                let btn = cc.find('Canvas').getChildByName('alert').getChildByName('button');
                jiesaiCode = false;
            }else{
                var WJFCommon = require("WJFCommon");
                let wjf = new WJFCommon();
                wjf.alert('请30秒后再进行操作！');
                let timer = setTimeout(function(){
                    jiesaiCode = true;
                    clearTimeout(timer);
                },30000)
            }
        },

        // 弹框弹出
        openAlert:function(str,close){

            let alert = cc.instantiate(this.alert2);
            alert.children[2].getComponent(cc.Label).string= str;
            // alert.children[3].getComponent(cc.Button).clickEvents[0].customEventData = close;
            alert.children[4].getComponent(cc.Button).clickEvents[0].customEventData = close;
            alert.parent = cc.find('Canvas');
        },

        /**
         * 一方要求解散时，向其他玩家发送请求信息
         */
        isOver_event:function(){
            if(cc.sys.localStorage.getItem("userOverBtn") == 1){
                cc.sys.localStorage.removeItem("userOverBtn");
                return;
            }
            var mj = cc.find('Canvas').getComponent('MJDataBind');
            cc.sys.localStorage.setItem('unOver','true');
            if(mj.alert.size()>0){
                var alert = mj.alert.get();
                alert.parent = cc.find("Canvas");
                let node = alert.getComponent('overGameClick') ;
                // let node = alert.getComponent('settingClick') ;
                node.labei.string = '你的好友请求解散房间' ;
                node.button.active = false;
                node.button2.active = true;
                node.labei.active =false;
                node.labei2.active = true;
                node.time = 120;
                cc.weijifen.GameBase.gameModel == 'ch' ? node.time = 120 
                                                       : node.time = 30;
                mj.t = setInterval(function(){node.daojishi()},1000)  ;  
            }
            
        },
        // 设置桌面等
        gameSetting:function(){
            let cardcolor = cc.sys.localStorage.getItem('cardcolor');
            let j;
            let mjdata = cc.find('Canvas').getComponent('MJDataBind');
            let setting = cc.instantiate(mjdata.gameSettingClick);
            setting.parent = mjdata.node;
            if (setting) {
                let cards = cc.find('Canvas/setting/majiang');
                for (let i = 0;i < cards.children.length;i++) {
                    if (cardcolor == 'yellow') { j = 0 } else 
                    if (cardcolor == 'blue') { j = 1 } else 
                    if (cardcolor == 'purple') { j = 2 };
                    cards.children[i].getChildByName('select_box').active = false;
                    cards.children[j].getChildByName('select_box').active = true;
                }
                // console.log(cards.children[j].getChildByName('select_box'))
            }
        },
        gameOver_event: function(data,context){
            let self = cc.find('Canvas/js/settingClick').getComponent('settingClick');
            cc.sys.localStorage.removeItem('waitting');
            let time;
            if(cc.sys.localStorage.getItem('unOver')=='true'){
                time = 0;
                cc.sys.localStorage.removeItem('unOver');
            }else{
                time = 3000;
              /*  cc.weijifen.GameBase.gameModel == 'ch' ? time = 120000 
                                                       : time = 30000;*/
            }
            setTimeout(function(){self.endGameOver(data,context)},time);
            cc.sys.localStorage.removeItem('subModel');
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
            /*if(cc.weijifen.GameBase.gameModel=='wz'){
                cc.director.loadScene('温州');
            }else{
                cc.director.loadScene('gameMain');                    
            }*/
            cc.director.loadScene('gameMain');                    
            let mj = cc.find('Canvas').getComponent('MJDataBind');
            clearTimeout(mj.t);  
            // var desk = require("DeskCards");
            // var jiantou = new desk();
            // jiantou.xiaochu();
        },
        unOver_event: function(){
            let mj = cc.find('Canvas').getComponent('MJDataBind')
            cc.sys.localStorage.removeItem('unOver');
            let dialog = cc.find("Canvas/alert") ;
            clearTimeout(mj.t);
            mj.alert.put(dialog);
        },
          // 设置背景有颜色    
        bgsetting: function(){

            let bg = cc.find('Canvas/bg');
            if(cc.sys.localStorage.getItem('bgcolor')=='green'){
                bg.children[0].active = true ;
                bg.children[1].active = false;
                bg.children[2].active = false;                
            }else if(cc.sys.localStorage.getItem('bgcolor')=='blue'){
                bg.children[0].active = false ;
                bg.children[1].active = true;
                bg.children[2].active = false; 
            }else if(cc.sys.localStorage.getItem('bgcolor')=='red'){
                bg.children[0].active = false ;
                bg.children[1].active = false;
                bg.children[2].active = true; 
            }
        },
        cardsetting: function(){
            // let he = this;
            let he = cc.find('Canvas').getComponent('MJDataBind'),
                setClick = cc.find('Canvas/js/settingClick').getComponent('settingClick');
            //手牌颜色变化
            for(let i = 0; i< he.cards_panel.children.length;i++){
                he.cards_panel.children[i].getComponent('HandCards').cardcolor();
            };
            setClick.foreachCards(he.top_panel,'SpecCards');
            setClick.foreachCards(he.left_panel,'SpecCards');
            setClick.foreachCards(he.right_panel,'SpecCards');
            //桌面牌颜色变化
            setClick.foreachCards(he.deskcards_current_panel,'DeskCards');
            setClick.foreachCards(he.deskcards_left_panel,'DeskCards');
            setClick.foreachCards(he.deskcards_right_panel,'DeskCards');
            setClick.foreachCards(he.deskcards_top_panel,'DeskCards');
            //宝牌颜色变化
            setClick.foreachCards(he.godcard.children[1],'DeskCards');        
            //补花颜色变化 判断如果有的情况
            setClick.foreachCards(cc.find('Canvas/cards/tesucards/huacard/current/buhua'),'BuHuaAction');
            setClick.foreachCards(cc.find("Canvas/cards/tesucards/huacard/right/buhua"),'BuHuaAction');
            setClick.foreachCards(cc.find("Canvas/cards/tesucards/huacard/left/buhua"),'BuHuaAction');
            setClick.foreachCards(cc.find("Canvas/cards/tesucards/huacard/top/buhua"),'BuHuaAction');
            
            //king里面啊的牌变化

            setClick.foreachDancrads(cc.find("Canvas/cards/handcards/current/kongcards"));
            setClick.foreachDancrads(cc.find("Canvas/cards/handcards/top/kongcards"));
            setClick.foreachDancrads(cc.find("Canvas/cards/handcards/left/kongcards"));
            setClick.foreachDancrads(cc.find("Canvas/cards/handcards/right/kongcards"));
           

        },
        foreachCards: function(fangwei,ff){
            if (fangwei) {

                for(let i = 0; i< fangwei.children.length;i++){
                    if(fangwei.children.length){
                        // console.log('children_component---------------',fangwei.children[i].getComponent(ff))
                        fangwei.children[i].getComponent(ff).cardcolor();                
                    }
                }
            }
            
        },
        foreachDancrads: function(fangwei){
            if (fangwei) {
            // console.log('name',fangwei.parent.name)
            // console.log('this---------',this)

                for(let i = 0 ; i < fangwei.children.length; i++){
                    this.foreachCards(fangwei.children[i],'DanAction');
                }    
            }
        },
    // }
});
