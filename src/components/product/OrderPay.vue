<template>
  <div class="container catr-cont">
    <Vheader name="订单"></Vheader>
    <!-- 地址开始 -->
    <div class="address" @click="goAdderssList">
      <div class="address-un" v-show="! adderss.areaName">
        <i class="iconfont on">&#xe639;</i>
        选择收货地址
      </div>
      <div class="address-on" v-show="adderss.areaName">
        <div class="address-on-left">
          <p>
            <strong>{{adderss.consignee}}</strong>
            <span>{{adderss.phone}}</span>
          </p>
          <p>{{adderss.areaName}} {{adderss.address}}</p>
        </div>
        <div class="address-on-right" v-show="adderss.isDefault == 1">
          <div class="address-on-btn">修改</div>
        </div>
      </div>
      <figure class="address-line">
        <img src="@/assets/line.png" alt="">
      </figure>
    </div>
    <!-- 地址结束 -->
    
    <!-- 商品列表开始 -->
    <div class="goods-list">
      <ul class="goods-cont">
        <li class="goods-item" v-for="(item, index) in form.reqCartList" :key="index">
          <div class="goods-item-img">
            <figure class="img">
              <img :src="$init.imgIp + item.imageUrl.split(',')[0]" alt="">
            </figure>
          </div>
          <div class="goods-item-info">
            <h4>{{item.name}}</h4>
            <div class="goods-item-info-spec">
              {{item.specification}}
            </div>
            <div class="goods-item-info-cont">
              <div class="on goods-item-info-cont-left">
                <small>¥ </small><span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span>
              </div>
              <div class="goods-item-info-cont-btn bload">
                × {{item.quantity}}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 商品列表结束 -->

    <!-- 信息开始 -->
    <ul class="group-list">
      <li class="group clearfix">
        <label>商品总额</label>
        <div class="group-cont bload">
          <small>¥</small>{{priceGoods | moneyFormat}}
        </div>
      </li>
      <li class="group clearfix">
        <label>运费</label>
        <div class="group-cont bload">
         +  <small>¥</small>{{priceShipping | moneyFormat}}
        </div>
      </li>
      <!-- <li class="group clearfix">
        <label>留言</label>
        <div class="group-cont">
          {{form.remark}}
        </div>
      </li> -->
    </ul>
    <ul class="group-list">
      <li class="group clearfix">
        <label>留言</label>
        <div class="group-cont">
          <textarea class="remark"  @blur="iptBlur" @focus="iptFocus" v-model="form.remark" placeholder="留言" rows="2"></textarea>
        </div>
      </li>
    </ul>
    <!-- 信息结束 -->

    <!-- <div class="supplement">
      <van-cell-group>
        <van-cell title="商品金额" :value="priceGoods | moneyFormat" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="运费" :value="priceShipping | moneyFormat" />
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="form.remark" placeholder="留言" />
      </van-cell-group>
    </div> -->
    
    <!-- 购物车控制开始 -->
    <div class="fix-bar">
      <div class="fix-bar-left">
        <div class="fix-bar-info">
          <div class="fix-bar-info-maney">
            <em class="on"> <small>¥ </small><span class="priceSpan" v-html="moneyFormat(price)"></span></em>
          </div>
        </div>
      </div>
      <div class="fix-bar-right" @click="goNext">
        结算 <small>({{goodsNum}}件)</small>
      </div>
    </div>
    <!-- 购物车控制结束 -->

  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'Cart',
  components: {
    Vheader
  },
  data () {
    return {
      value: '', // 留言
      // 弹出层
      popup: false,
      // 订单数据
      form: {
        reqCartList: [],
        receiverId: '',
        shippingMethodId: '',
        remark: ''
      },

      // 地址
      adderss: {},

      goodsNum: 0, // 商品数量
      priceShipping: 0, // 运费
      priceGoods: 0, // 商品总金额
      price: 0, // 计算出总价格
    }
  },
  created () {
    this.getOrder();
    this.getAddress();
    
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


    // 结算
    goNext () {
      let vm = this;
      if(! this.adderss.areaName){
        this.$toast('请选择地址')
        return false;
      }

      let postData = {
        receiverId: this.adderss.id,
        shippingMethodId: this.form.shippingMethodId,
        remark: this.form.remark,
        reqCartList: []
      }
      this.form.reqCartList.forEach((e, i) => {
        let obj = {
          id: e.id,
          productId: e.productId,
          productSkuId: e.productSkuId,
          shippingMethodId: e.shippingMethodId,
          weight: e.weight,
          quantity: e.quantity
        }
        postData.reqCartList.push(obj)
      })

      this.$http.post('/panda-shop-api/v1/generateOrder', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$router.push('/product/orderPayCheck/'+response.data.result)
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 选择地址
    goAdderssList () {
      this.$router.push('/product/addressList')
    },
    // 获取地址信息
    getAddress () {
      let vm = this;
      if(this.$init.checkAddress){
        this.adderss = this.$init.checkAddress.more;
      }else if(this.$init.defaultAdderss){
        this.adderss = this.$init.defaultAdderss;
      }else if(window.sessionStorage.getItem('defaultAdderss')){
        this.adderss = JSON.parse(window.sessionStorage.getItem('defaultAdderss'))
      }else{
        this.$http.get('/panda-shop-api/v1/listReceiver').then(function (response) {
          if(response.data.code == '1000'){
            if(response.data.result && response.data.result.length > 0){
              response.data.result.forEach((e, i) => {
                if(e.isDefault == 1){
                  vm.adderss = e;
                }
              })
              if(vm.adderss == {}){
                vm.adderss = response.data.result[0]
              }
              vm.$init.defaultAdderss = vm.adderss;
              window.sessionStorage.setItem('defaultAdderss', JSON.stringify(vm.adderss))
            }
          }else{
            vm.$toast(response.data.msg)
          }
        })
        .catch(function (error) {
          vm.$toast('请求超时，请稍后再试！')
        });
      }
    },
    // 计算运费
    calculateFreight () {
      var vm = this;
      var postData = [];
      this.form.reqCartList.forEach((e, i) => {
        let obj = {
          id: e.id,
          productId: e.productId,
          productSkuId: e.productSkuId,
          shippingMethodId: e.shippingMethodId,
          weight: e.weight,
          quantity: e.quantity
        }
        postData.push(obj)
        vm.priceGoods += e.salesPrice * e.quantity;
        vm.goodsNum += e.quantity;
      })
      this.$http.post('/panda-shop-api/v1/calculateFreight', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.priceShipping = response.data.result.price;
          vm.price = vm.priceShipping + vm.priceGoods;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 获取订单信息
    getOrder () {
      var orderJson = sessionStorage.getItem('goodsOrder');
      if(! orderJson){
        orderJson = this.$cookies.get('goodsOrder');
      }
      if(orderJson){
        this.form = JSON.parse(orderJson);
        this.calculateFreight()
        // console.log(this.form)
      }
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
        return '0'
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>
.catr-cont{
  padding-bottom: 102px;
  padding-top: 84px;
  background-color: #f8f8f8;
}
header{
  width: 100%;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}
.class-back{
  position: absolute;
  width: 80px;
  height: 80px;
  line-height: 92px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
}

/* 购物车控制条 */
.fix-bar{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100px;
  width: 100%;
  background-color: #fff;
  display: flex;
  font-size: 28px;
  border-top: 1px solid #eee;
}
.fix-bar-right{
  height: 100%;
  line-height: 100px;
  color: #fff;
  background-color: #ff5162;
  text-align: center;
  width: 220px;
  font-weight: 700;
  font-size: 28px;
}
.fix-bar-right small{
  font-size: 20px;
  font-weight: 500;
}
.fix-bar-left{
  flex: 10;
  display: flex;
}
.fix-bar-choice{
  width: 100px;
  text-align: center;
  height: 100px;
  line-height: 60px;
}
.fix-bar-choice-title{
  line-height: 30px;
  font-size: 22px;
}
.fix-bar-info{
  flex: 10;
  line-height: 100px;
}
.fix-bar-info-maney{
  padding-right: 20px;
  padding-left: 20px;
  font-size: 28px;
  font-weight: 700;
}
.fix-bar-info-maney .on{
  font-weight: 700;
}

/* 商品列表 */
.goods-list{
  margin-bottom: 20px;
  background-color: #fff;
}
.business-name{
  line-height: 44px;
  padding: 20px 20px 20px 90px;
  position: relative;
  font-size: 32px;
  font-weight: 700;
}
.business-name-choice{
  position: absolute;
  left: 20px;
  top: 17px;
}
.business-name .iconfont{
  font-size: 32px;
}
.goods-item{
  border-top: 1px solid #f8f8f8;
  display: flex;
  position: relative;
  padding: 20px 20px 20px 20px;
}
.goods-list .goods-item:first-child{
  border-top: none;
}
.goods-item-choice{
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 90px;
  box-sizing: border-box;
  padding: 0 20px;
  padding-top: 75px;
  color: #999;
}
.goods-item-choice .van-icon{
  font-size: 20px;
}
.goods-item-choice .van-icon.van-icon-checked{
  color: #ff5162;
}
.goods-item-img .img{
  display: block;
  height: 150px;
  width: 150px;
}
.goods-item-img .img img{
  display: block;
  height: 100%;
  width: 100%;
}
.goods-item-info{
  flex: 10;
  padding-left: 20px;
}
.goods-item-info h4{
  color: #4d4d4d;
  font-size: 24px;
  line-height: 45px;
}
.goods-item-info-spec{
color: #818181;
font-size: 24px;
line-height: 45px;
}
.goods-item-info-cont{
  display: flex;
}
.goods-item-info-cont-left{
  flex: 8;
  line-height: 60px;
  font-size: 28px;
}
.goods-item-info-cont-btn{
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  line-height: 60px;
  font-size: 24px;
}
.goods-item-info-cont-btn .btn {
  height: 60px;
  /* line-height: 50px; */
  width: 60px;
  text-align: center;
  font-size: 32px;
  background-color: #f7f7f7;
}
.goods-item-info-cont-btn .iconfont{
  font-size: 28px;
  line-height: 60px;
}
.goods-item-info-cont-btn-info{
  line-height: 60px;
  width: 90px;
  text-align: center;
  font-size: 28px;
  margin: 0 2px;
  background-color: #f7f7f7;
}

/* 地址选择 */
.address{
  margin-bottom: 20px;
}
.address-line{
  display: block;
  width: 100%;
}
.address-line img{
  display: block;
  width: 100%;
}
.address-un{
  height: 120px;
  box-sizing: border-box;
  background-color: #fff;
  text-align: center;
  font-size: 28px;
  line-height: 120px;
}
.address-un .iconfont{
  font-size: 28px;
}
.address-on{
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 24px;
  color: #818181;
  line-height: 48px;
  display: flex;
}
.address-on strong{
  font-size: 28px;
  color: #4d4d4d;
}
.address-on-left{
  flex: 10;
}
.address-on-right{
  padding-top: 18px;
}
.address-on-btn{
  height: 60px;
  line-height: 60px;
  border-radius: 4px;
  width: 100px;
  color: #fff;
  text-align: center;
  background-color: #ff9900;
}
.supplement{
  margin-bottom: 20px;
}

/* 信息 */
.group-list{
  background-color: #fff;
  font-size: 24px;
  line-height: 38px;
  padding: 10px;
  margin-bottom: 20px;
}
.group{
  padding: 10px;
}
.group label{
  float: left;
  width: 20%;
}
.group .group-cont{
  float: right;
  width: 75%;
  text-align: right;
}
.bload{
  font-weight: 700;
}
.group .color{
  color: #f90;
}

.remark{
  display: block;
  width: 100%;
  font-size: 24px;
  line-height: 38px;
  text-align: right;
  border: none;
  outline: none;
}
</style>

<style>
.van-radio .van-icon-checked{
  color: #ff5162;
}
.van-field__control{
  font-size: 14px;
}
</style>
