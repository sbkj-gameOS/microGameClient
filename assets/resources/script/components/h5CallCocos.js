cc.Class({
    extends: cc.Component,

    properties: {
    },

    //h5与cocos之间通讯
    onLoad: function () {
        let h5CallCocos = require('h5CallCocos');
        cc.weijifen.match = new h5CallCocos();
    },
    //点击进比赛
    matchListOneClick:function(data){
        // cc.weijifen.authorization = "61d8be72e66449aa9e0dc93df8a6122c";
        // data = {"room":"a2286aa2e6004dbd9d1d895016217faa","playway":"402888815e6f0177015e71529f3a0001","cardNum":"13","playerNum":"4","maxRound":"4","match":"true"};
        alert("进入比赛");
        alert('data.match',data.match)
        if(data.match){
            cc.weijifen.match = data.match ;
        }
        alert('data.playway',data.playway)

        if(data.playway){
            cc.weijifen.playway = data.playway;                  
        }
        alert('data.room',data.room)

        if(data.room){
            cc.weijifen.room = data.room; 
        }

        alert('data.playerNum',data.playerNum)
        if(data.playerNum){
            cc.weijifen.playerNum = data.playerNum;
        }
        alert('data.cardNum',data.cardNum)

        if(data.cardNum){
            cc.weijifen.cardNum = data.cardNum;
        }
        alert('data.maxRound',data.maxRound)
        
        if(data.maxRound){
            cc.weijifen.maxRound = data.maxRound;
        }
        alert('即将进入麻将场景')
        cc.director.loadScene("majiang");
    },
});
