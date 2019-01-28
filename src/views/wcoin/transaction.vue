<template>
<div class="container">
  <div class="headTop">
    <common-title title="交易记录"></common-title>
    <div class="nav-boxs">
      <scroll-nav v-if="showTab" :data-list="swiperInfo" :interval="31" @changeScrollNav="sortNav" :active-id="sortTab"></scroll-nav>
    </div>
  </div>
  <div class="list-box loadmore-container">
    <mt-loadmore :bottom-method="getListData" :bottom-all-loaded="noMoerData" ref="loadmore">
      <div class="list" v-if='sortTab==0' v-for="item in listData">
        <router-link :to="{path: '/wcoin/buyInfo', query:{type: 0}}">
          <div class="top between">
            <div class="top-l">
              <span>购买</span>
            </div>
            <div class="top-r">
              <span>+100个</span>
            </div>
          </div>
          <div class="center">备注:单价 {{item.price}}EUR
          </div>
          <div class="bottom">{{item.createTime|dateAndTime('/')}}</div>
        </router-link>
      </div>
      <div class="list" v-if='sortTab==1' v-for="item in listData" @click="gotoDetail(item,'/wcoin/buyInfo',{type: 1})">
        <div class="top between">
          <div class="top-l">
            <span>{{item.currencyNumber}}个</span>
          </div>
          <div class="top-r">
            <span class="buy-s" :class="item.auditState=='notreal'||item.auditState=='wait'?'buy-r':item.auditState=='refuse'||item.auditState=='cancel' || item.auditState=='timeout'?'buy-h':''">{{item.auditState=='notreal'?"待付款":item.auditState=='wait'?'待确认':item.auditState=='agree'?'购买成功':'已取消'}}</span>
          </div>
        </div>
        <div class="center">备注:单价 {{item.price}}EUR</div>
        <div class="bottom">{{item.createTime|dateAndTime('/')}}</div>
      </div>
      <div class="list" v-if='sortTab==2' v-for="item in listData" @click="gotoDetail(item,'/wcoin/sellInfo',{type: 2,state:1})">
        <div class="top between">
          <div class="top-l">
            <span>{{item.currencyNumber}}个</span>
          </div>
          <div class="top-r">
            <span class="buy-s" :class="item.auditState=='notreal'||item.auditState=='wait'?'buy-r':item.auditState=='refuse' || item.auditState=='cancel' || item.auditState=='timeout'?'buy-h':''">{{item.auditState=='notreal'?"待买家付款":item.auditState=='wait'?'待确认':item.auditState=='agree'?'出售成功':'已取消'}}</span>
          </div>
        </div>
        <div class="center">备注:单价 {{item.price}}EUR</div>
        <div class="bottom">{{item.createTime|dateAndTime('/')}}</div>
      </div>
      <div class="list" v-if='sortTab==3' v-for="item in listData" @click="gotoDetail(item,'/wcoin/dealInfo',{type: 3})">
        <div class="top between">
          <div class="top-l">
            <span>{{item.wineryPrice}}个</span>
          </div>
          <div class="top-r">
            <span class="buy-s">{{item.orderState=='success'?'交易成功':'交易失败'}}</span>
          </div>
        </div>
        <div class="center">备注：购买{{item.wineryPrice}}个{{item.currencyName}}</div>
        <div class="bottom">{{item.createTime|dateAndTime('/')}}</div>
      </div>
      <div class="list" v-if='sortTab==4' v-for="item in listData" @click="gotoDetail(item,'/wcoin/transferDetail', {type: item.type,id:item.id})">
        <div class="top between">
          <div class="top-l top-img">
            <img :src="item.avatarUrl"><b>{{item.remarks}}</b>
          </div>
          <div class="top-r">
            <b :class="item.type=='-'?'buy-b':''">{{item.currencyNumber}}wcoin</b>
          </div>
        </div>
        <div class="bottom">{{item.createTime|dateAndTime('/')}}</div>
      </div>
    </mt-loadmore>
  </div>
</div>
</template>
<script>
import commonTitle from '@/components/common-title'
import scrollNav from '@/components/scrollNav'
export default {
  data() {
    return {
      showTab: true,
      sortTab: 1,
      swiperInfo: [ // {"classifyName": "全部流水","typeId": 0},
        {
          "classifyName": "购买",
          "typeId": 1
        },
        {
          "classifyName": "出售",
          "typeId": 2
        },
        {
          "classifyName": "红酒币交易",
          "typeId": 3
        },
        {
          "classifyName": "转账",
          "typeId": 4
        }
      ],
      listData: [],
      pageNum: 0,
      noMoerData: false
    }
  },
  components: {
    commonTitle,
    scrollNav
  },
  created() {
    var storNav = sessionStorage.getItem("sortNav"); //获取sessionStorage的sortNav值
    this.sortTab = !storNav ? '' : storNav;
    this.getListData();
  },
  methods: {
    //切换导航
    sortNav(e) {
      if (this.sortTab == e.typeId) {
        return false;
      } else {
        this.sortTab = e.typeId;
        this.pageNum = 0;
        sessionStorage.setItem("sortNav", e.typeId); //赋值sessionStorage的sortNav值
        this.listData = [];
        this.pageNum = 0;
        this.noMoerData = false;
        this.getListData();
      }
    },
    // 获取列表数据
    getListData() {
      var url = this.sortTab == 1 ? 'user_wcoin_order/list.htm' : this.sortTab == 2 ? 'user_wcoin_order/issue_list.htm' : this.sortTab == 3 ? "goods_currency_order/list.htm" : this.sortTab == 4 ? 'user_transfer/list.htm' : '';
      var params = {
        pageNum: this.pageNum
      }
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
            this.$refs.loadmore.onBottomLoaded();
            this.noMoerData = true; //数据为空赋值
            this.$toast({
              message: '没有更多数据',
              duration: 1200,
              className: 'warning'
            });
          }
        } else if (res.retCode == '10002') {
          this.$router.push('/wcoin/login');
        }
      })
    },
    // 跳转详情
    gotoDetail(item, url, query) {
      sessionStorage.setItem('transactionDetail', JSON.stringify(item));
      this.$router.push({
        path: url,
        query: query
      })
    }
  }
}
</script>
<style scoped>
.headTop {
  position: fixed;
  background-color: #fff;
  width: 100%;
  left: 0;
  top: 0;
}

.container {
  background-color: #F3F2F0;
  min-height: 100%;
  overflow: auto;
  
}

.nav-boxs {
  padding: 0 40px;
  height: 64px;
  overflow: hidden;
}

.list-box {
  top: 273px;
}

.list {
  width: 690px;
  min-height: 210px;
  background-color: #fff;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
  margin: 0 auto;
  padding-left: 30px;
  margin-bottom: 33px;
}

.list a {
  display: block;
}

.top {
  padding-top: 30px;
  padding-right: 30px;
}

.top span {
  font-size: 36px;
  color: #333333;
}

.top-img {
  margin-bottom: 32px;
}

.top-l b {
  font-size: 32px;
  color: #333;
  vertical-align: middle;
  margin-left: 15px;
}

.top-l img {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  vertical-align: middle;
}

.top-r {}

.top-r b {
  font-size: 36px;
  color: #FF4848;
  margin-top: 20px;
  display: block;
}

.top-r .buy-s {
  color: #1FDD7D;
  font-size: 32px;
}

.top-r .buy-r {
  color: #FF4848;
  font-size: 32px;
}

.top-r .buy-b {
  color: #333;
  font-size: 36px;
}

.top-r .buy-h {
  font-size: 32px;
  color: #999999;
}

.center {
  font-size: 28px;
  color: #999999;
  margin-top: 12px;
  padding-bottom: 24px;
}

.bottom {
  border-top: 1px solid #eee;
  font-size: 28px;
  color: #CCCCCC;
  padding-top: 14px;
}

.nav-boxs>>>.nav-box li {
  font-size: 28px;
  color: #ccc;
}
</style>
