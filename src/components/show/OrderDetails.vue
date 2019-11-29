<template>
  <div class="container">
    <Vheader name="订单详情"></Vheader>
    <ul class="list">
      <li class="item">
        <div class="item-left">
          <b>{{order.goodsName}} </b>
          <p>{{order.planName}} </p>
        </div>
        <div class="item-right"></div>
      </li>
    </ul>

    <ul class="list">
      <li class="item">
        <div class="item-left">
          <b>排期、地址</b>
          <div class="nobor">
            <div class="item-left">
            排期: 
            </div>
            <div class="item-right">
              <span>{{order.planName}}</span>
            </div>
          </div>
          <div class="nobor">
            <div class="item-left">
            场馆名称: 
            </div>
            <div class="item-right">
              <span>{{order.venueName}}</span>
            </div>
          </div>
          <div class="nobor">
            <div class="item-left">
            详细地址: 
            </div>
            <div class="item-right">
              <span>{{order.venueAddress}}</span>
            </div>
          </div>
          <div class="nobor">
            <div class="item-left">
            取票方式: 
            </div>
            <div class="item-right">
              <span>{{order.deliverType | deliverTypeToStr}}</span>
            </div>
          </div>
        </div>
        <div class="item-right"></div>
      </li>
    </ul>

    <ul class="list">
      <li class="item">
        <div class="item-left">
          <b>订单号: {{order.id}}</b>
        </div>
        <div class="item-right">
          <span class="on">{{order.dataStatus | typeToStr}}</span>
        </div>
      </li>
      <li class="item">
        <div class="item-left">
          <p>单价: ¥ <span class="priceSpan" v-html="moneyFormat(order.price)"></span> x {{order.quantity}}张</p>
         <p>总价: ¥ <span class="priceSpan" v-html="moneyFormat(order.orderAmount)"></span></p>
         <p>优惠: ¥ 0</p>
         <p>实付: ¥ <span class="on priceSpan" v-html="moneyFormat(order.orderAmount)"></span></p>
        </div>
        <div class="item-right"></div>
      </li>
    </ul>

    <div class="goods-bottom" v-if="order.dataStatus == 1">
      <span @click.stop="goPay" v-if="order.dataStatus == 1" class="blue">去支付</span>
    </div>

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
      order: {}
    }
  },
  created () {
    this.getOrder()
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
    // 获取订单信息
    getOrder () {
      let vm = this;
      this.$http.get('/panda-ticket-api/v1/getOrder/' + this.$route.params.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.order = response.data.result;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 去支付
    goPay () {
      this.$router.push('/show/orderPay/'+this.order.id);
    },
  },
  filters: {
    // 取票方式
    deliverTypeToStr (value) {
      if(value == 1){
        return '快递'
      }else if(value == 2){
        return '上门自取'
      }else if(value == 3){
        return '现场自取'
      }else{
        return ''
      }
    },
    // 状态转字符串
    typeToStr (value) {
      if(value == 1){
        return '待支付'
      }else if(value == 2){
        return '待出票'
      }else if(value == 3){
        return '已发货'
      }else if(value == 4){
        return '已完成'
      }else if(value == 5){
        return '已取消'
      }else if(value == 6){
        return '已失败'
      }else if(value == 7){
        return '已退款'
      }else{
        return ''
      }
    },
    // 金钱格式化
    moneyFormat (value) {
      if(value){
        return (value/ 100).toFixed(2)
      }else if(value === 0){
        return 0
      }else{
        return ''
      }
    },
    // 时间格式化
    timeToStr (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm);
    },
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 84px;
}
.top img{
  display: block;
  width: 100%;
}
.nobor{
  display: flex;
}
header{
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  color: #4d4d4d;
  z-index: 20;
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

.list{
  margin-top: 20px;
  border-bottom: 1px solid #dddddd;
}
.item{
  border-top: 1px solid #dddddd;
  padding: 20px;
  line-height: 44px;
  font-size: 24px;
  color: #818181;
  display: flex;
  background-color: #fff;
}
.item-left{
  flex: 10;
}

.right{
  float: right;
}
.goods-list{
  background-color: #fff;
  margin-top: 20px;
}
.goods-item{
  border-top: 1px solid #dfdfdf;
  display: flex;
  position: relative;
  padding: 20px 20px 20px 20px;
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
.goods-item-img img{
  display: block;
  height: 150px;
  width: 150px;
}
.goods-item-info{
  flex: 10;
  padding-left: 20px;
  font-size: 24px;
  line-height: 50px;
} 
.goods-bottom{
  padding: 10px 20px;
  line-height: 54px;
  text-align: right;
  background-color: #fff;
  margin-top: 20px;
}
.goods-bottom span{
  text-align: center;
  display: inline-block;
  padding: 0 20px;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  margin-left: 10px;
}
.goods-bottom .red{
  color: #ff4403;
  border-color: #ff4403;
}
.goods-bottom .blue{
  color: #00b202;
  border-color: #00b202;
}
</style>
