var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,

    properties: {

    },
                                                    //                receive
    // use this for initialization
    onLoad: function () {
       
    },
    /*
    * 准备
    */
    readyGM_receive: function () {
        this.node.on('readyGM',function(event){ 
            //alert();
            var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
            context.current_ready.active = true ; //当前玩家准备（手）   
            cc.log(self)
            let socket = self.getSelf().socket();
            //debugger
            // 点击准备，
            socket.emit('readyGame',JSON.stringify({}))
            debugger
        });
    },
    /*
    * 重新进入
    */
    restar_receive: function () {
        this.node.on('restar',function(event){
            if(event.getUserData()){                
                if(cc.weijifen.GameBase.gameModel=='wz'){
                    cc.director.loadScene('温州');
                }else{
                    cc.director.loadScene('gameMain');                    
                }
            }else{
                if(cc.sys.localStorage.getItem('clear') != 'true'){
                    var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
                    var bth = cc.find('Canvas/global/main/button/readybtn');
                    if(cc.weijifen.match != 'true'){
                        bth.active =true;  
                        bth.x= -10;
                    }
                    var laizi = cc.find('Canvas/global/main/godcard/child').children
                    if(laizi){
                        for(let i =0 ; i < laizi.length ; i ++ ){
                            cc.find('Canvas/global/main/godcard/child').children[i].destroy();
                        }
                    }     
                    context.reinitGame(context);
                }
                cc.sys.localStorage.removeItem('clear');
                self.getSelf().shouOperationMune();
                event.target.parent.destroy(); 
            }        
        });
    },
    /*
    * 双击出牌
    */
    click_receive: function () {
        this.node.on('click',function(event){
            let mjdata = cc.find('Canvas').getComponent('MajiangDataBind');
            var action = cc.moveTo(0.5,880,274);
            mjdata.setting_coin.runAction(action);
            mjdata.initcardwidth();
        });
    },
    /*
    * 设置
    */
    setting_receive: function () {
        this.node.on('leaveGame',function(){
            let socket = self.getSelf().socket();
            socket.emit('leaveGame',JSON.stringify({
            }))
        });
        this.node.on('overGame',function(event){
            cc.log('ecent_getUserData',event.getUserData)
            let socket = self.getSelf().socket();
            if(event.getUserData()){
                socket.emit('overGame',JSON.stringify({
                    REFUSE : event.getUserData()
                }))
            }else{
                socket.emit('overGame',JSON.stringify({
                }))
            }
        });
    },
    /*
    * 网络断开、重连
    */
    net_receive: function () {
        this.node.on('duankai',function(event){
            let mj = cc.find('Canvas').getComponent('MajiangDataBind');
            mj.duankai.active = true;    
            cc.sys.localStorage.setItem('duankai','true');
        });
       
        this.node.on('chonglian',function(event){
            let mj = cc.find('Canvas').getComponent('MajiangDataBind');
            mj.duankai.active = false;  
            cc.director.loadScene('majiang');
        });
    },
    /*
    * 拿牌
    */
    takecard_receive: function () {
        this.node.on('takecard', function (event) {
            var context = cc.find('Canvas').getComponent('MajiangDataBind');             
            cc.weijifen.audio.playSFX('select.mp3');                            
            if(cc.sys.localStorage.getItem('take') == 'true'){
                let card = event.target.getComponent("TakeMJCard");
                if(card != null){
                    // 手牌
                    let cardValue = card.target.getComponent('HandCards');
                    self.getSelf().takecard_event({userid:cc.weijifen.user.id,card:cardValue.value},self);
                    let card_script = card.target.getComponent("HandCards") ;
                    /**
                     * 提交数据，等待服务器返回
                     */
    
                    let socket = self.getSelf().socket();
                    
                    if (cc.sys.localStorage.getItem('ting') == 'true') {  
                        context.tingting.active = true ;
                        setTimeout(function(){context.tingting.active = false},2000);
                        cc.weijifen.audio.playSFX('nv/ting.mp3');                                
                        let socket = self.getSelf().socket();
                        cc.sys.localStorage.removeItem('ting') ;
                        socket.emit("selectaction" , JSON.stringify({
                            action:"ting",
                            actionCard:[card_script.value]
                        }));
                        self.getSelf().tingAction();    
                    } else {
                        // 出牌事件---出的那张牌
                        socket.emit("doplaycards" , card_script.value) ;
                    }
                    //cc.find("");
                    self.getSelf().shouOperationMune();
                }
                event.stopPropagation();
            }
        });
    },
    /*
    * 选择动作
    */
    mySelection_receive: function () {
        this.node.on('mjSelection',function(event){
            let father = cc.find('Canvas').getComponent('MajiangDataBind').selectfather;
            father.active= false;
            father.children[0].children[1].children.splice(0,father.children[0].children[1].children.length);
            let socket = self.getSelf().socket();
            let params = [];
            let sendEvent;
            console.log(event);
            if ( event.getUserData() ) {
                sendEvent = event.getUserData().name ;
                params = event.getUserData().params ;
            }
            socket.emit("selectaction" , JSON.stringify({
                action:sendEvent,
                actionCard:params
            }));
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 蛋
    */
    dan_receive: function (event) {
        this.node.on("dan",function(event){
            cc.sys.localStorage.removeItem('guo');            
            var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
            if ( context.dans && context.dans.length > 1 ) {
                cc.sys.localStorage.removeItem('take');
                context.mjOperation('dan', context.dans,context);
            } else {
                let socket = self.getSelf().socket();
                let danParam = [];
                if ( context.dans ) {
                    danParam = context.dans[0] ;
                }
                socket.emit("selectaction" , JSON.stringify({
                    action:'dan',
                    actionCard:danParam
                }));
            }
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 碰
    */
    peng_receive: function (event) {
        this.node.on("peng",function(event){
            cc.sys.localStorage.removeItem('guo');            
            let socket = self.getSelf().socket();
            socket.emit("selectaction" , JSON.stringify({
                action:"peng",
                actionCard:[]
            }));
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 杠
    */
    gang_receive: function (event) {
        this.node.on("gang",function(event){
            cc.sys.localStorage.removeItem('guo');            
            var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
            if ( context.gangs && context.gangs.length > 1 ) {
                cc.sys.localStorage.removeItem('take');                
                context.mjOperation('gang', context.gangs,context);
            } else {
                let socket = self.getSelf().socket();
                let gangParam = [];
                if ( context.gangs ) {
                    gangParam = context.gangs[0] ;
                }
                socket.emit("selectaction" , JSON.stringify({
                    action:'gang',
                    actionCard:gangParam
                }));
            }
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 吃
    */
    chi_receive: function (event) {
        this.node.on("chi",function(event){
            cc.sys.localStorage.removeItem('guo');            
            var context = cc.find('Canvas').getComponent('MajiangDataBind'); 
            if ( context.chis && context.chis.length > 1 ) {
                cc.sys.localStorage.removeItem('take');
                let array = [];
                let array2 = [];
                function sortNumber(a,b){return a - b}   
                function sortNum(a,b){return b.id - a.id}              
                for(let i = 0 ;i<context.chis.length;i++){
                    let b = {};
                    context.chis[i].sort(sortNumber);
                    b.id = context.chis[i][0];
                    b.value = context.chis[i];
                    array.push(b);
                }
                array.sort(sortNum);
                for(let i = 0 ; i<array.length;i++){
                    array2.push(array[i].value);
                }
                

                context.mjOperation('chi',array2,context);
            } else {
                let socket = self.getSelf().socket();
                socket.emit("selectaction" , JSON.stringify({
                    action:'chi',
                    actionCard:context.chis[0]
                }));
            }
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 过
    */
    guo_receive: function (event) {
        this.node.on("hu",function(event){
            //cc.weijifen.audio.playSFX('nv/hu.mp3');            
            cc.sys.localStorage.removeItem('guo');            
            let socket = self.getSelf().socket();
            socket.emit("selectaction" , JSON.stringify({
                action:"hu",
                actionCard:[]
            }));
            //cc.find("");
            self.getSelf().shouOperationMune();
            event.stopPropagation();
        });
    },
    /*
    * 
    */

});


