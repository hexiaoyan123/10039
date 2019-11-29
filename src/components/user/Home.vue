<template>
  <div class="container">
    <ul class="list">
      <li class="role">
        <div class="role-img">
          <figure class="img">
            <img v-show="! $init.user.cacheUser.imageUrl" src="../../assets/user.jpg" alt />
            <img v-if="$init.user.cacheUser.imageUrl" :src="userImg" alt />
          </figure>
        </div>
        <div class="role-name">{{$init.user.cacheUser.nickname}}</div>
        <!-- <div class="role-right">
          <div class="logo-out-cont">
            <div class="logo-out" @click.stop="logout">
              <p>安全</p>
              <p>退出</p>
            </div>
          </div>
        </div>-->
      </li>
    </ul>

    <div class="orders o-cont">
      <div class="orders-in">
        <div class="o-name">我的订单</div>
        <ul>
          <!-- <li @click="goPath('/product/orders')">
            <i class="iconfont">
              <img class="big" src="../../assets/user/spdd.png" width="100%" />
            </i>
            <p>商品订单</p>
          </li> -->
          <li @click="goPath('/movie/orders')">
            <i class="iconfont" style="height: 19px;">
              <img class="big" src="../../assets/movie/movieList.png" width="100%" height="100%" />
            </i>
            <p>电影订单</p>
          </li>
          <!-- <li @click="goPath('/movie/orders')">
            <i class="iconfont">&#xe629;</i>
            <p>电影票订单</p>
          </li>
          <li @click="goPath('/show/order')">
            <i class="iconfont">&#xe645;</i>
            <p>演出订单</p>
          </li>-->
          <!-- <li @click="goPath('/ac/orderList')">
            <i class="iconfont" style="height: 19px;">
              <img src="@/assets/user/hddd.png" width="100%" height="100%" />
            </i>
            <p>活动订单</p>
          </li> -->
        </ul>
      </div>
    </div>

    <div class="orders">
      <div class="orders-in">
        <div class="o-name">常用工具</div>
        <ul>
          <li @click="goPath('/card/my')">
            <i class="iconfont">
              <img src="@/assets/user/wdkj.png" width="100%" />
            </i>
            <p>我的卡券</p>
          </li>
          <li @click="goPath('/card/search?actionType=binding')">
            <i class="iconfont">
              <img src="@/assets/user/kjcx.png" width="100%" />
            </i>
            <p>卡券查询</p>
          </li>
          <!-- <li @click="goPath('/card/search?actionType=recharge')">
            <i class="iconfont">&#xe6f8;</i>
            <p>卡券充值</p>
          </li>-->
          <li @click="goTel">
            <i class="iconfont">
              <img src="@/assets/user/lxkf.png" width="100%" />
            </i>
            <p>联系客服</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      userImg:
        this.$init.user.cacheUser.imageUrl &&
        this.$init.user.cacheUser.imageUrl.indexOf("http://") >= 0
          ? this.$init.user.cacheUser.imageUrl
          : this.$init.imgIp + this.$init.user.cacheUser.imageUrl
    };
  },
  created() {
    /*if(! this.$init.accessToken){
			  this.$router.push('/user/loginCode')
			}*/
  },
  methods: {
    // 退出登录
    logout() {
      let vm = this;
      this.$http
        .get("/v1/logout")
        .then(function(response) {
          if ("1000" == response.data.code) {
            // 清除登录信息
            vm.$init.loginUrl
              ? vm.$router.push(vm.$init.loginUrl)
              : vm.$router.push("/user/loginCode");
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 拨打电话
    goTel() {
      window.location.href = "tel:4000101515";
    },
    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f4f4f4;
  /* padding-top: 85px; */
  padding-bottom: 88px;
}

.top img {
  display: block;
  width: 100%;
}

header {
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #ff5162;
  color: #fff;
  text-align: center;
  display: flex;
  font-size: 28px;
  z-index: 101;
}

.header-back {
  width: 70px;
  text-align: center;
}

.header-cont {
  flex: 10;
}

.header-more {
  width: 75px;
  text-align: center;
}

.list {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.item {
  border-top: 1px solid #eee;
  padding: 20px;
  line-height: 44px;
  font-size: 24px;
  color: #818181;
  display: flex;
  background-color: #fff;
}

.item .iconfont {
  font-size: 26px;
  display: inline-block;
  width: 50px;
  text-align: center;
}

.item-left {
  flex: 10;
}

.role {
  padding: 20px;
  background: -webkit-linear-gradient(left, #ff8e62, #ff3766);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #ff3766);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #ff3766);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #ff3766);
  /* 标准的语法（必须放在最后） */
  padding-top: 40px;
  padding-bottom: 80px;
  color: #fff;
}

.role-name {
  margin-top: 10px;
  text-align: center;
  font-size: 28px;
  color: #fff;
}

.role-img {
  width: 100%;
  text-align: center;
}

.role-img .img {
  display: inline-block;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.role-img .img img {
  display: block;
  height: 100%;
  width: 100%;
}

.item .red {
  color: #ff4403;
  border-color: #ff4403;
}

.item .blue {
  color: #00b202;
  border-color: #00b202;
}

.list .item.center {
  display: block;
  text-align: center;
}

.orders {
  padding: 10px 20px;
}

.orders-in {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  box-shadow: 0px 10px 20px #e0e0e0;
}

.orders-in ul {
  display: flex;
  margin-bottom: 10px;
}

.orders-in li {
  flex: 4;
  text-align: center;
  font-size: 20px;
  padding-top: 10px;
}

.orders-in li .iconfont {
  display: inline-block;
  width: 36px;
  height: 30px;
  margin-bottom: 10px;
}

orders-in li .iconfont.big {
  width: 34px;
  height: 36px;
}

.iconfont {
}

.o-cont {
  margin-top: -70px;
}

.o-name {
  margin-bottom: 10px;
  padding: 5px 20px 20px 20px;
  border-bottom: 1px solid #eee;
}

.logo-out {
  line-height: 36px;
  width: 72px;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  color: #ff5162;
}

.logo-out-cont {
  padding: 12px 0 0 0;
}
</style>