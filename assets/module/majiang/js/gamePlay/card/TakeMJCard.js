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
        target:{
            default:null ,
            type : cc.Node
        },
        tape:cc.Button,
        
    },

    // use this for initialization
    onLoad: function () {
        this.tape.node.on('touchmove',this.touchendClick, this);
        this.tape.node.on('touchend',this.mouseupClick, this);
        
    },
    mouseupClick: function(event){
        console.log(this.y);
        if(cc.sys.localStorage.getItem('delta')>90){
            event.target.x = 0;
            event.target.y = 0;
            this.node.dispatchEvent( new cc.Event.EventCustom('takecard', true));
        }
        event.target.x = 0;
        event.target.y = 0;
        cc.sys.localStorage.removeItem('delta');
    },
    touchendClick:function(event){
        let card = event.target.parent.getComponent('HandCards');
        if(cc.sys.localStorage.getItem('alting')!='true'&&cc.sys.localStorage.getItem('ting')!='true'&&!card.caishen){
            var delta = event.touch.getDelta();
            event.target.x += delta.x;
            event.target.y += delta.y;
            cc.sys.localStorage.setItem('delta',event.target.y);
        }
        // console.log('currentTarget:'+event.currentTarget.x);
        // console.log('currentTouch:'+event.currentTouch._point.x);
        // console.log('target:'+event.target.x);
        // console.log('touch:'+event.touch._point.x);
        // console.log('parent:'+ event.target.parent.x+'  '+event.target.parent.name)
        // console.log('------'+Number(event.touch._point.x - event.target.parent.x));
    },
    onClick:function(event){
        let context = cc.find('Canvas').getComponent('MJDataBind');         
        let handCards = this.target.getComponent("HandCards")
        let self = this ;
        if(cc.weijifen.click == 1 &&cc.sys.localStorage.getItem('alting') !='true'){
            this.huifu();            
            this.node.dispatchEvent( new cc.Event.EventCustom('takecard', true) );
        }else{
            if( handCards.take == true){
                //出牌
                if (context.tings&&cc.sys.localStorage.getItem('ting')=='true'){
                    context.tingSelect.active = false;
                    let tinglength = context.tingSelect.children[0].children.length;
                    for(let i = 0 ; i< tinglength ; i++){
                        context.tingSelect.children[0].children[i].destroy();
                    }
                }
                event.target.x = 0;
                event.target.y = 0;
                this.node.dispatchEvent( new cc.Event.EventCustom('takecard', true) );
            }else{
                this.huifu();
                if(cc.sys.localStorage.getItem('alting')=='true'){
                    cc.sys.localStorage.setItem('take','true');                    
                }
                handCards.target.y = handCards.target.y + 20 ;
                handCards.cardvalue.color = new cc.Color(230, 190, 190);
                handCards.take = true;
                if (context.tings&&cc.sys.localStorage.getItem('ting')=='true'){
                    let tinglength = context.tingSelect.children[0].children.length;
                    for(let i = 0 ; i< tinglength ; i++){
                        context.tingSelect.children[0].children[i].destroy();
                    }
                    let chuqu = false;
                    for(let j = 0 ; j< context.tings.length;j++){
                        let cv = context.tings[j].card; 
                        if((cv<0&&parseInt(cv/4 )==parseInt(handCards.value/4 ))||(cv>=0&&handCards.mjtype==parseInt(cv/36)&&parseInt((handCards.value%36)/4)==parseInt((cv%36)/4))){
                            let tingcards = context.decode(context.tings[j].cards);
                            console.log(tingcards);
                            context.tingSelect.active = true;                            
                            for(let s = 0 ; s< tingcards.length;s++){
                                let limian = cc.instantiate(context.tingSelectch);
                                // if(context.tings[i].counts){
                                //     limian.getComponent('tingAction').label.string = '还剩:'+context.tings[j].counts.length+'张';
                                // }
                                let cccc = limian.getComponent('tingAction').target.getComponent('HandCards');
                                cccc.init(tingcards[s],true);
                                limian.parent = context.tingSelect.children[0];
                                chuqu = true;
                            }
                            break;
                        }  
                    }
                }
            }    
        }
    }, 
    huifu: function(){
        const length  = cc.find('Canvas/cards/handcards/current/currenthandcards').children.length;
        for(let i =0; i<length;i++){
            let cards =cc.find('Canvas/cards/handcards/current/currenthandcards').children[i];
            let handCards = cards.getComponent("HandCards");
            handCards.take = false;
            let button = cc.find('Canvas/cards/handcards/current/currenthandcards').children[i].children[0];                
            
            let card = cards.getComponent('HandCards');
            if(cc.weijifen.cardNum > 14){ 
                card.cardvalue.width = 67.5;
                card.cardvalue.height = 102.5;
                cards.width=65.5; 
            }else{
                cards.width=73;    
            }
            handCards.target.y = 0;
            if(button.getComponent(cc.Button).interactable&&!card.caishen){
                handCards.cardvalue.color = new cc.Color(255, 255, 255);
            }
        }
    }  
});