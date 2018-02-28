var mjcard = require('MJCardsValue');
cc.Class({
    extends: mjcard,
    properties: {
        target:cc.Node,
        majing:cc.Node,
        atlas:cc.SpriteAtlas,
        chun:cc.SpriteFrame,
        ju:cc.SpriteFrame,
        lan:cc.SpriteFrame,
        xia:cc.SpriteFrame,
        zhu:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {

    },
    init:function(value,fangwei){
        let atlas;
        this.majiangValue(value,fangwei);
        
        
    },

    majiangValue: function(value,fangwei){
        if(fangwei == 'B'){
            atlas = [this.chun,this.ju,this.lan,this.xia,this.zhu,this.atlas];          
        }else{
            atlas = this.atlas;
        }
        this.mjcardvalue(cvalue,fangwei,this.target,atlas);  
    }
});
