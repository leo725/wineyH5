<template>
<div class="container">
    <common-title title="填写寄件信息"></common-title>
    <div class="main">
        <div class="input-box between" @click="togglePopup=true;">
            <label>快递公司</label>
            <!-- <input type="text" placeholder="输入快递公司名称"> -->
            <div class="right">
                <span>{{selectedMail.logisticsCompayName}}</span>
                <img class="icon-right" src="../../assets/img/icon-right.png" alt="">
            </div>
        </div>
        <div class="input-box">
            <label>快递单号</label>
            <input type="text"  @input="handleInput" v-model="logisticsNumber" placeholder="请输入快递单号">
        </div>
        <div class="common-btn" @click="submit">
            确认提交
        </div>
    </div>
    <!-- 快递公司弹窗 -->
    <div class="goods-popup" v-if="togglePopup">  
        <div class="tan-popup" @click="togglePopup=false"></div>
        <div class="popup-main ">
            <p class="between pop-title">
                <span>请选择快递公司</span>
                <img src="../../assets/img/alert-close.png" alt="" class="close" @click="togglePopup=false">
            </p>
            <ul class="pop-list">
                <li @click="selectMail(item)" v-for="item in mailList">
                    <span class="name">{{item.logisticsCompayName}}</span>
                    <img src="../../assets/img/icon-select.png" alt="" class='select' v-if="selectedMail.id==item.id">
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
    data() {
        return {
            togglePopup: false,
            mailList: [],
            selectedMail: {},
            logisticsNumber: '' // 快递单号
        }
    },
    components: {
        commonTitle
    },
    created() {
        this.getMailList()
    },
    methods: {
        handleInput(e) {
            this.logisticsNumber = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        },
        // 获取快递公司列表
        getMailList() {
            this.$http.get('/apis' + '/sell_order/data.htm').then(res => {
                if (res.retCode == 0) {
                    this.mailList = res.data
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        },
        // 选择快递
        selectMail(item) {
            this.selectedMail = item;
            this.togglePopup = false;
        },
        // 提交
        submit() {
            if (!this.selectedMail.id || !this.logisticsNumber) {
                this.$toast({
                    message: "请完善快递信息",
                    className: 'warning',
                    duration: 1200
                });
                return false;
            }
            var parmas = {
                logisticsConpanyId: this.selectedMail.id,
                logisticsNumber: this.logisticsNumber,
                goodsWineryOrderId: this.$route.query.id
            }
            this.$http.post('/apis' + '/sell_order/is_update.htm', this.Qs.stringify(parmas)).then(res => {
                if (res.retCode == 0) {
                    // this.mailList = res.data
                    this.$toast({
                        message: "发货成功",
                        className: 'success',
                        duration: 1200
                    });
                    this.$router.replace({
                        path: '/wcoin/mySell'
                    })
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        }
    }
}
</script>

<style scoped>
.main {
    padding-left: 40px;
}

.input-box {
    height: 110px;
    border-bottom: 2px solid #eee;
    line-height: 110px;
    padding-right: 40px;
    overflow: hidden;
}

.input-box input,
.input-box label {
    color: #333;
    line-height: 108px;
    font-size: 32px;
}

.input-box label {
    color: #666;
}

.input-box input {
    padding-left: 40px;
    width: 500px;
}

.right {
    padding-top: 41.6px;
    padding-right: 30.7px;
}

.icon-right {
    height: 25.3px;
    position: relative;
    top: 3px;
    padding-left: 40px;
}

.right span {
    line-height: 0;
    font-size: 30px;
    color: #999999;
}

.mint-popup {
    width: 100%;
}
.tan-popup{
    background-color: transparent;
    position: absolute;
    z-index: 20;
    width: 100%;
    height: 100%;
}
.popup-main {
    width: 100%;
    height: 721px;
    padding: 40px;
    padding-right: 0;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    z-index: 50;
}

.popup-main-max {
    height: 100vh;
}

.pop-title span {
    font-size: 54px;
    color: #000000;
}

.pop-title img {
    width: 70px;
    height: 70px;
    margin-right: 40px;
}

.pop-list {
    padding-left: 20px;
    margin-top: 24px;
    height: 550px;
    overflow-y: auto;
}

.pop-list li {
    height: 110px;
    line-height: 110px;
    border-bottom: 2px solid #eee;
    position: relative;
}

.pop-list .name {
    display: inline-block;
    width: 600px;
    font-size: 32px;
    color: #000000;
}

.pop-list .num {
    font-size: 32px;
    color: #999999;
}

.pop-list .select {
    position: absolute;
    right: 60px;
    top: 40px;
    width: 30px;
}
.goods-popup{
   position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
