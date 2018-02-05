var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {},
    onLoad: function () {},
    init: function(){
        this.routes={};
        this.map("joinroom" , this.joinroom_event) ;          //加入房价
        this.map("players" , this.players_event) ;            //接受玩家列表
        this.map("banker" , this.banker_event) ;          //庄家
        this.map("play" , this.play_event) ;          //人齐了，接收发牌信息
        this.map("lasthands" , this.lasthands_event) ;              //庄家开始打牌了，允许出牌
        this.map("takecards" , this.takecard_event) ;                //我出的牌
        this.map("action" , this.action_event) ;                     //服务端发送的 动作事件，有杠碰吃胡过可以选择
        this.map("selectaction" , this.selectaction_event) ;        //我选择的动作， 杠碰吃胡
        this.map("dealcard" , this.dealcard_event) ;                //我出的牌
        this.map("allcards" , this.allcards_event) ;                //我出的牌
        this.map("isOver" , this.isOver_event);
        this.map("over" , this.over_event);
        this.map("unOver" , this.unOver_event);
        this.map("gameOver",this.gameOver_event);
        this.map("changeRoom",this.changeRoom_event);
        return this.routes;
    }
});
