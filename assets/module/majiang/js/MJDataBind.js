var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {

    },
    onLoad: function () {

        /**
         * 初始化房间信息
         * 1.房间号
         * 2.显示游戏规则
         * 3.用户头像
         * 4.游戏logo
         */

        //加载调用方法js
        var RoomInitFn = require('RoomInit');

        this.settingBtn();
        this.quanNum();
        this.roomNum();
        this.playerIsReady();
    },
      // 初始化房间信息
    playerIsReady:function () {
       /* let node = new cc.Node('Sprite');
        let sp = node.addComponent(cc.Sprite);

        sp.spriteFrame = this.sprite;
        node.parent = this.node;
        console.log(sp)*/
        // cc.log('Roominit-this',this)
        if(cc.weijifen.match == 'true' && cc.weijifen.starttime){
            this.starttime.node.parent.active = true;
        }
        cc.weijifen.playersss = 0;  
        if(cc.weijifen.browserType=="wechat"){
            this.wxButton.node.active = true ;
            let room ='';//房间号
            if(cc.weijifen.match != 'true'){
                room = cc.weijifen.room
            }
            cc.weijifen.WXorBlow.shareRoom(room);                    
        }else if(cc.weijifen.browserType != null){
            this.ggButton.node.active = true ;
        }
         // 游戏类型
        if(cc.weijifen.GameBase.gameModel =='wz'){
            if(cc.weijifen.playType == "LG"){
                sprite.spriteFrame = this.bkLogoImgLG;//龙港游戏logo
            }else{
                sprite.spriteFrame = this.bkLogoImgTP;//台炮游戏logo
            }
        }else if(cc.weijifen.GameBase.gameModel =='jx'){
            sprite.spriteFrame = this.jxLogoImgLG;
        } else {
            console.log('长春麻将MJDataBind')
        }
        console.log('wjf_num',cc.weijifen.playerNum)
        // console.log('cc.weijifen',cc.weijifen)


        let playerNum;
        playerNum = cc.weijifen.playerNum;
        this.player_num(playerNum);
    },
    /*
    * '设置'内容显示
    */
    settingBtn: function () {
        let setting_menu = cc.find('Canvas/other/setting');
        setting_menu.active = false;
    },
    /*
    *  房间号显示
    */
    roomNum: function () {
        if(cc.weijifen.match =='false'){
            let roomNum = cc.find('Canvas/roomNum').getChildByName('room')._components[0];// roomNum节点
            roomNum.string = cc.weijifen.room;
            cc.log(roomNum)
        }else if(cc.weijifen.match == 'true'){
            this.setting_coin.children[0].children[0].children[0].getCompoCanent(cc.Label).string = '退出';
            this.setting_coin.children[1].active = false;
            this.room_num.parent.children[2].active =false;
            this.room_num.parent.children[1].getComponent(cc.Label).string = '比赛模式';
            this.room_num.parent.children[1].x = this.room_num.parent.children[1].x +20;
            this.ready2.active = false;
            this.readybth.x = -4;
        };
    },
    /*
    *  圈数显示
    */
    quanNum: function () {
        /*设置圈数，圈数条显示*/
        let quanNum = cc.find('Canvas/roomNum').getChildByName('quan')._components[0];// quan节点
        this.maxRound = 0;
        if(cc.weijifen.maxRound){
            this.maxRound = cc.weijifen.maxRound;
        }
        // this.totaljs.string = '圈数  '+ this.maxRound;
        quanNum.string = '0/' + this.maxRound;
    },
    // 玩家
    player_num: function (playerNum) {
        function getNode (parentStr,subNameStr) {
            let head_parent = cc.find(parentStr).getChildByName(subNameStr);
            return head_parent;
        }
        let head_l = getNode('Canvas/players','head_left'),
            head_r = getNode('Canvas/players','head_right'),
            head_c_name = getNode('Canvas/players/head_current','name').getComponent(cc.Label),
            head_c_img = getNode('Canvas/players/head_current','head_img').getComponent(cc.Sprite),
            desk_t = getNode('Canvas/cards/deskcards','top')
            ;
        // 个人信息
        if (cc.weijifen.user) {
            let user = cc.weijifen.user,
                imgUrl = user.headimgurl;
            head_c_name.string = user.username;
            if (imgUrl) {
                cc.loader.load({
                    url: imgUrl,
                    type: 'jpg'
                },function (err,texture) {
                    head_img.spriteFrame = new cc.SperiteFrame(texture);
                })
            }
        }
        cc.weijifen.playerNum = playerNum;
        // 显示头像个数
        if(cc.weijifen.playerNum){
            if(cc.weijifen.playerNum == 2){

                head_l.active = false;
                head_r.active = false;

            }else if(cc.weijifen.playerNum == 3){
                head_l.active = false;      
            }
        }
    },
    /*
    * 初始化对象池
    */
    init_pool: function () {

    },
});




