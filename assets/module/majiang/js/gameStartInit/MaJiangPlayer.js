cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        dong:cc.Node,
        nan:cc.Node,
        xi:cc.Node,
        bei:cc.Node,
        headimg:cc.Node,
        on_off_line:cc.Node,
        username:{
            default:null ,
            type:cc.Label
        },
        goldcoins:{
            default:null ,
            type:cc.Label
        },
        selected:{
            default:null ,
            type : cc.Node
        },
        creator:{
            default:null ,
            type : cc.Node
        },
        selectcards:{
            default:null ,
            type : cc.Node
        },
        selectcolor:{
            default:null ,
            type : cc.Node
        },
        sezi:{
            default: null,
            type: cc.SpriteAtlas
        },
        sezivalues: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        // this.on_off_line.active = false;
        // this.selected.active = false ;
        this.creator.active = false ;
        
    },
    init:function(playerdata , inx , tablepos,count,seziArr){
        this.creator.active = false ;
        this.data = playerdata ;    //存放玩家数据
        this.tablepos = tablepos ;
        this.count = count;
        if(!playerdata.online){
            this.on_off_line.active = true;
            this.headimg.color = new cc.Color(42, 25, 25);
        }else{
            // this.on_off_line.active = false;//是否离线
            // this.headimg.color = new cc.Color(255, 255, 255);
        }
        // if(inx == 0){
        //     this.selectcards.parent.x = this.selectcards.parent.x * -1 ;
        // }else if(inx == 1){http://docs.cocos.com/creator/api/zh/classes/SpriteAtlas.html#getspriteframes
        //     this.selectcards.parent.x = this.selectcards.parent.x * -1 ;
        // }
        if(playerdata.headimgurl){
            var imgurl = playerdata.headimgurl;
            var sprite = this.headimg.getComponent(cc.Sprite);
            var head = this.headimg;
            cc.loader.load({url:imgurl,type:'jpg'},function(suc,texture){
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                head.width = 75;
                head.height = 75;
            });
        }
        this.username.string = playerdata.username ;
        this.goldcoins.string = playerdata.goldcoins ;



        // 获取到的图集 = this.sezi.getSpriteFrame(值);
        // this.sezis[i].getComponent(cc.Sprite).spriteFrame = 获取到的图集;
        // cc.log(this.sezi.getSpriteFrame('1'))
        // cc.log(sezis[0].getComponent(cc.Sprite).spriteFrame)


        if (seziArr) {
            var sezis = this.node.children[5].children;
            for (let i = 0;i< seziArr.length;i++) {
        // debugger
                let j = (1+i).toString();
                cc.log()
                cc.log('原始',sezis[i].getComponent(cc.Sprite).spriteFrame)
                cc.log('真实d',this.sezi.getSpriteFrame(j))
                sezis[i].getComponent(cc.Sprite).spriteFrame = this.sezi.getSpriteFrame(j);
                this.sezivalues[i] = sezis[i];
            }
            this.node.children[5].active = true;
           /* cc.log('我是player照片那个的色字',seziArr)
            cc.log(this.sezivalues[0].getComponent(cc.Sprite).spriteFrame)
            cc.log('/////')*/
        }


    },
    banker:function(){
        this.creator.active = true;
    },
    selecting:function(){
        if(this.data.id != cc.beimi.user.id){
            this.selectcards.active = true ;
            let ani = this.selectcolor.getComponent(cc.Animation);
            this.animState = ani.play("majiang_select") ;
            // 设置循环模式为 Loop
            this.animState.wrapMode = cc.WrapMode.Loop;
            this.animState.repeatCount = 20; //最大不超过 20次
        }
    },
    selectresult:function(data){
        for(var i = 0 ; i < this.selected.children.length ; i++){
            this.selected.children[i].active = false ;
            if(this.selected.children[i].name == data.color){
                this.selected.children[i].active = true;
            }
        }
        this.selected.active = true ;
        if(this.data.id != cc.beimi.user.id) {
            if (this.animState != null) {
                this.animState.stop("majiang_select");
            }
        }
    },
    winds:function(wind){
        this.dong.active = false;
        this.nan.active = false ; 
        this.xi.active = false ;
        this.bei.active = false ;
        this[wind].active = true;
        this.wind = wind;
    },
    nowind: function(){
        this[this.wind].active = false;
    },
    windss: function(num){
        if(num == 0){
            this.winds('dong');
        }else if(num == 1){
            this.winds('nan');
        }else if(num == 2){
            this.winds('xi');
        }else if(num == 3){
            this.winds('bei');
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
