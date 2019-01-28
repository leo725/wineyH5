<template>
    <div class="container">
        <common-title title="修改支付密码" sub-text="支付密码为6位数字" class="pay-title"></common-title>
        <div class="input-box">
            <div class="item" @click="openKeyboard('old')">
                <input v-model="oldPwd" type="password" maxlength="6" readonly placeholder="输入旧密码">
            </div>
            <div class="item" @click="openKeyboard('new')">
                <input v-model="pwd" type="password" maxlength="6" readonly placeholder="请输新密码">
            </div>
            <div class="item" @click="openKeyboard('re')">
                <input v-model="rePwd" type="password" maxlength="6" readonly placeholder="再次输入新密码">
            </div>
            <router-link to="/wcoin/paySecurityCode" replace class="forget">忘记密码？</router-link>
            <div class="common-btn" @click="confirm">确定</div>
        </div>
        <!-- 支付键盘 -->
        <keyboard :title="keyboardTitle" @changeNum="enterOver" v-show="keyboardShow" @closePwd="closekeyboard"></keyboard>
    </div>
</template>

<script>
import commonTitle from '@/components/common-title';
import keyboard from '@/components/keyboard'
export default {
    data() {
        return {
            flag: true, // true 设置密码 false 确认密码
            keyboardShow: false,
            keyboardTitle: '设置支付密码',
            oldPwd: '',
            pwd: '',
            rePwd: ''
        }
    },
    components: { commonTitle, keyboard },
    methods: {
        // 确定
        confirm() {
            if (!this.pwd || !this.rePwd || !this.oldPwd) {
                return false;
            }
            if (this.pwd != this.rePwd) {
                this.$toast({
                    message: '密码不一致',
                    className: "warning",
                    duration: 1200
                })
                return false;
            }
            if (this.oldPwd == this.pwd) {
                this.$toast({
                    message: '新密码不能与旧密码相同',
                    className: "warning",
                    duration: 1200
                })
                return false;
            }
            var params = {
                oldPassword: this.oldPwd,
                password: this.pwd,
                confirmPassword: this.rePwd
            }
            this.$http.post('/apis' + 'user_info/update_password.htm', this.Qs.stringify(params)).then(res => {
                if (res.retCode == 0) {
                    this.$toast({
                        message: '设置成功',
                        className: "success",
                        duration: 1200
                    })
                    this.$router.back(-1);
                } else if (res.retCode == '10002') {
                    this.$router.push('/wcoin/login')
                }
            })
        },
        enterOver(res) {
            this.keyboardShow = false;
            if (this.flag == 'old') {
                this.oldPwd = res;
            } else if (this.flag == 'new') {
                this.pwd = res;
            } else {
                this.rePwd = res;
            }
        },
        closekeyboard(res) {
            if (this.flag == 'old') {
                this.oldPwd = res;
            } else if (this.flag == 'new') {
                this.pwd = res;
            } else {
                this.rePwd = res;
            }
            this.keyboardShow = false;
        },
        openKeyboard(flag) {
            this.flag = flag;
            if (this.flag == 'old') {
                //确认支付密码
                this.oldPwd = '';
                this.keyboardTitle = '输入旧密码'
            } else if (this.flag == 'new') {
                // 设置支付密码
                this.pwd = '';
                this.keyboardTitle = '输入新密码'
            } else {
                //确认支付密码
                this.rePwd = '';
                this.keyboardTitle = '再次输入新密码'
            }
            this.keyboardShow = true;
        }
    }
}
</script>

<style scoped>
.pay-title {
  margin-bottom: 55px;
}
.input-box {
  padding-left: 40px;
}
.item {
  border-bottom: 2px solid #eee;
}
.item input {
  height: 110px;
  line-height: 110px;
  font-size: 32px;
  color: #333;
}
.item input:-moz-placeholder,
.item input::-webkit-input-placeholder {
  color: #999;
}
.common-btn {
  margin-top: 100px;
}
.forget {
  font-size: 28px;
  color: #e50026;
  margin-top: 20px;
}
</style>
