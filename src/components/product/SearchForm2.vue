<template>
  <div class="container spots-form" v-show="modoShow">
    <div class="spots-seanch">
      <input @blur="iptBlur" @focus="iptFocus" id="spots-s" type="text" v-model="q" @keyup.enter="goClass" maxlength="20">
      <span class="spots-seanch-ss">
        <i class="iconfont">&#xe6ac;</i>
      </span>
      <span class="spots-seanch-clear" v-show="q" @click="q = ''">
        <i class="iconfont">&#xe6e1;</i>
      </span>
      <span class="spots-seanch-close" @click="goBack">取消</span>
    </div>

    <!-- 搜索结果开始 -->
    <div class="container">
      <ul class="ss-list">
        <li class="ss-item" v-for="(item, index) in list" :key="index" @click="openSpot(item.id)">
          <div class="ss-item-left">
            {{item.name}}
          </div>
          <div class="ss-item-right">
            <i class="iconfont">&#xe625;</i>
          </div>
        </li>
      </ul>
      <div v-show="q && list.length == 0 && noData" class="noData">暂无数据！</div>
    </div>
    <!-- 搜索结果结束 -->
  </div>
</template>

<script>
export default {
  props: ['show'],
  data () {
    return {
      q: '', // 搜索内容
      list: [],
      // 渠道ID
      noData: false, // 无数据
    }
  },
  created () {
    // if(this.$route.query.channel){
    //   this.channel = this.$route.query.channel
    // }
  },
  methods: {
    // 查看商品筛选
    goClass (id) {
      if(this.$route.query.class){
        this.$router.push('/product/searchScreen/'+this.$route.query.class+'?q='+this.q)
      }else{
        this.$router.push('/product/searchScreen?q='+this.q)
      }
    },
    // 返回上一页
    goBack () {
      
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
  },
  computed: {
    modoShow () {
      return this.show;
    }
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
  font-size: 14px;
  border: none;
  outline: none;
  border-radius: 6px;
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


.ss-item{
  border-bottom: 1px solid #eee;
  padding: 30px;
  font-size: 24px;
  line-height: 38px;
  display: flex;
}
.ss-item-left{
  flex: 10;
}
.ss-item-right{
  color: #c1c1c1;
}
</style>
