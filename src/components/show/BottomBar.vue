<template>
  <div class="botton-bar-cont" v-show="show">
    <div class="botton-bar-item" :class="{'botton-bar-item-on': $route.path == '/index'}" @click="goPath('/index')">
      <i class="iconfont">&#xe604;</i>
      <p>首页</p>
    </div>
    <div class="botton-bar-item" :class="{'botton-bar-item-on': $route.path == '/show/home'}" @click="goPath('/show/home')">
      <i class="iconfont">&#xe645;</i>
      <p>演出</p>
    </div>
    <div class="botton-bar-item" :class="{'botton-bar-item-on': $route.path == '/show/order'}" @click="goPath('/show/order')">
      <i class="iconfont">&#xe611;</i>
      <p>订单</p>
    </div>
    <div class="botton-bar-item" :class="{'botton-bar-item-on': $route.path == '/user/home'}" @click="goPath('/user/home')">
      <i class="iconfont">&#xe6b8;</i>
      <p>我的</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      urls: [
        '/show/home'
      ]
    }
  },
  methods: {
    goPath (path) {
      this.$router.push(path)
    }
  },
  computed: {
    show () {
      if(this.urls.indexOf(this.$route.path) >= 0){
        return true
      }else{
        return false
      }
    }
  }
}
</script>

<style scoped>
.botton-bar-cont{
  /* position: absolute; */
  position: fixed;
  -webkit-overflow-scroll: touch;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  width: 100%;
  height: 88px;
  display: flex;
  box-shadow: 0 1px 6px #ccc;
  box-sizing: border-box;
  padding-top: 3px;
  z-index: 90;
  /* padding-left: 88px; */
}
.botton-bar-item{
  flex: 3;
  text-align: center;
}
.botton-bar-item .iconfont{
  font-size: 36px;
  line-height: 50px;
}
.botton-bar-item p{
  font-size: 24px;
  line-height: 30px;
} 
.botton-bar-cont .botton-bar-item-on{
  color: #ff5162;
}
.botton-bar-home{
  position: absolute;
  left: 0;
  top: 0;
  text-align: center;
  height: 88px;
  width: 88px;
  line-height: 88px;
  background-color: #ff5162;
  color: #ffffff;
}
.botton-bar-home .iconfont{
  font-size: 36px;
}
</style>

