<template>
  <div class="container address-list">
    <Vheader name="合并卡券"></Vheader>

    <div class="card">
      <ul class="card-form">
        <li class="card-item">
          <div class="card-item-lable">主卡卡号:</div>
          <input type="text" maxlength="18" v-model="voucher">
          <div class="card-item-ctrl">
            
          </div>
        </li>

        <li class="card-item">
          <div class="card-item-lable">密码:</div>
          <input type="password" maxlength="18" v-model="voucherPassword" v-show="! showPassword">
          <input type="text" maxlength="18" v-model="voucherPassword" v-show="showPassword">
          <div class="card-item-ctrl">
            <van-icon class="card-item-ctrl-password" v-show="! showPassword" name="password-not-view" @click="showPassword = true" />
            <van-icon class="card-item-ctrl-password"  v-show="showPassword" name="password-view" @click="showPassword = false" />
          </div>
        </li>

        <li class="card-bottom">
          <div class="card-bottom-left">有效期: {{info.card1.expDate}}, 卡余额: <em class="on">{{info.card1.balance}}</em>元</div>
          <div class="card-bottom-right">
            <div class="card-bottom-btn" @click="getCardInfo(1, voucher)">查询</div>
          </div>
        </li>
      </ul>
      <ul class="card-form">
        <li class="card-item">
          <div class="card-item-lable">清零卡卡号:</div>
          <input type="text" maxlength="18" v-model="cancelVoucher">
          <div class="card-item-ctrl">
            
          </div>
        </li>

        <li class="card-item">
          <div class="card-item-lable">密码:</div>
          <input type="password" maxlength="18" v-model="cancelPassword" v-show="! showPassword">
          <input type="text" maxlength="18" v-model="cancelPassword" v-show="showPassword">
          <div class="card-item-ctrl">
            <van-icon class="card-item-ctrl-password" v-show="! showPassword2" name="password-not-view" @click="showPassword2 = true" />
            <van-icon class="card-item-ctrl-password"  v-show="showPassword2" name="password-view" @click="showPassword2 = false" />
          </div>
        </li>

        <li class="card-bottom">
          <div class="card-bottom-left" >有效期: {{info.card2.expDate}}, 卡余额: <em class="on">{{info.card2.balance}}</em>元</div>
          <div class="card-bottom-right">
            <div class="card-bottom-btn" @click="getCardInfo(2, cancelVoucher)">查询</div>
          </div>
        </li>
      </ul>
    </div>
    
    
    <div class="card">
      <!-- <ul class="card-form">
        <li class="card-item">
          <div class="card-item-lable">手机号:</div>
          <input type="text">
          <div class="card-item-ctrl">
            
          </div>
        </li>
        <li class="card-item">
          <div class="card-item-lable">短信随机码:</div>
          <input type="text">
          <div class="card-item-ctrl">
            <div class="card-getcode">获取验证码</div>
          </div>
        </li>
      </ul> -->
      <div class="form-btn" @click="getVoucherMerge">提交</div>
    </div>

    <div class="note-cont">
      <h2>
        <van-icon class="on" name="info-o" />
        <span>注意事项</span>
      </h2>
      <p>1. 一张主卡三个月内仅能合并一次</p>
      <p>2.一旦合并清零卡就此作废, 不可恢复</p>
      <p><em class="on">*</em>中影票务通提供安全保障, 客服电话: 400-010-1515</p>
    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardRecharge',
  components: {
    Vheader
  },
  data () {
    return {
      showPassword: false,
      showPassword2: false,
      "voucher":"",
      "voucherPassword":"",
      "cancelVoucher":"",
      "cancelPassword":"",
      // 卡信息
      info: {
        card1: {},
        card2: {}
      }
    }
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 查询卡信息
    getCardInfo (num, card) {
      let vm = this;
      if(card == ''){
        vm.$toast('请输入卡号')
        return;
      }
      this.$http.get('/panda-payment-api/wap/getVoucher/'+card).then(function (response) {
        if(response.data.code == '1000'){
          vm.info['card'+num] = response.data.result;
        }else{
          vm.info['card'+num] = {};
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 合并卡
    getVoucherMerge () {
      let vm = this;
      if(this.voucher == ''){
        vm.$toast('请输入主卡卡号')
        return;
      }else{

      }
      let postData = {
        "voucher": this.voucher,
        "voucherPassword": this.voucherPassword,
        "cancelVoucher": this.cancelVoucher,
        "cancelPassword": this.cancelPassword
      }
      this.$http.post('/panda-payment-api/wap/getVoucherMerge', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$toast('合并成功');
          vm.goBack()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
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
}
.address-list{
  padding-top: 84px;
  background-color: #f8f8f8;
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

/* 文本框 */
.card-item{
  display: flex;
  font-size: 24px;
  color: #818181;
  line-height: 75px;
  padding: 12px 20px;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
}
.card-form{
  margin-bottom: 20px;
  border-top: 1px solid #dfdfdf;
}
.card-item input{
  display: block;
  height: 75px;
  border: none;
  font-size: 28px;
  line-height: 75px;
  outline: none;
  flex: 10;
  padding: 0 20px;
  min-width: 10px;
  text-align: right;
}
.card-item-ctrl{
  position: relative;
}
.card-code{
  display: block;
  height: 75px;
  width: 160px;
  border-radius: 6px;
  margin-right: 70px;
}
.card-item-ctrl .iconfont{
  position: absolute;
  display: inline-block;
  top: 0;
  right: 0;
  height: 75px;
  line-height: 75px;
  width: 70px;
  text-align: center;
  font-size: 48px;
}
.form-btn{
  width: 600px;
  margin: 0 auto;
  line-height: 80px;
  border-radius: 40px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  background-color: #ff5162;
  margin-top: 60px;
}
.card-item-ctrl-password{
  display: inline-block;
  line-height: 75px;
  width: 75px;
  text-align: right;
}
.card-bottom{
  padding: 12px 20px;
  line-height: 70px;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #dfdfdf;
}
.card-bottom-btn{
  width: 130px;
  box-sizing: border-box;
  text-align: center;
  color: #ff5162;
  border: 1px solid #ff5162;
  border-radius: 8px;
}
.card-bottom-left{
  flex: 10;
}
.card-getcode{
  padding: 0 20px;
  line-height: 75px;
  box-sizing: border-box;
  text-align: center;
  color: #ff5162;
  border: 1px solid #ff5162;
  border-radius: 8px;
}
.note-cont{
  width: 600px;
  margin: 0 auto;
  font-size: 24px;
  color: #b9b9b9;
  line-height: 44px;
  padding: 40px 0 60px 0;
}
</style>
 