let WJFCommon = require("WJFCommon"),
    WJF = new WJFCommon();
// 创建房间之后进入
cc.Class({
    extends: cc.Component,
    properties: {
         //ljh追加 房号 
        room_num:{
            default:null,
            type: cc.Node
        },

    },
    onLoad: function () {
        // 建立scoket连接
        WJF.connect();

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
    * 点击‘准备按钮’
    */
    onClick: function (e) {
        //开始匹配
        cc.sys.localStorage.setItem('already','true');
        // 头像移开中心地点
        let ok_current = cc.find('Canvas/players').getChildByName('ok_current'),
            buttons = cc.find('Canvas/bg/center/button');
            ok_current.active = true;
            buttons.active = false;
        // console.log(mjdata)
        let action = cc.moveTo(0.5,880,274);
        // mjdata.setting_coin.runAction(action);
        // let count = event.target.getComponent('Ready').count;
        let count = 0;

        let socket = WJF.socket();
        let param = {
            token:cc.weijifen.authorization,
            playway:cc.weijifen.playway,
            orgi:cc.weijifen.user.orgi
        } ;
        if ( cc.weijifen.room ) {
            param.room = cc.weijifen.room;
        }
        // let majiang = this.target.getComponent("MJDataBind");
        /*majiang.waittingForPlayers();//等待玩家进入*/
        // if(count == 0){
        //     event.target.getComponent('Ready').count=count+1;
        //     socket.emit("joinroom" ,JSON.stringify(param)) ;
        // }else{
            this.node.dispatchEvent(new cc.Event.EventCustom('readyGM', true));// 向节点分发readyGM自定义事件  Event.EventCustom     
        // }

       
        // debugger
    },
     /**
     * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
     * @param data
     * @param context
     */
    joinroom_event:function(data , context){
        //如果是2人的模式  就只加自己和对家
        context = cc.find('Canvas').getComponent('MajiangDataBind') ;
        // 判断玩家人数
        if(cc.beimi.playerNum == 2){
            if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('top')){

                var player = context.playerspool.get();//从玩家缓存对象池中拿到玩家对象
                var playerscript = player.getComponent("MaJiangPlayer");
                var inx = null , tablepos = "";
                if(data.id == cc.beimi.user.id){
                    player.setPosition(-584 , -269);
                    player.parent = context.root();
                    tablepos = "current" ;
                    cc.sys.localStorage.setItem('current',data.id);
                    cc.sys.localStorage.setItem('count','0')
                    
                }else{
                    player.parent= context.top_player;
                    tablepos = "top" ;
                    cc.sys.localStorage.setItem('top',data.id);
                    player.setPosition(0,0);
                    cc.sys.localStorage.setItem('count','2')
                    
                }
                playerscript.init(data , inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                context.playersarray.push(player) ;
                if(data.status == 'READY'){    
                    cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                    if(data.id == cc.beimi.user.id){
                        context.readybth.active = false ;
                        context.ready2.active = false ;
                    }  
                }
                
            }else{
                var playerarray = context.playersarray;
                if(playerarray){
                    for(let i =0 ; i< playerarray.length;i++){
                        var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                        var tablepos = playerinfo.tablepos;      
                        var on_off_line = playerinfo.on_off_line;     
                        var headimg = playerinfo.headimg;
                        if(data.id == playerinfo.data.id) {
                            if(data.status == 'READY'){    
                                cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                            }
                            if(data.online == false){
                                on_off_line.active = true;
                                headimg.color = new cc.Color(42, 25, 25);
                            }else{
                                on_off_line.active = false;
                                headimg.color = new cc.Color(255, 255, 255);
                            }
                            if(context.desk_cards.string!='136'){
                                context.readyNoActive(context);
                            }
                        }
                            
                    }
                }
            }
            //如果人满了 要求好友的按钮自动消失
            // if(context.playersarray.length == 2){
            //     context.ready2.active = false;
            //     context.readybth.x = -13;
            // }
        }else if(cc.beimi.playerNum == 3){
            if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('top')){
                var player = context.playerspool.get();
                var playerscript = player.getComponent("MaJiangPlayer");
                tablepos = "";
                var inx = cc.sys.localStorage.getItem('count');
                if(data.id == cc.beimi.user.id){
                    player.setPosition(-584 , -269);
                    player.parent = context.root();
                    tablepos = "current" ;
                    cc.sys.localStorage.setItem('current',data.id);
                    
                }else{
                    if(inx == 0||inx ==2){
                        player.parent= context.right_player;
                        tablepos = "right" ;
                        cc.sys.localStorage.setItem('right',data.id);
                        cc.sys.localStorage.setItem('count','1')
                    }else if(inx == 1){
                        player.parent= context.top_player;
                        tablepos = "top" ;
                        cc.sys.localStorage.setItem('top',data.id);
                        cc.sys.localStorage.setItem('count','2')   
                    }
                    player.setPosition(0,0);
                }
                playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                context.playersarray.push(player) ;
                //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                if(data.status == 'READY'){    
                    cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                    if(data.id == cc.beimi.user.id){
                        context.readybth.active = false ;
                        context.ready2.active = false ;
                    }  
                }
            }else{
                var playerarray = context.playersarray;
                if(playerarray){
                    for(let i =0 ; i< playerarray.length;i++){
                        var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                        var tablepos = playerinfo.tablepos;      
                        var on_off_line = playerinfo.on_off_line;     
                        var headimg = playerinfo.headimg;
                        if(data.id == playerinfo.data.id) {
                            if(data.status == 'READY'){    
                                cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                                if(data.id == cc.beimi.user.id){
                                    context.readybth.active = false ;
                                    context.ready2.active = false ;
                                }  
                            }
                            if(data.online == false){
                                on_off_line.active = true;
                                headimg.color = new cc.Color(42, 25, 25);
                            }else{
                                on_off_line.active = false;
                                headimg.color = new cc.Color(255, 255, 255);
                            }
                            //如果已经过了发牌阶段  则隐藏所有的准备状态
                            if(context.desk_cards.string !='136'){
                                context.readyNoActive(context);
                            }
                        }    
                    }
                }
            }
        
        }else{
            // 这是默认的4人模式 
            // 因为 加入会触发 改变状态也会触发该事件，所以用getitem保存一个数据 如果有了这个数据则 只判断状态的改变  如果没有则表示新玩家加入
            if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('left')&&data.id!=cc.sys.localStorage.getItem('top')){
                var player = context.playerspool.get();
                var playerscript = player.getComponent("MaJiangPlayer");
                tablepos = "";
                var inx = cc.sys.localStorage.getItem('count');
                if(data.id == cc.beimi.user.id){
                    player.setPosition(-584 , -269);
                    player.parent = context.root();
                    tablepos = "current" ;
                    cc.sys.localStorage.setItem('current',data.id);
                    
                }else{
                    if(inx == 0||inx ==3){
                        player.parent= context.right_player;
                        tablepos = "right" ;
                        cc.sys.localStorage.setItem('right',data.id);
                        cc.sys.localStorage.setItem('count','1')
                    }else if(inx == 1){
                        player.parent= context.top_player;
                        tablepos = "top" ;
                        cc.sys.localStorage.setItem('top',data.id);
                        cc.sys.localStorage.setItem('count','2')   
                    }else if(inx == 2){
                        player.parent= context.left_player;
                        tablepos = "left" ;
                        cc.sys.localStorage.setItem('left',data.id);
                        cc.sys.localStorage.setItem('count','3')
                    }
                    player.setPosition(0,0);
                }
                playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                context.playersarray.push(player) ;
                //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                if(data.status == 'READY'){    
                    cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                    if(data.id == cc.beimi.user.id){
                        context.readybth.active = false ;
                        context.ready2.active = false ;
                    }  
                }
            }else{
                var playerarray = context.playersarray;
                if(playerarray){
                    for(let i =0 ; i< playerarray.length;i++){
                        var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                        var tablepos = playerinfo.tablepos;      
                        var on_off_line = playerinfo.on_off_line;     
                        var headimg = playerinfo.headimg;
                        if(data.id == playerinfo.data.id) {
                            if(data.status == 'READY'){    
                                cc.find('Canvas/ready/'+tablepos+'_ready').active =true;
                                if(data.id == cc.beimi.user.id){
                                    context.readybth.active = false ;
                                    //context.ready2.active = false ;
                                }  
                            }
                            if(data.online == false){
                                on_off_line.active = true;
                                headimg.color = new cc.Color(42, 25, 25);
                            }else{
                                on_off_line.active = false;
                                headimg.color = new cc.Color(255, 255, 255);
                            }
                            //如果已经过了发牌阶段  则隐藏所有的准备状态
                            if(context.desk_cards.string !='136'){
                                context.readyNoActive(context);
                            }
                        }    
                    }
                }
            }
            // if(context.playersarray.length == 4){
            //     context.ready2.active = false;
            //     var action = cc.moveTo(0.2,-21,-151);
            //     context.readybth.runAction(action);
            }   
    },
   
});



