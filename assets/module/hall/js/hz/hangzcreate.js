var creat = require("createRoom");
var moShi,endPoint,playerData,userType,fengdeng,jushu,dairu,garams,player1,player2,player3,player4;
var player11,player22,player33,player44;
cc.Class({
    extends: creat,

    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        // playerData = 'both@@';
        moShi = "0";
        endPoint = '1';
        userType = "4";
        fengdeng = '0';
        endPoint = '1';
        jushu = '8';
        dairu = '40';
        player1 = '0';
        player2 = '2';
        player3 = '5';
        player4 = '7@@';
        player11 = '0';
        player22 = '2';
        player33 = '5';
        player44 = '7@@';
        garams = {};
    },
    // 模式
    moshiChange: function (event,data) {
        moShi = data;
        if (data == 0) {
            event.target.parent.parent.parent.parent.getChildByName('daju').active = true;
            event.target.parent.parent.parent.parent.getChildByName('dapian').active = false;
        } else {
            event.target.parent.parent.parent.parent.getChildByName('daju').active = false;
            event.target.parent.parent.parent.parent.getChildByName('dapian').active = true;
        }
        /*player1 = '0';
        player2 = '2';
        player3 = '5';
        player4 = '7@@';*/
    },
    clickmoshi:function(event,data){
        if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(129,74,17,255));
        }
        //3.更新moshi的值
        moShi = this.mosiOrpepleClick(event);
    },
     // 底分
    clickendpoint:function(event){
        if( endPoint != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(endPoint).children[2].setColor(cc.color(129,74,17,255));
        }

        //3.更新endPoint的值
        endPoint = this.mosiOrpepleClick(event);
    },
     // 带入
    clickdairu:function(event){
        if( dairu != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(dairu).children[2].setColor(cc.color(129,74,17,255));
        }

        //3.更新endPoint的值
        dairu = this.mosiOrpepleClick(event);
    },
    // 封顶
    clickfanshu:function(event){
        if(fengdeng != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(fengdeng).children[2].setColor(cc.color(129,74,17,255));
        }
        fengdeng = this.mosiOrpepleClick(event);
    },
    // 局数
    clickjushu:function(event){
        if(jushu != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(jushu).children[2].setColor(cc.color(129,74,17,255));
        }
        jushu = this.mosiOrpepleClick(event);
    },
    // 玩法
    clickPlayway:function(event,data){
        playerData = this.gameTypeClick(event,playerData);
         //选中改变颜色
        if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(231,62,65,255));
        }/*else{
            event.node.children[2].setColor(cc.color(129,74,17,255));
        }*/
        if (data) {
            event.node._parent.getChildByName(data).children[2].setColor(cc.color(129,74,17,255));
        } else {
            if (event.node.name == 2) {
                event.node._parent.getChildByName('3').children[2].setColor(cc.color(129,74,17,255));
                event.node._parent.getChildByName('4').children[2].setColor(cc.color(129,74,17,255));
            } else if (event.node.name == 3) {
                event.node._parent.getChildByName('2').children[2].setColor(cc.color(129,74,17,255));
                event.node._parent.getChildByName('4').children[2].setColor(cc.color(129,74,17,255));
            } else if (event.node.name == 4) {
                event.node._parent.getChildByName('2').children[2].setColor(cc.color(129,74,17,255));
                event.node._parent.getChildByName('3').children[2].setColor(cc.color(129,74,17,255));
            }
        }
    },
    clickPlayer1:function(event,data){
        var self = this;
        function change (player3) {
            if(player3 != self.mosiOrpepleClick(event) ){
                 //选中改变颜色
                if(event.isChecked==true){    
                    event.node.children[2].setColor(cc.color(231,62,65,255));
                }
                //上一个选中的字体恢复为默认色
                event.node._parent.getChildByName(player3).children[2].setColor(cc.color(129,74,17,255));
            }
        }
        change(player1);
        change(player11);
        if (moShi == 0) {
            player1 = this.mosiOrpepleClick(event);
            return
        }
        player11 = this.mosiOrpepleClick(event);
    },   
    clickPlayer2:function(event,data){
        var self = this;
        function change (player3) {
            if(player3 != self.mosiOrpepleClick(event) ){
                 //选中改变颜色
                if(event.isChecked==true){    
                    event.node.children[2].setColor(cc.color(231,62,65,255));
                }
                //上一个选中的字体恢复为默认色
                event.node._parent.getChildByName(player3).children[2].setColor(cc.color(129,74,17,255));
            }
        }
        change(player2);
        change(player22);
        if (moShi == 0) {
            player2 = this.mosiOrpepleClick(event);
            return
        }
        player22 = this.mosiOrpepleClick(event);
    },    
     clickPlayer3:function(event,data){
        var self = this;
        function change (player3) {
            if(player3 != self.mosiOrpepleClick(event) ){
                 //选中改变颜色
                if(event.isChecked==true){    
                    event.node.children[2].setColor(cc.color(231,62,65,255));
                }
                //上一个选中的字体恢复为默认色
                event.node._parent.getChildByName(player3).children[2].setColor(cc.color(129,74,17,255));
            }
        }
        change(player3);
        change(player33);
        if (moShi == 0) {
            player3 = this.mosiOrpepleClick(event);
            return
        }
        player33 = this.mosiOrpepleClick(event);
    },    
     clickPlayer4:function(event,data){
         //选中改变颜色
        if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(231,62,65,255));
        }else{
            event.node.children[2].setColor(cc.color(129,74,17,255));
        }
        if (moShi == 0) {
            player4 = this.gameTypeClick(event,player4);
            return
        }
        player44 = this.gameTypeClick(event,player4);
    },    
    // 选择玩家人数
    clickPepNum:function(event){
        if(userType != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(userType).children[2].setColor(cc.color(129,74,17,255));
        }
        userType = this.mosiOrpepleClick(event);
    },
    createClick:function(){
       /* playerData = playerData.split("@@");
        playerData.pop();*/
        moShi == 0 ? playerData = player1 + '@@' + player2 + '@@' + player3 + '@@' + player4
                   : playerData = player11 + '@@' + player22 + '@@' + player33 + '@@' + player44;
        garams.player = playerData;
        garams.game = 'HAZ';
        garams.pepNums = userType;
        garams.modeltype = jushu;
        moShi == 0 ? garams.endPoint = endPoint 
                   : garams.endPoint = dairu; 
        garams.count = moShi;
        garams.player2 = fengdeng;
        // console.log(garams)
        cc.sys.localStorage.setItem('subModel','HAZ');
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    } 
});