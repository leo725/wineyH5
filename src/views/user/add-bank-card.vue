<template>
  <div class="container">
    <common-title :title="isEdit?'修改银行卡':'添加银行卡'"></common-title>
    <div class="main-container">
      <div class="input-box">
        <label>户主</label>
        <input v-model="params.realName"  type="text" placeholder="请输入持卡人姓名">
      </div>
      <div class="input-box right-box" @click="bankPopup=true;">
        <label>银行名称</label>
        <span>{{selectBank.bankName}}</span>
        <img src="../../assets/img/icon-right.png" alt="" class="icon-right">
    </div>
        <div class="input-box">
          <label>银行支行</label>
          <input v-model="params.branchName"  type="text" placeholder="请输入办卡支行名称">
        </div>
        <div class="input-box">
          <label>储蓄卡号</label>
          <input v-model="params.cardNo" type="number" maxlength="18" placeholder="请输入储蓄卡号">
        </div>
        <div class="input-box">
          <label>手机号码</label>
          <input v-model="params.mobileNo" type="tel" placeholder="输入银行预留号码">
        </div>
        <p class="other" @click="params.isDefault=params.isDefault=='n'?'y':'n'">
          <input type="checkbox" :checked="params.isDefault=='y'" class="common-checkbox">
          <span>默认</span>
        </p>
        <div class="btn-box between">
          <div class="public-btn" @click='save'>{{isEdit?'保存':'马上绑定'}}</div>
          <div class="public-btn remove-btn" @click="remove" v-if="isEdit">解除绑定</div>
        </div>
      </div>
      <!-- 银行列表 -->
      <div class="goods-popup" v-if="bankPopup">  
        <div class="popup-main popup-main-max">
          <p class="between pop-title">
            <span>选择银行</span>
            <img src="../../assets/img/alert-close.png" alt="" class="close" @click="bankPopup=false">
      </p>
            <ul class="pop-list">
              <li @click="selectItem(item)" v-for="item in bankList">
                <img :src="item.logo" alt="" class="logo">
                <span class="name">{{item.bankName}}</span>
                <img src="../../assets/img/icon-select.png" alt="" class='select' v-if="item.id==selectBank.id">
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
      bankPopup: false,
      params: {
        realName: '',
        mobileNo: '',
        cardNo: '',
        isDefault: 'n',
        branchName: '',
        sysBankId: ''
      },
      selectBank: {},
      bankList: [],
      isEdit: false,
    }
  },
  components: {
    commonTitle
  },
  created() {
    if (this.$route.query.isEdit) {
      this.isEdit = true;
      var editBankCard = JSON.parse(sessionStorage.getItem('editBankCard'));
      this.params = {
        realName: editBankCard.realName,
        mobileNo: editBankCard.mobileNo,
        cardNo: editBankCard.cardNo,
        isDefault: editBankCard.isDefault,
        branchName: editBankCard.branchName,
        sysBankId: editBankCard.sysBankId,
        id: editBankCard.id
      }
    }
    this.getBankList();
  },
  beforeDestroy() {
    if (this.isEdit) {
      sessionStorage.removeItem('editBankCard');
    }
  },
  methods: {
    getBankList() {
      this.$http.post('/apis' + 'sys_bank/list.htm').then(res => {
        if (res.retCode == 0) {
          this.bankList = res.data;
          if (this.isEdit) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id == this.params.sysBankId) {
                this.selectBank = res.data[i];
                break;
              }
            }
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 选择银行
    selectItem(item) {
      this.selectBank = item;
      this.params.sysBankId = item.id;
      this.bankPopup = false;
    },
    //点击绑定
    save() {
      for (const key in this.params) {
        if (this.params.hasOwnProperty(key)) {
          if (key != 'isDefault' && !this.params[key]) {
            this.$toast({
              message: "请输入相关信息",
              className: 'warning',
              duration: 1200
            });
            return false;
          }
        }
      }
      if (!this.validate('mobile', this.params.mobileNo)) {
        this.$toast({
          message: "手机号格式不正确",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      if (!this.validate('bankCard', this.params.cardNo)) {
        this.$toast({
          message: "银行卡号格式不正确",
          className: 'warning',
          duration: 1200
        });
        return false;
      }
      this.$http.post('/apis' + 'user_bank/save.htm', this.Qs.stringify(this.params)).then(res => {
        if (res.retCode == 0) {
          this.$toast({
            message: this.isEdit ? "修改成功" : "绑定成功",
            className: 'success',
            duration: 1200
          });
          this.$router.back(-1);
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 解除绑定
    remove() {
      this.$messagebox.confirm('', {
        title: '确认解绑？',
        message: '是否确认解除绑定？',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          var params = {
            id: this.params.id
          }
          var list = this.cardList;
          this.$http.post('/apis' + 'user_bank/delete.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              this.$router.go(-1);
            } else if (res.retCode == "10002") {
              this.$router.replace({
                path: '/wcoin/login'
              })
            }
          })
        }
      }).catch(err => {
        if (err == 'cancel') { //取消的回调
        }
      });

    }
  }
}

</script>
<style scoped>
.main-container {
  padding-left: 40px;
  overflow: hidden;
}

.main-container .input-box {
  height: 110px;
  line-height: 110px;
  line-height: 110px;
  border-bottom: 2px solid #eee;
  overflow: hidden;
}

.main-container .input-box label {
  display: inline-block;
  width: 136px;
  font-size: 32px;
  color: #666666;
}

.main-container .input-box input {
  font-size: 30px;
  color: #333;
  width: 540px;
  line-height: 110px;
  padding-left: 40px;
}

.right-box {
  position: relative;
}

.right-box .icon-right {
  position: absolute;
  top: 42px;
  right: 40px;
  height: 25.2px;
}

.right-box span {
  font-size: 30px;
  color: #333333;
  float: right;
  line-height: 106px;
  margin-right: 94px;
}

.other {
  margin-top: 30px;
  padding-bottom: 10px;
}

.other span {
  font-size: 28px;
  color: #666666;
  vertical-align: middle;
  margin-left: 22px;
}

.mint-popup {
  width: 100%;
  height: 100%;
}

.popup-main {
  width: 100%;
  height: 721px;
  padding: 40px;
  padding-right: 0;
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
  width: 500px;
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

.pop-list .logo {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  margin-right: 40px;
  line-height: 110px;
  position: relative;
  top: 22px;
}

.public-btn {
  display: block;
  width: 3.84rem;
  height: 1.173333rem;
  line-height: 1.173333rem;
  color: #fff;
  background-color: #E50026;
  font-size: 0.426667rem;
  text-align: center;

}

.btn-box {
  margin-top: 1.333333rem;
  padding-right: 40px;
}

.remove-btn {
  background-color: #666666;
}
.goods-popup{
   position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #fff;
}
</style>
