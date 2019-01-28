<template>
<div class="container">
  <ul class="list">
    <li v-for="(item,index) in cartList">
      <div class="list-left">
        <div class="radio" @click="selectItem(item,index)">
          <input type="checkbox" :checked="selectIndexList.indexOf(index)>=0" class="common-checkbox">
        </div>
        <div class="list-main" @click.stop="productDetail(item)">
          <div class="imgbox">
            <img :src="item.logo" alt="">
          </div>
          <div class="info">
            <p>{{item.goodsName}}</p>
            <span class="red">{{item.currenctName}}</span>
            <div class="add-minus">
              <img src="../../assets/img/icon-jian.png" alt="" @click.stop="changeNum(item,false)">
              <span class="num" @click.stop="showNumberAlertFun(item,index)">{{item.number}}</span>
              <img src="../../assets/img/icon-jia.png" alt="" @click.stop="changeNum(item,true)">
            </div>
          </div>
        </div>
      </div>
      <div class="list-right" @click="deleteItem(item,index)">
        <img src="../../assets/img/delete.png" alt="">
      </div>
    </li>
  </ul>
  <div class="fixed-footer between">
    <div class="footer-left" @click="selectAllFun">
      <input type="checkbox" v-model='selectAll' readonly class="common-checkbox">
      <span>全选</span>
    </div>
    <div class="footer-right">
      <label>合计: </label>
      <span class="red">{{total}} Wcoin</span>
      <span class="submit-btn" @click="submit">结算</span>
    </div>
  </div>
  <number-alert :num='alertNumber' @sureBtn="numberCallback" @closeBtn="showAlertNumber=false;" v-if="showAlertNumber"></number-alert>
  <footer-tab></footer-tab>
  <keyboard @changeNum="submitPwd" v-show="keyShow" @closePwd="keyShow=false"></keyboard>
</div>
</template>

<script>
import footerTab from '@/components/footer-tab'
import numberAlert from '@/components/number-alert'
import keyboard from '@/components/keyboard'
export default {
  data() {
    return {
      selectAll: false,
      cartList: [],
      total: '0.00',
      selectIndexList: [],
      selectItemList: [],
      alertNumber: 1,
      alertNumberIndex: 0,
      showAlertNumber: false,
      keyShow: false
    }
  },
  components: {
    footerTab,
    numberAlert,
    keyboard
  },
  created() {
    this.getCartList();
  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  methods: {
    // 获取购物车列表
    getCartList() {
      this.$http.post('/apis' + 'user_shopping_cart/list.htm').then(res => {
        if (res.retCode == 0) {
          this.cartList = res.data;
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 改变数量
    changeNum(item, type) {
      if (type) {
        item.number++;
      } else if (item.number > 1) {
        item.number--;
      } else {
        this.$toast({
          message: '该商品不能再减少了',
          className: "warning",
          duration: 1200
        })
        return false;
      }

      var params = {
        id: item.id,
        number: item.number
      }
      this.$http.post('/apis' + 'user_shopping_cart/update.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.totalFun();
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 计算总价
    totalFun() {
      this.total = 0;
      for (let i = 0; i < this.selectItemList.length; i++) {
        const item = this.selectItemList[i];
        this.total += item.number * item.proportion
      }
      this.total = this.total.toFixed(2);
    },
    // 选择 
    selectItem(item, index) {
      var idx = this.selectIndexList.indexOf(index);
      if (idx < 0) {
        this.selectIndexList.push(index);
        this.selectItemList.push(item);
      } else {
        this.selectIndexList.splice(idx, 1);
        this.selectItemList.splice(idx, 1);
      }
      this.totalFun();
      this.isSelectedAll();
    },
    // 删除购物车
    deleteItem(item, index) {
      this.$messagebox.confirm('', {
        title: '确认删除？',
        message: '确认删除该商品吗？',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          var params = {
            id: item.id
          }
          this.$http.post('/apis' + 'user_shopping_cart/delete.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              this.cartList.splice(index, 1);
              var idx = this.selectIndexList.indexOf(index);
              for (let i = idx; i < this.selectIndexList.length; i++) {
                this.selectIndexList[i] = this.selectIndexList[i] - 1;
              }
              this.selectItemList.splice(idx, 1);
              this.selectIndexList.splice(idx, 1);
              this.totalFun();
            } else if (res.retCode == '10002') {
              this.$router.push('/wcoin/login');
            }
          })
        }
      }).catch(err => {
        if (err == 'cancel') { //取消的回调
        }
      });

    },
    // 判断是否全选
    isSelectedAll() {
      if (this.selectIndexList.length == this.cartList.length && this.cartList.length > 0) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },
    // 全选
    selectAllFun() {
      if (this.selectAll) {
        this.selectIndexList = [];
        this.selectItemList = [];
      } else {
        this.selectIndexList = [];
        this.selectItemList = [];
        for (let i = 0; i < this.cartList.length; i++) {
          this.selectIndexList.push(i);
          this.selectItemList.push(this.cartList[i])
        }
      }
      this.selectAll = !this.selectAll;
      this.totalFun();
    },
    // 调用数字弹框
    showNumberAlertFun(item, index) {
      this.alertNumber = item.number;
      this.alertNumberIndex = index;
      this.showAlertNumber = true;
    },
    // 数字弹框回调
    numberCallback(num) {
      this.cartList[this.alertNumberIndex].number = num;
      this.showAlertNumber = false;
      var params = {
        id: this.cartList[this.alertNumberIndex].id,
        number: this.cartList[this.alertNumberIndex].number
      }
      this.$http.post('/apis' + 'user_shopping_cart/update.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          this.totalFun();
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 商品详情
    productDetail(item) {
      this.$router.push({
        path: '/wcoin/goodsInfo',
        query: {
          id: item.goodsId
        }
      })
    },
    // 结算
    submit() {
      if (this.selectItemList.length <= 0) {
        this.$toast({
          message: '您还没有选择商品',
          className: "warning",
          duration: 1200
        })
        return false;
      }
      if (!this.globalData.hasRealInfo) {
        this.$http.post('/apis' + 'user_real/info.htm').then(res => {
          if (res.retCode == '0') {
            if (res.data.realAudit == 'agree') {
              console.log(res.data)
              this.globalData.hasRealInfo = true;
              this.checkPwd();
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
        this.checkPwd();
      }
    },
    checkPwd() {
      this.$http.post('/apis' + 'user_info/check_password.htm').then(res => {
        if (res.retCode == 0) {
          if (res.data == 'y') {
            this.keyShow = true;
          } else {
            this.$toast({
              message: '暂未设置支付密码',
              className: "warning",
              duration: 1200
            })
          }
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 输入密码回调
    submitPwd(num) {
      var ids = [];
      for (let i = 0; i < this.selectItemList.length; i++) {
        const element = this.selectItemList[i];
        ids.push(this.selectItemList[i].id)
      }
      var params = {
        id: ids.join(','),
        payPassword: num
      };
      this.$http.post('/apis' + 'user_shopping_cart/settlement.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          sessionStorage.setItem('cartTradeSuccess', JSON.stringify(res.data))
          this.$router.push({
            path: '/wcoin/tradeSuccess'
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
.container {
  padding-bottom: 240px;
  background-color: #f2f2f2;
  height: 100%;
  overflow: auto;
}

.fixed-footer {
  position: fixed;
  bottom: 120px;
  left: 0;
  right: 0;
  height: 120px;
  line-height: 120px;
  border-top: 2px solid #eee;
  background-color: #fff;
  z-index: 99;
}

.footer-left {
  line-height: 120px;
  padding-left: 30px;
  font-size: 0;
}

.footer-left span {
  font-size: 32px;
  color: #333333;
  vertical-align: middle;
  margin-left: 30px;
}

.footer-right {
  line-height: 120px;
  font-size: 0;
}

.footer-right label {
  font-size: 28px;
  color: #999999;
}

.footer-right .red {
  font-size: 28px;
  color: #e50026;
}

.submit-btn {
  display: inline-block;
  width: 180px;
  height: 80px;
  text-align: center;
  background-color: #e50026;
  font-size: 32px;
  color: #ffffff;
  line-height: 80px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.list li {
  height: 260px;
  padding: 50px 30px;
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
}

.radio {
  width: 30px;
  margin-right: 30px;
  display: inline-block;
  vertical-align: top;
  padding-top: 65px;
  font-size: 0;
}

.list-left {
  font-size: 0;
}

.list-main {
  display: inline-block;
  width: 600px;
  font-size: 0;
}

.list-main .imgbox img {
  width: 160px;
  height: 160px;
  object-fit: cover;
}

.list-main .imgbox {
  width: 160px;
  height: 160px;
  margin-right: 20px;
  vertical-align: top;
  display: inline-block;
}

.list-right {
  position: absolute;
  right: 30px;
  top: 30px;
}

.list-right img {
  width: 34px;
  height: 34px;
}

.info {
  width: 370px;
  display: inline-block;
}

.info p {
  height: 78px;
  margin-bottom: 33px;
  font-size: 28px;
  color: #666666;
  line-height: 39px;
}

.info .red {
  font-size: 32px;
  color: #e50026;
}

.add-minus {
  float: right;
  font-size: 0;
}

.add-minus img {
  width: 44px;
  height: 44px;
  margin-right: 4px;
  vertical-align: top;
}

.add-minus span.num {
  display: inline-block;
  width: 64px;
  height: 44px;
  text-align: center;
  background: #f2f2f2;
  font-size: 28px;
  color: #333333;
  margin-right: 4px;
  line-height: 44px;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
