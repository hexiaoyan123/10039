<template>
  <div class="container">
    <header>注册</header>
    <div class="cont">
        <div class="form-cont">
            <div class="form-grop">
                <label class="form-lable"></label>
                <input class="form-input" type="number" v-model.trim="form.phone" placeholder="请输入手机号码">
                <div class="form-more">
                    <van-icon name="close" v-show="form.phone" @click="form.phone = ''"/>
                </div>
            </div>
            <div class="form-grop">
                <label class="form-lable"></label>
                <input class="form-input" type="text" v-model.trim="form.code" placeholder="请输入验证码">
                <div class="form-more">
                    <span v-show="codeNum == 60" @click="getCode" class="red">获取验证码</span>
                    <span v-show="codeNum < 60" class="red">{{codeNum}}秒</span>
                </div>
            </div>
            <div class="form-grop">
                <label class="form-lable"></label>
                <input class="form-input" type="password" v-model.trim="form.password1" maxlength="20" placeholder="请输入密码">
                <div class="form-more">
                    <van-icon name="close"  v-show="form.password1" @click="form.password1 = ''" />
                </div>
            </div>
            <div class="form-grop">
                <label class="form-lable"></label>
                <input class="form-input" type="password" v-model.trim="form.password2" maxlength="20" placeholder="请再次输入密码">
                <div class="form-more">
                    <van-icon name="close"  v-show="form.password2" @click="form.password2 = ''" />
                </div>
            </div>
        </div>
        <div class="form-btn" @click="register">注册</div>
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
        code: '',
        password1: '',
        password2: ''
      },
      codeNum: 60, // 验证码倒计时
    }
  },
  methods: {
    // 注册
    register () {
        let vm = this;
        for(let key in this.form){
            if(this.form[key]+'' == ''){
                this.$toast('请补全信息');
                return false;
            }
        }
        if(! this.isPhone(this.form.phone + '')){
            this.$toast('手机号格式错误');
            return false;
        }
        if(this.form.password1 != this.form.password2){
            this.$toast('密码不一致');
            return false;
        }
        if(! this.checkPassword(this.form.password1)){
            return false;
        }
        let postData = {
            "registerType": "phone_password",
            "appId": this.$init.channelId,
            "appSecret": this.$init.appSecret,
            "phone": this.form.phone,
            "password": this.$md5(this.form.password1).toUpperCase(),
            "authCode": this.form.code,
            "isRegisterLogin": '1'
        }
        this.$http.post('/panda-common-oauth/oauth2/register', postData).then(function (response) {
            if(response.data.code == '1000'){
                const user = {
                    phone: vm.form.phone,
                    accessToken: response.data.result.accessToken,
                    refreshToken: response.data.result.refreshToken,
                    token: response.data.result.accessToken
                }
                vm.$init.user = user;
                vm.$cookies.set('user', JSON.stringify(user), '30d')
                // vm.$router.push('/');
                vm.getUserInfo();
            }else{
                vm.$toast(response.data.msg)
            }
        })
        .catch(function (error) {
            vm.$toast('请求超时，请稍后再试！')
        });
    },
    // 获取用户信息
    getUserInfo () {
      let vm = this;
      this.$axios({
        method: 'get',
        url: this.$init.ip + '/panda-common-oauth/oauth2/getUser',
        headers: {
          'Access-Token': this.$init.user.token
        }
      }).then(function (response) {
        if(response.data.code == '1000'){
          vm.$router.push('/');
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 获取验证码
    getCode () {
        if(this.isPhone(this.form.phone + '')){
            if(this.form.phone + '' == ''){
                this.$toast('请输入手机号');
                return false;
            }else if(! this.isPhone(this.form.phone + '')){
                this.$toast('手机号格式错误');
                return false;
            }
            let postData = {
                "authCodeType":"phone_auth_code",
                "appId": this.$init.channelId,
                "appSecret": this.$init.appSecret,
                "authType": 1,
                "phone": this.form.phone
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
            });
        }else if(this.form.phone + '' == ''){
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
    },
    // 密码验证
    checkPassword (str) {
        // var reg2 = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){8,18}/;
        // var reg3 = /[a-zA-Z]+/;
        // var reg4 = /[0-9]+/;
        // if(reg2.test(str) && reg3.test(str) && reg4.test(str)){
        //     return true;
        // }else if(!reg2.test(str)){
        //     this.$toast("长度在8-18位");
        //     return false;
        // }else if(!reg3.test(str)){
        //     this.$toast("需含有字母");
        //     return false;
        // }else if(!reg4.test(str)){
        //     this.$toast("需含有数字");
        //     return false;
        // }
        if(str.length < 6 || str.length > 20){
            this.$toast("密码长度在7-18位");
            return false;
        }else{
            return true;
        }
    },
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
