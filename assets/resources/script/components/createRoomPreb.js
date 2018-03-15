cc.Class({
    extends: cc.Component,

    properties: {
        ch:cc.Prefab,
        lanzi: cc.Node,
        left:cc.Node,
        lg:cc.Prefab,
        tp:cc.Prefab,
        ph:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.weijifen.GameBase.gameModel =='ch'){
            this.allfunction(['长春'],[this.ch]);
        }else if(cc.weijifen.GameBase.gameModel =='wz'){
            this.allfunction(['龙港','台炮'],[this.lg,this.tp]);
        }else if(cc.weijifen.GameBase.gameModel =='jx'){
            this.allfunction(['平湖'],[this.ph]);
        }
    },
    allfunction: function(name,value){
        for(let i in name){
            let he = cc.instantiate(this.lanzi);
            he.active = true;
            he.parent = this.left;
            he.children[2].getComponent(cc.Label).string =name[i];
            let her = cc.instantiate(value[i]);
            her.parent = he.children[1];
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
