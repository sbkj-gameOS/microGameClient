cc.Class({
    extends: cc.Component,

    properties: { 
        bgAudioID:-1            //   背景 音乐  id
    },

    // use this for initialization
    init: function () {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if(cc.sys.localStorage.getItem('nobgm') != 'true'){
                cc.audioEngine.resumeAll();
            }  
        });
    },  
    _getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },
    playBGM(url){
        var audioUrl = this._getUrl(url);
        if(this.bgAudioID >= 0){
            cc.audioEngine.stop(this.bgAudioID);
        }
        this.bgAudioID = cc.audioEngine.play(audioUrl,true,this.bgVolume);
    },
    playSFX(url){
        var audioUrl = this.getUrl(url);
        if(this.deskVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.deskVolume);    
        }
    },
    getState:function(){
        return cc.audioEngine.getState(this.bgAudioID);
    },
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
