<template>
  <div class="container">
    <header>
        <router-link to="/loginPassword">
            <van-icon class="out" name="arrow-left" />
        </router-link>
        <span>找回密码</span>
    </header>
    <div class="cont">
        <div class="form-cont">
            <div class="form-grop">
                <label class="form-lable">
                    账户名称:
                </label>
                <input class="form-input" type="number" v-model.trim="form.phone" placeholder="填写手机号码">
                <div class="form-more">
                    <van-icon name="close" v-show="form.phone" @click="form.phone = ''"/>
                </div>
            </div>
        </div>
        <div class="form-btn" @click="getCode">下一步</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      form: {
        phone: '',
      },
      codeNum: 60, // 验证码倒计时
    }
  },
  methods: {
    // 获取验证码
    getCode () {
        if(this.isPhone(this.form.phone + '')){
            let postData = {
                "authCodeType":"phone_auth_code",
                "appId": this.$init.channelId,
                "appSecret": this.$init.appSecret,
                "authType": 3,
                "phone": this.form.phone
            }
            // 这里写请求
            let vm = this;
            this.$http.post('/panda-common-oauth/oauth2/authCode', postData).then(function (response) {
                if(response.data.code == '1000'){
                    window.sessionStorage.setItem('findPasswordPhone', vm.form.phone)
                    vm.$router.push('/findPassword2');
                }else{
                    vm.$toast(response.data.msg)
                }
            })
            .catch(function (error) {
                vm.$toast('请求超时，请稍后再试！')
                // console.log(error)
            });
        }else if(this.form.phone + '' == ''){
            this.$toast('请输入手机号码')
        }else{
            this.$toast('手机号码格式错误')
        }
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
    text-align: right;
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
</style>
