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
        /*music:{
            default: null,
            type: cc.Sprite
        },
        musicSlider:{
            default: null,
            type: cc.Slider
        },
        sound:{
            default: null,
            type: cc.Sprite
        },
        soundSlider:{
            default: null,
            type: cc.Slider
        },*/
        musicon:{
            default: null,
            type: cc.Node
        },
        musicoff:{
            default: null,
            type: cc.Node
        },
        soundon:{
            default: null,
            type: cc.Node
        },
        soundoff:{
            default: null,
            type: cc.Node
        },
        danji:cc.Node,
        shuangji:cc.Node,

        Ycard: cc.Node,
        Bcard: cc.Node,
        Rcard: cc.Node,
        
        YBG: cc.Node,
        BBG: cc.Node,
        RBG: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // this.musicSlider.progress = cc.weijifen.audio.getBGMVolume();
        // this.music.fillRange  = cc.weijifen.audio.getBGMVolume() ;

        // this.soundSlider.progress = cc.weijifen.audio.getSFXVolume();
        // this.sound.fillRange =cc.weijifen.audio.getSFXVolume();
        if(cc.find('Canvas/global')){
            this.bgonload();
            this.cardonload();
        }
        if(cc.weijifen.audio.getState() == cc.audioEngine.AudioState.PLAYING){
            this.musicon.active = true ;
            this.musicoff.active =  false;
        }else{
            this.musicon.active = false ;
            this.musicoff.active =  true
        }
        if(cc.weijifen.audio.getSFXVolume()>0){
            this.soundon.active = true ;
            this.soundoff.active =false;
        }else{
            this.soundon.active = false ;
            this.soundoff.active =true;
        }
        if(cc.weijifen.click ==1){
            this.danji.active = true;
            this.shuangji.active = false;
        }else{
            this.danji.active = false;
            this.shuangji.active = true;
        }

    },
    // onMusicSlide:function(slider){
    //     if(cc.sys.localStorage.getItem('nobgm')=='true'){
    //         cc.weijifen.audio.playBGM("bgMain.mp3");
    //         cc.sys.localStorage.removeItem('nobgm');
    //     }
    //     this.music.fillRange  = slider.progress ;
    //     cc.weijifen.audio.setBGMVolume(slider.progress) ;
    //     this.musicon.active = true ;
    //     this.musicoff.active =  false;
    // },
    // onSoundSlide:function(slider){
    //     this.sound.fillRange  = slider.progress ;
    //     cc.weijifen.audio.setSFXVolume(slider.progress) ;
    //     this.soundon.active = true ;
    //     this.soundoff.active =  false;
    // },
    onSoundBtnClick:function(){
        //console.log(cc.weijifen.audio.getSFXVolume());
        if(cc.weijifen.audio.getSFXVolume()>0){
            this.soundon.active = false ;
            this.soundoff.active =true;
            cc.weijifen.audio.setSFXVolume(0);
        }else{
            this.soundon.active =true;
            this.soundoff.active =false;
            cc.weijifen.audio.setSFXVolume(1); 
        }
        cc.weijifen.mp3Music = cc.weijifen.audio.getSFXVolume();
    },
    onMusiceBtnClick:function(){
        if(cc.weijifen.audio.getState() == cc.audioEngine.AudioState.PLAYING){
            this.musicon.active = false ;
            this.musicoff.active =  true;
            cc.weijifen.audio.pauseAll();
            //cc.weijifen.audio.setBGMVolume(0);
            cc.sys.localStorage.setItem('nobgm','true');
        }else{
            this.musicon.active = true ;
            this.musicoff.active =  false;
            cc.weijifen.audio.playBGM("bgFight.mp3");
            cc.weijifen.audio.setBGMVolume(1);           
            cc.sys.localStorage.removeItem('nobgm');
        }
    },
    dnajiClick: function(){
        if(cc.weijifen.click == 1){
            this.danji.active = false;
            this.shuangji.active = true;
            cc.weijifen.click = 2 ;
            cc.sys.localStorage.setItem('click',2);
        }else{
            this.danji.active = true;
            this.shuangji.active = false;
            cc.weijifen.click = 1 ;
            cc.sys.localStorage.setItem('click',1);
            
        }
    },
    cardClick(event){
        var event_string = event.target.getComponent(cc.Button).clickEvents[0].customEventData
        let parent = event.target.parent.parent;
        for(let i = 0 ; i < parent.children.length; i++ ){
            parent.children[i].children[0].active = false;
        }
        event.target.parent.children[0].active = true;
        cc.sys.localStorage.setItem('cardcolor',event.target.name);
        if(cc.find('Canvas/bg')){
            let mj = cc.find('Canvas/js/settingClick').getComponent('settingClick');      
            mj.cardsetting();     
        }   
    },
    BGClick(event){
        
        let parent = event.target.parent;
        for(let i = 0 ; i< parent.children.length; i++){
            parent.children[i].children[0].active = false;
        }
        event.target.children[0].active = true ; 
        cc.sys.localStorage.setItem('bgcolor',event.target.name);
        if(cc.find('Canvas/bg')){
            let mj = cc.find('Canvas/js/settingClick').getComponent('settingClick');      
            mj.bgsetting(); 
        }
        
    },
    bgonload: function(){
        
        if(cc.sys.localStorage.getItem('bgcolor')=='green'){
            this.YBG.active = true ;
            this.BBG.active = false;
            this.RBG.active = false;                
        }else if(cc.sys.localStorage.getItem('bgcolor')=='blue'){
            this.YBG.active = false ;
            this.BBG.active = true;
            this.RBG.active = false; 
        }else if(cc.sys.localStorage.getItem('bgcolor')=='purple'){
            this.YBG.active = false ;
            this.BBG.active = false;
            this.RBG.active = true; 
        }
    },
    cardonload: function(){
        if(cc.sys.localStorage.getItem('cardcolor')=='yellow'){
            this.Ycard.active = true ;
            this.Bcard.active = false;
            this.Rcard.active = false;                
        }else if(cc.sys.localStorage.getItem('cardcolor')=='blue'){
            this.Ycard.active = false ;
            this.Bcard.active = true;
            this.Rcard.active = false; 
        }else if(cc.sys.localStorage.getItem('cardcolor')=='purple'){
            this.Ycard.active = false ;
            this.Bcard.active = false;
            this.Rcard.active = true; 
        }
    },
    /*
    * 阻止弹出层穿透
    */
    stopThrough: function (event) {
        event.bubbles = false
    }
});
