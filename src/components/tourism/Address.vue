<template>
<div class="container address">
  <ul class="address-list">
    <li class="address-item">
      <div class="address-item-left">
        <i class="iconfont">&#xe652;</i>
      </div>
      <div class="address-item-info">
        <div class="info-name">
          <span>小明</span>
          <span>1989888888</span>
        </div>
        <div class="info-code">身份证号: 19999999999999999</div>
      </div>
      <div class="address-item-ctrl">
        <ul>
          <li>
            <i class="iconfont">&#xe623;</i>
            编辑
          </li>
          <li>
            <i class="iconfont">&#xe7b2;</i>
            删除
          </li>
        </ul>
      </div>
    </li>
    <li class="address-item">
      <div class="address-item-left">
        <i class="iconfont address-check">&#xe618;</i>
      </div>
      <div class="address-item-info">
        <div class="info-name">
          <span>小明</span>
          <span>1989888888</span>
        </div>
        <div class="info-code">身份证号: 19999999999999999</div>
      </div>
      <div class="address-item-ctrl">
        <ul>
          <li>
            <i class="iconfont">&#xe623;</i>
            编辑
          </li>
          <li>
            <i class="iconfont">&#xe7b2;</i>
            删除
          </li>
        </ul>
      </div>
    </li>
  </ul>


  <div class="nodata" v-show="list.length == 0">
    <figure class="img">
      <img src="@/assets/tour/nodata.png" alt="">
    </figure>
    <p class="nodata-name">暂无信息</p>
  </div>

  <div class="bottom-btn">新增取票人</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style scoped>
.address{
  padding-bottom: 100px;
}
.img{
  margin: 0 auto;
  width: 170px;
  height: 170px;
}
.img img{
  display: block;
  width: 100%;
}
.nodata{
  padding-top: 400px;
}
.nodata-name{
  font-size: 28px;
  color: #b4b4b4;
  line-height: 80px;
  text-align: center;
}
.bottom-btn{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 28px;
  color: #ffffff;
  background-color: #ff9300;
}
.address-item{
  display: flex;
  position: relative;
  padding: 20px 30px;
  border-bottom: 1px solid #e8e8e8;
}
.address-item-left{
  height: 76px;
  line-height: 76px;
}
.address-item-left .iconfont{
  font-size: 32px;
}
.address-item-info{
  padding: 0 15px;
  flex: 10;
}
.info-name{
  font-size: 28px;
  line-height: 38px;
  color: #4b4b4b;
}
.info-name span{
  margin-right: 20px;
}
.info-code{
  font-size: 24px;
  line-height: 38px;
  color: #c1c1c1;
}
.address-item-ctrl{
  font-size: 24px;
  line-height: 76px;
}
.address-item-ctrl ul{
  display: flex;
}
.address-item-ctrl .iconfont{
  font-size: 24px;
}
.address-item-ctrl li{
  padding: 0 10px;
}
.address-check{
  color: #ff9300;
}
</style>