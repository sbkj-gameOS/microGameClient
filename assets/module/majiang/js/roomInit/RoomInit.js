let WJFCommon = require("WJFCommon");
// 创建房间之后进入
cc.Class({
    extends: WJFCommon,
    properties: {
         //ljh追加 房号 
        room_num:{
            default:null,
            type: cc.Node
        },

    },
    onLoad: function () {
     

    },
    statics: {
        /**
         * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
         * @param data
         * @param context
         */
        joinroom_event:function(data , context){
            let RoomInit = require('RoomInit');
            let roomInit = new RoomInit();
            // if (!cc.weijifen.isPlayersSend && cc.weijifen.match == 'true') return; 
            if(cc.sys.localStorage.getItem('waitting') != 1){
                cc.sys.localStorage.setItem('waitting','true');// (在游戏未开始时只有房主可以解散房间) 玩家等待中
            }
            var gameStartInitNode = cc.find('Canvas/js/GameStartInit').getComponent('GameStartInit');
            var fangweiNode = cc.find('Canvas/bg/center') ;
            //如果是2人的模式  就只加自己和对家
            context = cc.find('Canvas').getComponent('MJDataBind') ;
            // 反作弊提示
            if(data.msg){
                cc.find("Canvas/userIp").active = true;
                cc.find("Canvas/userIp/label").getComponent(cc.Label).string = data.msg;
                // setTimeout(function(){cc.find("Canvas/userIp").active = false;},6000)
            }
            
            if(cc.weijifen.playerNum == 2){
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('top') || cc.weijifen.match == 'true' && data.id == cc.sys.localStorage.getItem('current')){

                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    var inx = null , tablepos = "";
                    if(data.id == cc.weijifen.user.id){
                        tablepos = 'current';
                        roomInit.playerPosition(player,{x:-586,y:-130},context.root(),'current',data,'0');
                    }else{
                        tablepos = 'top';
                        roomInit.playerPosition(player,{x:0,y:0},context.top_player,'top',data,'2');
                    }
                    playerscript.init(data , inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    if(data.status == 'READY'){    
                        roomInit.readyHandle(tablepos,context,data);
                    }
                    
                }else{
                    roomInit.returnRoom(context,data,gameStartInitNode);
                }
            }else if(cc.weijifen.playerNum == 3){
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('top') || cc.weijifen.match == 'true' && data.id == cc.sys.localStorage.getItem('current')){
                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    tablepos = "";
                    var inx = cc.sys.localStorage.getItem('count');
                    if(data.id == cc.weijifen.user.id){
                        tablepos = 'current';
                        roomInit.playerPosition(player,{x:-586,y:-130},context.root(),'current',data);
                    }else{
                        if(inx == 0||inx ==2){
                            tablepos = 'right';
                            roomInit.playerPosition(player,{x:0,y:0},context.right_player,'right',data,'1');

                        }else if(inx == 1){
                            tablepos = 'top';
                            roomInit.playerPosition(player,{x:0,y:0},context.top_player,'top',data,'2');

                        }
                    }
                    playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                    if(data.status == 'READY'){    
                        roomInit.readyHandle(tablepos,context,data);
                    }
                }else{
                    roomInit.returnRoom(context,data,gameStartInitNode);
                }
            }else{
                // 这是默认的4人模式 
                // 因为 加入会触发 改变状态也会触发该事件，所以用getitem保存一个数据 如果有了这个数据则 只判断状态的改变  如果没有则表示新玩家加入
                if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('left')&&data.id!=cc.sys.localStorage.getItem('top')  || cc.weijifen.match == 'true' && data.id == cc.sys.localStorage.getItem('current')){
                    var player = context.playerspool.get();
                    var playerscript = player.getComponent("MaJiangPlayer");
                    tablepos = "";
                    var inx = cc.sys.localStorage.getItem('count');
                    if(data.id == cc.weijifen.user.id){
                        tablepos = 'current';
                        roomInit.playerPosition(player,{x:-586,y:-130},context.root(),'current',data);
                    }else{
                        if(inx == 0||inx ==3){
                            tablepos = 'right';
                            roomInit.playerPosition(player,{x:0,y:0},context.right_player,'right',data,'1');

                        }else if(inx == 1){
                            tablepos = 'top';
                            roomInit.playerPosition(player,{x:0,y:0},context.top_player,'top',data,'2');

                        }else if(inx == 2){
                            tablepos = 'left';
                            roomInit.playerPosition(player,{x:0,y:0},context.left_player,'left',data,'3');
                        }
                        // player.setPosition(0,0);
                    }
                    playerscript.init(data , context.inx , tablepos,Number(cc.sys.localStorage.getItem('count')));
                    context.playersarray.push(player) ;
                    //这里是用来判定自己重连的时候 如果已经准备了 则准备按钮消失
                    if(data.status == 'READY'){    
                        roomInit.readyHandle(tablepos,context,data);
                    }
                }else{
                    roomInit.returnRoom(context,data,gameStartInitNode);
                }
            }   

        },
    },
    
    onClick: function (event) {
        //开始匹配
        //cc.sys.localStorage.setItem('already','true');
        let mjdata = cc.find('Canvas').getComponent('MJDataBind');
        // var action = cc.moveTo(0.5,880,274);
        // mjdata.setting_coin.runAction(action);
        // var count = event.target.getComponent('Ready').count
        let socket = this.socket();
        var param = {
            token:cc.weijifen.authorization,
            playway:cc.weijifen.playway,
            orgi:cc.weijifen.user.orgi
        } ;
        if ( cc.weijifen.room ) {
            param.room = cc.weijifen.room ;
        }
        // let majiang = this.target.getComponent("MJDataBind");
        this.waittingForPlayers();
        // if(count == 0){
        //     event.target.getComponent('Ready').count=count+1;
        //     socket.emit("joinroom" ,JSON.stringify(param)) ;
        // }else{
            this.node.dispatchEvent(new cc.Event.EventCustom('readyGM', true));       
        // }
    },
    waittingForPlayers:function(){
        let context = cc.find('Canvas').getComponent('MJDataBind');
        context.exchange_state("ready" , context);
    },
    /*分享好友*/
    showActive: function () {
        // let mj = cc.find('Canvas').getComponent('MJDataBind').noticeShare.active = true;
        let object = cc.find('Canvas').getComponent('MJDataBind');
        var jsonData = {
            url:"http://game.bizpartner.cn/wxController/toCHAuthAgainWx?roomNum="+cc.weijifen.room+"&invitationcode="+cc.weijifen.user.invitationcode,
            title:"心缘竞技",
            context:"房间号："+cc.weijifen.room+"  好友邀请您进入房间",
            conType:1,
            msgType:1
        }
        var res = jsb.reflection.callStaticMethod(...object.anMethodParam().shareEvent,JSON.stringify(jsonData));
        return;
    },
    unactive: function(event){
        event.target.active = false;
    },
    /**
     * @param  {[Component]} context 
     * @param  {[Object]}    data 
     * @return {[type]}         
     */
    returnRoom (context,data,gameStartInitNode) {
        var playerarray = context.playersarray;
        if(playerarray){
            for(let i =0 ; i< playerarray.length;i++){
                var playerinfo = playerarray[i].getComponent('MaJiangPlayer');
                var tablepos = playerinfo.tablepos;   
                var on_off_line = playerinfo.on_off_line;     
                var headimg = playerinfo.headimg;
                if(data.id == playerinfo.data.id) {
                    if(data.status == 'READY'){    
                        cc.find('Canvas/players/ok_'+tablepos+'').active =true;
                    }
                    if(data.online == false){
                        on_off_line.active = true;
                        headimg.color = new cc.Color(42, 25, 25);
                        headimg.color = new cc.Color(100,100,100);
                    }else{
                        on_off_line.active = false;
                        headimg.color = new cc.Color(255, 255, 255);
                    }
                    if(gameStartInitNode.desk_cards.string!='136'){
                        context.readyNoActive(context);
                    }
                }
            }
        }
    },
    /**
     * 玩家方位等
     * @param  {[cc.Node]}   player     
     * @param  {[Object]}    __position 
     * @param  {[cc.Node]}   parent    
     * @param  {[String]}    tablepos   
     * @param  {[Object]}    data       
     * @param  {[String]}    count      
     */
    playerPosition (player,__position,parent,tablepos,data,count) {
        if (__position) player.setPosition(__position.x,__position.y);
        player.parent = parent;
        cc.sys.localStorage.setItem(tablepos,data.id);
        if (count) cc.sys.localStorage.setItem('count',count);
    },
    /**
     * 准备后操作
     * @param  {[String]}    tablepos
     * @param  {[Component]} context 
     * @param  {[Object]} data 
     */
    readyHandle (tablepos,context,data) {
        cc.find('Canvas/players/ok_'+tablepos+'').active =true;
        if(data.id == cc.weijifen.user.id){
            context.readybth.active = false ;
            context.ready2.active = false ;
        }  
    }
});



