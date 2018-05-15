cc.Class({
    extends: cc.Component,

    properties: {
        weijifen0: {
            default: null,
            type: cc.SpriteAtlas
        },
        target:{
            default: null,
            type: cc.Node
        },
        b_chun:{
            default: null,
            type: cc.SpriteFrame
        },
        b_ju:{
            default: null,
            type: cc.SpriteFrame
        },
        b_lan:{
            default: null,
            type: cc.SpriteFrame
        },
        b_xia:{
            default: null,
            type: cc.SpriteFrame
        },
        b_zhu:{
            default: null,
            type: cc.SpriteFrame
        },
        hua: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        
    },
    init:function(cvalue,fangwei,dd){
        this.cardcolor();                        
        this.value = cvalue ;
        this.fangwei = fangwei;

        var deskcard , cardframe ;
        let cardcolors = parseInt(this.value/4 );
        let csType1,csType2;
        let csCardColors1,csCardColors2;
        let csValue1,csValue2;
        if(cc.weijifen.powerCard){
            csCardColors1 = parseInt(cc.weijifen.powerCard[0]/4 );
            csType1 = parseInt(csCardColors1 / 9);//第一张财神牌类型 
            csValue1 = (parseInt((cc.weijifen.powerCard[0]%36)/4)+1);
            if(cc.weijifen.powerCard.length == 2){
                csCardColors2 = parseInt(cc.weijifen.powerCard[1]/4 );
                csType2 = parseInt(csCardColors2 / 9);//第二张财神牌类型
                csValue2 = (parseInt((cc.weijifen.powerCard[1]%36)/4)+1);
            }
        }
        if (cc.weijifen.GameBase.gameModel == 'wz' && cc.weijifen.playerNum == 2) {
            cc.find('Canvas/cards/tesucards/huacard/current').x = -430;
            cc.find('Canvas/cards/tesucards/huacard/top').x = 445;
            cc.find('Canvas/cards/tesucards/huacard/top').y = 155;
        }
        //确定牌的花色
        var  fw = 'B';
        if(fangwei == 'left'){
            fw = 'L';
        }else if(fangwei == 'right'){
            fw = 'R'
        }
        if(fw == 'B'){
            if(cvalue==-38){
                deskcard = fw+'_autumn';//秋
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            } else if(cvalue==-35){
                deskcard = this.b_zhu;//竹
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if(cvalue==-34){
                deskcard = this.b_ju;//菊
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if(cvalue==-33){
                deskcard = this.b_lan;//兰
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            } else if(cvalue == -32){
                deskcard = fw+'_plum';//梅
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            }else if(cvalue == -36){
                deskcard = this.b_chun;//春
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            }else if(cvalue == -37){
                deskcard = this.b_xia;//夏
                this.target.getComponent(cc.Sprite).spriteFrame = deskcard;
            }else if(cvalue == -39){
                deskcard = fw+'_winter';//冬
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            }else if(cvalue <= -8 && cvalue >= -11){//发财
                deskcard = fw+"_green";
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            }else if(cvalue <= -12 && cvalue >= -15){//红中
                deskcard = fw+"_red";
                cardframe = this.weijifen0.getSpriteFrame(deskcard);
                this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            }
            if(dd&&(cardcolors == csCardColors1 || (csCardColors2!=null &&cardcolors == csCardColors2)||(this.value>=-39&&this.value<=-36))){
                this.caishenCards();
            }
        }else{
            if(cvalue==-38){
                deskcard = fw+'_autumn';//秋
            } else if(cvalue==-35){
                deskcard = fw+'_bamboo';//竹
            } else if(cvalue==-34){
                deskcard = fw+'_chrysanthemum';//菊
            } else if(cvalue==-33){
                deskcard = fw+'_orchid';//兰
            } else if(cvalue == -32){
                deskcard = fw+'_plum';//梅
            }else if(cvalue == -36){
                deskcard = fw+'_spring';//春
            }else if(cvalue == -37){
                deskcard = fw+'_summer';//夏
            }else if(cvalue == -39){
                deskcard = fw+'_winter';//冬
            }else if(cvalue <= -4 && cvalue >= -7){
                deskcard = fw+'_white';//白
            }else if(cvalue <= -8 && cvalue >= -11){//发财
                deskcard = fw+"_green";
            }else if(cvalue <= -12 && cvalue >= -15){//红中
                deskcard = fw+"_red";
            }
            
            cardframe = this.weijifen0.getSpriteFrame(deskcard);
            this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
        }
    },

    caishenCards: function(){
        this.hua.active = true;
        this.target.zIndex = -999+this.value;
    },
    cardcolor:function(){
        if(cc.sys.localStorage.getItem('cardcolor')=='yellow'){
            this.target.children[0].active = false;
            this.target.children[1].active = false;
        }else if(cc.sys.localStorage.getItem('cardcolor')=='blue'){
            this.target.children[0].active = true;
            this.target.children[1].active = false;
        }else if(cc.sys.localStorage.getItem('cardcolor')=='purple'){
            this.target.children[0].active = false;
            this.target.children[1].active = true;
        }
    }, 
});
