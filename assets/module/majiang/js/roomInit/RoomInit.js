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
        // 建立scoket连接
        WJF.connect();

    },
     /**
     * 新创建牌局，首个玩家加入，进入等待状态，等待其他玩家加入，服务端会推送 players数据
     * @param data
     * @param context
     */
    joinroom_event:function(data , context){
        cc.log('RoomInit---context',context)
        //如果是2人的模式  就只加自己和对家
        context = cc.find('Canvas').getComponent('MJDataBind');
        context.init_pool(context);

        // 判断玩家人数
        if(cc.weijifen.playerNum == 2){
            if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('top')){
                debugger
                var player = context.playerspool.get();//从玩家缓存对象池中拿到玩家对象
                var playerscript = player.getComponent("MaJiangPlayer");// MaJiangPlayer为 初始化玩家信息
                var inx = null , tablepos = "";
                if(data.id == cc.weijifen.user.id){
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
                    if(data.id == cc.weijifen.user.id){
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
        }else if(cc.weijifen.playerNum == 3){
            if(data.id!=cc.sys.localStorage.getItem('current')&&data.id!=cc.sys.localStorage.getItem('right')&&data.id!=cc.sys.localStorage.getItem('top')){
                var player = context.playerspool.get();
                var playerscript = player.getComponent("MaJiangPlayer");
                tablepos = "";
                var inx = cc.sys.localStorage.getItem('count');
                if(data.id == cc.weijifen.user.id){
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
                    if(data.id == cc.weijifen.user.id){
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
                                if(data.id == cc.weijifen.user.id){
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
                if(data.id == cc.weijifen.user.id){
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
                    if(data.id == cc.weijifen.user.id){
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
                                if(data.id == cc.weijifen.user.id){
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
            }   
    },
    
});



