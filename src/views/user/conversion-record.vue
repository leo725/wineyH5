<template>
  <div class="container">
    <common-title title="兑换记录"></common-title>  
    <div class="loadmore-container">
      <mt-loadmore :bottom-method="getWcoin" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'" class="main">
        <ul>
          <li class="list" v-for="item in dataList">
            <router-link :to="{path: '/wcoin/orderInfo', query:{id: item.goodsWineryOrderId}}">
              <div class="top between">
                <span class="time">{{item.createTime|dateAndTime}}</span>
                <span class="type red" v-if="item.state=='paid'||item.state=='confirm' || item.state=='isPaid'">待发货</span>
                <span class="type red" v-if="item.state=='send'">待收货</span>
                <span class="type red" v-if="item.state=='finish'">已收货</span>
                <!-- 待发货,待收货,已收货 -->
              </div>
              <div class="middle between">
                <div class="list-main">
                  <img :src="item.logo" alt="">
                  <div class="title-box">
                    <p>{{item.goodsName|substr(15)}}</p>
                    <!-- <span>500ml</span> -->
                  </div>
                </div>
                <div class="list-info">
                  <span class="price">{{item.price}}</span>
                  <p class="dw">{{item.payMode=='platform'?'Wcoin':'EUR'}}</p>
                  <span class="num">X {{item.goodsNumber}}个</span>
                </div>
              </div>
              <div class="bottom between">
                <span>合计:</span>
                <div class="total">
                  <span class="price">{{item.totle}}</span>
                  <p class="dw">{{item.payMode=='platform'?'Wcoin':'EUR'}}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </mt-loadmore>
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
    }
  },
  created() {
    this.getWcoin();
  },
  methods: {
    // 加载更多
    getMore() {

    },
    getWcoin() {
      var params = {
        pageNum: this.pageNum
      }
      this.$http.post('/apis' + '/goods_winery_order/list.htm', this.Qs.stringify(params)).then(res => {
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
  }
}

</script>
<style scoped>
.container {
  background-color: #f2f2f2;
  height: 100%;
}

.main {
  padding: 0 30px;
  position: fixed;
  top: 196px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  
}

.list {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 30px;
}
.top{
  padding: 0 10px;
}
.list .top span {
  font-size: 28px;
  color: #666666;
}

.list .top span.red {
  color: #e50026;
}

.middle {
  margin-top: 30px;
  padding: 10px;
  padding-top: 0;
  width: 650px;
  border-bottom: 2px solid #eee;
}

.list-info {
  width: 120px;
  text-align: right;
}

.dw {
  color: #333333;
  font-size: 24px;
  line-height: 39px;
  text-align: right;
}

.price {
  color: #333333;
  font-size: 30px;
  line-height: 39px;
  text-align: right;
}

.list-info .num {
  font-size: 22px;
  color: #666666;
  padding: 2px 12px;
  background: #eeeeee;
  margin-top: 34px;
  display: inline-block;
}

.list-main {
  overflow: hidden;
}

.list-main img {
  width: 150px;
  height: 150px;
  margin-right: 20px;
  font-size: 0;
  float: left;
}

.list-main>div {
  float: left;
}

.list-main>div p {
  width: 320px;
  font-size: 30px;
  color: #333333;
  height: 82px;
  margin-bottom: 28px;

}

.list-main>div span {
  font-size: 26px;
  color: #999999;
}

.bottom {
  padding: 0 10px;
  padding-top: 20px;
  
}

.bottom>span {
  font-size: 30px;
  color: #333333;
}

</style>
