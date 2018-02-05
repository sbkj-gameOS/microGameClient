var WJFCommon = require("WJFCommon");
cc.Class({
    extends: WJFCommon,
    properties: {
    },
    // use this for initialization
    onLoad: function () {
        this.init();
    },
    init: function(){
        let he = this ;
        he.START = 0;
        he.END = 0;
        try{ 
            cc.promise=navigator.mediaDevices.getUserMedia({audio:true});
            cc.promise.then(function(stream){
                cc.recorder=new MediaRecorder(stream);
                cc.recorder.ondataavailable=function(event){
                    //收集媒体设备 获得到的 可以使用的 媒体流数据
                    console.log(event.data)
                    var file = new FileReader();
                    file.readAsArrayBuffer(event.data);
                    console.log(file);
                    file.onloadend = function() {              
                        let ab = he.ab2str(file.result);
                        let socket = he.socket();
                        socket.emit('sayOnSound',JSON.stringify({
                            userid : cc.weijifen.user.id,
                            file : ab,
                            start : he.START,
                            end : he.END
                        })
                    )}
                }
            });
        }catch(error){
            cc.weijifen.browserType = null;
        }
    },
    talkPlay: function(data){
        if(typeof(data.file) == 'string'){
            let str =  this.str2ab(data.file);
            var aud = new Audio();
            var blob = new Blob([str],{'type':'video/webm'}) ;
            aud.src = URL.createObjectURL(blob);
            if(aud.play){
                aud.play() ;
            } 
        }  
    },
    talkRecordStart: function(){
        try{        
            this.START = new Date().getTime();
            cc.recorder.start();
        }catch(error){
            cc.find('Canvas/YY').active = true;
            setTimeout(function(){
                cc.find('Canvas/YY').active = false;                
            },2000);
        }
    },
    talkRecordEnd : function(){
        try{        
            if(cc.recorder.state != 'inactive'){
                this.END = new Date().getTime(); 
                cc.recorder.stop();
            } 
        }catch(error){

        }   
    }
});
