<template>
  <div class="container" >
    <Vheader name="订单日志"></Vheader>

    <timeline timeline-theme="#eee">
      <timeline-item bg-color="#c06" line-color="#eee" v-for="(item, index) in logList" :key="index">
        <div class="log-cont">
          <div>
            {{item.createTime | dateFormat}} &nbsp;&nbsp;&nbsp;&nbsp; 【{{item.motionName}}】
          </div>
          <div v-show="item.remark && item.remark != '-'">
            {{item.remark}}
          </div>
        </div>
      </timeline-item>
    </timeline>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
export default {
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
    Vheader
  },
  data () {
    return {
      order: {},
      logObj: {},
      paymentList: [],
      logList: []
    }
  },
  created () {
    this.getOrder()
  },
  methods: {
    // 获取订单信息
    getOrder () {
      let vm = this;
      this.$http.get('/panda-shop-api/v2/getOrder/' + this.$route.params.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.order = response.data.result;
          if(response.data.result.resOrderLogList && response.data.result.resOrderLogList.length > 0){
            vm.logObj = response.data.result.resOrderLogList[response.data.result.resOrderLogList.length-1];
            vm.logList = response.data.result.resOrderLogList;
          }
          if(response.data.result.resPaymentList && response.data.result.resPaymentList.length > 0){
            vm.paymentList = response.data.result.resPaymentList
          }
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
      this.$init.order = this.order;
      this.$router.push('/product/orderPayCheck/'+this.order.id)
    },
    // 去评价
    goEV () {
      this.$init.order = this.order;
      this.$router.push('/product/orderEvaluate/'+this.order.id)
    },
    // 日志
    goLog () {
      this.$init.order = this.order;
      this.$router.push('/product/orderDetailsLog/'+this.order.id)
    },
    // 查看商品
    goGoods (obj) {
      this.$router.push('/product/'+obj.productId)
    },
    // 删除订单
    delOrder () {
      let vm = this;
      this.$http.get('/panda-shop-api/wap/delOrder/'+ this.order.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.goBack()
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
      this.$http.get('/panda-shop-api/wap/cancelOrder/'+ this.order.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.goBack()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
  },
  filters: {
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
    // 支付状态转字符串
    payToStr (value) {
      if(value == 1){
        return '待支付'
      }else if(value == 2){
        return '已支付'
      }else if(value == 3){
        return '部分支付'
      }else if(value == 4){
        return '已退款'
      }else if(value == 5){
        return '部分退款'
      }else{
        return ''
      }
    },
    // 支付类型转字符串
    paymentMethodStr (value) {
      // 状态（1：中影现金卡支付；2：中影次卡支付；3：微信支付；4：中影现金卡微信补差支付；5：中影次卡微信补差支付；）
      if(value == 1){
        return '中影现金卡支付'
      }else if(value == 2){
        return '中影次卡支付'
      }else if(value == 3){
        return '微信支付'
      }else if(value == 4){
        return '中影现金卡微信补差支付'
      }else if(value == 5){
        return '中影次卡微信补差支付'
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
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 84px;
}
.log-cont{
  padding: 20px;
  background-color: #fff;
  font-size: 24px;
  line-height: 38px;
}
.log-cont>div{
  padding: 6px 0;
}
</style>