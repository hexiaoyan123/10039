<template>
  <div class="container ignore-cont product-goods">
    <!-- 头部开始 -->
    <header class="gradation">
      <div class="header-back" @click="goBack">
        <!-- <i class="iconfont">&#xe60d;</i> -->
      </div>
      <div class="header-cont">
        <span :class="{'header-on': showModular == 1}" @click="chengeModular(1)">商品</span>
        <span :class="{'header-on': showModular == 2}" @click="chengeModular(2)">详情</span>
        <span :class="{'header-on': showModular == 3}" @click="chengeModular(3)"> 服务保障</span>
        <span :class="{'header-on': showModular == 4}" @click="chengeModular(4)"> 评价</span>
      </div>
      <div class="header-more">
        <!-- <i class="iconfont">&#xe60a;</i> -->
      </div>
    </header>
    <!-- 头部结束 -->

    <swiper v-show="showModular == 1 || showModular == 2 || showModular == 3" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callbackS">
      <swiper-slide>
        <!-- 商品开始 -->
        <product-goods slot="default" :info="goods" :spec="choice" @showModu="showModu"  @gotoev="goEv" :key="1"></product-goods>
        <!-- 商品结束 -->
      </swiper-slide>
      <swiper-slide>
        <product-deta :info="goods" :key="2"></product-deta>
      </swiper-slide>
      <swiper-slide>
        <product-server :info="goods" :key="3"></product-server>
      </swiper-slide>
    </swiper>
    
    <!-- 评价开始 -->
    <div v-show="showModular == 4">
      <product-ev :info="goods" :key="4"></product-ev>
    </div>
    <!-- 评价结束 -->

    <!-- 服务保障开始 -->
    <!-- <div v-show="showModular == 4">
      <product-server :info="goods" :key="4"></product-server>
    </div> -->
    <!-- 服务保障结束 -->

    <!-- 加入购物车开始 -->
    <div class="add-cart-cont">
      <div class="add-cart-icons">
        <div class="add-cart-icon" @click="goShoppingCart">
          <div class="popo gradation" v-show="cartNum">{{cartNum}}</div>
          <figure class="img">
            <img src="@/assets/xb/cart.png" alt="">
          </figure>
        </div>
        <div class="add-cart-icon">
          <figure class="img">
            <img src="@/assets/xb/kefu.png" alt="">
          </figure>
        </div>
      </div>
      <div class="add-cart-add gradation"  @click="showModu(1)">
        加入购物车
      </div>
    </div>
    <!-- 加入购物车结束 -->

    <!-- 选择商品参数 -->
    <van-actionsheet v-model="show" title="">
      <div class="choice-zhan"></div>
      <div class="choice-cont">
        <div class="choice-top">
          <figure class="img" v-if="goods.imageUrl">
            <img :src="$init.imgIp + goods.imageUrl.split(',')[0]" alt="">
          </figure>
          <h3>
            <small>¥</small>
            <span class="priceSpan" v-html="moneyFormat(choice.price)"></span>
          </h3>
          <p>
            <del>￥{{choice.marketPrice | moneyFormat}}<!--<span class="priceSpan" v-html="moneyFormat(choice.marketPrice)"></span>-->/原价</del>
          </p>
          <p>库存：{{choice.stock}}</p>
          <i class="iocn-close" id="choice-close" @click="show = false"></i>
        </div>

        <div class="choice-item" v-if="choice.list && choice.list.length > 0">
          <product-money :v-goods="choice.list" @checkGoods="selectChoice"></product-money>
        </div>

        <div class="choice-num-cont">
          <div class="choice-num-cont-left">数量</div>
          <div class="choice-num-cont-right">
            <div class="choice-num-reduce" @click="choiceNumReduce">
              <i class="iconfont">&#xe638;</i>
            </div>
            <div class="choice-num-show">
              {{choice.num}}
            </div>  
            <div class="choice-num-add" @click="choiceNumAdd">
              <i class="iconfont">&#xe602;</i>
            </div>
          </div>
        </div>

        <div class="choice-ok gradation"  v-show="choice.type == 1" @click="addShoppingCart">加入购物车</div>
        <div class="choice-ok gradation" v-show="choice.type == 2" @click="buyNow">立即购买</div>
        <div class="choice-ok-cont"  v-show="choice.type == 3">
          <div class="choice-ok gradation"  @click="addShoppingCart">加入购物车</div>
          <!-- <div class="choice-ok" @click="buyNow">立即购买</div> -->
        </div>
      </div>
    </van-actionsheet>
    <!-- 选择商品参数 -->

  </div>
</template>

<script>
// import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import ProductGoods from './ProductGoods'
import ProductEv from './ProductEv'
import ProductDetails from './ProductDetails'
import ProductService from './ProductService'
import ProductMoney from './ProductMoney'
export default {
  name: 'Product',
  components: {
    swiper,
    swiperSlide,
    'product-goods': ProductGoods, // 商品
    'product-ev': ProductEv, // 评价
    'product-deta': ProductDetails, // 详情
    'product-server': ProductService, // 服务
    'product-money': ProductMoney, // 选择商品
  },
  data () {
    let vm = this;
    return {
      cartNum: '', // 购物车数量
      showModular: 1, // 显示模块
      id: this.$route.params.id, // 商品ID
      channel: this.$init.channelId, // 商品渠道
      goods: false, // 商品详情
      show: false, // 选择参数
      baseImg: this.$init.ip + '/',
      choice: {
        type: 1, // 类型 (1:加入购物车, 2:立即购买)
        num: 1, // 数量
        price: '',
        marketPrice: '', // 原价
        stock: '', // 库存
        id: '',
        list: [],
        message: ''
      },
      /**
       * 配置项目
       */
      swiperOption: {
        direction: 'vertical',
        preventDefault: false,
        mousewheel: true,
        on: {
          slideChangeTransitionEnd () {
            if(this.snapIndex === 0){
              vm.showModular = 1
            }else if(this.snapIndex === 1){
              vm.showModular = 2
            }else if(this.snapIndex === 2){
              vm.showModular = 3
            }
          }
        }
      },
    }
  },
  created () {
    this.$store.commit('ctrlLoader', true)
    this.getGoods();
    this.getCardNum()
  },
  mounted () {
    
  },
  computed: {
    swiper(){
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
  	moneyFormat(value) {
				if(value) {
					var moneyValue = (value / 100).toFixed(2).split('.');

					return '<big>' + moneyValue[0] + '</big>.' + moneyValue[1]
				} else if(value === 0) {
					return '0'
				} else {
					return ''
				}
			},
    callbackS () {
      
    },
    // 改变标签指向
    chengeModular (index) {
      if(index == 1){
        this.$refs.mySwiper.swiper.slideTo(0)
      }else if(index == 2){
        this.$refs.mySwiper.swiper.slideTo(1)
      }else if(index == 3){
        this.$refs.mySwiper.swiper.slideTo(2)
      }
      this.showModular = index;
    },

    // 查看更多评价
    goEv (num) {
      this.chengeModular(num)
    },
    // 加入购物车或购买
    showModu (type) {
      this.choice.type = type;
      this.show = true;
    },
    // 加入购物车按钮
    addShoppingCart () {
      let vm = this;
      if(! this.choice.id){
        vm.$toast('请选择参数')
        return
      }
      let postData = {
        "quantity": this.choice.num,
        "productSkuId": this.choice.id
      }
      this.$http.post('/panda-shop-api/v1/saveCart', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$toast('添加成功');
          vm.getCardNum();
          vm.show = false;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 获取购物车数量
    getCardNum () {
      let vm = this;
      this.$http.get('/panda-shop-api/v1/getCartQuantity').then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.cartNum = response.data.result
          }else{
            vm.cartNum = ''
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 立即购买
    buyNow () {
      let vm = this;
      if(! this.choice.id){
        vm.$toast('请选择参数')
        return
      }
      let postData = {
        reqCartList: [{
          "quantity": this.choice.num,
          "productId": this.choice.id
        }]
      }
      this.$http.post('/panda-shop-api/wap/generateOrder', postData, this.channel).then(function (response) {
        if(response.data.code == '1000'){
          let order = {
            id: response.data.result
          }
          vm.$init.order = order;
          vm.$router.push('product/orderPayCheck/' + response.data.result);
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 联系客服
    customService () {
      window.location.href = 'tel:10010';
    },
    // 前往购物车
    goShoppingCart () {
      this.$router.push('/product/cart')
    },
    // 获取商品详情
    getGoods () {
      let vm = this;
      // debugger
      this.$http.get('/panda-shop-api/v1/getProduct/'+this.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.goods = response.data.result;
          vm.goods.resProductSkuList.forEach((e, i) => {
            vm.choice.list.push(e)
            if(i == 0){
              vm.choice.id = e.id;
              vm.choice.price = e.salesPrice;
              vm.choice.marketPrice = e.marketPrice;
              vm.choice.stock = e.stock;
            }
          })
          vm.$store.commit('ctrlLoader', false)
        }else{
          vm.$toast(response.data.msg);
          setTimeout(() => {
            vm.$store.commit('ctrlLoader', false)
            vm.goBack()
          }, 2000)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 数量 +
    choiceNumAdd () {
      this.choice.num += 1;
    },
    // 数量 - 
    choiceNumReduce () {
      if(this.choice.num > 1){
        this.choice.num -= 1;
      }else{
        this.choice.num = 1;
      }
    },
    // 选择版本
    selectChoice (obj) {
      this.choice.id = obj.id;
      let newObj = {};
      this.choice.list.forEach((e, i) => {
        if(e.id == obj.id){
          newObj = e
        }
      })
      this.choice.price = newObj.salesPrice;
      this.choice.marketPrice = newObj.marketPrice;
      this.choice.message = obj.message;
      this.choice.stock = newObj.stock;
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
  },
  filters: {
    // 金钱格式化
    moneyFormat (value) {
      if(value){
        return (value/ 100).toFixed(2)
      }else if(value === 0){
        return 0
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 85px;
}
.ignore-cont{
  padding-bottom: 50px;
}
.top img{
  display: block;
  width: 100%;
}
.product-cont{
  height: 100%;
  position: relative;
}
header{
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
.header-back{
  width: 70px;
  text-align: center;
}
.header-cont{
  flex: 10;
}
.header-more{
  width: 75px;
  text-align: center;
}
header .iconfont{
  font-size: 28px;
}
.header-cont span{
  display: inline-block;
  box-sizing: border-box;
  height: 85px;
  border-bottom: 6px solid transparent;
  margin: 0 20px;
}
.header-cont .header-on{
  border-bottom-color: #fff;
  font-weight: 700;
}

/* 选择商品参数 */
.choice-cont{
  background: #fff;
}
.choice-zhan{
  height: 40px;
}
.choice-top{
  padding: 18px 27px 18px 212px;
  position: relative;
  border-bottom: 1px solid #eee;
}
.choice-top .img{
  display: inline-block;
  height: 166px;
  width: 166px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: absolute;
  bottom: 24px;
  left: 27px;
  overflow: hidden;
}
.choice-top .img img{
  display: inline-block;
  height: 100%;
  width: 100%;
}
.choice-top h3{
  line-height: 50px;
  font-size: 36px;
  color: #FF6372;
}
.choice-top h3 small{
  font-size: 18px;
}
.choice-top p{
  line-height: 30px;
  font-size: 22px;
  color: #808080;
}
.choice-top p del{
  color: #dddddd;
}
#choice-close{
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 32px;
}
.choice-item{
  padding: 10px 27px;
  font-size: 24px;
  color: #818181;
}
.choice-item h3{
  line-height: 56px;
}
.choice-item li{
  display: inline-block;
  line-height: 46px;
  padding: 0 26px;
  border-radius: 4px;
  border: 1px solid #eee;
  margin-bottom: 18px;
  margin-right: 18px;
}
.choice-item .on{
  color: #fff;
  background-color: #ff5162;
  border: 1px solid #ff5162;
}


.choice-num-cont{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 20px 30px;
  line-height: 60px;
  display: flex;
  color: #4d4d4d;
  font-size: 24px;
}
.choice-num-cont-left{
  flex: 10;
}
.choice-num-cont-right{
  text-align: right;
  border-radius: 5px;
  display: flex;
  text-align: center;
}
.choice-num-reduce{
  width: 60px;
  background-color: #e4e4e4;
  border-radius: 4px;
}
.choice-num-show{
  width: 100px;
}
.choice-num-add{
  width: 60px;
  background-color: #e4e4e4;
  border-radius: 4px;
}

/* .choice-num-cont{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 15px 27px;
  line-height: 50px;
  display: flex;
  color: #818181;
  font-size: 24px;
}
.choice-num-cont-left{
  flex: 10;
}
.choice-num-cont-right{
  text-align: right;
  border: 1px solid #eee;
  border-radius: 25px;
  display: flex;
  text-align: center;
}
.choice-num-reduce{
  width: 63px;
}
.choice-num-show{
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  width: 114px;
  color: #ff5162;
}
.choice-num-add{
  width: 63px;
} */

.choice-ok{
  color: #fff;
  line-height: 90px;
  text-align: center;
  background-color: #ff5162;
  font-size: 28px;
}
.choice-ok-cont{
  display: flex;
}
.choice-ok-cont .choice-ok{
  flex: 5;
}


/* 加入购物车 */
.add-cart-cont{
  line-height: 90px;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: #fff;
  display: flex;
}
.add-cart-icons{
  display: flex;
  width: 200px;
  box-sizing: border-box;
  padding-left: 8px;
  padding-top: 20px;
}
.add-cart-add{
  flex: 10;
  text-align: center;
  color: #fff;
  font-size: 28px;
}
.add-cart-icon{
  flex: 10;
  height: 50px;
  position: relative;
  box-sizing: border-box;
  border-left: 1px solid #e9e9e9;
  padding-top: 6px;
  text-align: center;
  line-height: 0;
}
.add-cart-icons .add-cart-icon:first-child{
  border: none;
}
.add-cart-icon .img{
  display: inline-block;
  height: 38px;
  width: 38px;
}
.add-cart-icon .img img{
  display: inline-block;
  height: 100%;
}
.popo{
  position: absolute;
  height: 22px;
  min-width: 12px;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  padding: 0 5px;
  border-radius: 11px;
  color: #fff;
  right: 56px;
  top: -6px;
  /* background: transparent */
}

.better-title{
  text-align: center;
  font-size: 16px;
  line-height: 38px;
  padding: 10px 0;
  color: #ddd;
}
</style>

<style>
.van-button--bottom-action.van-button--primary{
  background-color: #ff5162;
}
.van-button--bottom-action{
  background-color: #ff5162;
}
.product-goods .van-actionsheet{
  background: transparent;
  border: none;
}
.product-goods .van-hairline--bottom{
  display: none;
}
/* 轮播 */
.product-goods .swiper-container{
  height: 100%;
}
.product-goods .swiper-wrapper{
  height: 100%;
}
</style>