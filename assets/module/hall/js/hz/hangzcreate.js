var creat = require("createRoom");
var moShi,endPoint,playerData,userType,fengdeng,jushu,garams;
cc.Class({
    extends: creat,

    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        playerData = "0@@2@@5@@7";
        moShi = "0";
        endPoint = '1';
        userType = "4";
        fengdeng = '0';
        endPoint = '1';
        jushu = '8';
        garams = {};
    },
    // 模式
    clickmoshi:function(event){
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
    clickPlayway:function(event){
        playerData = this.gameTypeClick(event,playerData);
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
        playerData = playerData.split("@@");
        playerData.pop();
        garams.player = playerData;
        garams.game = 'HAZ';
        garams.pepNums = userType;
        garams.jushu = jushu;
        garams.endPoint = endPoint;
        garams.count = moShi;
        garams.player2 = fengdeng;
        console.log(garams)
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    } 
});