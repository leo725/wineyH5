<template>
<div class="container">

  <div class="header">
    <div class="header-top between">
      <div class="user">
        <img :src="userInfo.avatarUrl" alt="">
        <span>Wcoin</span>
      </div>
      <img src="../../assets/img/jyjl.png" class="record" @click="targetPage">
    </div>
    <div class="header-bottom">
      <span>可用金额</span>
      <div class="right">
        <p>{{userWcoinInfo.balanceNumber}} Wcoin</p>
        <i>1 Wcoin ≈ 1.00 EUR</i>
      </div>
    </div>
  </div>
  <div class="nav-box between">
    <div class="left">
      <span :class="activeNav=='购买'?'active':''" @click="changeNav('购买')">购买</span>
      <span :class="activeNav=='出售'?'active':''" @click="changeNav('出售')">出售</span>
    </div>
    <div class="sort">
      <p @click="showSortList=!showSortList" :class="showSortList?'open':''">
        <span>{{sort=='surplusnumberdesc'?'数量升序':sort=='surplusnumberasc'?'数量降序':sort=='priceasc'?'价格升序':'价格降序'}}</span>
        <i :class="showSortList?'icon-top':'icon-bottom'"></i>
      </p>
      <ul v-show="showSortList">
        <li :class="sort=='priceasc'?'active':''" @click="changeSort('priceasc')">价格升序</li>
        <li :class="sort=='pricedesc'?'active':''" @click="changeSort('pricedesc')">价格降序</li>
        <li :class="sort=='surplusnumberdesc'?'active':''" @click="changeSort('surplusnumberdesc')">数量升序</li>
        <li :class="sort=='surplusnumberasc'?'active':''" @click="changeSort('surplusnumberasc')">数量降序</li>
      </ul>
    </div>
  </div>
  <div class="loadmore-container">
    <mt-loadmore :bottom-method="getData" :bottom-all-loaded="noMoerData" ref="loadmore" class="main-container">
      <ul class="list">
        <li class="between" v-for="item in list">
          <div class="list-left">
            <div class="img-box">
              <img :src="item.avatarUrl" alt="">
            </div>
            <div class="list-info">
              <p>{{item.nickName}}</p>
              <div>
                <span>成交&nbsp;{{item.sellNumber}}个</span>
                <span>剩余&nbsp;{{item.surplusNumber}}个</span>
              </div>
            </div>
          </div>
          <div class="list-right">
            <p>{{item.price}}&nbsp;EUR</p>
            <span class="btn" v-if="activeNav=='购买'" @click="buy(item)">购买</span>
            <span class="btn" v-else @click="sell(item)">出售</span>
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </div>

  <footer-tab></footer-tab>
</div>
</template>
<script>
import footerTab from '@/components/footer-tab'
export default {
  data() {
    return {
      activeNav: '购买',
      showSortList: false,
      noMoerData: false,
      pageNum: 0,
      sort: 'priceasc',
      list: [],
      userInfo: {}, // 用户信息
      userWcoinInfo: {} // 用户wcoin信息
    }
  },
  components: {
    footerTab
  },
  created() {
    this.getUserWcoinInfo();
    this.getUserInfo();
    this.getData();
  },
  methods: {
    // 查询用户wcoin信息
    getUserWcoinInfo() {
      this.$http.post('/apis' + 'user_currency/info.htm').then(res => {
        if (res.retCode == 0) {
          this.userWcoinInfo = res.data;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      this.$http.get('/apis' + 'user_info/info.htm').then(res => {
        if (res.retCode == 0) {
          this.userInfo = res.data;
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 获取数据
    getData() {
      var url = this.activeNav == '购买' ? 'user_wcoin_sell/list.htm' : 'user_wcoin_buy/list.htm';
      var params = {
        sort: this.sort,
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + url, this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          if (res.data.length > 0) {
            this.list = this.list.concat(res.data);
            this.pageNum += 1; //pageNum++
            if (res.data.length < 10) {
              this.noMoerData = true; //数据为空赋值
              this.$refs.loadmore.onBottomLoaded();
            }
          } else {
            this.$refs.loadmore.onBottomLoaded();
            this.noMoerData = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
              duration: 1200,
              className: 'warning'
            });
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    // 改变排序
    changeSort(type) {
      this.sort = type;
      this.showSortList = false;
      this.noMoerData = false;
      this.pageNum = 0;
      this.list = [];
      this.getData();
    },
    changeNav(type) {
      this.activeNav = type;
      this.pageNum = 0;
      this.list = [];
      this.noMoerData = false;
      this.showSortList = false;
      this.getData();
    },
    // 购买
    buy(item) {
      this.$router.push({
        path: '/wcoin/commonBuy',
        query: {
          id: item.id,
          price: item.price,
          surplusNumber: item.surplusNumber,
          nickName: item.nickName
        }
      })
    },
    // 出售
    sell(item) {
      this.$router.push({
        path: '/wcoin/wcoinSell',
        query: {
          type: 'common',
          id: item.id,
          price: item.price,
          surplusNumber: item.surplusNumber,
          nickName: item.nickName
        }
      })
    },
    targetPage() {
      sessionStorage.setItem("sortNav", 1); //赋值sessionStorage的sortNav值
      this.$router.push({
        path: '/wcoin/transaction'
      })
    }
  }
}
</script>
<style scoped>
.container {
  bottom: 0px;
  padding: 30px;
  padding-right: 0;
  padding-bottom: 120px;
  top: 0;
  position: fixed;
  left: 0;
  right: 0;
}

.header {
  padding-right: 30px;
}

.header .user img {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 40px;
  object-fit: cover;
}

.header-top {
  background: #333333;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
  padding: 42px;
  padding-right: 0;
}

.header .user span {
  font-size: 38px;
  color: #ffffff;
  line-height: 84px;
  vertical-align: middle;
}

.record {
  width: 166px;
  height: 60px;
  margin-top: 12px;
  position: relative;
  right: -6px;
}

.header-bottom {
  background: #cccccc;
  height: 140px;
  padding-top: 32px;
  padding-left: 60px;
}

.header-bottom span {
  font-size: 26px;
  color: #666666;
}

.header-bottom .right {
  float: right;
  width: 375px;
}

.header-bottom .right p {
  font-size: 38px;
  color: #333333;
  margin-bottom: 10px;
}

.header-bottom .right i {
  font-size: 26px;
  color: #2a2a2a;
}

.nav-box {
  margin-top: 60px;
  padding-left: 8px;
  padding-bottom: 45px;
  padding-right: 30px;
}

.nav-box .left span {
  vertical-align: bottom;
  font-size: 32px;
  color: #999999;
  position: relative;
  margin-right: 50px;
}

.nav-box .left span::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -20px;
  width: 0px;
  height: 6px;
  margin-left: 0px;
  background-color: #000;
}

.nav-box .left span.active::after {
  width: 68px;
  margin-left: -34px;
  transition: all linear 0.25s;
}

.nav-box .left span.active {
  font-size: 42px;
  color: #333333;
}

.nav-box .sort p {
  width: 158px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #eeeeee;
  color: #666666;
}

.sort span {
  font-size: 22px;
}

.nav-box .sort p.open {
  color: #e50026;
  background: rgba(229, 0, 38, 0.2);
}

.sort li {
  width: 208px;
  height: 68px;
  line-height: 68px;
  text-align: center;
  background-color: #fff;
  font-size: 28px;
  color: #999999;
}

.sort li.active {
  background: #d9d9d9;
  color: #333333;
}

.sort {
  position: relative;
}

.sort ul {
  position: absolute;
  right: 0;
  top: 58px;
  box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.12);
  z-index: 1000;
}

.list {
  padding-left: 10px;
}

.list li {
  border-bottom: 2px solid #eee;
  padding-top: 43px;
}

.list-left {
  font-size: 0;
  padding-bottom: 43px;
}

.list-left .img-box{
  display: inline-block;
   width: 88px;
  height: 88px;
  border-radius: 50%;
  vertical-align: top;
  margin-right: 40px;
}

.list-left img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.list-left .list-info {
  display: inline-block;
  vertical-align: top;
}

.list-info p {
  font-size: 32px;
  color: #333333;
  margin-bottom: 17px;
}

.list-info span {
  font-size: 24px;
  color: #999999;
  padding: 0 20px;
  border-left: 2px solid #979797;
}

.list-info span:first-child {
  padding-left: 0;
  border-left: 0;
}

.list-right {
  text-align: right;
  padding-right: 40px;
}

.list-right p {
  font-size: 30px;
  color: #e50026;
}

.list-right .btn {
  display: inline-block;
  width: 108px;
  height: 52px;
  line-height: 52px;
  text-align: center;
  margin-top: 10px;
  background: #666666;
  color: #fff;
  font-size: 28px;
}

.icon-bottom {
  display: inline-block;
  width: 0;
  height: 0;
  border: 7px solid transparent;
  border-top: 7px solid #666;
  position: relative;
  top: 3px;
}

.icon-top {
  display: inline-block;
  width: 0;
  height: 0;
  border: 7px solid transparent;
  border-bottom: 7px solid #e50026;
  position: relative;
  bottom: 4px;
}

.loadmore-container {
  top: 465px;
  padding-left: 30px;
  padding-bottom: 120px;
}
</style>
