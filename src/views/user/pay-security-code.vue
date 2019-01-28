<template>
    <div class="container">
        <common-title title="修改支付密码" :sub-text="'已发送验证码到您的手机 '+mobileNo" class="pay-title"></common-title>
        <div class="main">
            <p class="title">输入验证码</p>
            <input type="text" maxlength="4" class="hidden" v-model="codeModal" ref="hideInput">
            <ul class="list" @click="focusInput">
                <li v-for="(item,index) in codeList" :class="index==codeModal.length?'active':''">{{item.value}}</li>
            </ul>
            <p class="code-btn" @click="sentCode" v-if="canSentCode">获取验证码</p>
            <p class="code-btn no" v-else>{{num}}S后重发</p>
        </div>
    </div>
</template>

<script>
import commonTitle from '@/components/common-title'
var timer;
export default {
    data() {
        return {
            mobileNo: this.globalData.wcoinMobile,
            codeList: [{
                value: ''
            }, {
                value: ''
            }, {
                value: ''
            }, {
                value: ''
            }],
            codeModal: '',
            num: 60,
            canSentCode: true
        }
    },
    components: { commonTitle },
    created() {
        this.sentCode();
    },
    mounted() {
        this.$refs.hideInput.focus()
    },
    methods: {
        focusInput() {
            this.codeModal = '';
            this.$refs.hideInput.focus()
        },
        // 提交验证码
        goNext() {
            this.$router.replace({
                path: '/wcoin/setPayPwd',
                query: {
                    code: this.codeModal
                }
            })
        },
        // 发送验证码
        sentCode() {
            if (!this.canSentCode) {
                return false;
            };
            this.canSentCode = false;
            clearInterval(timer);
            var params = {
                mobileNo: this.mobileNo,
                smsEnum: 'paypassword'
            }
            this.showBtn = false;
            this.$http.post('/apis' + 'sms/send.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: '验证码发送成功',
                        className: 'success',
                        duration: 1200
                    })
                    timer = setInterval(() => {
                        this.num--;
                        if (this.num <= 0) {
                            this.num = 60;
                            this.canSentCode = true;
                            clearInterval(timer)
                        }
                    }, 1000)
                }
            })

        }
    },
    watch: {
        codeModal(newVal, oldVale) {
            var arr = [{
                value: ''
            }, {
                value: ''
            }, {
                value: ''
            }, {
                value: ''
            }];
            for (let i = 0; i < newVal.length; i++) {
                if (i > 3) {
                    return;
                }
                arr[i].value = newVal[i];
            }
            this.codeList = arr;
            if (newVal.length == 4) {
                this.goNext();
            }
        }
    }
}
</script>

<style scoped>
.pay-title {
  margin-bottom: 55px;
}
.main {
  padding-left: 40px;
}
.title {
  font-size: 38px;
  color: #333333;
}
.list {
  overflow: hidden;
  margin-top: 80px;
}
.list li {
  width: 68px;
  float: left;
  margin-right: 80px;
  border-bottom: 2px solid #666;
  text-align: center;
  font-size: 48px;
  color: #333;
  height: 68px;
}
.list li.active {
  position: relative;
}
.list li.active::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 0;
  height: 48px;
  border-left: 4px solid #666;
  animation: mymove 1s infinite;
}
@keyframes mymove {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.hidden {
  opacity: 0;
  height: 0;
}
.code-btn {
  font-size: 32px;
  margin-top: 80px;
  color: #e50026;
}
.code-btn.no {
  color: #cccccc;
}
</style>
