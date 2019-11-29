<template>
  <div class="container">
    <header>
        <router-link to="/findPassword1">
            <van-icon class="out" name="arrow-left" />
        </router-link>
        <span>安全监测</span>
    </header>
    <div class="cont">
        <div class="form-name">
            <p>我们已经发送了验证码到您的手机</p>
            <h2 class="red">{{findPasswordPhone.substring(7, 11)}}</h2>
        </div>
        <div class="form-cont">
            <div class="form-grop">
                <label class="form-lable">
                    校验码:
                </label>
                <input class="form-input" type="number" v-model.trim="authCode" placeholder="请填写校验码">
                <div class="form-more">
                    | 
                    <span v-show="codeNum == 60" @click="getCode" class="red">获取验证码</span>
                    <span v-show="codeNum < 60">{{codeNum}}秒后重新获取</span>
                </div>
            </div>
        </div>
        <div class="form-btn" @click="checkAuthCode">下一步</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FindPassword2',
  data () {
    return {
      findPasswordPhone: window.sessionStorage.getItem('findPasswordPhone'),
      authCode: '', // 验证码
      codeNum: 60, // 验证码倒计时
    }
  },
  created () {
    this.countDown();
  },
  methods: {
    // 验证验证码
    checkAuthCode () {
        if(this.authCode == ''){
            vm.$toast('请输入验证码')
            return false;
        }
        let postData = {
            "appId": this.$init.channelId,
            "appSecret": this.$init.appSecret,
            "phone": this.findPasswordPhone,
            "authCode": this.authCode
        }
        // 这里写请求
        let vm = this;
        this.$http.post('/panda-common-oauth/oauth2/checkAuthCode', postData).then(function (response) {
            if(response.data.code == '1000'){
                window.sessionStorage.setItem('findPasswordAccessToken', response.data.result.accessToken);
                vm.$router.push('/findPassword3');
            }else{
                vm.$toast(response.data.msg)
            }
        })
        .catch(function (error) {
            vm.$toast('请求超时，请稍后再试！')
            // console.log(error)
        });
    },
    // 获取验证码
    getCode () {
        if(this.isPhone(this.findPasswordPhone + '')){
            let postData = {
                "authCodeType":"phone_auth_code",
                "appId": this.$init.channelId,
                "appSecret": this.$init.appSecret,
                "authType": 3,
                "phone": this.findPasswordPhone
            }
            // 这里写请求
            let vm = this;
            this.$http.post('/panda-common-oauth/oauth2/authCode', postData).then(function (response) {
                if(response.data.code == '1000'){
                    vm.countDown();
                }else{
                    vm.$toast(response.data.msg)
                }
            })
            .catch(function (error) {
                vm.$toast('请求超时，请稍后再试！')
                // console.log(error)
            });
        }else if(this.findPasswordPhone + '' == ''){
            this.$toast('请输入手机号码')
        }else{
            this.$toast('手机号码格式错误')
        }
    },
    // 倒计时
    countDown () {
        let vm = this;
        vm.codeNum = 59;
        function numDown () {
            if(vm.codeNum > 1){
                vm.codeNum = vm.codeNum -1;
            }else{
                vm.codeNum = 60;
                window.clearInterval(int)
                return false;
            }
        }
        var int = setInterval(numDown, 1000)
    },
    // 验证手机号
    isPhone (str) {
        var myreg=/^[1][2,3,4,5,7,8,9][0-9]{9}$/;  
        if (!myreg.test(str)) {  
            return false;  
        } else {  
            return true;  
        }
    }
  }
}
</script>

<style scoped>
header{
    font-size: 28px;
    color: #4d4d4d;
    line-height: 84px;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    position: relative;
}
.out{
    position: absolute;
    left: 0px;
    line-height: 84px;
    top: 0;
    width: 80px;
    font-size: 28px;
}
.cont{
    padding: 75px;
}
.form-grop{
    display: flex;
    border-bottom: 1px solid #e990bc;
    font-size: 28px;
    line-height: 66px;
    margin-bottom: 42px;
}
.form-input{
    flex: 10;
    border: none;
    outline: none;
    font-size: 28px;
    line-height: 66px;
    min-width: 20px;
    box-sizing: border-box;
    padding: 0 10px;
}
.van-icon{
    display: inline-block;
    padding: 0 5px;
}
.form-btn{
    color: #fff;
    line-height: 80px;
    font-size: 28px;
    text-align: center;
    border-radius: 40px;
    background-color: #ff5162;
}
.form-cont{
    padding-bottom: 30px;
}
.form-more{
    color: #b9b9b9;
}
.form-name{
    text-align: center;
    margin-bottom: 40px;
}
.form-name p{
    font-size: 24px;
    color: #4d4d4d;
    line-height: 50px;
}
.form-name h2{
    font-size: 53px;
    line-height: 88px;
}
</style>
