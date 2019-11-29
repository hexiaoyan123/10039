<template>
  <div>
    <div class="movie-item">
      <div class="movie-item-top" @click="goOrderDetails">
        <div class="movie-item-left">
            <figure class="img">
              <img :src="info.goodsPoster" alt="">
            </figure>
          <div class="movie-item-left-stea on">{{info.dataStatus | typeToStr}}</div>
        </div>
        <div class="movie-item-right">
          <h3 class="unoverflow">{{info.goodsName}}</h3>
          <h4 class="unoverflow">{{info.venueName}}</h4>
          <p class="unoverflow">总价: ¥ <span class="priceSpan" v-html="moneyFormat(info.orderAmount)"></span></p>
          <p class="unoverflow">放映时间: {{info.planName}}</p>
        </div>
      </div>
      <div class="movie-item-bottom" v-if="info.dataStatus == 1">
        <div class="movie-item-bottom-time">
          剩余支付时间: <em class="on">{{timer}}</em>
        </div>
        <div class="movie-item-bottom-ctrl">
          <!-- <span class="movie-btn-1" @click="cancelOrder">取消订单</span> -->
          <span class="movie-btn-2" @click="goPlay">立即支付</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderShowListItem',
  props: ['obj'],
  data () {
    return {
      timer: '00:00', // 倒计时时间
      show: true,
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
    // 查看订单
    goOrderDetails () {
      this.$router.push('/show/orderDetail/'+this.info.id);
    },
    // 去支付
    goPlay () {
      this.$router.push('/show/orderPay/'+this.info.id);
    },
    // 刷新列表
    refresh () {
      this.$emit('refreshList', true);
    },
    // 取消订单
    cancelOrder () {
      let vm = this;
      this.$http.get('/panda-cinema-api/wap/cancelOrder/'+this.info.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.refresh();
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 立即支付
    // 倒计时
    resetTime (time) {
      let vm = this;
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var end = time*1000;
      if(end <= now){
        return false;
      }
      //时间差
      var leftTime = end-now;
      var timer = null;
      // 倒计时函数
      function countDown() {
        leftTime -= 1000;
        //定义变量 d,h,m,s保存倒计时的时间
        var d,h,m,s;
        if (leftTime>=0) {
          d = Math.floor(leftTime/1000/60/60/24);
          h = Math.floor(leftTime/1000/60/60%24);
          m = Math.floor(leftTime/1000/60%60);
          s = Math.floor(leftTime/1000%60);   
          
          if(m < 10){
            m = '0'+m
          }
          if(s <10){
            s = '0' + s
          }
          
          vm.timer = m+":"+s;
        }else{
          vm.timer = "00:00";
          clearInterval(timer);
        }
      }

      timer=setInterval(countDown,1000);
    }
  },
  computed: {
    info () {
      if(this.obj){
        this.resetTime(this.obj.overTime)
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
    // 放映类型转换
    showTypeToStr (value) {
      if(value == 1){
        return '2D'
      }else if(value == 2){
        return '3D'
      }else if(value == 3){
        return 'MAX2D'
      }else if(value == 4){
        return 'MAX3D'
      }else if(value == 6){
        return 'DMAX'
      }
    },
  }
}
</script>

<style scoped>
.movie-item{
  padding: 20px;
  background-color: #ffffff;
  border-radius: 6px;
  border-top: 10px solid #ff5162;
  margin-bottom: 20px;
}
.movie-item-top{
  display: flex;
}
.movie-item-left{
  flex: 5;
  border-right: 1px dashed #dddddd;
  color: #000;
  text-align: center;
}
.movie-item-left-d{
  line-height: 32px;
  font-size: 32px;
  padding: 10px 0;
}
.movie-item-left-big{
  font-size: 38px;
  line-height: 38px;
  padding: 0 0 10px 0;
}
.movie-item-left-stea{
  font-size: 26px;
  padding-top: 30px;
}
.movie-item-right{
  width: 70%;
  padding-left: 20px;
}
.movie-item-right h3{
  color: #000;
  line-height: 32px;
  font-size: 32px;
  padding: 10px 0;
}
.movie-item-right h4{
  color: #000;
  line-height: 32px;
  font-size: 32px;
  padding: 10px 0;
}
.movie-item-right p{
  font-size: 24px;
  line-height: 24px;
  padding: 10px 0;
  color: #999;
}
.movie-item-bottom{
  display: flex;
}
.movie-item-bottom-time{
  flex: 5;
  line-height: 72px;
  color: #424242;
  font-size: 26px;
}
.movie-item-bottom-ctrl{
  flex: 5.6;
  text-align: right;
  font-size: 26px;
}
.movie-btn-1{
  display: inline-block;
  width: 150px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 26px;
  line-height: 70px;
  border: 1px solid #ff5162;
  border-radius: 6px;
  color: #ff5162;
}
.movie-btn-2{
  display: inline-block;
  width: 150px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 26px;
  line-height: 70px;
  border: 1px solid #ff5162;
  border-radius: 6px;
  margin-left: 20px;
  color: #fff;
  background-color: #ff5162;
}
.movie-item-left .img{
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0 4px;
    border-radius: 12px;
    overflow: hidden;
    font-size: 0;
}
.movie-item-left .img img{
  width: 100%;
}
</style>

