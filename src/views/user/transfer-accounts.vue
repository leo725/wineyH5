<template>
<div class="container">
    <common-title title="转账" sub-text="钱将实时转入对方账户，无法退款">
        <router-link to="/wcoin/transferRecord" slot class="slot-icon">
            <img src="../../assets/img/icon-list.png" alt="">
        </router-link>
    </common-title>

    <div class="main">
        <div class="input-box">
            <input type="tel" v-model="mobileNo" placeholder="输入对方账号">
        </div>
        <div class="common-btn next-btn" @click="nextSetp">
            下一步
        </div>
    </div>
</div>
</template>

<script>
import commonTitle from '@/components/common-title'
export default {
    data() {
        return {
            mobileNo: ''
        }
    },
    components: {
        commonTitle
    },
    methods: {
        // 下一步
        nextSetp() {
            if (!this.mobileNo) {
                this.$toast({
                    message: '请输入手机号',
                    className: 'warning',
                    duration: 1200
                })
                return false;
            }
            if (!this.validate('mobile', this.mobileNo)) {
                this.$toast({
                    message: '手机号格式不正确',
                    className: 'warning',
                    duration: 1200
                })
                return false;
            }
            if (this.mobileNo == this.globalData.wcoinMobile) {
                this.$toast({
                    message: '不能转账给自己',
                    className: 'warning',
                    duration: 1200
                })
                return false;
            }
            if (!this.globalData.hasRealInfo) {
                this.$http.post('/apis' + 'user_real/info.htm').then(res => {
                    if (res.retCode == '0') {
                        if (res.data.realAudit == 'agree') {
                            this.globalData.hasRealInfo = true;
                            this.goNext();
                        } else {
                            this.$toast({
                                message: '请先实名认证',
                                duration: 1200,
                                className: 'warning'
                            });
                            return false;
                        }
                    } else if (res.retCode == "10002") {
                        this.$router.replace({
                            path: '/wcoin/login'
                        })
                    }
                })
            } else {
                this.goNext();
            }
        },
        goNext() {
            this.$http.post('/apis' + 'user_info/get_other_info.htm', this.Qs.stringify({
                mobileNo: this.mobileNo
            })).then(res => {
                if (res.retCode == 0) {
                    sessionStorage.setItem("transferOtherInfo", JSON.stringify(res.data))
                    this.$router.replace({
                        path: '/wcoin/transferCurrency'
                    })
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login');
                }
            })
        }
    }
}
</script>

<style scoped>
.slot-icon img {
    width: 35.7px;
    height: 42px;
    margin-right: 40px;
    margin-top: 10px;
}

.main {
    padding-left: 40px;
    padding-top: 55px;
}

.input-box {
    height: 110px;
    border-bottom: 2px solid #eee;
    line-height: 110px;
}

.input-box input {
    font-size: 32px;
    color: #333;
}

.next-btn {
    margin-top: 100px;
}
</style>
