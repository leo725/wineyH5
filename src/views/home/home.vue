<template>
<div class="container" ref="container">

  <div class="loadmore-container" ref="loadmoreContainer">
    <div class="headTop" ref="headTop">
      <div class="search-box" ref='searchBox'>
        <div class="search" @click="targetSearch">
          <img src="../../assets/img/icon-search.png">
          <span>请输入商品名称</span>
        </div>
      </div>
      <div class="swiperBox">
        <div class="swiper-container" ref="swiper">
          <mt-swipe :auto="2000" :speed="300">
            <mt-swipe-item v-for="(item,index) in bannerList">
              <a :href="item.linkValue">
                <img :src="item.pic">
              </a>
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div class="navBox" ref="scrollNav" :style="scrollNavStyle">
        <scroll-nav v-if="showTab" :data-list="swiperInfo" :interval="25" @changeScrollNav="sortNav" :active-id="sortTab"></scroll-nav>
      </div>
    </div>
    <mt-loadmore :bottom-method="getList" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
      <wcoin-list :dataList="wcoinList"></wcoin-list>
    </mt-loadmore>
  </div>
  <footer-tab></footer-tab>
</div>
</template>
<script>
import footerTab from '@/components/footer-tab'
import scrollNav from '@/components/scrollNav'
import wcoinList from '@/components/wcoin-list'
export default {
  components: {
    footerTab,
    scrollNav,
    wcoinList
  },
  data() {
    return {
      scrollNavStyle: {
        position: 'static'
      },
      showTab: false,
      swiperInfo: [],
      wcoinList: [],
      bannerList: [],
      pageNum: 0,
      sortTab: '',
      scrollHeight: 0,
      noMoerData: false
    }
  },
  mounted() {
    var loadmoreContainer = this.$refs.loadmoreContainer;
    loadmoreContainer.addEventListener('scroll', this.handleScroll)
  },
  created() {
    this.getBanner();
    this.getNav();
  },
  methods: {
    //跳转到搜索页面
    targetSearch() {
      if (this.sortTab) {
        this.$router.push({
          path: '/wcoin/homeSearch',
          query: {
            type: this.sortTab
          }
        })
      }

    },
    //切换导航
    sortNav(e) {
      if (this.sortTab == e.id) {
        return false;
      } else {
        this.sortTab = e.id;
        this.pageNum = 0;
        this.noMoerData = false;
        this.wcoinList = []
        this.getList();
        sessionStorage.setItem("homeNav", e.id); //赋值sessionStorage的sortNav值
      }
    },
    handleScroll(event) {
      var sTop = parseInt(event.target.scrollTop)
      var swiper = this.$refs.swiper.clientHeight;
      var searchBox = this.$refs.searchBox.clientHeight - 1;
      if (sTop > swiper) {
        this.scrollNavStyle = {
          position: 'fixed',
          top: searchBox + 'px',
          left: 0,
          right: 0
        }
      } else {
        this.scrollNavStyle = {
          position: 'static'
        }
      }
    },
    //获取banner轮播图
    getBanner() {
      this.$http.post('/apis' + 'sys_banner/list.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          this.bannerList = res.data;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //获取红酒分类
    getNav() {
      this.$http.post('/apis' + 'goods_classify/list.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          var storNav = sessionStorage.getItem("homeNav"); //获取sessionStorage的sortNav值
          if (res.data && res.data.length > 0) {
           this.sortTab = storNav ? storNav : res.data[0].id; // res.data[0].id;
            this.getList();
          }
          this.swiperInfo = res.data;
          this.showTab = true;
        } else if (res.retCode == "10002") {
          this.$router.replace({
            path: '/wcoin/login'
          })
        }
      })
    },
    //获取列表-
    getList() {
      if (!this.noMoerData) {
        var params = {
          pageNum: this.pageNum,
          name: '',
          goodsClassifyId: this.sortTab
        }
        this.$http.post('/apis' + 'home_goods/list.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            if (res.data.length > 0) {
              this.wcoinList = this.wcoinList.concat(res.data);
              this.pageNum += 1; //pageNum++
              if (res.data.length < 10) {
                this.noMoerData = true; //数据为空赋值
              }
              this.$refs.loadmore.onBottomLoaded();
              return false;
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
      } else {
        this.$toast({
          message: '没有更多数据',
          duration: 1200,
          className: 'warning'
        });
      }

    }
  }
}
</script>
<style scoped>
.container {
  height: 100%;
  overflow: auto;
}

.headTop {
  background-color: #f3f2f0;
}

.search-box {
  padding: 30px 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 5;
  background-color: #f3f2f0;
}

.search-box a {
  width: 100%;
}

.search {
  width: 690px;
  height: 88px;
  line-height: 88px;
  background-color: #e5e5e5;
  border-radius: 2px;
  margin: 0 auto;
}

.search img {
  width: 38px;
  float: left;
  position: relative;
  top: 24px;
  margin-right: 35px;
  margin-left: 24px;
}

.search span {
  font-size: 28px;
  color: #cccccc;
  float: left;
  height: 88px;
  line-height: 90px;
}

.swiperBox {
  padding-top: 148px;
  padding-bottom: 28px;
}

.swiper-container {
  width: 690px;
  margin: 0 auto;
  height: 239px;
}

.mint-swipe-item {}

.swiper-container img {
  width: 690px;
  height: 239px;
}

.navBox {
  padding: 0 30px;
}

.navBox {
  background-color: #f3f2f0;
  z-index: 6;
}

>>>.mint-swipe-indicators .mint-swipe-indicator.is-active {
  background-color: #999999;
  width: 23px;
  border-radius: 17px;
  opacity: 1;
}

>>>.mint-swipe-indicators .mint-swipe-indicator {
  background-color: #d8d8d8;
  opacity: 1;
  height: 10px;
}

.loadmore-container {
  top: 0px;
  bottom: 120px;
}
</style>
