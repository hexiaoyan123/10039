<template>
  <div class="goods-item-cont">
    <!-- 商品列表开始 -->
    <div class="goods-list" @click="goDetails">
      <div class="business-name">
        <span class="business-name-left">{{info.storeName}}</span>
        <span class="business-name-right">{{info.dataStatus | typeToStr}}</span>
      </div>
      <div class="od">
        <div class="od-left">订单编号：{{info.id}}</div>
        <div class="od-right">订单时间：{{info.createTime | dateFormat}}</div>
      </div>
      <div class="crad-cont" v-if="info.resPageOrderItemList.length == 1">
        <ul class="goods-cont">
          <li v-for="(item, index) in info.resPageOrderItemList" :key="index">
            <div class="goods-item">
              <div class="goods-item-img">
                <figure class="img">
                  <img :src="item.imageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(item)">
                </figure>
              </div>
              <div class="goods-item-info">
                <h4>{{item.name}}</h4>
                <p class="no">{{item.specification}}</p>
                <div class="tags">
                  <div class="tag" v-if="item.afterSale"><!--{{item.afterSale | afterSaleToStr}}-->  </div>
                </div>
                <div class="many">
                  <div class="many-left">
                    <small>￥</small><span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span>
                  </div>
                  <div class="many-right">
                    <small>x</small>{{item.quantity}}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="crad-cont" v-if="info.resPageOrderItemList.length > 1">
        <ul class="goods-imgs-list">
          <li class="goods-imgs-item" v-for="(item, index) in info.resPageOrderItemList" :key="index">
            <figure class="img">
              <img :src="item.imageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(item)">
            </figure>
          </li>
        </ul>
      </div>

      <div class="pool-cont">
        <h3 class="goods-order-many" v-if="info.dataStatus > 1 && info.dataStatus < 6">共{{info.quantity}}件商品, 实付款: <em class="on">￥<span class="priceSpan" v-html="moneyFormat(info.orderAmount)"></span></em></h3>
        <!-- <h3 class="goods-order-many" v-if="info.dataStatus == 1">共{{info.quantity}}件商品, 小计: <em class="on">￥{{info.productPrice + info.freight | moneyFormat}}</em></h3> -->
        <h3 class="goods-order-many" v-if="info.dataStatus == 1">共{{info.quantity}}件商品, 小计: <em class="on">￥<span class="priceSpan" v-html="moneyFormat(info.orderAmount)"></span></em></h3>
        
        <div class="pool-ctrl" v-if="info.dataStatus == 1">
          <span class="pool-ctrl-item" @click.stop="cancelOrder">
            取消订单
          </span>
          <span class="pool-ctrl-item" @click.stop="goPay">
            去支付
          </span>
        </div>
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
      this.$router.push('/product/orderDetails/'+this.info.id)
    },
    // 去支付
    goPay () {
      this.$init.order = this.info;
      this.$router.push('/product/orderPayCheck/'+this.info.id)
    },
    // 查看商品
    goGoods (obj) {
      this.$router.push('/product/'+obj.productId)
    },
    // 刷新列表
    refresh () {
      this.$emit('refreshList', true);
    },
    // 删除订单
    delOrder () {
      let vm = this;
      this.$http.get('/panda-shop-api/wap/delOrder/'+ this.info.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.refresh()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 取消订单
    cancelOrder () {
      let vm = this;
      this.$http.get('/panda-shop-api/v2/cancelOrder/'+ this.info.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.refresh()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
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
    // 标签
    afterSaleToStr (str) {
      var value = ''
      if(str){
        value = str.split(',')[0]
      }
      if(value == 1){
        return '不支持退换货和维修服务'
      }else if(value == 2){
        return '七日包退'
      }else if(value == 3){
        return '十五日包换'
      }else if(value == 4){
        return '一年包修'
      }else{
        return ''
      }
    },
    // 时间格式化
    dateFormat (shijianchuo) {
      if(shijianchuo){
        function add0(m){return m<10?'0'+m:m }
        var time = new Date(shijianchuo *1000);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d);
      }else{
        return ''
      }
    },
    // 状态转字符串
    typeToStr (value) {
      if(value == 1){
        return '待付款'
      }else if(value == 2){
        return '待审核'
      }else if(value == 3){
        return '待发货'
      }else if(value == 4){
        return '待收货'
      }else if(value == 5){
        return '已收货'
      }else if(value == 6){
        return '已取消'
      }else if(value == 7){
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
  padding: 20px 20px 12px 20px;
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
  color: #ff3666;
}

.goods-item{
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
  height: 176px;
  border-radius: 8px;
  overflow: hidden;
}
.goods-item-img .img img{
  display: block;
  height: 100%;
}
.goods-item-info{
  width: 480px;
  padding-left: 20px;
  font-size: 24px;
}
.goods-item-info h4{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 32px;
  height: 64px;
}
.goods-item-info p{
  color: #808080;
  line-height: 40px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.goods-item-info .many{
  display: flex;
}
.goods-item-info .tags{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}
.goods-item-info .tag{
  display: inline-block;
  font-size: 12px;
  line-height: 28px;
  padding: 0 10px;
  border-radius: 5px;
  color: #fff;
  background: linear-gradient(90deg, #ff9462, #ff3766);
}
.many small{
  font-size: 18px;
}
.many-left{
  flex: 10;
  color: #ff5162;
  font-size: 28px;
  line-height: 32px;
}
.many-right{
  line-height: 32px;
  color: #808080;
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
  font-size: 24px;
  line-height: 60px;
}
.crad-cont{
  margin: 0 20px;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 24px;
}
.pool-cont{
  margin: 0 20px;
  border-top: 1px solid #eaeaea;
  padding-bottom: 12px;
}
.pool-ctrl{
  padding: 12px 0;
  text-align: right;
}
.pool-ctrl-item{
  display: inline-block;
  line-height: 50px;
  height: 50px;
  border: 1px solid #ff5162;
  width: 140px;
  border-radius: 25px;
  text-align: center;
  color: #ff5162;
}
.od{
  display: flex;
  padding: 0 20px;
  font-size: 24px;
  color: #d1d1d1;
  line-height: 32px;
  margin-bottom: 12px;
}
.od-left{
  flex: 10;
}
</style>