var WJFCommon = require('WJFCommon');
cc.Class({
    extends: WJFCommon,

    properties: {
        scrollWord: cc.Node,
        pointer: {
            default: null,
            type: cc.Sprite
        },
        turnModel: cc.Node,
        turnImgArr: {
            default: [],
            type: cc.SpriteFrame
        },
        turnTable: cc.Node,
        clickBtn: cc.Node,
        rightBox: cc.Node
    },
    onLoad () {
        // cc.weijifen.activityId = 31;
        cc.weijifen.http.httpPost("/gamePrizeActivity/prizeDzpData",{type: 'ch'},function(result,obj){
            // {"success":"true","activityId":"31"}
            var res = JSON.parse(result);
            if (res.success) {
                cc.weijifen.activityId = res.activityId;
                obj.clickFlag = true; // 是否已经点击抽奖按钮
                obj.turnTableNum = 8; // 转盘格数 
                obj.turnRotation = 360 / (obj.turnTableNum); // 每一份转盘格数转动的角度
                obj.turnTableInit();
            }
        },this.err,this);

    },
    /**
     * 初始化转盘奖项
     */
    turnTableInit () {
        // 测试数据
    /* {"activityManange":{"gameType":1,"image":null,"competency":"[{\"id\":\"1\",\"name\":\"1人1天次\"},{\"id\":\"3\",\"name\":\"房卡1天多次\"}]",
     "awardData":"{\"awardData\":[{\"orgi\":\"ch\",\"createTime\":1525685580000,\"count\":\"1\",\"dname\":\"房卡\",\"id\":22,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-1张\",\"probability\":2},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"再接再厉\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"再接再厉\",\"probability\":35},
     {\"orgi\":\"ch\",\"createTime\":1525685587000,\"count\":\"3\",\"dname\":\"房卡\",\"id\":24,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-3张\",\"probability\":1},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"不要灰心\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"不要灰心\",\"probability\":25},
     {\"orgi\":\"ch\",\"createTime\":1525685594000,\"count\":\"10\",\"dname\":\"房卡\",\"id\":26,\"isDel\":0,\"did\":1,\"nameValue\":\"房卡-10张\",\"probability\":0},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"再接再厉\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"再接再厉\",\"probability\":20},
     {\"orgi\":\"ch\",\"createTime\":1525685556000,\"count\":\"1\",\"dname\":\"月赛卡\",\"id\":21,\"isDel\":0,\"did\":2,\"nameValue\":\"月赛卡-1张\",\"probability\":0},
     {\"orgi\":null,\"createTime\":1525685631132,\"count\":null,\"dname\":\"不要灰心\",\"id\":-1,\"isDel\":null,\"did\":-1,\"nameValue\":\"不要灰心\",\"probability\":17}],
     \"glData\":[[0,1,43,\"房卡-1张\",2,22],[1,45,88,\"再接再厉\",35,-1],[2,90,133,\"房卡-3张\",1,24],[3,135,178,\"不要灰心\",25,-1],[4,180,223,\"房卡-10张\",0,26],[5,225,268,\"再接再厉\",20,-1],
     [6,270,313,\"月赛卡-1张\",0,21],[7,315,358,\"不要灰心\",17,-1]]}","num":1,"content":"欢乐大转盘，转转更欢乐","orgi":"ch","createTime":1534129469000,"name":"欢乐大转盘","startTime":"2018-05-07 00:00:00.0","endTime":"2019-05-06 00:00:00.0","id":31,"userType":2,"isDel":0,"status":1},
     "prizeUser":"OOO 获得 房卡-3张, T。篮球疯子爱健身 获得 房卡-1张  , Er. 获得 房卡-1张   ,T。篮球疯子爱健身 获得 房卡-1张,  亚茹[微笑] 获得 房卡-1张 ,  宋静冰 获得 房卡-1张 ","success":true}*/
        let self = this;
        function initData (res) {
            var data1 = null;
            var data = JSON.parse(res);
            if (data.success) {
                let arr = [],userType = ['','VIP用户','普通用户'];
                let awardData = JSON.parse(data.activityManange.awardData).awardData;
                let competency = JSON.parse(data.activityManange.competency);// 参赛资格
                self.glData = JSON.parse(data.activityManange.awardData).glData;// 顶部滚动信息
                // 转盘
                for (let i = 0;i < awardData.length;i++) {
                    let turnModel = cc.instantiate(self.turnModel);
                    turnModel.getChildByName('txt').getComponent(cc.Label).string = awardData[i].nameValue;
                    if (awardData[i].dname == '房卡') {
                        turnModel.getChildByName('img').getComponent(cc.Sprite).spriteFrame = self.turnImgArr[0];
                    } else if (awardData[i].dname == '再接再厉' || awardData[i].dname == '不要灰心') {
                        turnModel.getChildByName('img').getComponent(cc.Sprite).spriteFrame = self.turnImgArr[1];
                    } else if (awardData[i].dname == '月赛卡') {
                        turnModel.getChildByName('img').getComponent(cc.Sprite).spriteFrame = self.turnImgArr[0];
                    }
                    turnModel.rotation = self.turnRotation * (i + 1);
                    turnModel.parent = self.turnTable;
                    turnModel.active = true;
                }
                // 右侧信息（content节点）
                // @param i           子节点下标
                // @param childName   孙节点名字
                // @param dataStr     孙对应要更改的数据
                function getString (i,childName,dataStr) {
                    self.rightBox.children[i].getChildByName(childName).getComponent(cc.Label).string = data.activityManange[dataStr];          
                }
                for (let ele of competency) { arr.push(ele.name); }
                getString(0,'name','name');
                self.rightBox.children[1].getChildByName('name').getComponent(cc.Label).string = 
                                data.activityManange.startTime.substr(0,data.activityManange.startTime.length - 2) + ' - ' + 
                                data.activityManange.startTime.substr(0,data.activityManange.startTime.length - 2);
                self.rightBox.children[2].getChildByName('name').getComponent(cc.Label).string = arr.join('/');          
                self.rightBox.children[3].getChildByName('name').getComponent(cc.Label).string = userType[data.activityManange.userType];          
                getString(4,'name','content');
                self.scrollWord.getComponent(cc.Label).string = data.prizeUser;
                self.scrollAction();
            }
        };
        cc.weijifen.http.httpPost("/gamePrizeActivity/findActivityOne",{activityId:cc.weijifen.activityId},initData,self.err,self);

    },
    scrollAction () {
        let offset_x = 0,action;
        let self = this;
        let text = self.scrollWord;
        let width = 999;// 滚动字幕背景的长度
        let timer = setInterval(function(){
            if (!text.name) {
                clearInterval(timer);
                return
            }
            offset_x -= 5;
            if (-offset_x > text.width) {
                offset_x = 0;
                text.x = 0;
            } else {
                text.x = offset_x;
            }
        },30);
    },
    /*点击抽奖按钮*/
    startClick () {
        let self = this;
        self.lottery();
    },
    /*查询当前用户是否有资格*/
    lottery () {
        let self = this,
            params = {
                token: cc.weijifen.authorization,
                activityId: cc.weijifen.activityId
            }
        function query (res) {
            let data = JSON.parse(res);
            if (data.success) {
                if (data.zige) {
                    self.clickBtn.getComponent(cc.Button).interactable = false;
                    self.startGame();
                } else {
                    if (data.roomCard) {
                        self.alert("当前房卡数量："+data.roomCard+"\n继续操作将扣除一张房卡，扣除房卡后可拥有一次抽奖机会，是否继续？");
                        if (data.roomCard) {
                            self.subtractCard();
                        } else {
                            return false;
                        }
                    } else {
                        // 没有资格
                        self.alert(data.msg);
                    }
                }
                return
            }
            self.alert(data.msg);
        }
        cc.weijifen.http.httpPost('/gamePrizeActivity/findZiGe',params,query,self.err,self);
    },
    /*开始抽奖游戏*/
    startGame () {
        let self = this,
            params = {
                token: cc.weijifen.authorization,
                activityId: cc.weijifen.activityId
            };
        cc.weijifen.http.httpPost("/gamePrizeActivity/findZpData",params,function(res){
            let data = JSON.parse(res);
            if (data.success) {
                self.pointerButtonStartControl(data);
            }
        },self.err,self);
    },
    /*
    * 转盘转动动画
    * @param data 抽奖的结果
    */
    pointerButtonStartControl (data) {
        let self = this;
        // let angle = 200;// 初始状态下，抽奖结果所在的度数
        let rounds = 6; // 转盘转动的圈数
        let clickTimes = 6; // 转盘转动的时间
        var rotateBy02 = cc.rotateBy(clickTimes, (360 - data.angle ) + 360 * rounds);
        // var rotateBy02 = cc.rotateBy(clickTimes, data.angle + 360 * rounds - self.turnRotation);
        self.pointer.node.runAction(rotateBy02).easing(cc.easeCubicActionOut(clickTimes));
        let timer = setTimeout(function(){
            self.alert(data.msg);
            self.clickBtn.getComponent(cc.Button).interactable = true;
            clearTimeout(timer);
        },6000);
    },
    /*扣除房卡*/
    subtractCard () {
        let self = this,
            token = cc.weijifen.authorization;
        cc.weijifen.http.httpPost('/gamePrizeActivity/kouRoomCard',{token:token},function(res){
            let data = JSON.parse(res);
            if (data.success) {
                self.startGame();
            }

        },self.err,self);
    },
    err () {
        console.log('错误！')
    }
});
 