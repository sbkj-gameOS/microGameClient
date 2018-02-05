cc.Class({
    extends: cc.Component,
    /** 
     *  value   麻将值
     *  fangwei  M手上的麻将自己 B桌上的麻将自己  L左边的麻将 R右边的麻将
     *  target   目标节点
     *  images   给节点渲染的图
     *  bol      是否是特殊麻将  比如财神
     * */
    mjcardvalue: function(value,fangwei,target,images,bol){
        let cardcolors = parseInt(value/4 ) ;
        let cardtype  = parseInt(cardcolors / 9);
        let deskcard,cardframe ;
        if(cardcolors < 0){
            if(cardcolors==-7){
                deskcard = fangwei+'_wind_east';
            } else if(cardcolors == -6){
                deskcard = fangwei+'_wind_south';
            } else if(cardcolors == -5){
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
        }else{
            if(cardtype == 0){ //万
                deskcard = fangwei+"_character_"+ (parseInt((value%36)/4)+1);
            }else if(cardtype == 1){ //筒
                deskcard = fangwei+"_dot_"+ (parseInt((value%36)/4)+1) ;
            }else if(cardtype == 2){  //条
                deskcard = fangwei+"_bamboo_"+ (parseInt((value%36)/4)+1) ;
            }
        }
        if(deskcard == null){
            if(value==-38){
                deskcard = fangwei+'_autumn';//秋
            } else if(value==-35){
                deskcard = fangwei+'_bamboo';//竹
            } else if(value==-34){
                deskcard = fangwei+'_chrysanthemum';//菊
            } else if(value==-33){
                deskcard = fangwei+'_orchid';//兰
            } else if(value == -32){
                deskcard = fangwei+'_plum';//梅
            }else if(value == -36){
                deskcard = fangwei+'_spring';//春
            }else if(value == -37){
                deskcard = fangwei+'_summer';//夏
            }else if(value == -39){
                deskcard = fangwei+'_winter';//冬
            }
            if(fangwei=='B'){
                if(value==-36){
                    cardframe = images[0];//春
                }else if(value==-34){
                    cardframe = images[1];//菊
                }else if(value==-33){
                    cardframe = images[2];//兰
                }else if(value==-37){
                    cardframe = images[3];//夏
                }else if(value==-35){
                    cardframe = images[4];//竹
                }else{
                    cardframe = images[5].getSpriteFrame(deskcard);
                }
            }
        }
        if(fangwei!='B'){
            cardframe = this.images.getSpriteFrame(deskcard);
        }
        this.target.getComponent(cc.Sprite).spriteFrame = cardframe;
    },
    majiangColor:function(target,value){
        target.color = new Color(value[0],value[1],value[2]);
    }
});