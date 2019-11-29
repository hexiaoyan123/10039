<template>
  <div class="container address-list">
    <Vheader name="卡券充值"></Vheader>
    
    <div class="card">
      <div class="quality">
        <h2>充值金额</h2>
        <van-row gutter="10">
          <van-col span="8" v-for="(item, index) in list" :key="index">
            <div class="item" :class="{'item-check': checkMoney == item.money}" @click="clickMoney(item.money)">
              <h4>
                <small>¥</small> {{item.show}}
              </h4>
              <p>售价: <small>¥</small> <em>{{item.money}}</em></p>
              <div class="item-on" v-show="checkMoney == item.money">
                <van-icon name="success" />
              </div>
            </div>
          </van-col>
        </van-row>
      </div>

      <div class="card-title">
        <h4>其它金额 :</h4>

        <div class="card-form">
          <input type="number" v-model="checkMoney" min="1" max="100000" placeholder="请输入充值金额">
          <van-icon name="clear" class="card-form-clear" @click="checkMoney = ''"/>
        </div>

        <!-- <h4>微信支付(安全快捷)
          <van-icon name="checked" />
        </h4> -->
        <!-- <div class="card-title-btn" @click="goWechat">确认</div> -->
        <!-- <div class="card-title-btn" @click="checkOk">确认</div> -->
       <!-- <h3 class="on">温馨提示：</h3>
        <p>1.中票VIP卡有效期剩余30天之内，系统将按照如下充值延期规则对  	卡有效期进行自动延期。</p>
        <p>2.充值120元（含120元）以下延期1个月；充值120元以上至300元（含300元）延期3个月；充值300元以上至600元（含600元）延期6个月；充值600元以上延期12个月。</p>
        <p>3备注：如延期一个月，按到期当月的总天数为1个月，如2月28日到期，2月的总天数为28天，即充值延期至3月28日。如中票VIP卡已过期，需通过其他方式充值120元激活并延期一个月，每张卡可充值激活并延期一次，详情请咨询客服。</p>
     --> </div>

    </div>

    <div class="card-footer">
      <div class="card-footer-l">
        <span>订单金额:</span>
        <em class="on"><span>¥</span> {{checkMoney}}</em>
      </div>
      <div class="card-footer-r" @click="goWechat">确认</div>
    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardRechargeMoney',
  components: {
    Vheader
  },
  data () {
    return {
      // 选中的金额
      checkMoney: '',
     // 充值金额数组
     list: [
       {
         show: 1,
         money: 1
       },
       {
         show: 5,
         money: 5
       },
       {
         show: 10,
         money: 10
       },
       {
         show: 30,
         money: 30
       },
       {
         show: 50,
         money: 50
       },
       {
         show: 100,
         money: 100
       },
       {
         show: 200,
         money: 200
       },
       {
         show: 500,
         money: 500
       },
       {
         show: 1000,
         money: 1000
       },
     ],
     // 卡信息
     card: {},
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
    if(window.localStorage.getItem('cardRechargeMoney')){
      this.checkMoney = window.localStorage.getItem('cardRechargeMoney') - 0;
    }

  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 选中金额
    clickMoney (str) {
      this.checkMoney = str;
      window.localStorage.setItem('cardRechargeMoney', str)
    },
    // 确认充值金额
    checkOk () {
      
      if(! this.checkMoney){
        this.$toast('请选择充值金额');
        return;
      }
      let vm = this;
      let postData = {
        "voucher": this.card.voucher,
        "charge": this.checkMoney * 100,
        "saleId": this.card.saleId
      }
      this.$http.post('/panda-payment-api/wap/wechat/voucherRecharge', postData).then(function (response) {
        if(response.data.code == '1000'){
          
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('网络错误')
      });
    },
    // 跳转支付
    goWechat () {
      let vm = this;
      if(! this.checkMoney){
        this.$toast('请选择充值金额');
        return;
      }else if(this.checkMoney < 1){
        this.$toast('充值金额需大于1元');
        return
      }
      let urlStr = window.location.href;
      let urlStrBase = urlStr.substring(0, urlStr.indexOf(this.$route.path))
      
      // 跳回链接
      let backUrl = encodeURIComponent(urlStrBase + '/card/rechargeMoneyOk/' + this.$route.params.id);

      // this.$http.get('/panda-payment-api/wap/wechat/authorize?state=' + backUrl).then(function (response) {
      //   if(response.data.code == '1000'){
          
      //   }else{
      //     vm.$toast(response.data.msg)
      //   }
      // })
      // .catch(function (error) {
      //   vm.$toast('网络错误')
      // });

      let nowToken = this.$init.accessToken;
      window.localStorage.setItem('payBackData', JSON.stringify({
        user: this.$init.user,
        accessToken: this.$init.accessToken,
        refreshToken: this.$init.refreshToken
      }))

      // 获取权限链接
      window.location.href = this.$init.ip + '/panda-payment-api/wap/wechat/authorize?accessToken='+nowToken+'&state=' + backUrl;
    }
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
  border-bottom: 1px solid #eee;
  background-color: #ff5162;
  z-index: 101;
}
.address-list{
  padding-top: 85px;
  padding-bottom: 88px;
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
  margin-bottom: 26px;
}
.item{
  border: 1px solid #eee;
  border-radius: 8px;
  height: 170px;
  box-sizing: border-box;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}
.item-check{
  border-color: #ff5162;
}
.item h4{
  font-size: 40px;
  color: #ff5162;
  line-height: 92px;
}
.item p{
  color: #b9b9b9;
  font-size: 24px;
}
.item p small{
  color: #4d4d4d;
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
}
.card-title h4 .van-icon{
  float: right;
  color: #00b202;
}

.card-footer{
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  font-size: 28px;
  background-color: #fff;
  z-index: 10;
  border-top: 1px solid #eee;
}
.card-footer-l{
  flex: 10;
  padding: 0 20px;
  text-align: right;
}
.card-footer-l .on span{
	font-size: 12px;
}
.card-footer-r{
  width: 300px;
  text-align: center;
  color: #fff;
  background-color: #ff5162;
}
.card-form{
  position: relative;
  padding: 20px 0 40px 0;
}
.card-form input{
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #eee;
  padding: 10px 56px;
  border-radius: 40px;
  height: 80px;
  line-height: 80px;
  font-size: 28px;
}
.card-form-clear{
  position: absolute;
  line-height: 80px;
  width: 80px;
  text-align: center;
  right: 0;
  top: 20px;
  font-size: 32px;
  color: #ff5162;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color: #DDD;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #DDD;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #DDD;
}   
</style>
 