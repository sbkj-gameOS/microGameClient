/*
* @房间创建（丽水-壶镇麻将）
*/
var creat = require("createRoom");//导入components目录下的createRoom
var playerData,guiZe,maiMa,userType,moShi,garams;
cc.Class({
    extends: creat,
    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        // 一下为默认选中的选项
        playerData = "zm";
        moShi = "8";
        userType = "4";
        guiZe = 'genpai@@';
        maiMa = '0';
        garams = {};
    },
       // 选择玩法
    clickPlayway:function(event){
        if(playerData != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }
            //上一个选中的字体恢复为默认色
             event.node._parent.getChildByName(playerData).children[2].setColor(cc.color(255,255,255,255));
        }
       
        playerData = this.mosiOrpepleClick(event);
    },
    // 选择规则
    clickGuize:function(event){
        guiZe = this.gameTypeClick(event,guiZe);
         //选中改变颜色
        if(event.isChecked==true){    
            event.node.children[2].setColor(cc.color(255,210,90,255));
        }else{
            event.node.children[2].setColor(cc.color(255,255,255,255));
        }
    },
     // 选择买马
    clickMaima:function(event){
        if(maiMa != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(255,210,90,255));
            }
            //上一个选中的字体恢复为默认色
             event.node._parent.getChildByName(maiMa).children[2].setColor(cc.color(255,255,255,255));
        
        }
       
        maiMa = this.mosiOrpepleClick(event);
    },

    // 选择模式
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
 
    // 点击创建按钮
    createClick:function(){
        /*playerData = playerData.split("@@");
        playerData.pop();*/
        garams.game = 'LSGD';
        /*garams.waytype = playerData;
        garams.guiZe = guiZe;
        garams.maiMa = maiMa;*/
        garams.player2 = playerData;
        garams.player = guiZe;
        garams.count = maiMa;
        garams.modeltype = moShi;
        garams.pepNums = userType;
        console.log(garams)
         if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        // 此处的onClick是createRoom中的方法
        this.onClick(garams);
    }
});
