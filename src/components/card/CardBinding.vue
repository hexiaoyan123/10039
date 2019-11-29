<template>
  <div class="container address-list" style="overflow: hidden;">
    <Vheader name="绑定卡券"></Vheader>
    
    <div class="card" style="overflow: hidden;">
      <ul class="card-form" style="overflow: hidden;">
        <li class="card-item" style="overflow: hidden;">
          <div class="card-item-lable">卡号:</div>
          <input @blur="iptBlur" @focus="iptFocus" type="text" v-model="card">
          <div class="card-item-ctrl">
            <!-- <i class="iconfont" @click="getScanQRCode">&#xe65c;</i> -->
          </div>
        </li>
        <li class="card-item" style="overflow: hidden;">
          <div class="card-item-lable">密码:</div>
          <input @blur="iptBlur" @focus="iptFocus" type="password" v-model="password" v-show="! showPassword">
          <input @blur="iptBlur" @focus="iptFocus" type="text" v-model="password" v-show="showPassword">
          <div class="card-item-ctrl">
            <van-icon class="card-item-ctrl-password" v-show="! showPassword" name="password-not-view" @click="showPassword = true" />
            <van-icon class="card-item-ctrl-password"  v-show="showPassword" name="password-view" @click="showPassword = false" />
          </div>
        </li>
      </ul>
      <div class="form-btn" @click="saveUserVoucher">确认</div>
    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardBinding',
  components: {
    Vheader
  },
  data () {
    return {
      showPassword: false,
      card: '', // 卡号
      password: '', // 密码
    }
  },
  created () {
    if(this.$route.query.voucher){
      this.card = this.$route.query.voucher;
    }
    // 设置微信权限
    // this.getWeChatData();
  },
  methods: {
    // 设置微信
    getScanQRCode () {
      var vm = this;
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            alert(res)
          if(res.resultStr){
            vm.card = res.resultStr;
          }else{
            vm.$toast('无法识别');
          }
        }
      });
    },
    // 获取微信参数
    getWeChatData () {
      let vm = this;
      let htmlUrl = encodeURIComponent('http://' + window.location.host); // +'&url=' + htmlUrl  // + '/#/card/binding'
      this.$http.get('/v1/getH5Params?channelId='+this.$init.channelId +'&url=' + htmlUrl).then(function (response) {
        if(response.data.code == '1000'){
          var sign = response.data.result;
          window.wx.config({
            appId: sign.appId, // 必填，公众号的唯一标识
            timestamp: sign.timeStamp, // 必填，生成签名的时间戳
            nonceStr: sign.nonceStr, // 必填，生成签名的随机串
            signature: sign.signature, // 必填，签名，见附录1
            jsApiList: ['scanQRCode']
          });
          wx.ready(function(){
            console.log('配置好了')
          });
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('网络错误')
      });
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
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 绑定卡券
    saveUserVoucher () {
      let vm = this;
      if(this.card == ''){
        this.$toast('请输入卡号');
        return false;
      }else if(! this.password){
        this.$toast('请输入密码');
        return false;
      }
      let postData = {
        "voucher": this.card,
        "voucherPassword": this.password
      }
      this.$http.post('/panda-payment-api/v1/saveUserVoucher', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$toast('绑定成功');
          vm.$router.push('/card/my')
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('网络错误')
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
  border-bottom: 1px solid #eee;
  background-color: #ff5162;
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

/* 文本框 */
.card-item{
  display: flex;
  font-size: 24px;
  color: #818181;
  line-height: 75px;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}
.card-item input{
  display: block;
  height: 75px;
  border: none;
  font-size: 28px;
  line-height: 75px;
  outline: none;
  flex: 10;
  padding: 0 10px;
  min-width: 10px;
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
.card-item-ctrl .iconfont{
  font-size: 24px;
  text-align: right;
}
</style>
 