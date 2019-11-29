<template>
  <div class="container spots-form">
    <div class="spots-seanch">
      <form action="JavaScript:return true;" @submit.prevent class="mui-input-row mui-search" >
        <input @blur="iptBlur"  @focus="iptFocus" id="spots-s" type="search" v-model="q" @keyup.enter="goClass" maxlength="20">
      </form>
      <span class="spots-seanch-ss">
        <i class="iconfont">&#xe6ac;</i>
      </span>
      <span class="spots-seanch-clear" v-show="q && isIOS" @click="q = ''">
        <i class="iconfont">&#xe6e1;</i>
      </span>
      <span class="spots-seanch-close" @click="goBack">取消</span>
    </div>

    <!-- 搜索结果开始 -->
    <div class="container">
      <div class="s-list">
        <div class="s-list-name">热门标签</div>
        <ul class="clearfix">
          <li class="s-item" v-for="(item, index) in listTag" :key="index" @click="goClass2(item)">{{item}}</li>
        </ul>
        <div v-show="listTag.length == 0" class="noData">暂无数据！</div>
      </div>
      <div class="s-line">
        <div class="s-line-in"></div>
      </div>
      <div class="s-list">
        <div class="s-list-name">搜索历史
          <div class="s-clear" @click="delSearchHistory">
            <i class="iconfont">&#xe7b2;</i>
          </div>
        </div>
        <ul class="clearfix">
          <li class="s-item" v-for="(item, index) in listSearchHistory" :key="index" v-show="item" @click="goClass2(item)">{{item}}</li>
        </ul>
        <div v-show="listSearchHistory.length == 0" class="noData">暂无数据！</div>
      </div>

    </div>
    <!-- 搜索结果结束 -->
  </div>
</template>

<script>
export default {
  name: 'SearchScreen',
  components: {
    
  },
  data () {
    return {
      isIOS: false,
      q: '', // 搜索内容
      list: [],
      // 渠道ID
      channel: this.$init.channelId,
      noData: false, // 无数据

      listTag: [], // 标签
      listSearchHistory: [], // 历史
      listSearchHistoryIds: [], // 历史ID
    }
  },
  created () {
    this.getListSearchHistory()
    this.isIOS = this.$base.isIOS()
  },
  methods: {
    // 查看商品筛选
    goClass2 (q) {
      this.$router.push('/product/shList?q='+q)
    },
    // 清除历史
    delSearchHistory () {
      let vm = this;
      this.$http.post('/panda-shop-api/v2/delSearchHistory', this.listSearchHistoryIds).then(function (response) {
        if(response.data.code == '1000'){
          vm.getListSearchHistory();
          vm.$toast(response.data.msg)
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 获取搜索历史
    getListSearchHistory () {
      let vm = this;
      vm.listTag = []; // 标签
      vm.listSearchHistory = []; // 历史
      vm.listSearchHistoryIds = []; // 历史ID
      this.$http.get('/panda-shop-api/v2/listSearchHistory').then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            response.data.result.forEach((e, i) => {
              if(e.tagCategory == 1){
                vm.listTag.push(e.name)
              }else{
                vm.listSearchHistory.push(e.name)
                vm.listSearchHistoryIds.push(e.id)
              }
            })
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 查看商品筛选
    goClass () {
      this.$router.push('/product/shList?q='+this.q)
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    //focus
    iptFocus () {
        this.errorMessage = '';
        this.inFocus = true;
    },
    //blur
    iptBlur () {
      let this_ = this;
      this_.inFocus = false;
      setTimeout(function () {
        if(this_.inFocus == false){
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          this_.checkWxScroll();
        }
      },200)
    },
    checkWxScroll(){
        var ua = navigator.userAgent.toLowerCase();
        var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(ua.match(/MicroMessenger/i) == 'micromessenger'&&!!u){//在iphone 微信中
          this.temporaryRepair();
        }
    },
    temporaryRepair(){
      var currentPosition,timer;
      var speed=1;//页面滚动距离
      timer=setInterval(function(){
        currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition-=speed;
        window.scrollTo(0,0);//页面向上滚动
        clearInterval(timer);
      },1);
    },
  }
}
</script>

<style scoped>
.spots-form{
  padding-top: 100px;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
.spots-seanch{
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 15px 30px;
  background-color: #fff;
}
.spots-seanch .iconfont{
  font-size: 24px;
  color: #c1c1c1;
}
.spots-seanch input{
  position: absolute;
  left: 30px;
  width: 600px;
  line-height: 38px;
  padding: 16px 40px 16px 70px;
  box-sizing: border-box;
  font-size: 24px;
  border: none;
  outline: none;
  border-radius: 6px;
  -webkit-appearance: none;
  box-shadow: 0 0 30px #f0f0f0;
}
.spots-seanch-ss{
  position: absolute;
  line-height: 70px;
  top: 15px;
  left: 30px;
  width: 70px;
  text-align: center;
}
.spots-seanch-clear{
  position: absolute;
  line-height: 70px;
  top: 15px;
  left: 590px;
  width: 40px;
  text-align: center;
}
.spots-seanch-close{
  position: absolute;
  line-height: 70px;
  top: 15px;
  right: 30px;
  width: 80px;
  text-align: center;
}


.s-list{
  padding: 38px 0px 10px 26px;
}
.s-list-name{
  font-size: 24px;
  color: #d3d3d3;
  line-height: 38px;
  margin-bottom: 17px;
  position: relative;
}
.s-item{
  float: left;
  line-height: 50px;
  padding: 0 26px;
  background-color: #f5f5f5;
  font-size: 20px;
  color: #4d4d4d;
  border-radius: 5px;
  margin-right: 17px;
  margin-bottom: 17px;
}
.s-line{
  padding: 0 26px;
}
.s-line-in{
  border-bottom: 1px solid #f8f8f8;
}

.s-clear{
  position: absolute;
  right: 26px;
  top: 0;
  font-size: 28px;
}
</style>
