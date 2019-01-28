<template>
  <div class="container">
    <common-title title="我卖出的"></common-title>
    <div class="roder-type">
      <span :class="activeType=='红酒'?'active':''" @click="changeNav('红酒')">红酒</span>
      <span :class="activeType=='红酒币'?'active':''" @click="changeNav('红酒币')">红酒币</span>
    </div>
    <div class="loadmore-container main">
      <mt-loadmore :bottom-method="getData" :bottom-all-loaded="noMoerData" ref="loadmore">
        <ul>
          <li class="list" @click.stop="targetPage(item)" v-for="item in listData">
            <header class="between">
              <p>交易类型：{{activeType=='红酒'?'兑换红酒':'出售红酒币'}}</p>
              <p v-if="activeType=='红酒'" class="type red">{{item.state=='unpaid'?'待付款':item.state=='paid'?'待发货':item.state=='isPaid'?'等待后台确认':item.state=='confirm'?'待发货':item.state=='send'?'已发货':'已完成'}}</p>
              <p v-if="activeType=='红酒币'" class="type red">{{item.orderState=='success'?'交易成功':'交易失败'}}</p>
              <!--已发货  已完成  交易成功  买家已付款-->
            </header>
            <main>
              <img :src="item.logo" alt="">
              <div class="list-main between">
                <div class="left">
                  <p>{{item.goodsName}}</p>
                  <span v-if="activeType=='红酒'">兑换数量{{item.goodsNumber}}</span>
                  <span v-if="activeType=='红酒币'">兑换数量{{item.wineryPrice}}</span>
                </div>
                <span class="right">{{item.currencyName}}</span>
              </div>
            </main>
            <footer class="between">
              <span class="time">{{item.createTime|dateAndTime}}</span>
              <div class="btn-box">
                <span class="btn btn-red" v-if="item.state=='paid'" @click.stop="gotoNext('/wcoin/shipments',item)">去发货</span>
                <span class="btn btn-red" v-if="item.state=='isPaid'" @click.stop="cancelMail(item)">取消寄件</span>
                <span class="btn btn-red" v-if="item.state=='confirm'" @click.stop="gotoNext('/wcoin/mailInfo',item)">填写寄件信息</span>
                <span class="btn btn-default" v-if="item.state!='isPaid'&&item.state!='paid'&&item.state!='confirm'"
                  @click.stop="targetPage(item)">查看订单</span>
                <!-- <span class="btn btn-default">已发货</span> -->
                <!-- <router-link to="/wcoin/mailInfo" class="btn btn-red">填写寄件信息</router-link>
              <router-link to="/wcoin/shipments" class="btn btn-red" v-if="item.state=='paid'">去发货</router-link>
              <router-link to="" class="btn btn-default" v-if="item.state!='isPaid'&&item.state!='paid'">查看订单</router-link> -->
                <!-- <router-link to="/wcoin/mailDetail" class="btn btn-default">已发货</router-link> -->
              </div>
            </footer>
          </li>
        </ul>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  import commonTitle from '@/components/common-title'
  export default {
    data() {
      return {
        activeType: '红酒',
        noMoerData: false,
        pageNum: 0,
        listData: []
      }
    },
    components: {
      commonTitle
    },
    created() {
      var mySellNav = sessionStorage.getItem('mySellNav');
      if (mySellNav) {
        this.activeType = mySellNav;
      }
      this.getData()
    },
    beforeDestroy() {
        // 页面销毁之前关闭弹窗
        this.$messagebox.close();
    },
    methods: {
      // 获取列表数据
      getData() {
        var params = {
          pageNum: this.pageNum
        }
        var url = this.activeType == '红酒' ? 'sell_order/list.htm' : 'goods_currency_order/sell_list.htm';
        this.$http.post('/apis' + url, this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            if (res.data.length > 0) {
              this.listData = this.listData.concat(res.data);
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
      // 改变导航
      changeNav(type) {
        if (this.activeType == type) {
          return false;
        }
        this.activeType = type;
        this.pageNum = 0;
        this.listData = [];
        this.noMoerData = false;
        this.getData();
        sessionStorage.setItem('mySellNav', this.activeType)
      },
      //跳转
      targetPage(item) {
        if (this.activeType == '红酒') {
          this.$router.push({
            path: '/wcoin/sellOrderInfo',
            query: {
              id: item.goodsWineryOrderId
            }
          })
        } else { // 红酒币详情
          sessionStorage.setItem('transactionDetail', JSON.stringify(item))
          this.$router.push({
            path: '/wcoin/sellInfo',
            query: {
              id: item.id,
              state: 2 //state为2为我卖出的
            }
          })
        }
      },
      // 去发货 / 填写寄件信息
      gotoNext(url, item) {
        sessionStorage.removeItem('shipmentsParams');
        this.$router.push({
          path: url,
          query: {
            id: item.goodsWineryOrderId
          }
        })
      },
      // 取消寄件
      cancelMail(item) {
        this.$messagebox.confirm('', {
          title: '提示',
          message: '是否取消寄件?',
        }).then(action => {
          if (action == 'confirm') { //确认的回调
            var params = {
              goodsWineryOrderId: item.goodsWineryOrderId
            }
            this.$http.post('/apis' + 'sell_order/cancel_mail.htm', this.Qs.stringify(params)).then(res => {
              if (res.retCode == 0) {
                this.$toast({
                  message: '操作成功',
                  duration: 1200,
                  className: 'success'
                });
                this.pageNum=0;
                this.listData = [];
                this.noMoerData = false;
                this.getData();
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
  .main {
    position: fixed;
    top: 280px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .mint-loadmore {
    height: auto;
  }

  .main ul {
    padding: 10px 30px;
    height: 100%;
  }

  .list {
    height: 346px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
    margin-bottom: 30px;
    padding: 24px 0px 0 30px;
  }

  .list header p {
    font-size: 28px;
    color: #666666;
  }

  .list .red {
    color: #e50026;
    padding-right: 30px;
  }

  .list main {
    margin-top: 24px;
    margin-bottom: 17px;
    font-size: 0;
    position: relative;
  }

  .list main img {
    width: 166px;
    height: 166px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .list-main {
    height: 166px;
    background: #fafafa;
    padding-top: 24px;
    height: 100%;
    padding-left: 196px;
    height: 166px;
    padding-right: 30px;
  }

  .left {
    width: 300px;
  }

  .left p,
  .right {
    font-size: 28px;
    color: #666666;
    line-height: 38px;
    margin-bottom: 20px;
    height: 76px;
  }

  .left span {
    font-size: 22px;
    color: #999999;
  }

  footer {
    padding-right: 20px;
  }

  footer .time {
    line-height: 58px;
    font-size: 26px;
    color: #cccccc;
  }

  .btn-box {
    font-size: 0;
  }

  footer .btn {
    height: 58px;
    line-height: 58px;
    display: inline-block;
    font-size: 28px;
    overflow: hidden;
    margin-left: 10px;
  }

  .btn-default {
    padding: 0 18px;
    border: 2px solid #666;
    color: #666666;
  }

  .btn-red {
    padding: 0 22px;
    background: #e50026;
    color: #fff;
  }

  .roder-type {
    padding-left: 40px;
    font-size: 0;
  }

  .roder-type span {
    line-height: 59px;
    font-size: 32px;
    margin-right: 50px;
    color: #999999;
    position: relative;
    vertical-align: middle;
  }

  .roder-type span::after {
    position: absolute;
    content: "";
    width: 0px;
    height: 6px;
    left: 50%;
    bottom: -16px;
    background-color: #000;
    margin-left: 0px;
  }

  .roder-type .active {
    position: relative;
    font-size: 42px;
    color: #333;
  }

  .roder-type .active::after {
    position: absolute;
    content: "";
    width: 68px;
    height: 6px;
    left: 50%;
    bottom: -16px;
    background-color: #000;
    margin-left: -34px;
    transition: all linear 0.25s;
  }

  .font-black {
    line-height: 58px;
    font-size: 28px;
    color: #666;
  }

</style>
