<template>
  <div class="goods-item-cont">
    <!-- 商品列表开始 -->
    <div class="goods-list" @click="goDetails">
      <div class="business-name">
        <span class="business-name-left unoverflow">{{info.activityName}}</span>
        <span class="business-name-right">{{info.dataStatus | typeToStr}}</span>
      </div>
      <ul class="goods-cont" >
        <li>
          <div class="goods-item">
            <div class="goods-item-img">
              <figure class="img">
                <img :src="info.activityImageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(info)">
              </figure>
            </div>
            <div class="goods-item-info">
              <p class="unoverflow">{{info.activitySkuName}}</p>
              <p class="unoverflow">{{info.activityStartTime | dateFormat}} - {{info.activityEndTime | dateFormat}}</p>
              <p class="unoverflow">{{info.activityAreaName}} {{info.activityAddress}}</p>
            </div>
          </div>
        </li>
      </ul>
      <h3 class="goods-order-many" v-if="info.dataStatus > 1">￥<span class="priceSpan" v-html="moneyFormat(info.orderAmount)"></span></h3>
      <h3 class="goods-order-many" v-if="info.dataStatus == 1">需付款: ￥<span class="priceSpan" v-html="moneyFormat(info.orderAmount)"></span></h3>
      <div class="goods-bottom"  v-if="info.dataStatus == 1">
        <span @click.stop="goPay" v-if="info.dataStatus == 1" class="blue">去支付</span>
      </div>
    </div>
    <!-- 商品列表结束 -->
  </div>
</template>

<script>
export default {
  name: 'OrderGoodsListItem',
  props: ['obj'],
  data () {
    return {
      list: [],
      pageNum: 1,
      noTimestamp: Date.parse(new Date()) / 1000
    }
  },
  created () {
    // this.getOrder(true);
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
    // 查看详情
    goDetails (id) {
      this.$router.push('/ac/orderDetails/'+this.info.orderId)
    },
    // 去支付
    goPay () {
      this.$router.push('/ac/orderPay/'+this.info.orderId)
    },
    // 查看活动
    goGoods (obj) {
      // this.$router.push('/ac/enrollDetail/'+obj.productId)
    },
  },
  computed: {
    info () {
      if(this.obj){
        return this.obj;
      }else{
        return {}
      }
    }
  },
  filters: {
    // 状态转字符串
    typeToStr (value) {
      if(value == 1){
        return '待付款'
      }else if(value == 3){
        return '已报名'
      }else if(value == 4){
        return '已取消'
      }else if(value == 5){
        return '已失败'
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
    dateFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
  }
}
</script>

<style scoped>
.goods-item-cont{
  margin-bottom: 20px;
}
/* 商品列表 */
.goods-list{
  margin-top: 20px;
  background-color: #fff;
}
.business-name{
  line-height: 36px;
  padding: 20px 20px 20px 20px;
  position: relative;
  font-size: 28px;
  font-weight: 500;
  display: flex;
}
.business-name-left{
  flex: 6;
}
.business-name-right{
  font-size: 24px;
}

.goods-item{
  border-top: 1px solid #eee;
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
.goods-item-img .img{
  display: block;
  height: 150px;
  width: 150px;
  border-radius: 5px;
  overflow: hidden;
  /* width: 150px; */
}
.goods-item-img .img img{
  display: block;
  height: 100%;
}
.goods-item-info{
  flex: 10;
  padding-left: 20px;
  font-size: 24px;
  line-height: 50px;
  overflow: hidden;
} 
.goods-bottom{
  padding: 10px 20px;
  line-height: 54px;
  border-top: 1px solid #eee;
  text-align: right;
}
.goods-bottom span{
  text-align: center;
  display: inline-block;
  padding: 0 20px;
  border: 1px solid #eee;
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

/* 多个商品列表 */
.goods-imgs-list{
  overflow: auto;
  white-space:nowrap;
  padding: 20px 0 20px 20px;
  border-top: 1px solid #eee;
}
.goods-imgs-item{
  display: inline-block;
  font-size: 0;
  line-height: 0;
  margin-right: 20px;
}
.goods-imgs-item .img{
  display: inline-block;
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
}
.goods-imgs-item .img img{
  display: block;
  height: 100%;
}
.goods-order-many{
  text-align: right;
  padding: 0 20px 10px 20px;
  font-size: 24px;
  line-height: 24px;
}
</style>

