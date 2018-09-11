var WJFCommon = require("WJFCommon");

cc.Class({
    extends: WJFCommon,
    properties: {
        headimgs:cc.Node,
        peoname:cc.Label,
        count:cc.Label,
        mjloyad: cc.Node,
        mjloyad2:cc.Node,
        mjkong:cc.Node,
        jifan:cc.Label,
        card:cc.Prefab,// 牌面
        win:cc.Node,
        hu: cc.Label,
        dong:cc.Node,
        xi:cc.Node,
        nan:cc.Node,        
        bei:cc.Node,
        redwin:cc.SpriteFrame,
        diaopao:cc.SpriteFrame,
        target:cc.Node,
        hua: cc.Prefab,
        buhua: cc.Prefab,
        huaParent: cc.Node,
        banker: cc.Node,
        headBorder: cc.SpriteAtlas
    },
    
    // use this for initialization
    onLoad: function () {
      
    },
    /**
     * 小局结束，结算页
     */
    init: function(){
        let headimg;
        let gang=0; 
        let fan=0;
        let units;
        let drop = '';
        let noTing= '';
        let hucards = -111;
        let tai = '';
        let hua ;
        let baoBox = cc.find('Canvas/summary').children[8];
        this.hu.string='';
        if (cc.weijifen.GameBase.gameModel == 'nj') {
            baoBox.active = false;
        }
        if(this.data.point){
            let id = this.data.user;
            let players = cc.find('Canvas').getComponent('MJDataBind').playersarray;
            for(let i = 0 ; i < players.length ; i++){
                let player = players[i].getComponent('MaJiangPlayer')
                if(id == player.data.id){
                    player.goldcoins.string = this.data.point ; 

                }
            }
        }
        if(this.data.gang){
            gang = this.data.gang.count;
        }
        if(this.data.balance){
            let huaCards;
            let card;
            let baopai ;
            let summary = cc.find('Canvas/summary').getComponent('SummaryClick');
            // 补花
                // huaCards = [-32,-33,-34,-35,-36,-37,-38,-39,-6,-9,-12];
            if(this.data.balance.buhua){
                // huaCards = this.decode(this.data.balance.bu);
                huaCards = this.data.balance.buhua;
                for(let i = 0 ; i< huaCards.length ; i ++){
                    let card = cc.instantiate(this.buhua);
                    card.getComponent('BuHuaAction').init(huaCards[i]);
                    card.parent = this.huaParent;
                }
            }
            if(this.data.balance.bao!= -1){
                card = cc.instantiate(summary.bp);
                baopai  = card.getComponent('DeskCards');    
                baopai.init(this.data.balance.bao,'B',true);
                card.parent = summary.bpp;   
            }
            if(this.data.balance.huCard){
                hucards = this.data.balance.huCard;
            }
            if(this.data.balance.drop == true){
                drop = '点炮';
                this.target.getComponent(cc.Sprite).spriteFrame = this.diaopao;
                this.target.color = new cc.Color(255,255,255);
            }    
            if(this.data.balance.taishu){
                tai = ' '+this.data.balance.taishu + '台';
            }
            units= this.data.balance.units;
            fan = this.data.balance.count ; 
            
            if(units){
                let point = '';
                for(let i =0 ;i< units.length;i++){
                    if(cc.weijifen.GameBase.gameModel == 'wz'){
                        point = units[i].point;
                    }
                    this.hu.string += (units[i].tip+' '+ point +' ');
                } 
            }  
            // if(cc.weijifen.GameBase.gameModel != 'wz' && cc.weijifen.GameBase.gameModel != 'nj' &&  cc.weijifen.GameBase.gameModel != 'ls'){
            if(cc.weijifen.GameBase.gameModel == 'ch'){
                this.jifan.string = fan +'番'+'   '+gang +'杠   ';
                if(this.data.balance.noTing == true){
                    noTing = '未上听';
                }else{
                    noTing = '上听';
                }
            } 
        }
      
        
        this.hu.string += noTing + '  '+drop + ' ' + tai;
        let player = cc.find('Canvas').getComponent('MJDataBind').playersarray;
        var cardsss = this.data.cards;
        // var cardsss = this.decode(this.data.cards);
        function sortNumber(a,b){return a - b}
        cardsss.sort(sortNumber);
        
        for(let i=0;i<player.length;i++){
            let pl = player[i].getComponent('MaJiangPlayer');
            if(pl.data.id == this.data.user){
                if(this[pl.wind]){
                    this[pl.wind].active = true;                    
                }
                if(this.data.user == cc.weijifen.banker){
                    this.banker.active = true ; 
                }
                headimg = pl.data.headimgurl;
                this.peoname.string = pl.data.username;
            }
        }
        if(headimg){
            var imgurl = headimg;
            var sprite = this.headimgs.getComponent(cc.Sprite);
            var head = this.headimgs;
            cc.loader.load({url:imgurl,type:'jpg'},function(suc,texture){
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                head.width = 52;
                head.height = 47;
            });
            var headBorder = this.headimgs.children[0].getComponent(cc.Sprite);
            this.headimgs.children[0].width = 70;
            this.headimgs.children[0].height = 65;
            if (cc.weijifen.level == 2) {
                headBorder.spriteFrame = this.headBorder.getSpriteFrame('333333333');
            } else if (cc.weijifen.level == 1) {
                headBorder.spriteFrame = this.headBorder.getSpriteFrame('111111111');
            } if (cc.weijifen.level == 0) {
                headBorder.spriteFrame = this.headBorder.getSpriteFrame('222222');
            } 
        }
        this.count.string= this.data.count;
        if(this.data.win ==true){
            var gameModelMp3 = "";
            this.target.getComponent(cc.Sprite).spriteFrame = this.redwin;
            this.win.active = true;
        }
        function setCardSize (node) {
            node[0].width = 30;
            node[0].height = 12;
            node[0].x = 0;
            node[0].y = -23;
            node[1].width = 30;
            node[1].height = 12;
            node[1].x = 0;
            node[1].y = -23;
        };
        for(let i = 0;i<this.data.actions.length;i++){
            let kong = cc.instantiate(this.mjkong);
            kong.parent = this.mjloyad;
            // let action = this.decode(this.data.actions[i].card);
            let action = this.data.actions[i].card;
            function sortNumber(a,b){return a - b};
            action.sort(sortNumber);
                if(this.data.actions[i].action=='gang'&&action.length ==1){
                    let c=[action[0],action[0],action[0],action[0]];
                    for(let h = 0; h<4 ;h++){
                        let card = cc.instantiate(this.card);
                        //console.log(cd[j]);
                        let a = false;
                        let b = card.getComponent('DanAction');
                        if(this.data.actions[i].type=='an'&&(h!=2)){
                            a = true;
                            b.target.children[2].width = 32;
                            b.target.children[2].height = 40;
                            b.target.children[3].width = 32;
                            b.target.children[3].height = 40;
                            b.target.children[2].x = 0;
                            b.target.children[2].y = 6;
                            b.target.children[3].x = 0;
                            b.target.children[3].y = 6;
                        }
                        b.init(c[h],a,'','1');
                        b.target.height = 53;
                        b.target.width= 32;
                        setCardSize(b.target.children);
                     
                        card.parent = kong;   
                    }
                }else if(this.data.actions[i].action=='dan'){
                    let mj = cc.find('Canvas').getComponent('MJDataBind');
                    var gameStartInit = require('GameStartInit');
                    let player = gameStartInit.player(this.data.user,mj);
                    let card = cc.find('Canvas/cards/handcards/'+player.tablepos+'/kongcards').children[i+1];
                    for(let q = 0 ; q< card.children.length; q++){
                        let xiao = cc.instantiate(this.card);
                        let xiaocard = xiao.getComponent('DanAction');
                        let da = card.children[q].getComponent('DanAction');
                        xiaocard.init(da.mjtype,false,'',da.count.string);
                        xiaocard.target.height =53;
                        xiaocard.target.width =32;
                        setCardSize(xiaocard.target.children);

                        xiao.parent =kong;
                    }
                }else{
                    for(let j=0;j<action.length;j++){
                        let card = cc.instantiate(this.card);
                        //console.log(cd[j]);
                        let a = false;
                        let c = action[j];
                        let b = card.getComponent('DanAction');                          
                        b.init(c,a,'','1');
                        b.target.height = 53;
                        b.target.width= 32;
                        setCardSize(b.target.children);

                        card.parent = kong;           
                    }
                }
            }
        {
            
            let kong = cc.instantiate(this.mjkong);
            for(let i = 0;i<cardsss.length;i++){   
                kong.parent = this.mjloyad;
                if(cardsss[i]>-32){
                    let card = cc.instantiate(this.card);
                    let b = card.getComponent('DanAction');
                    b.init(cardsss[i],false,'','1','',true);
                    b.target.height = 53;
                    b.target.width= 32;
                    setCardSize(b.target.children);

                    card.parent = kong;     
                }else{
                    let card = cc.instantiate(this.hua);
                    let b = card.getComponent('BuHuaAction');
                    b.init(cardsss[i],'',true);
                    b.target.height = 53;
                    b.target.width= 32;
                    setCardSize(b.target.children);
                    card.parent = kong;  
                }
                      
            }
        }
        {
            if(this.data.win){
                let kong = cc.instantiate(this.mjkong);
                kong.parent = this.mjloyad;
                if(this.data.balance.huCard>-32){
                    let card = cc.instantiate(this.card);                 
                    let b = card.getComponent('DanAction');
                    b.init(this.data.balance.huCard,false,'','1','',true);
                    b.target.height = 53;
                    b.target.width= 32;
                    setCardSize(b.target.children);
                    card.parent = kong; 
                }else{

                    let b = card.getComponent('BuHuaAction');
                    b.init(this.data.balance.huCard,'',true);
                    b.target.height = 53;
                    b.target.width= 32;
                    setCardSize(b.target.children);
              
                    card.parent = kong; 
                }
                 
            }       
        }
    },
    setData:function(data){
        this.data = data ; 
        this.init();
    },
    isDan: function(action){
        
        let type = 'yao';
        for(let i = 0 ; i< action.length; i ++){
            if(action[i]<0){
                if(parseInt(action[i]/4)<-3){
                    type = 'wind';
                    break;
                }else{
                    type='xi';
                    break;
                }
            }else{
                if(parseInt((action[i]%36)/4)==8&&((parseInt(parseInt(action[i]/4)/9)==0)||parseInt(parseInt(action[i]/4)/9)==1||parseInt(parseInt(action[i]/4)/9)==2)){
                    type='jiu';
                    break;
                }
            }
        }
        return type;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
