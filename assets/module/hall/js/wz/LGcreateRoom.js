var creat = require("createRoom");
var moShi,playerData,playerData2,userType,garams;
cc.Class({
    extends: creat,

    properties: {
        jushu:cc.Node,
        people:cc.Node,
    },
    // use this for initialization
    onLoad: function () {
        playerData = "classic";
        playerData2="3-6-9-12";
        moShi = "8";
        userType = "4";
        garams={};
    },
    clickmoshi:function(event){
        if( moShi != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(moShi).children[2].setColor(cc.color(129,74,17,255));
        }

        moShi = this.mosiOrpepleClick(event);
    },
    clickPepNum:function(event){
        if( userType != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }


            //2.上一个选中的字体恢复为默认色
            userType = userType.toString();
            event.node._parent.getChildByName(userType).children[2].setColor(cc.color(129,74,17,255));
        }

        userType = this.mosiOrpepleClick(event);
    },
    clickPlayway1:function(event){
        if( playerData != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(playerData).children[2].setColor(cc.color(129,74,17,255));
        }

        playerData = event.target.name;
        if( playerData == 'yiGu'){
            this.toggleClick(false);
        }else{
            this.toggleClick(true);
        }
        playerData = this.mosiOrpepleClick(event);
    },
    clickPlayway2:function(event){
        if( playerData2 != this.mosiOrpepleClick(event)){
            // 1.将当前选中的字体改为红色
             if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(231,62,65,255));
            }

            //2.上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(playerData2).children[2].setColor(cc.color(129,74,17,255));
        }

        playerData2 = this.mosiOrpepleClick(event);
    },
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        //游戏模式
        garams.player = playerData;
        garams.player2 = playerData2;
        //人数
        garams.pepNums = userType;
        //局数
        garams.modeltype = moShi;
        garams.game = 'LG';
        cc.weijifen.playType='LG';
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    },
    toggleClick:function(bol){
        for(let i = 1 ;i<3;i++){
            this.people.children[i].active = bol;
        }
        this.jushu.active = bol;   
        userType = 4;
    }
    
});
