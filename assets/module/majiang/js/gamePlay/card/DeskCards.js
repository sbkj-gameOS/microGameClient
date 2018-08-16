cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        weijifen0: {
            default: null,
            type: cc.SpriteAtlas
        },
        cardvalue:{
            default: null,
            type: cc.Node
        },
        target:{
            default: null,
            type: cc.Node
        },
        jiantou:cc.Node,
        jiantou2:cc.Node,
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
    },
    /**
     * 桌面牌初始化
     * @param  {[Number]}  cvalue  
     * @param  {[String]}  fangwei {B:current、top;L:left;R:right}
     * @param  {[type]}    bol    
     */
    init:function(cvalue,fangwei,bol,direction){
        //this.jiantou.active  = true;
        this.cardcolor();
        this.xiaochu();
        var gameModelMp3 = "";//播放声音
        if(cc.weijifen.GameBase.gameModel == "wz"){
            gameModelMp3 = "wz";
        }
        // let ani = this.jiantou.getComponent(cc.Animation);
        // let c = fangwei;
        // if(fangwei =='B'){
        //     c='top';
        // }else if(fangwei =='L'){
        //     c='left';
        // }else if(fangwei =='R'){
        //     c='right';
        // }
        // ani.play(c) ;  
        this.value = cvalue ;
        let cardframe ;
        let cardcolors = parseInt(this.value/4 ) ;
        let cardtype  = parseInt(cardcolors / 9);
        let deskcard ;
        
        if(fangwei !='Z'){
            if(cardcolors < 0){
                
                if(cardcolors==-7){
                    deskcard = fangwei+'_wind_east';
                } else if(cardcolors==-6){
                    deskcard = fangwei+'_wind_south';
                } else if(cardcolors==-5){
                    deskcard = fangwei+'_wind_west';
                } else if(cardcolors == -4){
                    deskcard = fangwei+'_wind_north';
                }else if(cardcolors == -3){
                    deskcard = fangwei+'_red';
                }else if(cardcolors == -2){
                    deskcard = fangwei+'_green';
                }else if(cardcolors == -1){
                    deskcard = fangwei+'_white';
                }
                if(bol != true){
                    let time = 0;
                    if(cc.sys.localStorage.getItem('ting') == 'true'){
                        time = 1000;
                    }
                    setTimeout(function(){
                        if (direction != undefined) {
                            // cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'wind_'+(cardcolors+8)+'.mp3');                
                            cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'wind_'+(cardcolors+8)+ cc.weijifen.genders[direction] +'.mp3');    
                        }
                    },time);
                }
                //东南西北风 ， 中发白
            }else{
                
               /* if(cardtype == 0){ //万
                    deskcard = fangwei+"_character_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true){
                        cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'wan_'+(parseInt((this.value%36)/4)+1)+'.mp3');
                    }
                }else if(cardtype == 1){ //筒
                    deskcard = fangwei+"_dot_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true){
                        cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'tong_'+(parseInt((this.value%36)/4)+1)+'.mp3');
                    }
                }else if(cardtype == 2){  //条
                    deskcard = fangwei+"_bamboo_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true){
                    cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'suo_'+(parseInt((this.value%36)/4)+1)+'.mp3');
                    }
                }*/
                if(cardtype == 0){ //万
                    deskcard = fangwei+"_character_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true && direction != undefined){
                        cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'wan_'+(parseInt((this.value%36)/4)+1)+ cc.weijifen.genders[direction] +'.mp3');
                    }
                }else if(cardtype == 1){ //筒
                    deskcard = fangwei+"_dot_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true && direction != undefined){
                        cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'tong_'+(parseInt((this.value%36)/4)+1)+ cc.weijifen.genders[direction] +'.mp3');
                    }
                }else if(cardtype == 2){  //条
                    deskcard = fangwei+"_bamboo_"+ (parseInt((this.value%36)/4)+1) ;
                    if(bol != true && direction != undefined){
                        cc.weijifen.audio.playSFX('nv/'+gameModelMp3+'suo_'+(parseInt((this.value%36)/4)+1)+ cc.weijifen.genders[direction] +'.mp3');
                    }
                }
            }
            var buhuaTrue = false;
            if(deskcard == null){
                var buhua = "-32,-33,-34,-35,-36,-37,-38,-39";
                if(buhua.indexOf(cvalue) >= 0){
                    buhuaTrue = true;
                    if(cvalue==-38){
                        deskcard = 'B_autumn';//秋
                        cardframe = this.weijifen0.getSpriteFrame(deskcard);
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = cardframe;
                    } else if(cvalue==-35){
                        deskcard = this.b_zhu;//竹
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = deskcard;
                    } else if(cvalue==-34){
                        deskcard = this.b_ju;//菊
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = deskcard;
                    } else if(cvalue==-33){
                        deskcard = this.b_lan;//兰
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = deskcard;
                    } else if(cvalue == -32){
                        deskcard = 'B_plum';//梅
                        cardframe = this.weijifen0.getSpriteFrame(deskcard);
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = cardframe;
                    }else if(cvalue == -36){
                        deskcard = this.b_chun;//春
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = deskcard;
                    }else if(cvalue == -37){
                        deskcard = this.b_xia;//夏
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = deskcard;
                    }else if(cvalue == -39){
                        deskcard = 'B_winter';//冬
                        cardframe = this.weijifen0.getSpriteFrame(deskcard);
                        this.cardvalue.getComponent(cc.Sprite).spriteFrame = cardframe;
                    } 
                }
            }
            // 桌面麻将desk_card中spriteFrame更换
            if(!buhuaTrue){
                cardframe = this.atlas.getSpriteFrame(deskcard);
                this.cardvalue.getComponent(cc.Sprite).spriteFrame = cardframe;
            }
            if(cc.sys.localStorage.getItem('cl')!='true'){
                if(this.jiantou){
                    this.jiantou.active = true;                
                }
            }
        }  
    },
    /**
     * 牌面上的箭头指示
     * @param   cards 桌面牌容器（desk_cards节点下的current、这类节点left）
     */
    initjiantou: function(cards){
        if(cards.children){
            for(let i =0; i< cards.children.length;i++){
                var card = cards.children[i].getComponent('DeskCards');
                card.jiantou2.destroy();
            }
        }
    },
    xiaochu: function(){
         let context = cc.find('Canvas').getComponent('MJDataBind');
         this.initjiantou(context.deskcards_current_panel);
         this.initjiantou(context.deskcards_right_panel);
         this.initjiantou(context.deskcards_top_panel);
         this.initjiantou(context.deskcards_left_panel);
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
