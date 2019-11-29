<template>
<div class="container order">
  <div class="order-info">
    <div class="name-cont">
      <div class="name-cont-left">民族村成人票</div>
      <div class="name-cont-right">
        <em>¥</em>72
      </div>
    </div>
    <div class="tab-list">
      <span class="tab-item">刷脸</span>
      <span class="tab-item">刷脸</span>
      <span class="tab-item">刷脸</span>
    </div>
    <div class="tips-cont">
      <span class="tips-btn">预定须知<i class="iconfont">&#xe625;</i></span>
    </div>
  </div>
  <div class="order-group">
    <label>使用日期</label>
    <div class="order-group-cont">
      <ul class="o-dates">
        <li class="o-dates-one"></li>
        <li class="o-date-item">
          <div class="o-date-day">今天12-05</div>
          <div class="o-date-price">
            <em>¥</em>72
          </div>
        </li>
        <li class="o-date-item o-date-item-on">
          <div class="o-date-day">今天12-05</div>
          <div class="o-date-price">
            <em>¥</em>72
          </div>
        </li>
        <li class="o-date-item">
          <div class="o-date-item-more">更多日期 <i class="iconfont">&#xe625;</i></div>
        </li>
      </ul>
    </div>
  </div>

  <div class="users">
    <div class="user-name">选择出行人</div>
    <ul class="user-list clearfix">
      <li class="user-item">
        <span class="user-item-name">二毛</span>
      </li>
      <li class="user-item user-item-on">
        <span class="user-item-name">二毛</span>
      </li>
      <li class="user-item">
        <span class="user-item-name user-item-add"><i class="iconfont">&#xe61e;</i> 新增</span>
      </li>
    </ul>
  </div>

  <div class="order-group">
    <label>联系人</label>
    <div class="order-group-cont">
      <input type="text" placeholder="需要1人姓名">
    </div>
  </div>
  <div class="order-group">
    <label>联系手机</label>
    <div class="order-group-cont">
      <input type="text" placeholder="联系人手机号">
    </div>
  </div>

  
  <div class="bottom-btn">
    <div class="bottom-btn-left">
      价格: <em>¥72.00</em>
    </div>
    <div class="bottom-btn-right">
      提交订单
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
.order{
  padding-bottom: 100px;
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
  display: flex;
  box-shadow: 0 1px 6px #ccc;
}
.bottom-btn-left{
  flex: 10;
  background-color: #fff;
  padding: 0 30px;
  text-align: left;
  color: #4d4d4d;
}
.bottom-btn-left em{
  color: #ff5162;
}
.bottom-btn-right{
  width: 188px;
}
.order-info{
  padding: 20px 30px;
  background-color: #f5f5f5;
}
.name-cont{
  font-size: 28px;
  line-height: 46px;
  color: #4d4d4d;
  display: flex;
}
.name-cont-left{
  flex: 10;
}
.name-cont-right{
  color: #ff5162;
}
.name-cont-right em{
  font-size: 20px;
}
.tab-list{
  padding: 10px 0;
}
.tab-item{
  display: inline-block;
  padding: 0 15px;
  line-height: 30px;
  font-size: 16px;
  background-color: #fff;
  margin-right: 6px;
  border-radius: 3px;
}
.tips-btn{
  color: #c1c1c1;
  font-size: 22px;
  line-height: 38px;
}
.order-group{
  padding: 30px 40px;
  display: flex;
  border-bottom: 1px solid #f8f8f8;
}
.order-group>label{
  line-height: 52px;
  font-size: 24px;
  width: 110px;
}
.order-group-cont{
  flex: 10;
}
.order-group-cont input{
  border: none;
  outline: none;
  display: block;
  text-align: right;
  width: 100%;
  font-size: 24px;
  line-height: 38px;
  padding: 7px;
}
.o-dates{
  display: flex;
}
.o-dates-one{
  flex: 10;
}
.o-date-item{
  padding: 10px;
  box-sizing: border-box;
  width: 140px;
  border-radius: 5px;
  border: 1px solid #f8f8f8;
  text-align: center;
  font-size: 22px;
  line-height: 38px;
  margin-left: 10px;
}
.o-date-price{
  color: #ff5162;
}
.o-date-price em{
  font-size: 16px;
}
.o-date-item-on{
  background-color: #ff5162;
  color: #fff;
}
.o-date-item-on .o-date-price{
  color: #fff;
}
.o-date-item-more{
  line-height: 76px;
}
.users{
  padding: 30px;
  border-top: 6px solid #f5f5f5;
  border-bottom: 6px solid #f5f5f5;
}
.user-name{
  font-size: 24px;
  line-height: 38px;
}
.user-list{
  padding-top: 20px;
}
.user-item{
  display: block;
  float: left;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
  position: relative;
  padding: 0 20px;
  font-size: 22px;
  line-height: 38px;
  margin-right: 16px;
  margin-bottom: 16px;
}
.user-item-on{
  border-color:#ff9300;
  color: #ff9300;
}
.user-item-add{
  color: #ff9300;
}
.user-item-add .iconfont{
  font-size: 22px;
}
</style>