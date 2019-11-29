<template>
  <div class="hello">
    <div class="cont">
      <h2 class="red">商品详情</h2>
      <ul>
        <li>
          <router-link to="/product">商品详情</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">个人中心</h2>
      <ul>
        <li>
          <router-link to="/home">个人中心</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">订单和购物车</h2>
      <ul>
        <li>
          <router-link to="/cart">购物车</router-link>
        </li>
        <li>
          <router-link to="/cartEdit">编辑购物车</router-link>
        </li>
        <li>
          <router-link to="/orderPay">订单结算</router-link>
        </li>
        <li>
          <router-link to="/orderList">订单列表</router-link>
        </li>
        <li>
          <router-link to="/orderDetails">订单详情</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">卡券</h2>
      <ul>
        <li>
          <router-link to="/cardRecharge">卡充值</router-link>
        </li>
        <li>
          <router-link to="/cardRechargeMoney">充值选择金额</router-link>
        </li>
        <li>
          <router-link to="/cardMerge">卡券合并</router-link>
        </li>
        <li>
          <router-link to="/cardMy">我的卡券</router-link>
        </li>
        <li>
          <router-link to="/cardQuery">卡券查询</router-link>
        </li>
        <li>
          <router-link to="/cardBinding">绑定卡券</router-link>
        </li>
        <li>
          <router-link to="/cardFlow">流水查询</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">地址</h2>
      <ul>
        <li>
          <router-link to="/addressList">选择地址列表</router-link>
        </li>
        <li>
          <router-link to="/addressAdd">新增收货地址</router-link>
        </li>
        <li>
          <router-link to="/addressListManage">管理收货地址</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">电影票</h2>
      <ul>
        <li>
          <router-link to="/movieCinema">选择电影院</router-link>
        </li>
        <li>
          <router-link to="/movieField">选择场次</router-link>
        </li>
        <li>
          <router-link to="/movieSeat">选择座位</router-link>
        </li>
        <li>
          <router-link to="/movieFilm">电影详情</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">搜索</h2>
      <ul>
        <li>
          <router-link to="/searchClass">条件筛选</router-link>
        </li>
        <li>
          <router-link to="/searchClassItem">条件筛选组</router-link>
        </li>
        <li>
          <router-link to="/searchForm">搜索表单</router-link>
        </li>
        <li>
          <router-link to="/searchScreen">搜索筛选</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">主页</h2>
      <ul>
        <li>
          <router-link to="/index">主页</router-link>
        </li>
        <li>
          <router-link to="/baking">烘焙</router-link>
        </li>
        <li>
          <router-link to="/book">图书</router-link>
        </li>
        <li>
          <router-link to="/bookItem">图书组</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">公用部分</h2>
      <ul>
        <li>
          <router-link to="/success">成功</router-link>
        </li>
        <li>
          <router-link to="/fail">失败</router-link>
        </li>
        <li>
          <router-link to="/error">报错</router-link>
        </li>
      </ul>
    </div>
    <div class="cont">
      <h2 class="red">登录注册</h2>
      <ul>
        <li>
          <router-link to="/register">注册</router-link>
        </li>
        <li>
          <router-link to="/loginPassword">密码登录</router-link>
        </li>
        <li>
          <router-link to="/loginCode">验证码登录</router-link>
        </li>
        <li>
          <router-link to="/findPassword1">找回密码1</router-link>
          <router-link to="/findPassword2">找回密码2</router-link>
          <router-link to="/findPassword3">找回密码3</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Button, Cell } from 'vant';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
.cont{
  border: 1px solid #f2f2f2;
  margin-bottom: 40px;
  font-size: 28px;
}
ul{
  padding: 0 20px;
}
h2{
  font-size: 32px;
  font-weight: 700;
  line-height: 60px;
}
</style>
