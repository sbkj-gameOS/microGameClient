var creat = require("createRoom");
var moShi,endPoint,playerData,userType,fengdeng,jushu,dairu,garams,player1,player2,player3,player4;
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
        garams = {};
    },
    // 模式
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
        if (data == 0) {
            event.node.parent.parent.parent.y = 33;
            event.node.parent.parent.parent.getChildByName('daju').active = true;
            event.node.parent.parent.parent.getChildByName('dapian').active = false;
        } else {
            // event.node.parent.parent.parent.y = -10;
            event.node.parent.parent.parent.y = 160;
            event.node.parent.parent.parent.getChildByName('dapian').active = true;
            event.node.parent.parent.parent.getChildByName('daju').active = false;
        }
        playerData = '';
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
        if(player1 != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(player1).children[2].setColor(cc.color(129,74,17,255));
        }
        player1 = this.mosiOrpepleClick(event);
    },   
    clickPlayer2:function(event,data){
        if(player2 != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(player2).children[2].setColor(cc.color(129,74,17,255));
        }
        player2 = this.mosiOrpepleClick(event);
    },    
     clickPlayer3:function(event,data){
        if(player3 != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(player3).children[2].setColor(cc.color(129,74,17,255));
        }
        player3 = this.mosiOrpepleClick(event);
    },    
     clickPlayer4:function(event,data){
        player4 = this.gameTypeClick(event,player4);
         //选中改变颜色
         if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(231,62,65,255));
        }else{
            event.node.children[2].setColor(cc.color(129,74,17,255));
        }
       

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
        playerData = player1 + '@@' + player2 + '@@' + player3 + '@@' + player4;
        garams.player = playerData;
        garams.game = 'HAZ';
        garams.pepNums = userType;
        garams.jushu = jushu;
        garams.endPoint = endPoint;
        moShi == 0 ? garams.endPoint = endPoint 
                   : garams.endPoint = dairu; 
        garams.count = moShi;
        garams.player2 = fengdeng;
        cc.sys.localStorage.setItem('subModel','HAZ');
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    } 
});