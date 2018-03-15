var WJFCommon = require("WJFCommon");

var array ="";
cc.Class({
    extends: WJFCommon,

    properties: {
        cardNum:cc.Label,
        inputNum1: {
            default: null,
            type: cc.Label
        },
        inputNum2: {
            default: null,
            type: cc.Label
        },
        inputNum3: {
            default: null,
            type: cc.Label
        },
        inputNum4: {
            default: null,
            type: cc.Label
        },
        inputNum5: {
            default: null,
            type: cc.Label
        },
        inputNum6: {
            default: null,
            type: cc.Label
        },
        notice: {
            default: null,
            type: cc.Label
        },
    },

    onLoad: function () {
        array = "";
        if(this.cardNum){
            this.cardNum.string =  cc.weijifen.user.cards + '张'
        }
        if(this.zhoupic){
            cc.weijifen.http.httpGet('/api/room/queryUserWinner?token='+cc.weijifen.authorization,this.countsucess,this.counterror,this);            
        }
    },
    /*
    * 房间号监听输入
    */
    clickNum: function(event){
        var num = event.currentTarget.name,
            num_parent = event.currentTarget.parent.parent;
        this.notice.string ='';     
        if(array.length == 0){
            this.inputNum1.string = num;
        }else if(array.length == 1){
            this.inputNum2.string = num;
        }else if(array.length == 2){
            this.inputNum3.string = num;
        }else if(array.length == 3){
            this.inputNum4.string = num;
        }else if(array.length == 4){
            this.inputNum5.string = num;
        }else if(array.length == 5){
            this.inputNum6.string = num;
        }
           array += num;
        if(array.length == 6){
            this.click();
        }
        // 
    },
    /*
    * 房间号已经是6位，可以进入
    */
    click: function(){
        var room={};
        room.room = array;
        
        if(cc.weijifen.authorization){
            cc.weijifen.room =array;
            room.token = cc.weijifen.authorization;
            cc.weijifen.http.httpPost('/api/room/query',room,this.JRsucess,this.JRerror,this);
        }else{
            array = "";
            this.notice.getComponent('cc.Label').string ='not found token';
            object.inputNum1.string = "";
            object.inputNum2.string = "";
            object.inputNum3.string = "";
            object.inputNum4.string = "";
            object.inputNum5.string = "";
            object.inputNum6.string = "";
        }
    },
    JRsucess: function(result,object){
        var data = JSON.parse(result);
        if(data.playway&&data.room){
            cc.weijifen.playway = data.playway;
            if(data.match){
                cc.weijifen.match = data.match ; 
            }
            if(data.game){
                cc.weijifen.playType = data.game;
            }
            if(data.playerNum){
                cc.weijifen.playerNum = data.playerNum;
            }
            if(data.cardNum){
                cc.weijifen.cardNum = data.cardNum;
            }
            if(data.maxRound){
                cc.weijifen.maxRound = data.maxRound;
            }
            cc.director.preloadScene('majiang',function(){
                cc.director.loadScene('majiang');
            });
        }else if(data.error){
        //   
            object.notice.string = data.msg;
            object.inputNum1.string = "";
            object.inputNum2.string = "";
            object.inputNum3.string = "";
            object.inputNum4.string = "";
            object.inputNum5.string = "";
            object.inputNum6.string = "";
            array = "";
            if(cc.weijifen.user.cards == 0 ){
                cc.weijifen.dialog.destroy();
                cc.weijifen.dialog = null ;
                cc.weijifen.dialog = cc.instantiate(object.shopping);
                cc.weijifen.dialog.parent = cc.find('Canvas');
            }
        }  
    },
    JRerror: function(object){
        object.notice.string ='连接失败';      
        object.inputNum1.string = "";
        object.inputNum2.string = "";
        object.inputNum3.string = "";
        object.inputNum4.string = "";
        object.inputNum5.string = "";
        object.inputNum6.string = "";
        array = "";
       
    },
    //清空按钮
    emptyClick:function(){
        array = "";
        this.inputNum1.string = "";
        this.inputNum2.string = "";
        this.inputNum3.string = "";
        this.inputNum4.string = "";
        this.inputNum5.string = "";
        this.inputNum6.string = "";
    },
    //删除按钮
    removeOneClick:function(){
        if(array != ""){
            if(array.length == 1){
                this.inputNum1.string = "";
            }else if(array.length == 2){
                this.inputNum2.string = "";
            }else if(array.length == 3){
                this.inputNum3.string = "";
            }else if(array.length == 4){
                this.inputNum4.string = "";
            }else if(array.length == 5){
                this.inputNum5.string = "";
            }else if(array.length == 6){
                this.inputNum6.string = "";
            }
            array = array.substr(0,array.length-1);
        }
    },
    helpClick: function(){
        cc.weijifen.dialog1 = cc.instantiate(this.help);
        cc.weijifen.dialog1.parent = this.root();
    },
    jjroom: function(event){
        let type = event.target.name;
        let arry = event.target.children[0].getComponent(cc.Label).string.split(' ')
        cc.weijifen.starttime = arry[1];
        this.loadding();
        cc.weijifen.http.httpGet('/api/room/match?token='+cc.weijifen.authorization+'&type='+type,this.jjsucess,this.jjerror,this);
    },
    jjsucess: function(result,object){
        
        var data = JSON.parse(result);
        //playerNum,cardNum
        if(data.error){  
            object.closeloadding();
            object.alert2('比赛未开始或者您没资格进入比赛');
        }else{
            if(data.match){
                cc.weijifen.match = data.match ; 
            }
            if(data.playway){
                cc.weijifen.playway = data.playway;                  
            }
            if(data.room){
                cc.weijifen.room = data.room; 
            }
            if(data.playerNum){
                cc.weijifen.playerNum = data.playerNum;
            }
            if(data.cardNum){
                cc.weijifen.cardNum = data.cardNum;
            }
            if(data.maxRound){
                cc.weijifen.maxRound = data.maxRound;
            }
            cc.director.loadScene("majiang");
        }    
    },
    jjerror: function(result,object){
        object.closeloadding();
        object.alert2('比赛未开始或者您没资格进入比赛');
    }
});
