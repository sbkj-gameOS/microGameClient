cc.Class({
    extends: cc.Component,

    properties: {
        ch:cc.Prefab,
        lanzi: cc.Node,
        left:cc.Node,
        lg:cc.Prefab,
        tp:cc.Prefab,
        ph:cc.Prefab,
        nj:cc.Prefab,
        gd:cc.Prefab,
        jy:cc.Prefab,
        matchHall: cc.Prefab,
        hangz: cc.Prefab,
        isKuaiSan:false,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.weijifen.matchFlag) {
            this.allfunction(['日赛','月赛'],[this.matchHall,this.matchHall]);
            return
        }
        if(cc.weijifen.GameBase.gameModel =='ch'){
            this.allfunction(['长春麻将'],[this.ch]);
        }else if(cc.weijifen.GameBase.gameModel =='wz'){
            this.allfunction(['龙港麻将','台炮麻将'],[this.lg,this.tp]);
        }else if(cc.weijifen.GameBase.gameModel =='jx'){
            this.allfunction(['平湖麻将'],[this.ph]);
        } else if (cc.weijifen.GameBase.gameModel =='nj') {
            this.allfunction(['南京麻将'],[this.nj]);
        } else if (cc.weijifen.GameBase.gameModel == 'ls') {
            // this.allfunction(['壶镇麻将','经典麻将'],[this.gd,this.jy]);
            this.allfunction(['经典麻将','广式麻将','杭州麻将'],[this.jy,this.gd,this.hangz]);
        } 
    },
    allfunction: function(name,value){
        for(let i in name){
            let he = cc.instantiate(this.lanzi);
            he.active = true;
            he.parent = this.left;
            he.children[2].getComponent(cc.Label).string =name[i];
            let her = cc.instantiate(value[i]);
            if(name[i]=='长春麻将'&&this.isKuaiSan){
                var moshi=her.children[0].children[1];
                 var creator= her.children[6].children[0].getComponent("CHcreateRoom");//同样的脚本在一个预制里面挂载了两次。。。魔鬼
                 creator._kuaiSan=true;
                  moshi.children[0].active=false;
                  moshi.children[1].active=false;
                  moshi.children[3].active=true;
                  moshi.children[3].x=-96;
                  moshi.children[3].y=4;
            }
            if (name[i] == '月赛') her.y = -98;
            her.parent = he.children[1];
            var toggle=he.getComponent(cc.Toggle);
            i==0?toggle.isChecked=true:null;
        }

    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
 