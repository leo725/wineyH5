<template>
<div class="container">
    <common-title title="寄件详情"></common-title>
    <div class="main">
        <div class="main-box">
            <i class="bg"></i>
            <div class="box">
                <header>
                    <p class="title">上门取件预约成功</p>
                    <p class="code">取件码：{{mailDetail.deliverCode}}</p>
                    <p class="remind">快递上门前请勿提供</p>
                </header>
                <div class="center between">
                    <span>取件时间</span>
                    <p>{{mailDetail.deliverPartTime|strStartAndEnd(5)}}</p>
                </div>
                <main>
                    <div class="info-box between">
                        <img src="../../assets/img/icon-ji.png" alt="">
                        <div class="right">
                            <p class="top between">
                                <span>寄件人：{{mailDetail.deliverNickName}}</span>
                                <span>{{mailDetail.deliverMobileNo}}</span>
                            </p>
                            <p class="address">{{mailDetail.deliverAddress}}</p>
                        </div>
                    </div>
                    <div class="info-box between">
                        <img src="../../assets/img/icon-shou.png" alt="">
                        <div class="right">
                            <p class="top between">
                                <span>收件人：{{mailDetail.collectNickName}}</span>
                                <span>{{mailDetail.collectPhone}}</span>
                            </p>
                            <p class="address">{{mailDetail.collectAddress}}</p>
                        </div>
                    </div>
                </main>
                <div class="common-btn" @click="cancelMail">取消寄件</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
    data() {
        return {
            mailDetail: {}
        }
    },
    components: {
        commonTitle
    },
    created() {
        var mailDetail = sessionStorage.getItem('maildetailObj');
        if (mailDetail) {
            this.mailDetail = JSON.parse(mailDetail);
            console.log(this.mailDetail)
        }
    },
    beforeDestroy() {
        // 页面销毁之前关闭弹窗
        this.$messagebox.close();
    },
    methods: {
        // 取消寄件
        cancelMail() {
            this.$messagebox.confirm('', {
                title: '提示',
                message: '是否取消寄件?',
            }).then(action => {
                if (action == 'confirm') { //确认的回调
                    var params = {
                        goodsWineryOrderId: this.mailDetail.goodsWineryOrderId
                    }
                    this.$http.post('/apis' + 'sell_order/cancel_mail.htm', this.Qs.stringify(params)).then(res => {
                        if (res.retCode == 0) {
                            this.$toast({
                                message: '操作成功',
                                duration: 1200,
                                className: 'success'
                            });
                            this.$router.back(-1);
                        } else if (res.retCode == "10002") {
                            this.$router.replace({
                                path: '/wcoin/login'
                            })
                        }
                    })
                }
            }).catch(err => {
                if (err == 'cancel') { //取消的回调
                    console.log(2);
                }
            });
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100%;
    background-color: #f2f2f2;
}

.main {
    padding: 0 30px;
}

.main-box {
    padding: 0px 0px 50px;
    background-color: #fff;
}

.bg {
    display: block;
    height: 80px;
    width: 100%;
    background: url(../../assets/img/line_caries.png) no-repeat;
    background-size: 100%;
    position: relative;
    top: -16px;
}

.box {
    padding: 0 60px;
}

.title {
    font-size: 38px;
    color: #e50026;
    margin-bottom: 27px;
}

.code {
    font-size: 32px;
    color: #333333;
    margin-bottom: 6px;
    line-height: 45px;
}

.remind {
    font-size: 26px;
    color: #333333;
}

.center {
    height: 110px;
    line-height: 110px;
    border-top: 2px solid #eee;
    border-bottom: 2px solid #eee;
    margin: 30px 0;
}

.center span,
.center p {
    font-size: 30px;
    color: #333333;
    line-height: 106px;
}

.center p {
    color: #333;
}

.info-box {
    margin-bottom: 40px;
}

.info-box img {
    width: 83px;
    height: 83px;
    margin-top: 22px;
    margin-right: 34px;
}

.info-box .top span {
    font-size: 28px;
    color: #000000;
    margin-bottom: 8px;
}

.info-box .right{
    width: 100%;
}

.address {
    font-size: 28px;
    color: #999999;
    line-height: 40px;
    min-height: 76px;
}

.common-btn {
    background: #999999;
    margin-top: 126px;
}
</style>
