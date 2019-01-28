<template>
  <div class="container">
    <common-title title="我的红酒">
      <router-link to="/wcoin/conversionRecord" slot class="slot-icon">
        <img src="../../assets/img/icon-list.png" alt="">
            </router-link>
    </common-title>
    <div class="loadmore-container">
      <mt-loadmore :bottom-method="getWcoin" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
        <ul class="list">
          <li class="between" :class="item.balanceNumber==0?'no-use':''" v-for="item in dataList">
            <!-- @click="targetPage('wineInfo',item.goodsId)" -->
            <div class="info between">
              <img :src="item.logo" alt="">
              <div class="info-main">
                <p class="name">{{item.goodsName|substr(7)}}</p>
                <div class="other">
                  <span class="red">{{item.currencyName}}</span>
                  <span class="num">X {{item.balanceNumber}}个</span>
                </div>
              </div>
            </div>
            <div class="right" v-if="item.balanceNumber!=0" @click="change(item.sysCurrencyId)">立即兑换</div>
            <div class="right" v-else>已兑换</div>
          </li>
          <!-- <li class="between no-use">
            <div class="info between">
              <img src="../../assets/img/service.png" alt="">
              <div class="info-main">
                <p class="name">阿半多干红葡萄酒阿半多干红葡萄</p>
                <div class="other">
                  <span class="red">A币</span>
                  <span class="num">X 1个</span>
                </div>
              </div>
            </div>
            <div class="right">已兑换</div>
          </li> -->
        </ul>
      </mt-loadmore>
    </div>
    <div class="goods-popup" v-if="goodsPopup">
      <div class="popup-main popup-main-max">
        <div class="between pop-title">
          <div>
            <span>选择卖家</span>
            <h6>请选择你要兑换的卖家</h6>
          </div>
          <img src="../../assets/img/alert-close.png" alt="" class="close" @click="goodsPopup=false;sellPageNum=0;goodsArr=[]">
      </div>
          <div class="loadmore-container sell-container">
            <mt-loadmore :bottom-method="getSell" ref="sellmore" :bottom-all-loaded="noMoerList" :bottom-pull-text="noMoerList?'没有更多数据':'加载更多'">
              <ul class="pop-list">
                <li @click="selectGoods(item.goodsId)" v-for="item in goodsArr">
                  <span class="name">{{item.nickName}}</span>
                  <!-- <img src="../../assets/img/icon-select.png" alt="" class='select'> -->
                </li>
              </ul>
            </mt-loadmore>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import commonTitle from '@/components/common-title'
export default {
  components: { commonTitle },
  data() {
    return {
      pageNum: 0,
      dataList: [], //兑换列表
      noMoerData: false,
      goodsPopup: false,
      goodsArr: [],
      sellPageNum: 0, //卖家的
      noMoerList: false
    }
  },
  created() {
    this.getWcoin();
  },
  methods: {
    // 获取更多
    getMore() {

    },
    targetPage(url, id) {
      this.$router.push({ path: '/wcoin/' + url, query: { id: id } })
    },
    getWcoin() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + '/my_red_wine/list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          console.log(res.data)
          if (res.data.length > 0) {
            this.dataList = this.dataList.concat(res.data);
            this.pageNum += 1; //pageNum++
            if (res.data.length < 10) {
              this.noMoerData = true; //数据为空赋值
              this.$refs.loadmore.onBottomLoaded();
            }
          } else {
            this.noMoerData = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
              duration: 1200,
              className: 'warning'
            });
            this.$refs.loadmore.onBottomLoaded();
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //弹出卖家
    change(id) {
      this.sysCurrencyId = id;
      this.getSell();
      this.goodsPopup = true
    },
    //获取卖家列表
    getSell() {
      var params = {
        sysCurrencyId: this.sysCurrencyId,
        pageNum: this.sellPageNum
      }
      this.$http.post('/apis' + '/my_red_wine/user_goods_list.htm', this.Qs.stringify(params)).then(res => {
        if (res.retCode == 0) {
          console.log(res.data)
          if (res.data.length > 0) {
            this.goodsArr = this.goodsArr.concat(res.data);
            this.sellPageNum += 1; //pageNum++
            if (res.data.length < 10) {
              this.noMoerList = true; //数据为空赋值
              this.$refs.sellmore.onBottomLoaded();
            }
          } else {
            this.noMoerList = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
              duration: 1200,
              className: 'warning'
            });
            this.$refs.sellmore.onBottomLoaded();
          }
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //跳转页面
    selectGoods(id) {

      this.$router.push({
        path: '/wcoin/wineInfo',
        query: {
          id: id
        }
      })
    }
  }
}

</script>
<style scoped>
.container {
  background-color: #f2f2f2;
  height: 100%;
}

.slot-icon img {
  width: 35.7px;
  height: 42px;
  margin-right: 40px;
  margin-top: 10px;
}

.main {
  padding: 0 30px;
  position: fixed;
  top: 176px;
  left: 0;
  right: 0;
  bottom: 0;
}

.list li {
  margin:0 auto;
  height: 188px;
  margin-bottom: 30px;
  background: url(../../assets/img/group.png) no-repeat;
  background-size: 100% 100%;
  width: 690px;

}

.list li.no-use {
  background: url(../../assets/img/group2.png) no-repeat;
  background-size: 100% 100%;
}

.list .right {
  width: 260px;
  height: 188px;
  line-height: 188px;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
}

.info-main {
  width: 286px;
}

.info {
  padding: 30px;
  padding-right: 18px;
}

.info img {
  width: 128px;
  height: 128px;
  margin-right: 20px;
}

.info .name {
  font-size: 26px;
  color: #333333;
}

.info .other {
  margin-top: 13px;
}

.other .red {
  font-size: 28px;
  color: #e50026;
  margin-right: 12px;
  display: block;
  margin-bottom: 16px;
}

.other .num {
  background: #eeeeee;
  padding: 3px 10px;
  font-size: 22px;
  color: #666666;

}

/*弹框样式*/
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

.popup-main-max {
  height: 100%;
}

.pop-title span {
  font-size: 54px;
  color: #000000;
}

.pop-title h6 {
  color: #999;
  font-size: 28px;
  margin-top: 20px;
}

.pop-title img {
  width: 70px;
  height: 70px;
  margin-right: 40px;
}

.pop-list {
  padding-left: 40px;
  margin-top: 24px;
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
.loadmore-container{
  top: 176px;
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
