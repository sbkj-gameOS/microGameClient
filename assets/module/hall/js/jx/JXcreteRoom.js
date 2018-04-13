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
        moShi = this.mosiOrpepleClick(event);
        console.log('模式',moShi)
    },
    // 封顶
    clickfanshu:function(event){
        fengdeng = this.mosiOrpepleClick(event);
        console.log('封顶',fengdeng)
    },
    // 玩法
    clickPlayway:function(event){
        playerData = this.gameTypeClick(event,playerData);
        console.log('玩法',playerData)
    },
    // 选择玩家人数
    clickPepNum:function(event){
        if(userType != this.mosiOrpepleClick(event) ){
             //选中改变颜色
            if(event.isChecked==true){    
                event.node.children[2].setColor(cc.color(184,31,31,255));
            }
            //上一个选中的字体恢复为默认色
            event.node._parent.getChildByName(userType).children[2].setColor(cc.color(172,95,95,255));
        }
        userType = this.mosiOrpepleClick(event);
        console.log('userType',userType)
    },
    createClick:function(){
        playerData = playerData.split("@@");
        playerData.pop();
        garams.player = playerData;
        garams.game = 'JX';
        garams.pepNums = userType;
        garams.count = moShi;
        garams.player2 = fengdeng;
        console.log('房间信息',garams)
        if(cc.weijifen.authorization){
            garams.token = cc.weijifen.authorization;
        }
        this.onClick(garams);
    } 
});