cc.Class({
    extends: cc.Component,

    properties: {
        cardvalue:{
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
    },
    /**
     * 记录牌的 特殊属性， 是否刚抓起来的牌，已经玩家位置 ， 右、上、左
     * @param spec
     * @param inx
     */
    init:function(spec , inx){
        this.cardcolor();                
        this.spec = spec ;
        this.inx = inx ;
        if(this.spec == true){
            if(this.inx == 0 || this.inx == 2){
                this.node.height = this.node.height + 50;
                
            }else{
                this.node.width = this.node.width + 30 ;
            }
        }
    },
    reinit:function(){
       
        this.node.height = this.node.height =0;    
        this.node.width = this.node.width = 0 ;
        this.spec = false ;
    },
    cardcolor:function(){
        
        if(cc.sys.localStorage.getItem('cardcolor')=='yellow'){
            this.cardvalue.children[0].active = false;
            this.cardvalue.children[1].active = false;
        }else if(cc.sys.localStorage.getItem('cardcolor')=='blue'){
            this.cardvalue.children[0].active = true;
            this.cardvalue.children[1].active = false;
        }else if(cc.sys.localStorage.getItem('cardcolor')=='purple'){
            this.cardvalue.children[0].active = false;
            this.cardvalue.children[1].active = true;
        }
    }, 
});
