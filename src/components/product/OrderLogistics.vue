<template>
  <div class="container">
    <Vheader name="查看物流"></Vheader>

    <div class="card card1">
      <div class="card1-1" @click="goBack">
        <i class="iconfont">&#xe60d;</i>
      </div>
      <div class="card1-2">
        <img v-if="goods.imageUrl" :src="goods.imageUrl.split(',')[0] | imgSpecilize" alt="">
      </div>
      <div class="card1-3">
        {{shipping.dataStatus | typeToStr}}
      </div>
      <div class="card1-4">
        <span class="btn" @click="collect">确认收货</span>
      </div>
    </div>

    <!-- <div class="card card2">
      <div class="card2-1">
        <figure class="img">
          <img src="@/assets/l-header.png" alt="">
        </figure>
      </div>
      <div class="card2-2">
        <div class="card2-2-1">
          快递员 111
        </div>
        <div class="card2-2-2">
          圆通快递 手机号
        </div>
        <div class="card2-2-3">
          <img src="@/assets/l-phone.png" alt="">
        </div>
      </div>
    </div> -->

    <div class="card card3">
      <div v-if="traceList.length == 0" class="nodata">暂无数据！</div>
      <ul class="list" v-if="traceList.length > 0">
        <li class="item" v-for="(item, index) in traceList" :key="index">
          <div class="item-left">
            <div class="big">{{item.acceptTime | dayFormat}}</div>
            <div class="small">{{item.acceptTime | timeFormat}}</div>
          </div>
          <div class="item-right">
            <div class="item-bor">√</div>
            <div class="item-1">{{item.acceptTime | dateFormat}}</div>
            <div class="item-2">
              {{item.acceptStation}}
            </div>
          </div>
        </li>
      </ul>
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
      id: this.$route.params.id,
      shipperCode: this.$route.query.shipperCode,
      logisticCode: this.$route.query.logisticCode,
      order: {},
      goods: {},
      traceList: [], // 物流列表
      shipping: {}
    }
  },
  created () {
    this.getOrder();
    this.getListShippingTrace();
  },
  methods: {
    // 获取订单信息
    getOrder () {
      let vm = this;
      this.$store.commit('ctrlLoader', true)
      this.$http.get('/panda-shop-api/v2/getOrder/' + this.$route.params.id).then(function (response) {
        vm.$store.commit('ctrlLoader', false)
        if(response.data.code == '1000'){
          vm.order = response.data.result;
          vm.goods = {}
          response.data.result.resOrderItemList.forEach((e, i) => {
            if(e.id == vm.$route.query.goodsId){
              vm.goods = e
            }
          })
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 根据快递公司编号和快递单号获取发货跟踪
    getListShippingTrace () {
      let vm = this;
      this.$http.get('/panda-shop-api/v2/listShippingTrace/' + this.shipperCode + '/' + this.logisticCode).then(function (response) {
        if(response.data.code == '1000'){
          vm.shipping = response.data.result;
          vm.traceList = response.data.result.resListShippingTraceList;
          if(! vm.traceList){
            vm.traceList = []
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 确认收货
    collect () {
      let vm = this;
      this.$store.commit('ctrlLoader', true)
      this.$http.get('/panda-shop-api/v2/receivedOrder/' + this.$route.params.id).then(function (response) {
        vm.$store.commit('ctrlLoader', false)
        if(response.data.code == '1000'){
          vm.getOrder()
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
  },
  filters: {
    // 日格式化
    dayFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return add0(m)+'-'+add0(d);
    },
    // 小时格式化
    timeFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return add0(h)+':'+add0(mm);
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
    // 计算信息
    typeToStr (value) {
      // 2：在途；3：签收；4：问题件
      if(value === 2){
        return '在途'
      }else if(value === 3){
        return '签收'
      }else if(value === 4){
        return '问题件'
      }else{
        return ''
      }
    },
  }
}
</script>

<style scoped>
.container{
  background-color: #fff;
  padding-top: 84px;
}
.on{
  color: #ff5162;
}
.btn{
  display: inline-block;
  font-size: 24px;
  line-height: 50px;
  height: 50px;
  width: 140px;
  border: 1px solid #ff5162;
  color: #ff5162;
  text-align: center;
  border-radius: 25px;
  margin-left: 20px;
}
.card{
  margin: 0 20px;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  margin-top: 25px;
  overflow: hidden;
}
.card1{
  padding: 20px;
  display: flex;
  line-height: 50px;
}
.card1-1 .iconfont{
  font-size: 28px;
  color: #989898;
}
.card1-3{
  flex: 10;
}
.card1-2{
  width: 50px;
  padding: 0 25px;
}
.card1-2 img{
  display: block;
  width: 100%;
}
.card2{
display: flex;
}
.card2-1{
  width: 190px;
  padding: 30px 0;
  background-color: #f5f5f5;
}
.card2-1 .img{
  display: block;
  width: 120px;
  margin: 0 auto;
}
.card2-1 .img img{
  display: block;
  width: 100%;
}
.card2-2{
  padding: 40px 30px;
  font-size: 24px;
  line-height: 44px;
}
.card2-2-1{
  color: #989898;
}
.card2-2-2{
  font-size: 28px;
}
.card2-2-3{
  width: 50px;
  position: absolute;
  right: 50px;
  top: 60px;
}
.card2-2-3 img{
  display: block;
  width: 100%;
}
.card3{
  margin-bottom: 26px;
}
.list{
  padding: 30px 0;
}
.item{
  display: flex;
}
.item-left{
  width: 150px;
  text-align: center;
}
.big{
  font-size: 28px;
  line-height: 32px;
}
.small{
  font-size: 20px;
  line-height: 26px;
  color: #989898;
}
.item-right{
  flex: 10;
  position: relative;
}
.item-bor{
  position: absolute;
  left: -25px;
  top: 0;
  line-height: 50px;
  height: 50px;
  width: 50px;
  text-align: center;
  color: #fff;
  background: linear-gradient(90deg,#ffac62,#ff3666);
  border-radius: 50%;
}
.item-1{
  font-size: 28px;
  line-height: 50px;
  padding-left: 50px;
}
.item-2{
  padding-left: 40px;
  padding-right: 20px;
  border-left: 1px solid #f3f3f3;
  min-height: 160px;
  font-size: 24px;
  color: #989898;
  margin: 6px 0;
}
.nodata{
  line-height: 120px;
  text-align: center;
}
</style>