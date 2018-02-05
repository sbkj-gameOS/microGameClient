var _mcw,_lastmcg,_mch;
var mjcard = require('MJCardsValue');
cc.Class({
    extends: mjcard,

    properties: {
        target:cc.Node,
        majing:cc.Node,
        caishen:cc.Node,
        atlas:cc.SpriteAtlas,
        chun:cc.SpriteFrame,
        ju:cc.SpriteFrame,
        lan:cc.SpriteFrame,
        xia:cc.SpriteFrame,
        zhu:cc.SpriteFrame,
    },
    onLoad: function () {
        this.take = false ;
    },
    init:function(value){
        this.mjWidth();     
        this.caishen = false ; 
        this.take = false;
        this.value = value ;
        this.majiangValue(value,fangwei);    //根据类型来决定麻将大小
    },
    majiangValue: function(value,fangwei,bol){
        let atlas;
        if(fangwei == 'B'){
            atlas = [this.chun,this.ju,this.lan,this.xia,this.zhu,this.atlas];          
        }else{
            atlas = this.atlas;
        }
        this.mjcardvalue(value,fangwei,this.target,atlas,bol);  
    },
   
    caishenCards: function(){
        this.caishen.active = true;
        this.target.zIndex = -999+this.value;
        this.target.getComponent(cc.Button).enabled = false;
        this.majiangColor(this.majing,[118,118,118]);
    },
    lastone:function(){
        this.target.width = _lastmcg;
    },
    relastone:function(){
        this.target.width = _mcw;
        this.target.y = 0;
    },
    mjWidth: function(){
        if(cc.weijifen.GameBase.gameModel=='ch'){
            _mcw = 90;
            _mch = 136;
            _lastmcg =120;
        }else if(cc.weijifen.GameBase.gameModel=='wz'){
            _mcw =73;
            _mch = 110;
            _lastmcg =100;
        }
        this.majing.width = _mcw;
        this.majing.height = _mch;
    },
    reinit: function(){
        this.relastone();
        this.take = false;
    },
    quCaishen: function(target){
        target.getComponent(cc.Button).enabled = true;
        this.majiangColor(this.majing,[255,255,255]);
    }
    
});
