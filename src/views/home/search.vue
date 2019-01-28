<template>
  <div class="container">
    <div class="headTop" ref="headTop">
      <div class="search-box">
        <div class="search between">
          <div>
            <img src="../../assets/img/icon-search.png" @click="onInput" >
          <input type="text" @keypress="searchGoods"   @click="clickInput" v-model="goodsName" name="goodsName" ref="input" placeholder="请输入商品名称">
          </div>
          <span class="cancel" @click="cancel">取消</span>
        </div>
      </div>
      <div class="content">
        <div class="hot-search" v-if="showHot">
          <div v-if="hotList.length>0">
            <h3 class="between">
              <span>历史搜索</span>
              <img src="../../assets/img/del-s.png" @click="delHot">
            </h3>
            <ul class="clearfix">
              <li v-for="item in hotList" @click="hotTap(item.content)">{{item.content}}</li>
            </ul>
          </div>
          <div class="other-search">
            <h3 class="between">
              <span>热门搜索</span>
              
            </h3>
            <ul class="clearfix">
              <li v-for="item in otherList" @click="hotTap(item.content)">{{item.content}}</li>
            </ul>
          </div>
        </div>
        <div v-else class="listBox">
          <div class="loadmore-container" v-if="wcoinList.length>0">
            <mt-loadmore :bottom-method="getList" ref="loadmore" :bottom-all-loaded="noMoerData">
              <wcoin-list :dataList="wcoinList"></wcoin-list>
            </mt-loadmore>
          </div>
          <div v-else>
            <p class="noMoer">未能找到您搜索的商品</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wcoinList from '@/components/wcoin-list'
export default {
  components: { wcoinList },
  data() {
    return {
      sortTab: this.$route.query.type,
      showHot: true, //判断是否显示热门搜索
      pageNum: 0,
      noMoerData: false,
      goodsName: '',
      wcoinList: [],
      hotList: [], //热门list
      otherList:[]
    }
  },
  mounted() {

  },
  created() {
    this.getHot();
    this.getOther();
  },
  beforeDestroy() {
    // 页面销毁之前关闭弹窗
    this.$messagebox.close();
  },
  //
  methods: {
    //点击热门搜索
    hotTap(name) {
      this.goodsName = name;
      this.pageNum = 0;
      this.wcoinList = [];
      this.noMoerData = false;
      this.getList();
    },
    //点击进入input
    clickInput() {
      if (!this.showHot) {
        this.getHot();
      }
    },
    //清空热门搜素
    delHot() {
      this.$messagebox.confirm('', {
        title: '确认清空？',
        message: '是否确认清空历史搜索？',
      }).then(action => {
        if (action == 'confirm') { //确认的回调
          this.$http.post('/apis' + 'user_search_record/delete.htm', this.Qs.stringify({})).then(res => {
            if (res.retCode == 0) {
              this.hotList = [];
              this.showHot=true
            } else if (res.retCode == "10002") {
              this.$router.replace({ path: '/wcoin/login' })
            }
          })
        }
      }).catch(err => {
        if (err == 'cancel') { //取消的回调
        }
      });

    },
    //点击搜索键
    searchGoods(event) {
      if (event.keyCode == 13) { //如果按的是enter键 13是enter   
        event.preventDefault(); //禁止默认事件（默认是换行）     
        this.pageNum = 0;
        this.wcoinList = [];
        this.noMoerData = false;
        this.$refs.input.blur();
        this.getList();
      }

    },
    //onInput
    onInput(){
      this.pageNum = 0;
      this.wcoinList = [];
      this.noMoerData = false;
      this.$refs.input.blur();
      this.getList();
    },
    //获取历史搜索
    getHot() {
      this.showHot = true;
      this.goodsName = '';
      this.$http.post('/apis' + 'user_search_record/list.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          this.hotList = res.data;
        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    //获取列表-
    getList() {
      if (!this.noMoerData) {
        var params = {
          pageNum: this.pageNum,
          name: this.goodsName
        }
        this.$http.post('/apis' + 'home_goods/list.htm', this.Qs.stringify(params)).then(res => {
          if (res.retCode == 0) {
            this.showHot = false;
            if (res.data.length > 0) {
              this.wcoinList = this.wcoinList.concat(res.data);
              this.pageNum += 1; //pageNum++
              if (res.data.length < 10) {
                this.noMoerData = true; //数据为空赋值
                setTimeout(() => {
                  this.$refs.loadmore.onBottomLoaded();
                }, 20)
              }
            } else {
              this.noMoerData = true; //数据为空赋值
              this.$toast({
                message: '没有更多数据',
                duration: 1200,
                className: 'warning'
              });
              setTimeout(() => {
                this.$refs.loadmore.onBottomLoaded();
              }, 20)
            }

          } else if (res.retCode == "10002") {
            this.$router.replace({ path: '/wcoin/login' })
          }
        })
      } else {
        this.$toast({
          message: '没有更多数据',
          duration: 1200,
          className: 'warning'
        });
      }

    },
    //获取热门搜索列表
    getOther() {
      this.showHot = true;
      this.goodsName = '';
      this.$http.post('/apis' + '/user_search_record/is_list.htm', this.Qs.stringify({})).then(res => {
        if (res.retCode == 0) {
          this.otherList = res.data;
        } else if (res.retCode == "10002") {
          this.$router.replace({ path: '/wcoin/login' })
        }
      })
    },
    cancel(){
      this.$router.back(-1);
    }
  }

}

</script>
<style scoped>
.container {
  background-color: #fff;
  min-height: 100%;
  overflow: auto;
  
}

.content {
  padding-top: 168px;
}

.search-box {
  padding: 30px 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

.search {
  width: 690px;
  height: 88px;
  line-height: 88px;
  background-color: #E5E5E5;
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

.search input {
  font-size: 28px;
  color: #333;
  float: left;
  background-color: transparent;
  width: 480px;
  height: 88px;

}
.search .cancel{
  background-color: #fff;
  font-size: 28px;
  line-height: 88px;
  padding-left: 20px;
  color: #666;
}

input::-webkit-input-placeholder {
  color: #c1c1c1;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c1c1c1;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c1c1c1;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #c1c1c1;
}

.hot-search {
  padding: 0 30px;
}

.hot-search h3 span {
  font-size: 42px;
  color: #333333;
}

.hot-search h3 img {
  height: 34px;
  position: relative;
  top: 10px;
}

.hot-search ul {
  margin-top: 35px;
}

.hot-search li {
  padding: 0 24px;
  height: 60px;
  line-height: 60px;
  font-size: 26px;
  color: #666666;
  float: left;
  background: #E5E5E5;
  margin-right: 20px;
  margin-bottom: 20px;
}
.other-search{
  margin-top: 30px;
}
.loadmore-container {
  top: 120px;
}
.noMoer{
  font-size: 30px;
  color: #666;
  text-align: center;
  margin-top: 30px;
}
</style>
