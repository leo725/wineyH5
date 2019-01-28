<template>
  <div class="container">
    <common-title title="留言"></common-title>
    <div class="wordList loadmore-container" ref="scrollBot">
      <mt-loadmore :bottom-method="getLeaveWord" ref="loadmore" :bottom-all-loaded="noMoerData" :bottom-pull-text="noMoerData?'没有更多数据':'加载更多'">
        <ul class="list">
          <li v-for="(item,index) in leaveList">
            <div class="info" @click="targetInfo(item.nickName,item.id,item,item.userId)">
              <div class="top between">
                <div class="left">
                  <!--  <span v-if="state==1" class="noReady"></span> -->
                  <img :src="item.userAvatarUrl">
                  <b>{{item.nickName}}</b>
                </div>
                <div class="right">
                  {{item.createTime|timeNoYear}}
                </div>
              </div>
              <div class="text">
                {{item.content}}
              </div>
            </div>
            <ul class="list listTwo">
              <li @click="targetInfo(list.nickName,item.id,list,item.userId)" v-for="(list,num) in item.apiGoodsLeaveListVoList">
                <div class="">
                  <div class="top between">
                    <div class="left">
                      <img :src="list.userAvatarUrl">
                      <b>{{list.nickName}}</b>
                    </div>
                    <div class="right">
                      {{list.createTime|timeNoYear}}
                    </div>
                  </div>
                  <div class="text">
                    <span class="">回复@{{list.replyUserName}}:</span> {{list.content}}
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </mt-loadmore>
    </div>
  </div>
</template>
<script>
  import commonTitle from '@/components/common-title';
  export default {
    components: {
      commonTitle
    },
    data() {
      return {
        state: this.$route.query.state, //判断可以进行评论否，1为可以，2为不
        id: this.$route.query.id,
        pageNum: 0,
        leaveList: [],
        noMoerData: false,
        userInfo: {}
      }
    },
    created() {
      this.getLeaveWord();
      this.getUserInfo();
      window.onscroll = function () { //变量scrollTop是滚动条滚动时，距离顶部的距离   
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度     
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight; //变量scrollHeight是滚动条的总高度     
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight; //滚动条到底部的条件        

        if (scrollTop + windowHeight == scrollHeight) { //写后台加载数据的函数           console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);      
          this.getLeaveWord();
        }
      }

    },
    mounted() {
      var container = this.$refs.scrollBot;
      //container.addEventListener('scroll', this.handleScroll)
    },
    methods: {
      //跳转留言回复页面
      targetInfo(name, id, item, firstUserId) {
        if (this.state != 2) {
          if (item.userId != this.userInfo.id)
            this.$router.push({
              path: '/wcoin/reply',
              query: {
                id: id,
                type: 2,
                name: name
              }
            }) //type1为留言，2为回复
        } else {
          if (firstUserId == this.userInfo.id && item.userId != this.userInfo.id)
            this.$router.push({
              path: '/wcoin/reply',
              query: {
                id: id,
                type: 2,
                name: name
              }
            }) //type1为留言，2为回复
        }
      },
      //滚动到底部
      handleScroll() {
        this.getLeaveWord();
      },
      getUserInfo() {
        if (!this.globalData.userInfo) {
          this.$http.get('/apis' + 'user_info/info.htm').then(res => {
            if (res.retCode == 0) {
              this.userInfo = res.data;
              this.globalData.userInfo = this.userInfo;
            } else if (res.retCode == '10002') {
              this.$router.push('/wcoin/login');
            }
          })
        } else {
          this.userInfo = this.globalData.userInfo
        }
      },
      //获取留言列表
      getLeaveWord() {
        if (!this.noMoerData) {
          var params = {
            goodsId: this.id,
            pageNum: this.pageNum
          }
          this.$http.post('/apis' + 'goods_leave/goods_list.htm', this.Qs.stringify(params)).then(res => {
            if (res.retCode == 0) {
              if (res.data.length > 0) {
                this.leaveList = this.leaveList.concat(res.data);
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
    },

  }

</script>
<style scoped>
  .wordList {
    padding-left: 40px;
  }

  .list {}

  .list li {
    padding-top: 30px;
  }

  .list img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .list .top {
    margin-bottom: 3px;
  }

  .list .top .left b {
    font-size: 28px;
    color: #999999;
    position: relative;
    top: -14px;
  }

  .list .top .left {
    position: relative;
  }

  .list .top .right {
    font-size: 28px;
    color: #CCCCCC;
    margin-top: 5px;
  }

  .list .text {
    font-size: 28px;
    color: #333333;
    line-height: 40px;
    padding-bottom: 30px;
  }

  .listTwo {
    padding-left: 91px;
  }

  .info {
    padding-right: 40px;
  }

  .list .text span {
    font-size: 28px;
    color: #333333;
  }

  .list li {
    border-bottom: 1px solid #eee;
  }

  .listTwo li {
    border: none;
    padding-right: 40px;
  }

  .listTwo li:first-child {
    border-top: 1px solid #eee;
  }

  .noReady {
    position: absolute;
    left: 38px;
    top: 2px;
    width: 15px;
    height: 15px;
    background: #E50026;
    border-radius: 50%;
  }

  .loadmore-container {
    top: 150px;
  }

</style>
