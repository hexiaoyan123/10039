<template>
<div class="container ticket">
  <Vheader name="门票"></Vheader>
  <!-- 搜索开始 -->
  <div class="ticket-form">
    <input type="text">
    <div class="ticket-form-placeholder">
      <i class="iconfont">&#xe6ac;</i> 请输入城市名/景点名称
    </div>
    <div class="ticket-form-clear">
      <i class="iconfont">&#xe6e1;</i>
    </div>
  </div>
  <!-- 搜索结束 -->
  <!-- 热门景点开始 -->
  <div class="ticket-hot">
    <div class="ticket-hot-name"> &nbsp; 热门景点</div>
    <div class="ticket-hot-info">
      <div class="ticket-hot-info-left">最热进店推荐</div>
      <div class="ticket-hot-info-right">
        <em>1</em> / 4
      </div>
    </div>
    <div class="ticket-hot-list">
      <ul class="ticket-hot-items">
        <li class="ticket-hot-item" v-for="(item, index) in 4" :key="index">
          <figure class="img">
            <img src="https://www.apple.com/cn/home/images/promos/apple-music/apple_music__543e514c_large.jpg" alt="">
          </figure>
          <div class="ticket-hot-item-name">民族村</div>
          <div class="ticket-hot-item-price">
            <em>￥</em> 72 <span>起</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- 热门景点结束 -->
  <!-- 筛选列表开始 -->
  <div class="ticket-cont">
    <div class="ticket-cont-top">
      <ul class="ticket-cont-top-cont">
        <li>
          区域 <i class="iconfont">&#xe656;</i>
        </li>
        <li>
          智能排序 <i class="iconfont">&#xe656;</i>
        </li>
      </ul>
    </div>
    <div class="ticket-cont-list">
      <div class="ticket-cont-item" v-for="(item, index) in 6" :key="index">
        <div class="ticket-cont-item-img">
          <figure class="img">
            <img src="https://www.apple.com/cn/home/images/promos/apple-music/apple_music__543e514c_large.jpg" alt="">
          </figure>
        </div>
        <div class="ticket-cont-item-info">
          <div class="ticket-cont-item-name">云南</div>
          <div class="ticket-cont-item-taps clearfix">
            <span class="ticket-cont-item-tap">刷脸入门</span>
          </div>
          <div class="ticket-cont-item-price">
            <em>￥</em> 72 <span>起</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 筛选列表结束 -->
</div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  components: {
    Vheader
  },
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  created () {

  },
  methods: {
    
  }
}
</script>

<style scoped>
.ticket{
  padding-top: 84px;
}
.ticket-form{
  padding: 22px;
  position: relative;
}
.ticket-form input{
  display: block;
  line-height: 38px;
  font-size: 24px;
  padding: 14px;
  border-radius: 6px;
  border: none;
  outline: none;
  box-sizing: border-box;
  width: 100%;
  background-color: transparent;
}
.ticket-form-placeholder{
  text-align: center;
  z-index: -1;
  position: absolute;
  left: 0;
  top: 22px;
  width: calc(100% - 44px);
  margin: 0 22px;
  line-height: 38px;
  padding: 14px 0;
  background-color: #eeeeee;
  border-radius: 6px;
  font-size: 24px;
  color: #c1c1c1;
}
.ticket-form-placeholder .iconfont{
  font-size: 24px;
}
.ticket-form-clear{
  position: absolute;
  width: 50px;
  text-align: center;
  top: 22px;
  right: 22px;
  line-height: 38px;
  padding: 14px 0;
  color: #c1c1c1;
}
.ticket-form-clear .iconfont{
  font-size: 24px;
}
.ticket-cont{
  box-sizing: border-box;
  padding-top: 80px;
  position: relative;
}
.ticket-cont-top{
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 1px 6px #eee;
}
.ticket-cont-top-cont{
  display: flex;
}
.ticket-cont-top-cont li{
  flex: 5;
  text-align: center;
  font-size: 24px;
  color: #4d4d4d;
  line-height: 80px;
}
.ticket-hot{
  padding: 22px;
  border-bottom: 6px solid #f5f5f5;
}
.ticket-hot-name{
  font-size: 24px;
  line-height: 28px;
  border-left: 4px solid #ff5162;
}
.ticket-hot-info{
  display: flex;
  font-size: 24px;
  color: #c1c1c1;
  line-height: 60px;
}
.ticket-hot-info-left{
  flex: 10;
}
.ticket-hot-info-right em{
  color: #4d4d4d;
}
.ticket-hot-list{
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.ticket-hot-items{
  white-space: nowrap;
}
.ticket-hot-item{
  display: inline-block;
  margin-right: 24px;
}
.ticket-hot-item .img{
  width: 410px;
  height: 246px;
  border-radius: 6px;
  overflow: hidden;
}
.ticket-hot-item .img img{
  display: block;
  width: 100%;
  border-radius: 6px;
}
.ticket-hot-item-name{
  font-size: 24px;
  line-height: 38px;
  padding-top: 10px;
}
.ticket-hot-item-price{
  font-size: 24px;
  line-height: 38px;
  color: #ff5162;
}
.ticket-hot-item-price em{
  font-size: 18px;
}
.ticket-hot-item-price span{
  font-size: 18px;
  color: #c1c1c1;
}
.ticket-cont-list{
  padding-top: 14px;
}
.ticket-cont-item{
  display: flex;
  font-size: 24px;
  padding: 14px 22px;
  line-height: 38px;
}
.ticket-cont-item-img{
  padding-right: 20px;
}
.ticket-cont-item-img .img{
  height: 124px;
  width: 256px;
  border-radius: 6px;
  overflow: hidden;
}
.ticket-cont-item-img .img img{
  display: block;
  width: 100%;
  border-radius: 6px;
}
.ticket-cont-item-info{
  flex: 10;
}
.ticket-cont-item-taps{
  padding: 8px 0;
}
.ticket-cont-item-tap{
  display: block;
  border: 1px solid #f2f2f2;
  color: #4d4d4d;
  float: left;
  padding: 0 14px;
  line-height: 30px;
  font-size: 16px;
  margin-right: 8px;
}
.ticket-cont-item-price{
  text-align: right;
}
.ticket-cont-item-price em{
  font-size: 18px;
}
.ticket-cont-item-price span{
  font-size: 18px;
  color: #c1c1c1;
}
</style>