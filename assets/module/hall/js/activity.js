var WJFCommon = require('WJFCommon');
cc.Class({
    extends: WJFCommon,

    properties: {
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
    },
    onLoad () {
        cc.weijifen.activityId = 31;
        this.clickFlag = true; // 是否已经点击抽奖按钮
        this.turnTableNum = 8; // 转盘格数 
        this.turnRotation = 360 / (this.turnTableNum); // 每一份转盘格数转动的角度
        this.turnTableInit();

    },
    /**
     * 初始化转盘奖项
     */
    turnTableInit: function () {
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
                let awardData = JSON.parse(data.activityManange.awardData).awardData;
                self.glData = JSON.parse(data.activityManange.awardData).glData;
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
                // 右侧信息


            }
        };
        cc.weijifen.http.httpPost("/gamePrizeActivity/findActivityOne",{activityId:cc.weijifen.activityId},initData,self.err,self);
    },
    /*点击抽奖按钮*/
    startClick: function () {
        let self = this;
        self.lottery();

        self.pointerButtonStartControl();


    },
    /*查询当前用户是否有资格*/
    lottery () {
        let self = this;
        function query (res) {
            console.log(res)


        }
        cc.weijifen.http.httpPost('/gamePrizeActivity/findZiGe',{activityId:cc.weijifen.activityId},query,self.err,self);
    },
    /*转盘转动动画*/
    pointerButtonStartControl: function () {
        let self = this;
        let angle = 200;// 初始状态下，抽奖结果所在的度数
        let rounds = 6; // 转盘转动的圈数
        let clickTimes = 6; // 转盘转动的时间
        var rotateBy02 = cc.rotateBy(clickTimes, angle + 360 * rounds - self.turnRotation);
        self.pointer.node.runAction(rotateBy02).easing(cc.easeCubicActionOut(clickTimes));
    },
    err () {
        console.log('错误！')
    }
});
