<template>
  <div class="container address-list">
    <Vheader name="卡券充值"></Vheader>
    
    <div class="card">
      <div class="card-img">
        <van-icon name="wechat" />
      </div>
      <div class="card-title">
        <div class="card-title-btn" @click="checkOk">微信支付</div>
        <h3 class="on">温馨提示：</h3>
        <p>1.中票VIP卡有效期剩余30天之内，系统将按照如下充值延期规则对  	卡有效期进行自动延期。</p>
        <p>2.充值120元（含120元）以下延期1个月；充值120元以上至300元（含300元）延期3个月；充值300元以上至600元（含600元）延期6个月；充值600元以上延期12个月。</p>
        <p>3备注：如延期一个月，按到期当月的总天数为1个月，如2月28日到期，2月的总天数为28天，即充值延期至3月28日。如中票VIP卡已过期，需通过其他方式充值120元激活并延期一个月，每张卡可充值激活并延期一次，详情请咨询客服。</p>
      </div>

    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardRechargeMoneyOk',
  components: {
    Vheader
  },
  data () {
    return {
      // 选中的金额
      checkMoney: '',
      // 卡信息
      card: {},
      // 微信信息
      wxData: {},
    }
  },
  created () {
    // 获取卡信息
    if(this.$init.cardRecharge){
      this.card = this.$init.cardRecharge;
    }else{
      this.card = JSON.parse(window.sessionStorage.getItem('cardRecharge'));
    }
    // 获取选中充值金额
    if(this.$cookies.get('cardRechargeMoney')){
      this.checkMoney = this.$cookies.get('cardRechargeMoney');
    }
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 确认充值金额
    checkOk () {
      let vm = this;
      let postData = {
        "voucher": this.card.voucher,
        "charge": this.checkMoney * 100,
        "saleId": this.card.saleId
      }
      this.$http.post('/panda-payment-api/wap/wechat/voucherRecharge', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.wxData = response.data.result;
          vm.wxPlay()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    wxPlay () {
      let vm = this;
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
              "appId":vm.wxData.appId,     //公众号名称，由商户传入     
              "timeStamp":vm.wxData.timeStamp,         //时间戳，自1970年以来的秒数     
              "nonceStr":vm.wxData.nonceStr, //随机串     
              "package":vm.wxData.package,     
              "signType":"MD5",         //微信签名方式：     
              "paySign":vm.wxData.paySign //微信签名 
          },
          function(res){     
              if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                vm.$router.push('/success')
              } 
          }
      ); 
    },
  }
}
</script>

<style scoped>
/* 头 */
header{
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #ff5162;
  z-index: 101;
}
.address-list{
  padding-top: 85px;
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
  color: #fff;
}

.quality{
  padding: 26px 20px 20px 20px;
  margin-bottom: 20px;
}
.quality h2{
  height: 28px;
  line-height: 28px;
  font-size: 28px;
  border-left: 5px solid #ff5162;
  padding-left: 8px;
  color: #4d4d4d;
  margin-bottom: 26px;
}
.item{
  border: 1px solid #ff5162;
  border-radius: 8px;
  height: 170px;
  box-sizing: border-box;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}
.item h4{
  font-size: 40px;
  color: #ff9900;
  line-height: 92px;
}
.item p{
  color: #b9b9b9;
  font-size: 24px;
}
.item em{
  color: #4d4d4d;
}
.item-on{
  height: 0;
  width: 0;
  position: absolute;
  right: 0;
  bottom: 0;
  color: #fff;
  border-right: 26px solid #ff5162;
  border-top: 26px solid transparent;
  border-bottom: 26px solid #ff5162;
  border-left: 26px solid transparent;
}
.card-title{
  padding: 0 20px;
}
.card-title-btn{
  width: 600px;
  margin: 0 auto;
  line-height: 80px;
  border-radius: 40px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  background-color: #ff5162;
  margin-top: 40px;
  margin-bottom: 38px;
}
.card-title p{
  font-size: 24px;
  color: #b9b9b9;
  line-height: 50px;
}
.card-title h3{
  font-size: 28px;
  color: #ff5162;
  line-height: 62px;
}
.card-title h4{
  font-size: 28px;
  color: #b9b9b9;
}
.card-title h4 .van-icon{
  float: right;
  color: #00b202;
}
.card-img{
  font-size: 200px;
  text-align: center;
  padding: 100px 20px;
  color: #609700;
}
</style>
 