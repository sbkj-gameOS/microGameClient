var creat = require("createRoom");
var moShi,playerData,userType,fengdeng,garams;
cc.Class({
    extends: creat,

    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        playerData = "both@@zf@@";
        moShi = "4";
        userType = "4";
        fengdeng = '100';
        garams={};
    },
    // 模式
    clickmoshi:function(event){
         if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(255,255,255,255));
        }

        //3.更新moshi的值
        moShi = this.mosiOrpepleClick(event);
    },
    // 封顶
    clickfanshu:function(event){
          if(fengdeng != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(fengdeng).children[2].setColor(cc.color(255,255,255,255));
        }
        fengdeng = this.mosiOrpepleClick(event);
    },
    // 玩法
    clickPlayway:function(event){
        playerData = this.gameTypeClick(event,playerData);
         //选中改变颜色
         if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(255,210,90,255));
        }else{
            event.node.children[2].setColor(cc.color(255,255,255,255));
        }
    },
    // 选择玩家人数
    clickPepNum:function(event){
        if(userType != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(userType).children[2].setColor(cc.color(255,255,255,255));
        }
        userType = this.mosiOrpepleClick(event);
    },
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        garams.player = playerData;
        garams.game = 'JX';
        garams.pepNums = userType;
        // 圈数
        garams.modeltype = moShi;
        garams.count = moShi;
        garams.player2 = fengdeng;
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    } 
});