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
        
        beimi0: {
            default: null,
            type: cc.SpriteAtlas
        },
        atlas:{
            default: null,
            type: cc.SpriteAtlas
        },
        count: cc.Label,
        target:{
            default: null,
            type: cc.Node
        },
        MJhead: cc.Node,
        x:cc.Node,
        current: cc.Node,
        right: cc.Node,
        left: cc.Node,
        top: cc.Node,
        hua:cc.Node,
        juju: cc.Node
    },
    
    // use this for initialization
    onLoad: function () {

    },
    init:function(cvalue,back,fangwei,count,target,dd){
        // console.log('此处可以查看蛋牌数量！')
        /*
        1、蛋牌的prafab为MY
        2、牌面数量从左向右添加
        */
        this.back = back;
        this.cardcolor();                                
        this.fangwei = fangwei;
        this.cardName = null;
        if(target !=null){
            if(this.juju&&!dd){
                this.juju.active = true;
                this.ani = this.juju.getComponent(cc.Animation);
                this.ani.play("juju_"+fangwei) ;   
                
            }
            /*if(target == 'current'){
                this.current.active = true ;
            }else if(target == 'right'){
                this.right.active = true ; 
            }else if(target == 'left'){
                this.left.active = true ; 
            }else if(target == 'top'){
                this.top.active = true ; 
            }*/
        }
        this.count.string = count;
        this.value = cvalue ;
        this.back = back;
        this.fangwei = fangwei;
        let cardcolors = parseInt(this.value/4 ) ;
        let cardtype  = parseInt(cardcolors / 9);
        this.cardcolors =cardcolors;
        this.cardtype =cardtype;
        this.mjtype = cvalue; 
        this.mjvalue = parseInt((this.value%36)/4 ) ;

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



        var deskcard , cardframe ;
        if(this.back == true){
            if(this.fangwei == 'left'){
                this.MJhead.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('e_mj_b_left');
            }else if(this.fangwei == 'top'){
                this.MJhead.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('e_mj_b_bottom');
                this.target.height =63;
            }else if(fangwei == 'right'){
                this.MJhead.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('e_mj_b_right');
            }else{
                this.MJhead.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('e_mj_b_bottom');
                // this.target.height = 76;
                this.target.height = 110;
            }
        } else {
            //确定牌的花色
            var  fw = 'B';
            if(fangwei == 'left'){
                fw = 'L';
            }else if(fangwei == 'right'){
                fw = 'R'
            }
            if(cardcolors < 0){
               
                if(cardcolors==-7){
                    deskcard = fw+'_wind_east';
                    this.cardName = '_wind_east';
                } else if(cardcolors==-6){
                    deskcard = fw+'_wind_south';
                    this.cardName = '_wind_south';
                } else if(cardcolors==-5){
                    deskcard = fw+'_wind_west';
                    this.cardName = '_wind_west';
                } else if(cardcolors == -4){
                    deskcard = fw+'_wind_north';
                    this.cardName = '_wind_north';
                }else if(cardcolors == -3){
                    deskcard = fw+'_red';
                    this.cardName = '_red';
                }else if(cardcolors == -2){
                    deskcard = fw+'_green';
                    this.cardName = '_green';
                }else if(cardcolors == -1){
                    deskcard = fw+'_white';
                    this.cardName = '_white';
                }       
                if(dd&&(cardcolors == csCardColors1 || (csCardColors2!=null &&cardcolors == csCardColors2)||(this.value>=-39&&this.value<=-36))){
                    this.caishenCards();
                }
            }else{
            
                if(cardtype == 0){ //万
                    deskcard = fw+"_character_"+ (parseInt((this.value%36)/4)+1) ;
                    this.cardName = '_character_' + (parseInt((this.value%36)/4)+1);
                }else if(cardtype == 1){ //筒
                    deskcard = fw+"_dot_"+ (parseInt((this.value%36)/4)+1) ;
                    this.cardName = '_dot_' + (parseInt((this.value%36)/4)+1);
                }else if(cardtype == 2){  //条
                    deskcard = fw+"_bamboo_"+ (parseInt((this.value%36)/4)+1) ;
                    this.cardName = '_bamboo_' + (parseInt((this.value%36)/4)+1);
                }   
                
                if(dd&&(cardtype == csType1 && (parseInt((this.value%36)/4)+1) == csValue1)){
                    this.caishenCards();
                }else if(dd&&(cardtype == csType2 && (parseInt((this.value%36)/4)+1) == csValue2)){
                    this.caishenCards();
                }// }
                
            }
            cardframe = this.beimi0.getSpriteFrame(deskcard);
            this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
            
            }
            if(this.count.string==undefined){
                this.count.string = '1';
            }else{
            this.x.active = true;
        }   
        if(this.count.string == '1'){
            this.count.node.active = false;
            this.x.active = false;
        }
    },
    countactive:function(num){
        this.count.node.active = true ; 
        this.x.active = true;
    },
    setValue: function(values){
        this.value = values;
    },
    caishenCards: function(){
        this.hua.active = true;
        this.target.zIndex = -999+this.value;
    },
    jujufei: function(){
        if(this.juju.active == true){
            this.juju.active = false ; 
            this.ani.stop("juju_"+this.fangwei) ;
        }
    },    
    cardcolor:function(){
        if(cc.sys.localStorage.getItem('cardcolor')=='yellow'){
            this.target.children[0].active = false;
            this.target.children[1].active = false;
            this.target.children[2].active = false;
            this.target.children[3].active = false;
        }else if(cc.sys.localStorage.getItem('cardcolor')=='blue'){
            if(this.back){
                this.target.children[2].active = true;
                this.target.children[3].active = false;
                this.target.children[0].active = false;
                this.target.children[1].active = false;
            }else{
                this.target.children[0].active = true;
                this.target.children[1].active = false;
                this.target.children[3].active = false;
                this.target.children[2].active = false;
            }
            

        }else if(cc.sys.localStorage.getItem('cardcolor')=='purple'){
            if(this.back){
                this.target.children[2].active = false;
                this.target.children[3].active = true;
                this.target.children[0].active = false;
                this.target.children[1].active = false;
            }else{
                this.target.children[0].active = false;
                this.target.children[1].active = true;
                this.target.children[3].active = false;
                this.target.children[2].active = false;
            }
        }
    }, 

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
