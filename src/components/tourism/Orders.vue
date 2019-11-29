<template>
<div class="container order">
  <div class="order-cont">
    <div class="order-top">
      <div class="order-top-item order-top-item-on">全部</div>
      <div class="order-top-item">待支付</div>
      <div class="order-top-item">已取消</div>
      <div class="order-top-item">已经使用</div>
    </div>
    <div class="order-list">
      <div class="order-item" v-for="(item, index) in 8" :key="index">
        <div class="order-item-name">
          <div class="order-item-name-left">
            门票
          </div>
          <div class="order-item-name-right">
            <em>¥</em> 72
          </div>
        </div>
        <div class="order-item-time">
          <div class="order-item-time-left">
            游玩日期: 2018-12-09
          </div>
          <div class="order-item-time-right">
            等待支付
          </div>
        </div>
        <div class="order-item-time">
          <div class="order-item-time-left">
            门票张数:1张
          </div>
        </div>
        <div class="order-item-btns">
          <div class="order-item-btn">取消</div>
          <div class="order-item-btn order-item-btn-on">支付</div>
        </div>
      </div>
    </div>
  </div>
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
.order-cont{
  box-sizing: border-box;
  height: 100%;
  padding-top: 100px;
  position: relative;
  font-size: 24px;
}
.order-top{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  display: flex;
}
.order-top-item{
  display: inline-block;
  line-height: 60px;
  text-align: center;
  border-radius: 5px;
  background-color: #f5f5f5;
  flex: 5;
  margin-left: 20px;
}
.order-top-item:first-child{
  margin-left: 0;
}
.order-top-item-on{
  color: #fff;
  background-color: #ff9300;
}
.order-item{
  padding: 30px;
  line-height: 38px;
  border-top: 1px solid #f5f5f5;
}
.order-item-name{
  display: flex;
  line-height: 46px;
}
.order-item-name-left{
  flex: 10;
}
.order-item-name-right{
  color: #ff5162;
}
.order-item-name-right em{
  font-size: 18px;
}
.order-item-time{
  display: flex;
  font-size: 20px;
  color: #c1c1c1;
}
.order-item-time-left{
  flex: 10;
}
.order-item-time-right{
  color: #ff9300;
}
.order-item-btns{
  text-align: right;
}
.order-item-btn{
  display: inline-block;
  border: 1px solid #c1c1c1;
  font-size: 20px;
  padding: 0 20px;
  border-radius: 5px;
  margin-left: 8px;
  color: #c1c1c1;
}
.order-item-btn-on{
  border-color: #ff9300;
  background-color: #ff9300;
  color: #fff;
}
</style>