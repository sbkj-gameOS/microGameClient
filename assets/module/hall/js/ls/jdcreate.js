/*
* @房间创建（丽水-经典麻将）
*/
var creat = require("createRoom");//导入components目录下的createRoom
var playerData,guiZe,userType,moShi,garams;
cc.Class({
    extends: creat,
    properties: {
        
    },
    // use this for initialization
    onLoad: function () {
        // 一下为默认选中的选项
        playerData = "jy";
        guiZe = 'gp@@';
        moShi = "8";
        userType = "4";
        garams={};
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
        if (playerData == 'gs') {
            event.node._parent._parent._parent.children[2].children[1].active = false;
            event.node._parent._parent._parent.children[2].children[2].active = true;
            guiZe = 'tsfb@@';
        } else {
            event.node._parent._parent._parent.children[2].children[2].active = false;
            event.node._parent._parent._parent.children[2].children[1].active = true;
        }  
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
        // playerData = playerData.split("@@");
        // playerData.pop();
        if (playerData == 'gs') {
            garams.game = 'jygs';
            garams.waytype = 'jygs';
        } else {
            garams.game = "jy";
            garams.waytype = playerData;
        }  
        garams.player = guiZe;
        garams.modeltype = moShi;
        garams.pepNums = userType;
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        // 此处的onClick是createRoom中的方法
        this.onClick(garams);
    }
});
